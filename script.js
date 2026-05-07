const DATA_PATH = './data.json';

const typingTitle = document.getElementById('typingTitle');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const projectsGrid = document.getElementById('projectsGrid');
const reviewsList = document.getElementById('reviewsList');
const projectTemplate = document.getElementById('projectTemplate');
const reviewTemplate = document.getElementById('reviewTemplate');
const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');

const TYPE_TEXT = 'Привет! Я создаю веб-приложения, которыми приятно пользоваться.';

function typeGreeting(text, speed = 38) {
  let index = 0;
  typingTitle.textContent = '';
  const timer = setInterval(() => {
    typingTitle.textContent += text[index] || '';
    index += 1;
    if (index > text.length) clearInterval(timer);
  }, speed);
}

function renderProjects(projects = []) {
  projectsGrid.innerHTML = '';
  projects.forEach((project) => {
    const node = projectTemplate.content.cloneNode(true);
    node.querySelector('h3').textContent = project.title;
    node.querySelector('.project-description').textContent = project.description;

    const image = node.querySelector('.project-image');
    image.src = project.image;
    image.alt = `Изображение проекта ${project.title}`;

    const link = node.querySelector('.project-link');
    link.href = project.url;

    const tagsWrap = node.querySelector('.project-tags');
    (project.tags || []).forEach((tag) => {
      const chip = document.createElement('span');
      chip.textContent = tag;
      tagsWrap.append(chip);
    });

    projectsGrid.append(node);
  });
}

function renderReviews(reviews = []) {
  reviewsList.innerHTML = '';
  reviews.forEach((review) => {
    const node = reviewTemplate.content.cloneNode(true);
    node.querySelector('.review-text').textContent = `“${review.text}”`;
    node.querySelector('.review-author').textContent = review.author;
    node.querySelector('.review-role').textContent = review.role;
    reviewsList.append(node);
  });
}

async function loadData() {
  try {
    const response = await fetch(DATA_PATH);
    if (!response.ok) throw new Error('Не удалось загрузить конфиг.');
    const data = await response.json();
    renderProjects(data.projects);
    renderReviews(data.reviews);
  } catch (error) {
    console.error(error);
    formStatus.textContent = 'Ошибка загрузки данных портфолио.';
  }
}

function setupRevealAnimation() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
      });
    },
    { threshold: 0.15 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

function setupNav() {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

function setupForm() {
  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(contactForm);
    const payload = Object.fromEntries(formData.entries());

    if (!payload.name || !payload.email || !payload.message) {
      formStatus.textContent = 'Заполните все поля формы.';
      return;
    }

    formStatus.textContent = 'Спасибо! Сообщение сохранено локально.';
    const savedMessages = JSON.parse(localStorage.getItem('portfolioMessages') || '[]');
    savedMessages.push({ ...payload, date: new Date().toISOString() });
    localStorage.setItem('portfolioMessages', JSON.stringify(savedMessages));
    contactForm.reset();
  });
}

function init() {
  typeGreeting(TYPE_TEXT);
  setupRevealAnimation();
  setupNav();
  setupForm();
  loadData();
  document.getElementById('year').textContent = String(new Date().getFullYear());
}

init();
