#!/usr/bin/env bash
# Slack 通知（Critical/High/Secret のみ・通知過多を避ける）。secret 値は絶対に含めない。
# env: SLACK_WEBHOOK_URL（未設定なら no-op）
# usage: notify-slack.sh --context main|scheduled --repo owner/repo [--sha SHA|--pr N]
#                        [--only-if-new new-findings.json]
set -uo pipefail
CTX=""; REPO=""; SHA=""; PR=""; ONLY_NEW=""
while [ $# -gt 0 ]; do case "$1" in
  --context) CTX="$2"; shift 2;; --repo) REPO="$2"; shift 2;;
  --sha) SHA="$2"; shift 2;; --pr) PR="$2"; shift 2;;
  --only-if-new) ONLY_NEW="$2"; shift 2;; *) shift;; esac; done

[ -z "${SLACK_WEBHOOK_URL:-}" ] && { echo "SLACK_WEBHOOK_URL 未設定; skip"; exit 0; }

# only-if-new: ファイルが空/0件なら通知しない
if [ -n "$ONLY_NEW" ]; then
  n=$(jq 'length' "$ONLY_NEW" 2>/dev/null || echo 0)
  [ "${n:-0}" -eq 0 ] && { echo "新規 Critical/High なし; 通知しない"; exit 0; }
fi

RUN_URL="${GITHUB_SERVER_URL:-https://github.com}/${REPO}/actions/runs/${GITHUB_RUN_ID:-}"
REF="${SHA:+commit \`${SHA:0:12}\`}${PR:+PR #$PR}"
TEXT=":rotating_light: *Security alert* (${CTX})
• repo: \`${REPO}\`  ${REF}
• run: ${RUN_URL}"
[ -n "${DEFECTDOJO_URL:-}" ] && TEXT="$TEXT
• DefectDojo: ${DEFECTDOJO_URL}"

# secret 値は載せない（要約のみ）
curl -s -X POST -H 'Content-type: application/json' \
  --data "$(jq -nc --arg t "$TEXT" '{text:$t}')" "$SLACK_WEBHOOK_URL" >/dev/null \
  && echo "Slack 通知送信" || echo "Slack 通知失敗 (継続)"
