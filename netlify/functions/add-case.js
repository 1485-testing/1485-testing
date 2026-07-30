/**
 * Netlify Function: add-case
 * POST /.netlify/functions/add-case
 *
 * Netlify 환경변수 (Site settings → Environment variables):
 *   ADMIN_PASS     관리자 비밀번호
 *   GITHUB_TOKEN   GitHub Personal Access Token (repo contents 쓰기 권한)
 *   GITHUB_OWNER   GitHub 사용자명 (예: 1485-testing)
 *   GITHUB_REPO    레포 이름       (예: 1485-testing)
 */

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };
  if (event.httpMethod !== 'POST') return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };

  let body;
  try { body = JSON.parse(event.body); }
  catch { return { statusCode: 400, headers, body: JSON.stringify({ error: '잘못된 요청 형식입니다.' }) }; }

  const { password, caseData } = body;
  if (!password || password !== process.env.ADMIN_PASS)
    return { statusCode: 401, headers, body: JSON.stringify({ error: '비밀번호가 틀렸습니다.' }) };

  const OWNER  = process.env.GITHUB_OWNER;
  const REPO   = process.env.GITHUB_REPO;
  const TOKEN  = process.env.GITHUB_TOKEN;
  const FILE   = 'data/cases.json';
  const API    = `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE}`;
  const ghHeaders = {
    Authorization: `token ${TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'User-Agent': 'smartdesign-admin',
  };

  // 현재 cases.json 조회
  let currentCases = [];
  let fileSha = null;
  try {
    const res = await fetch(API + '?ref=main', { headers: ghHeaders });
    if (res.ok) {
      const data = await res.json();
      fileSha = data.sha;
      currentCases = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
    }
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'GitHub 조회 실패: ' + e.message }) };
  }

  // 새 사례 추가
  const newCase = {
    id:          'case-' + Date.now(),
    title:       caseData.title       || '',
    location:    caseData.location    || '',
    service:     caseData.service     || '',
    date:        caseData.date        || new Date().toISOString().split('T')[0],
    description: caseData.description || '',
    tags:        Array.isArray(caseData.tags) ? caseData.tags
                   : (caseData.tags || '').split(',').map(t => t.trim()).filter(Boolean),
    image:       caseData.image       || '',
  };
  currentCases.unshift(newCase);

  // GitHub 커밋
  const content = Buffer.from(JSON.stringify(currentCases, null, 2)).toString('base64');
  try {
    const res = await fetch(API, {
      method: 'PUT',
      headers: { ...ghHeaders, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `사례 추가: ${newCase.title} (${newCase.date})`,
        content,
        branch: 'main',
        ...(fileSha ? { sha: fileSha } : {}),
      }),
    });
    if (!res.ok) {
      const err = await res.json();
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'GitHub 커밋 실패: ' + JSON.stringify(err) }) };
    }
  } catch (e) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: '커밋 오류: ' + e.message }) };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({ success: true, message: '사례가 추가됐습니다. 30초 후 반영됩니다.', case: newCase }),
  };
};
