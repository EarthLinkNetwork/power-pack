#!/usr/bin/env node
/* PR に sticky な security コメントを 1 つだけ作り、以後は更新する。
   secret 値は本文に含めない（summary.md は redact 済み前提）。
   env: GITHUB_TOKEN, GITHUB_REPOSITORY(owner/repo), PR_NUMBER, PR_AUTHOR
   arg: summary.md path */
const fs = require('fs');
const MARK = '<!-- eln-security-bot -->';
const token = process.env.GITHUB_TOKEN;
const [owner, repo] = (process.env.GITHUB_REPOSITORY || '').split('/');
const pr = process.env.PR_NUMBER;
const author = process.env.PR_AUTHOR || '';
const body0 = fs.existsSync(process.argv[2]) ? fs.readFileSync(process.argv[2], 'utf8') : '(no summary)';

async function gh(method, path, body) {
  const r = await fetch(`https://api.github.com${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json', 'User-Agent': 'eln-security-bot' },
    body: body ? JSON.stringify(body) : undefined });
  if (!r.ok) throw new Error(`${method} ${path} -> ${r.status} ${await r.text()}`);
  return r.json();
}
(async () => {
  if (!pr) { console.log('no PR_NUMBER; skip'); return; }
  // 新規 Critical / Secret のときだけ強メンション
  const strong = /CRITICAL|Secret:/.test(body0);
  const mention = strong && author ? `@${author} ⚠️ 重大なセキュリティ問題を検出しました。\n\n` : '';
  const body = `${MARK}\n${mention}${body0}\n\n<sub>このコメントは push のたびに更新されます。</sub>`;
  const list = await gh('GET', `/repos/${owner}/${repo}/issues/${pr}/comments?per_page=100`);
  const existing = list.find(c => (c.body || '').includes(MARK));
  if (existing) { await gh('PATCH', `/repos/${owner}/${repo}/issues/comments/${existing.id}`, { body });
                  console.log('updated comment', existing.id); }
  else { const c = await gh('POST', `/repos/${owner}/${repo}/issues/${pr}/comments`, { body });
         console.log('created comment', c.id); }
})().catch(e => { console.error(String(e).replace(/gh[pousr]_[A-Za-z0-9]+/g,'***')); process.exit(0); });
