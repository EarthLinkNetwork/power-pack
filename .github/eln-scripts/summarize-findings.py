#!/usr/bin/env python3
"""scan-results/*.json|sarif を正規化し、GitHub annotation / summary.md / gate を出力。
secret 値は表示しない（gitleaks は --redact 前提、ここでも値は出さない）。
--baseline-dir を指定すると regression gate モード:
  head にのみ存在する新規 findings のみ gate 対象。base 既存 backlog はブロックしない。"""
import argparse, glob, json, os, sys

SEV_ORDER = ["critical", "high", "medium", "low", "info"]

def norm_sev(s):
    s = (s or "").lower()
    return {"error":"high","warning":"medium","note":"low","unknown":"info",
            "moderate":"medium"}.get(s, s if s in SEV_ORDER else "info")

def load(p):
    try: return json.load(open(p))
    except Exception: return None

def collect(d):
    """scan-results ディレクトリの JSON を読み込み finding リストを返す。
    各 finding に fp (fingerprint) フィールドを付与する。
    fingerprint は tool 別・行ズレに頑健な安定キー。"""
    findings = []  # {tool,severity,file,line,title,is_secret,fp}
    for p in sorted(glob.glob(os.path.join(d, "*"))):
        data = load(p)
        name = os.path.basename(p).lower()
        if data is None:
            continue

        if "semgrep" in name and isinstance(data, dict) and "results" in data:
            for r in data["results"]:
                ex = r.get("extra", {})
                # fingerprint: check_id + path（line は不使用。コード移動に頑健）
                check_id = r.get("check_id", "") or ""
                path = r.get("path", "") or ""
                fp = f"semgrep:{check_id}:{path}"
                findings.append(dict(
                    tool="semgrep",
                    severity=norm_sev(ex.get("severity")),
                    file=path,
                    line=(r.get("start") or {}).get("line"),
                    title=ex.get("message", "semgrep finding")[:160],
                    is_secret=False,
                    fp=fp,
                ))

        elif "gitleaks" in name and isinstance(data, list):
            for r in data:
                # fingerprint: gitleaks が計算した Fingerprint フィールドを優先。
                # なければ RuleID+File（commit hash は含めない）
                raw_fp = r.get("Fingerprint") or f"{r.get('RuleID', '')}:{r.get('File', '')}"
                fp = f"gitleaks:{raw_fp}"
                findings.append(dict(
                    tool="gitleaks",
                    severity="high",
                    file=r.get("File"),
                    line=r.get("StartLine"),
                    title=f"Secret: {r.get('RuleID', 'rule')} (値は非表示)",
                    is_secret=True,
                    fp=fp,
                ))

        elif "trivy" in name and isinstance(data, dict):
            for res in data.get("Results", []) or []:
                tgt = res.get("Target", "")
                for v in (res.get("Vulnerabilities") or []):
                    vuln_id = v.get("VulnerabilityID", "") or ""
                    pkg = v.get("PkgName", "") or ""
                    ver = v.get("InstalledVersion", "") or ""
                    # fingerprint: VulnerabilityID + PkgName + InstalledVersion + Target
                    fp = f"trivy:{vuln_id}:{pkg}:{ver}:{tgt}"
                    findings.append(dict(
                        tool="trivy",
                        severity=norm_sev(v.get("Severity")),
                        file=tgt,
                        line=None,
                        title=f"{vuln_id} {pkg} {ver}",
                        is_secret=False,
                        fp=fp,
                    ))
                for s in (res.get("Secrets") or []):
                    fp = f"trivy-secret:{s.get('RuleID', '')}:{tgt}"
                    findings.append(dict(
                        tool="trivy",
                        severity="high",
                        file=tgt,
                        line=s.get("StartLine"),
                        title=f"Secret: {s.get('RuleID')} (値は非表示)",
                        is_secret=True,
                        fp=fp,
                    ))

        elif "audit" in name and isinstance(data, dict):
            vulns = data.get("vulnerabilities") or {}
            if isinstance(vulns, dict):
                for k, v in vulns.items():
                    sev = norm_sev(v.get("severity"))
                    # via が文字列（advisory ID）の場合のみ使用。オブジェクト（ネスト）は無視
                    advisory_ids = ",".join(
                        str(x) for x in (v.get("via") or []) if isinstance(x, str)
                    )
                    fp = f"audit:{k}:{sev}:{advisory_ids}"
                    findings.append(dict(
                        tool="audit",
                        severity=sev,
                        file="package.json",
                        line=None,
                        title=f"{k}: {v.get('severity')} advisory",
                        is_secret=False,
                        fp=fp,
                    ))
    return findings

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--dir", required=True)
    ap.add_argument("--fail-sev", default="critical,high")
    ap.add_argument("--secret-fail", default="true")
    ap.add_argument("--medium-fail", default="false")
    ap.add_argument("--summary-md", required=True)
    ap.add_argument("--out", default="/dev/null")
    ap.add_argument("--baseline-dir", default=None,
                    help="base ブランチのスキャン結果ディレクトリ。指定時は regression gate モード。"
                         "未指定の場合は従来どおり全件 gate（後方互換）。")
    a = ap.parse_args()

    head_fs = collect(a.dir)

    # Regression gate モード判定
    regression_mode = False
    if a.baseline_dir and os.path.isdir(a.baseline_dir):
        base_fs = collect(a.baseline_dir)
        base_fps = {f["fp"] for f in base_fs}
        new_fs = [f for f in head_fs if f["fp"] not in base_fps]
        pre_fs = [f for f in head_fs if f["fp"] in base_fps]
        regression_mode = True
    else:
        # baseline 無し: 全件 gate（従来動作）
        new_fs = head_fs
        pre_fs = []

    # gate 対象は new_fs のみ
    fs = new_fs
    counts = {s: 0 for s in SEV_ORDER}
    for f in fs:
        counts[f["severity"]] = counts.get(f["severity"], 0) + 1
    secrets = [f for f in fs if f["is_secret"]]

    # annotations（コード連動、新規 findings のみ）
    for f in fs:
        if f.get("file") and f.get("line"):
            print(f"::error file={f['file']},line={f['line']}::[{f['tool']}/{f['severity']}] {f['title']}")

    # summary.md 構築
    fail_sev = set(s.strip() for s in a.fail_sev.split(",") if s.strip())

    if regression_mode:
        md = [
            "## 🔒 Security PR check (regression gate)\n",
            "> **Gate 対象**: このPRが新規に持ち込んだ findings のみ。"
            " Base ブランチ既存の backlog は参考表示（非ブロック）。\n",
        ]
    else:
        md = ["## 🔒 Security PR check\n"]

    # --- New findings セクション ---
    if regression_mode:
        new_total = sum(counts.values())
        md.append(f"### 🆕 New in this PR ({new_total} 件)\n")

    md += ["| tool | crit | high | med | low |", "|---|---|---|---|---|"]
    by_tool: dict = {}
    for f in fs:
        by_tool.setdefault(f["tool"], {s: 0 for s in SEV_ORDER})[f["severity"]] += 1
    if by_tool:
        for t, c in sorted(by_tool.items()):
            md.append(f"| {t} | {c['critical']} | {c['high']} | {c['medium']} | {c['low']} |")
    else:
        md.append("| (none) | 0 | 0 | 0 | 0 |")

    ch = [f for f in fs if f["severity"] in ("critical", "high")]
    if ch:
        md.append("\n#### Critical / High (new)\n")
        for f in ch[:50]:
            loc = f"`{f['file']}`" + (f":{f['line']}" if f.get("line") else "")
            md.append(f"- **{f['severity'].upper()}** [{f['tool']}] {f['title']} — {loc}")
        md.append(
            "\n> 修正方法: Semgrep=該当行のロジック修正 / Trivy=依存 bump"
            " / Gitleaks=secret 失効&除去&履歴削除"
        )
    elif regression_mode:
        md.append("\n✅ 新規の critical / high はありません。")
    else:
        md.append("\n✅ Critical / High はありません。")

    # --- Pre-existing backlog セクション (regression mode のみ) ---
    if regression_mode:
        pre_counts: dict = {s: 0 for s in SEV_ORDER}
        for f in pre_fs:
            pre_counts[f["severity"]] = pre_counts.get(f["severity"], 0) + 1
        pre_total = sum(pre_counts.values())
        md.append("\n---\n")
        md.append(f"### 📦 Pre-existing backlog（参考・非ブロック） ({pre_total} 件)\n")
        if pre_fs:
            pre_by_tool: dict = {}
            for f in pre_fs:
                pre_by_tool.setdefault(f["tool"], {s: 0 for s in SEV_ORDER})[f["severity"]] += 1
            md += ["| tool | crit | high | med | low |", "|---|---|---|---|---|"]
            for t, c in sorted(pre_by_tool.items()):
                md.append(
                    f"| {t} | {c['critical']} | {c['high']} | {c['medium']} | {c['low']} |"
                )
            md.append(
                f"\n> 合計 {pre_total} 件は base ブランチから継続する既存 backlog です。"
                " このPRではブロックしません。"
            )
        else:
            md.append("> Base ブランチに既存の backlog はありません。")

    open(a.summary_md, "w").write("\n".join(md) + "\n")
    print("\n".join(md))

    # GitHub Actions outputs
    with open(a.out, "a") as o:
        for s in SEV_ORDER:
            o.write(f"count_{s}={counts[s]}\n")
        o.write(f"secret_count={len(secrets)}\n")
        if regression_mode:
            o.write(f"new_count={sum(counts.values())}\n")
            o.write(f"backlog_count={len(pre_fs)}\n")

    # Gate（新規 findings のみ対象）
    violated = any(counts[s] > 0 for s in fail_sev)
    if a.secret_fail == "true" and secrets:
        violated = True
    if a.medium_fail == "true" and counts["medium"] > 0:
        violated = True

    if violated:
        label = "New findings gate" if regression_mode else "Security gate"
        print(
            f"::error::{label} FAILED"
            f" (fail_sev={a.fail_sev}, new_critical={counts['critical']},"
            f" new_high={counts['high']}, new_secrets={len(secrets)})"
        )
        sys.exit(1)

    if regression_mode:
        new_total = sum(counts.values())
        print(
            f"Security gate passed. [regression mode]"
            f" new={new_total} backlog={len(pre_fs)}"
        )
    else:
        print("Security gate passed.")

if __name__ == "__main__":
    main()
