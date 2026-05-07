const DATA_PATH = './data.json';
const i18n = {
  ru: { navAbout:'Обо мне',navProjects:'Проекты',navPlayground:'Песочница',navContacts:'Контакты',navReviews:'Отзывы',heroBadge:'Senior Engineer / Creative Technologist',heroTitle:'Я строю живые digital-продукты нового уровня.',heroSubtitle:'Интерактивный дизайн, быстрая архитектура и мощный DX для команд и стартапов.',ctaProjects:'Смотреть проекты',ctaPlayground:'Открыть песочницу',aboutTitle:'Обо мне',aboutText:'Я делаю современный IT-продукт: от UX-концепции до production-кода.',aboutStack:'Стек',aboutFocus:'Фокус',aboutMode:'Подход',projectsTitle:'Проекты',projectsHint:'Добавляйте проекты через data.json.',playTitle:'Live Coding Playground',playSubtitle:'Редактируйте код и смотрите результат сразу.',runCode:'Запустить код',preview:'Превью',contactsTitle:'Контакты',contactsSubtitle:'Напишите, и я отвечу в течение суток.',formName:'Имя',formEmail:'Email',formMessage:'Сообщение',send:'Отправить',reviewsTitle:'Отзывы',reviewsHint:'Отзывы загружаются из data.json',formOk:'Спасибо! Сообщение сохранено локально.',formErr:'Заполните все поля.'},
  en: { navAbout:'About',navProjects:'Projects',navPlayground:'Playground',navContacts:'Contacts',navReviews:'Reviews',heroBadge:'Senior Engineer / Creative Technologist',heroTitle:'I build living digital products at the highest level.',heroSubtitle:'Interactive design, fast architecture, and strong DX for teams and startups.',ctaProjects:'View projects',ctaPlayground:'Open playground',aboutTitle:'About me',aboutText:'I craft modern IT products from UX concept to production code.',aboutStack:'Stack',aboutFocus:'Focus',aboutMode:'Approach',projectsTitle:'Projects',projectsHint:'Add projects via data.json.',playTitle:'Live Coding Playground',playSubtitle:'Edit code and see instant output.',runCode:'Run code',preview:'Preview',contactsTitle:'Contacts',contactsSubtitle:'Send a message and I will reply within 24 hours.',formName:'Name',formEmail:'Email',formMessage:'Message',send:'Send',reviewsTitle:'Reviews',reviewsHint:'Reviews are loaded from data.json',formOk:'Thanks! Message saved locally.',formErr:'Please fill all fields.'},
  zh: { navAbout:'关于我',navProjects:'项目',navPlayground:'代码沙盒',navContacts:'联系',navReviews:'评价',heroBadge:'高级工程师 / 创意技术专家',heroTitle:'我打造高水准、充满生命力的数字产品。',heroSubtitle:'互动设计、快速架构与强大开发体验，服务团队与创业公司。',ctaProjects:'查看项目',ctaPlayground:'打开沙盒',aboutTitle:'关于我',aboutText:'我从 UX 概念到生产级代码打造现代 IT 产品。',aboutStack:'技术栈',aboutFocus:'重点',aboutMode:'方法',projectsTitle:'项目',projectsHint:'通过 data.json 轻松添加项目。',playTitle:'实时编码沙盒',playSubtitle:'编辑代码并立即查看结果。',runCode:'运行代码',preview:'预览',contactsTitle:'联系',contactsSubtitle:'欢迎留言，我通常 24 小时内回复。',formName:'姓名',formEmail:'邮箱',formMessage:'留言',send:'发送',reviewsTitle:'用户评价',reviewsHint:'评价内容来自 data.json',formOk:'感谢！消息已保存在本地。',formErr:'请填写所有字段。'}
};

