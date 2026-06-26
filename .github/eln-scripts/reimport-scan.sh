#!/usr/bin/env bash
# reimport-scan.sh — スキャン結果を DefectDojo に reimport（repo×tool ごとに Test 継続）。
#   Product Type=ELN GitHub Repositories / Product=<repo> / Engagement=<--engagement>
#   Test=<--test-title>。auto_create_context で無ければ自動作成。close_old_findings 対応。
#   token は投入専用（管理者 token を使わない前提）。token はログに出さない。
#
# env:  DEFECTDOJO_URL, DEFECTDOJO_TOKEN
# args: --repo R --engagement E --scan-type "Trivy Scan" --file f.json
#       [--test-title T] [--close-old] [--emit-new out.json] [--min-sev Low]
set -uo pipefail
REPO=""; ENG=""; ST=""; FILE=""; TITLE=""; CLOSE="false"; EMIT=""; MINSEV="Info"
while [ $# -gt 0 ]; do case "$1" in
  --repo) REPO="$2"; shift 2;; --engagement) ENG="$2"; shift 2;;
  --scan-type) ST="$2"; shift 2;; --file) FILE="$2"; shift 2;;
  --test-title) TITLE="$2"; shift 2;; --close-old) CLOSE="true"; shift;;
  --emit-new) EMIT="$2"; shift 2;; --min-sev) MINSEV="$2"; shift 2;;
  *) echo "unknown arg: $1" >&2; exit 2;; esac; done
TITLE="${TITLE:-$ST}"
: "${DEFECTDOJO_URL:?DEFECTDOJO_URL required}"; : "${DEFECTDOJO_TOKEN:?DEFECTDOJO_TOKEN required}"
[ -f "$FILE" ] || { echo "scan file not found: $FILE" >&2; exit 3; }
[ -n "$REPO" ] && [ -n "$ENG" ] && [ -n "$ST" ] || { echo "--repo/--engagement/--scan-type required" >&2; exit 2; }

DD="${DEFECTDOJO_URL%/}"; AUTH="Authorization: Token $DEFECTDOJO_TOKEN"
echo "[reimport] product='$REPO' engagement='$ENG' test='$TITLE' type='$ST' close_old=$CLOSE"
code=$(curl -sS -o /tmp/dd-reimport.json -w '%{http_code}' -X POST "$DD/api/v2/reimport-scan/" \
  -H "$AUTH" \
  -F "scan_type=$ST" -F "file=@$FILE" \
  -F "product_type_name=ELN GitHub Repositories" \
  -F "product_name=$REPO" \
  -F "engagement_name=$ENG" \
  -F "test_title=$TITLE" \
  -F "auto_create_context=true" \
  -F "close_old_findings=$CLOSE" \
  -F "minimum_severity=$MINSEV" \
  -F "active=true" -F "verified=false")
if [ "$code" != "201" ] && [ "$code" != "200" ]; then
  echo "[reimport] FAILED HTTP $code" >&2
  jq -r '.message // .detail // .' /tmp/dd-reimport.json 2>/dev/null >&2 || true
  rm -f /tmp/dd-reimport.json; exit 4
fi
TEST_ID=$(jq -r '.test // .test_id // empty' /tmp/dd-reimport.json 2>/dev/null)
echo "[reimport] OK (HTTP $code) test_id=$TEST_ID"
rm -f /tmp/dd-reimport.json

# 新規 Critical/High を抽出（scheduled の通知判定用）
if [ -n "$EMIT" ] && [ -n "$TEST_ID" ]; then
  curl -sS -H "$AUTH" -H 'Accept: application/json' \
    "$DD/api/v2/findings/?test=$TEST_ID&severity=Critical&severity=High&is_mitigated=false&limit=200" \
    | jq '[.results[]? | {id,title,severity,file_path,line}]' > "$EMIT" 2>/dev/null || echo "[]" > "$EMIT"
  echo "[reimport] new crit/high -> $EMIT ($(jq 'length' "$EMIT" 2>/dev/null))"
fi
