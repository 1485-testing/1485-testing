<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>시공 사례 | 스마트디자인 강동구 집수리</title>
  <meta name="description" content="스마트디자인 강동구 변기교체·수전교체·환풍기교체 실제 시공 사례. 천호동, 성내동, 길동, 암사동 등 현장 기록."/>
  <link rel="canonical" href="https://1485testing.netlify.app/cases/"/>
  <script type="application/ld+json">{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"홈","item":"https://1485testing.netlify.app/"},{"@type":"ListItem","position":2,"name":"시공 사례","item":"https://1485testing.netlify.app/cases/"}]}</script>
  <script src="/js/layout.js"></script>
  <style>
.admin-link{text-align:right;padding:14px 16px 0}
.admin-link a{font-size:12px;color:var(--mu);border:1px solid var(--bd);padding:5px 12px;border-radius:6px;background:var(--card)}
.filter-bar{display:flex;gap:8px;overflow-x:auto;padding:14px 16px 8px;-webkit-overflow-scrolling:touch;scrollbar-width:none}
.filter-bar::-webkit-scrollbar{display:none}
.fbtn{white-space:nowrap;padding:7px 14px;border-radius:6px;font-size:13px;font-weight:600;border:1px solid var(--bd);background:var(--card);color:var(--mu);cursor:pointer;transition:.15s;flex-shrink:0}
.fbtn.on{background:var(--p);color:#fff;border-color:var(--p)}
.fbtn:hover:not(.on){border-color:var(--p);color:var(--p)}
.cases-grid{display:grid;gap:12px;padding:0 16px}
.case-card{background:var(--card);border:1px solid var(--bd);border-radius:12px;overflow:hidden;box-shadow:var(--sh0);transition:.15s}
.case-card:hover{border-color:var(--p2);box-shadow:var(--sh1)}
.case-img{width:100%;aspect-ratio:16/9;background:#dde8f5;display:flex;align-items:center;justify-content:center;font-size:48px;overflow:hidden}
.case-img img{width:100%;height:100%;object-fit:cover}
.case-body{padding:16px}
.case-meta{display:flex;align-items:center;gap:8px;margin-bottom:8px;flex-wrap:wrap}
.cbadge{display:inline-block;padding:3px 10px;border-radius:4px;font-size:11px;font-weight:700;background:var(--p3);color:var(--p)}
.cdate{font-size:11px;color:var(--mu2)}
.ctitle{font-size:15px;font-weight:800;color:var(--tx);margin-bottom:6px}
.cloc{font-size:12px;color:var(--mu);margin-bottom:8px}
.cdesc{font-size:13px;color:var(--mu);line-height:1.75}
.ctags{display:flex;gap:6px;margin-top:10px;flex-wrap:wrap}
.ctag{font-size:11px;padding:3px 8px;background:var(--bg);border:1px solid var(--bd);border-radius:4px;color:var(--mu2)}
.empty-state{text-align:center;padding:40px 20px;color:var(--mu);font-size:14px}
.cta-box{background:var(--a);border-radius:12px;margin:20px 16px;padding:24px 20px;text-align:center}
.cta-box p{font-size:13px;color:rgba(255,255,255,.9);margin-bottom:14px;word-break:keep-all}
.cta-box a{display:inline-flex;align-items:center;gap:8px;background:#fff;color:var(--a);padding:12px 26px;border-radius:8px;font-size:19px;font-weight:900}
  </style>
</head>
<body>
<div id="sd-header"></div>
<div style="padding:20px 16px 0">
  <div style="font-size:18px;font-weight:900;color:var(--tx)">📸 시공 사례</div>
  <div style="font-size:13px;color:var(--mu);margin-top:4px">스마트디자인 강동구 실제 시공 현장 기록</div>
</div>
<div class="admin-link"><a href="/admin/">🔐 관리자 로그인</a></div>
<div class="filter-bar">
  <button class="fbtn on" data-f="전체">전체</button>
  <button class="fbtn" data-f="변기교체">변기교체</button>
  <button class="fbtn" data-f="세면대수전교체">세면대수전</button>
  <button class="fbtn" data-f="싱크대수전교체">싱크대수전</button>
  <button class="fbtn" data-f="환풍기교체">환풍기교체</button>
  <button class="fbtn" data-f="샤워기수전교체">샤워기수전</button>
  <button class="fbtn" data-f="전체인테리어">인테리어</button>
</div>
<div class="cases-grid" id="cases-grid"><div class="empty-state">⏳ 불러오는 중...</div></div>
<div class="cta-box"><p>시공 문의는 24시 전화 상담으로!</p><a href="tel:0503-7150-5346">📞 0503-7150-5346</a></div>
<div id="sd-footer"></div>
<script>
SD.init('cases');
var allCases=[],cf='전체';
var icon={'변기교체':'🚽','세면대수전교체':'🪣','싱크대수전교체':'🍳','샤워기수전교체':'🚿','환풍기교체':'💨','전체인테리어':'🏠','바닥보수':'🪵','도배':'🖼️','타일시공':'🔲','누수수리':'💧'};
fetch('/data/cases.json').then(function(r){return r.json()}).then(function(d){allCases=d;render()})
  .catch(function(){document.getElementById('cases-grid').innerHTML='<div class="empty-state">사례를 불러올 수 없습니다.</div>'});
function render(){
  var g=document.getElementById('cases-grid');
  var list=cf==='전체'?allCases:allCases.filter(function(c){return c.service===cf});
  var s=[].concat(list).sort(function(a,b){return b.date.localeCompare(a.date)});
  if(!s.length){g.innerHTML='<div class="empty-state">해당 카테고리의 사례가 없습니다.</div>';return;}
  g.innerHTML=s.map(function(c){
    var img=c.image?'<img src="'+c.image+'" alt="'+c.title+'">':(icon[c.service]||'🔧');
    return '<article class="case-card"><div class="case-img">'+img+'</div>'
      +'<div class="case-body"><div class="case-meta"><span class="cbadge">'+c.service+'</span><span class="cdate">'+c.date+'</span></div>'
      +'<div class="ctitle">'+c.title+'</div><div class="cloc">📍 '+c.location+'</div>'
      +'<div class="cdesc">'+c.description+'</div>'
      +'<div class="ctags">'+(c.tags||[]).map(function(t){return '<span class="ctag">#'+t+'</span>'}).join('')+'</div>'
      +'</div></article>';
  }).join('');
}
document.querySelectorAll('.fbtn').forEach(function(b){
  b.addEventListener('click',function(){
    document.querySelectorAll('.fbtn').forEach(function(x){x.classList.remove('on')});
    this.classList.add('on'); cf=this.dataset.f; render();
  });
});
</script>
</body>
</html>
