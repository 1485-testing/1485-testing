/**
 * generate-post.js
 * 매일 1개 키워드를 골라 posts/ 디렉터리에 HTML 페이지를 생성합니다.
 * 실행: node scripts/generate-post.js
 */

const fs   = require('fs');
const path = require('path');

// ── 경로 설정 ──
const ROOT          = path.join(__dirname, '..');
const KEYWORDS_PATH = path.join(ROOT, 'data', 'keywords.json');
const POSTS_PATH    = path.join(ROOT, 'data', 'posts.json');
const TEMPLATE_PATH = path.join(ROOT, 'templates', 'post-template.html');
const POSTS_DIR     = path.join(ROOT, 'posts');

// ── 유틸 ──
function encodeKorean(str) {
  return encodeURIComponent(str);
}

function today() {
  return new Date().toISOString().split('T')[0];
}

// ── 메인 ──
function main() {
  // 1. 데이터 로드
  const keywords = JSON.parse(fs.readFileSync(KEYWORDS_PATH, 'utf8'));
  const posts    = JSON.parse(fs.readFileSync(POSTS_PATH,    'utf8'));
  const template = fs.readFileSync(TEMPLATE_PATH, 'utf8');

  // 2. 미사용 키워드 찾기
  const unused = keywords.filter(k => !k.used);
  if (!unused.length) {
    console.log('✅ 모든 키워드를 소진했습니다. keywords.json에서 used를 false로 재설정하세요.');
    process.exit(0);
  }

  const kw = unused[0];
  const date = today();

  // 3. HTML 생성 (템플릿 치환)
  const html = template
    .replace(/\{\{LOCATION\}\}/g,      kw.location)
    .replace(/\{\{SERVICE\}\}/g,       kw.service)
    .replace(/\{\{SLUG\}\}/g,          kw.slug)
    .replace(/\{\{DATE\}\}/g,          date)
    .replace(/\{\{LOCATION_ENC\}\}/g,  encodeKorean(kw.location))
    .replace(/\{\{SERVICE_ENC\}\}/g,   encodeKorean(kw.service));

  // 4. 파일 저장 (posts/{slug}/index.html)
  const postDir = path.join(POSTS_DIR, kw.slug);
  fs.mkdirSync(postDir, { recursive: true });
  fs.writeFileSync(path.join(postDir, 'index.html'), html, 'utf8');
  console.log(`✅ 생성: posts/${kw.slug}/index.html`);

  // 5. keywords.json 업데이트
  kw.used = true;
  kw.usedDate = date;
  fs.writeFileSync(KEYWORDS_PATH, JSON.stringify(keywords, null, 2), 'utf8');

  // 6. posts.json 인덱스 업데이트
  posts.unshift({
    slug:     kw.slug,
    title:    `${kw.location} ${kw.service} 출장 방문 안내`,
    location: kw.location,
    service:  kw.service,
    date:     date,
    url:      `/posts/${kw.slug}/`
  });
  fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2), 'utf8');
  console.log(`✅ posts.json 업데이트: ${posts.length}개 포스트`);
}

main();