const els = {
  typingTitle: document.getElementById('typingTitle'), langSelect: document.getElementById('langSelect'),
  navToggle: document.getElementById('navToggle'), navLinks: document.getElementById('navLinks'),
  projectsGrid: document.getElementById('projectsGrid'), reviewsList: document.getElementById('reviewsList'),
  projectTemplate: document.getElementById('projectTemplate'), reviewTemplate: document.getElementById('reviewTemplate'),
  contactForm: document.getElementById('contactForm'), formStatus: document.getElementById('formStatus'),
  codeInput: document.getElementById('codeInput'), codePreview: document.getElementById('codePreview'), runCodeBtn: document.getElementById('runCodeBtn')
};
let locale = localStorage.getItem('portfolioLang') || 'ru';
let copy = i18n[locale];

function applyI18n() {
  copy = i18n[locale];
  document.querySelectorAll('[data-i18n]').forEach((el) => { el.textContent = copy[el.dataset.i18n]; });
  typeText(copy.heroTitle);
}

function typeText(text) {
  els.typingTitle.textContent = '';
  [...text].forEach((ch, i) => setTimeout(() => { els.typingTitle.textContent += ch; }, 22 * i));
}

function renderProjects(projects=[]) { els.projectsGrid.innerHTML=''; projects.forEach((p)=>{ const n=els.projectTemplate.content.cloneNode(true); n.querySelector('h3').textContent=p.title; n.querySelector('.project-description').textContent=p.description; const img=n.querySelector('.project-image'); img.src=p.image; img.alt=p.title; n.querySelector('.project-link').href=p.url; const tags=n.querySelector('.project-tags'); (p.tags||[]).forEach((t)=>{ const s=document.createElement('span'); s.textContent=t; tags.append(s); }); els.projectsGrid.append(n); }); }
function renderReviews(reviews=[]) { els.reviewsList.innerHTML=''; reviews.forEach((r)=>{ const n=els.reviewTemplate.content.cloneNode(true); n.querySelector('.review-text').textContent=`“${r.text}”`; n.querySelector('.review-author').textContent=r.author; n.querySelector('.review-role').textContent=r.role; els.reviewsList.append(n); }); }

async function loadData(){ const resp=await fetch(DATA_PATH); const data=await resp.json(); renderProjects(data.projects); renderReviews(data.reviews); }
function setupReveal(){ const ob=new IntersectionObserver((e)=>e.forEach((x)=>x.isIntersecting&&x.target.classList.add('visible')),{threshold:.12}); document.querySelectorAll('.reveal').forEach((el)=>ob.observe(el)); }
function setupNav(){ els.navToggle.addEventListener('click',()=>els.navLinks.classList.toggle('open')); els.navLinks.querySelectorAll('a').forEach((a)=>a.addEventListener('click',()=>els.navLinks.classList.remove('open'))); }
function setupForm(){ els.contactForm.addEventListener('submit',(e)=>{ e.preventDefault(); const payload=Object.fromEntries(new FormData(els.contactForm).entries()); if(!payload.name||!payload.email||!payload.message){ els.formStatus.textContent=copy.formErr; return; } const arr=JSON.parse(localStorage.getItem('portfolioMessages')||'[]'); arr.push({...payload,date:new Date().toISOString()}); localStorage.setItem('portfolioMessages',JSON.stringify(arr)); els.formStatus.textContent=copy.formOk; els.contactForm.reset(); }); }
function setupI18n(){ els.langSelect.value=locale; els.langSelect.addEventListener('change',(e)=>{ locale=e.target.value; localStorage.setItem('portfolioLang',locale); applyI18n(); }); }
function runCode(){ els.codePreview.srcdoc = els.codeInput.value; }
function setupPlayground(){ els.codeInput.value = `<style>body{font-family:system-ui;padding:18px;background:#0b1020;color:#fff}button{background:#6d5cff;color:#fff;border:0;padding:10px 14px;border-radius:8px}</style><h2>Hello, Neon Lab 👋</h2><button onclick="this.textContent='It works 🚀'">Click me</button>`; els.runCodeBtn.addEventListener('click', runCode); runCode(); }

function init(){ setupNav(); setupReveal(); setupForm(); setupI18n(); setupPlayground(); applyI18n(); loadData(); }
init();
