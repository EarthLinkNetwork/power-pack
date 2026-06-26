#!/usr/bin/env python3
"""scan-results/*.json|sarif を正規化し、GitHub annotation / summary.md / gate を出力。
secret 値は表示しない（gitleaks は --redact 前提、ここでも値は出さない）。"""
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
    findings=[]  # {tool,severity,file,line,title,is_secret}
    for p in glob.glob(os.path.join(d,"*")):
        data=load(p); name=os.path.basename(p).lower()
        if data is None: continue
        if "semgrep" in name and isinstance(data,dict) and "results" in data:
            for r in data["results"]:
                ex=r.get("extra",{})
                findings.append(dict(tool="semgrep",severity=norm_sev(ex.get("severity")),
                    file=r.get("path"),line=(r.get("start") or {}).get("line"),
                    title=ex.get("message","semgrep finding")[:160],is_secret=False))
        elif "gitleaks" in name and isinstance(data,list):
            for r in data:
                findings.append(dict(tool="gitleaks",severity="high",
                    file=r.get("File"),line=r.get("StartLine"),
                    title=f"Secret: {r.get('RuleID','rule')} (値は非表示)",is_secret=True))
        elif "trivy" in name and isinstance(data,dict):
            for res in data.get("Results",[]) or []:
                tgt=res.get("Target","")
                for v in (res.get("Vulnerabilities") or []):
                    findings.append(dict(tool="trivy",severity=norm_sev(v.get("Severity")),
                        file=tgt,line=None,title=f"{v.get('VulnerabilityID')} {v.get('PkgName')} {v.get('InstalledVersion')}",is_secret=False))
                for s in (res.get("Secrets") or []):
                    findings.append(dict(tool="trivy",severity="high",file=tgt,line=s.get("StartLine"),
                        title=f"Secret: {s.get('RuleID')} (値は非表示)",is_secret=True))
        elif "audit" in name and isinstance(data,dict):
            vulns=(data.get("vulnerabilities") or {})
            if isinstance(vulns,dict):
                for k,v in vulns.items():
                    findings.append(dict(tool="audit",severity=norm_sev(v.get("severity")),
                        file="package.json",line=None,title=f"{k}: {v.get('severity')} advisory",is_secret=False))
    return findings

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--dir",required=True); ap.add_argument("--fail-sev",default="critical,high")
    ap.add_argument("--secret-fail",default="true"); ap.add_argument("--medium-fail",default="false")
    ap.add_argument("--summary-md",required=True); ap.add_argument("--out",default="/dev/null")
    a=ap.parse_args()
    fs=collect(a.dir)
    counts={s:0 for s in SEV_ORDER}
    for f in fs: counts[f["severity"]]=counts.get(f["severity"],0)+1
    secrets=[f for f in fs if f["is_secret"]]
    # annotations (code-linked のみ)
    for f in fs:
        if f.get("file") and f.get("line"):
            print(f"::error file={f['file']},line={f['line']}::[{f['tool']}/{f['severity']}] {f['title']}")
    # summary.md
    fail_sev=set(s.strip() for s in a.fail_sev.split(",") if s.strip())
    md=["## 🔒 Security PR check\n","| tool | crit | high | med | low |","|---|---|---|---|---|"]
    by_tool={}
    for f in fs: by_tool.setdefault(f["tool"],{s:0 for s in SEV_ORDER})[f["severity"]]+=1
    for t,c in sorted(by_tool.items()):
        md.append(f"| {t} | {c['critical']} | {c['high']} | {c['medium']} | {c['low']} |")
    ch=[f for f in fs if f["severity"] in ("critical","high")]
    if ch:
        md.append("\n### Critical / High\n")
        for f in ch[:50]:
            loc=f"`{f['file']}`"+(f":{f['line']}" if f.get('line') else "")
            md.append(f"- **{f['severity'].upper()}** [{f['tool']}] {f['title']} — {loc}")
        md.append("\n> 修正方法: Semgrep=該当行のロジック修正 / Trivy=依存 bump / Gitleaks=secret 失効&除去&履歴削除")
    else:
        md.append("\n✅ Critical / High はありません。")
    open(a.summary_md,"w").write("\n".join(md)+"\n")
    print("\n".join(md))
    # outputs
    with open(a.out,"a") as o:
        for s in SEV_ORDER: o.write(f"count_{s}={counts[s]}\n")
        o.write(f"secret_count={len(secrets)}\n")
    # gate
    violated = any(counts[s]>0 for s in fail_sev)
    if a.secret_fail=="true" and secrets: violated=True
    if a.medium_fail=="true" and counts["medium"]>0: violated=True
    if violated:
        print(f"::error::Security gate FAILED (fail_sev={a.fail_sev}, secrets={len(secrets)})")
        sys.exit(1)
    print("Security gate passed.")

if __name__=="__main__": main()
