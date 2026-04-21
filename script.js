const invitationConfig = {
  profile: {
    name: 'София',
    date: '21 апреля',
    time: '18:00',
    exhibition: '«Под маской»',
    venue: 'Москва, Музей русского импрессионизма',
    telegramUsername: '@VIK_1s',
    telegramMessage: 'Да, я на всё готова!',
    defaultMaskPhoto: './assets/images/couple-photo.jpg',
    musicPath: '',
  },
  copyVariants: {
    romantic: {
      eyebrow: 'Личное приглашение',
      heroTitle: 'Есть вечера, которые хочется разделить только с тем, кто чувствует красоту.',
      heroDescription:
        'Там, где свет мягко касается тени, а за маской раскрываются характеры, настроение и тайна.',
      personalTitle: 'София, ты точно поймаешь эту атмосферу.',
      personalText:
        'Мне захотелось пригласить тебя туда, где искусство звучит тише слов, а каждый образ словно говорит по-особенному.',
      eventTitle: 'Выставка «Под маской»',
      eventText:
        'Карнавалы, маскарады и тонкая театральность повседневной жизни — мир, где хочется рассматривать детали вдвоём.',
      inviteTitle: 'Если тебе откликается эта история, давай пойдём вместе.',
      inviteText:
        'Без лишнего шума, в красивом ритме вечерней Москвы — просто оказаться в нужном месте и в нужной компании.',
      confirmation:
        'Тогда всё решено: скоро за маской искусства нас будет ждать очень красивый вечер.',
    },
    mysterious: {
      eyebrow: 'Вечер в стиле noir',
      heroTitle: 'Иногда самый интересный образ — тот, что скрыт под маской.',
      heroDescription: 'Темнее фон, тише музыка, точнее детали. И особенное приглашение только для тебя.',
      personalTitle: 'София, мне кажется, тебе понравится эта игра образов.',
      personalText:
        'Там, где у каждого штриха есть подтекст, а атмосфера держит внимание до последнего света в зале.',
      eventTitle: '«Под маской» в Москве',
      eventText:
        'Эстетика перевоплощений, карнавала и лёгкой тайны — история, которую хочется прожить не в одиночку.',
      inviteTitle: 'Предлагаю открыть эту историю вместе.',
      inviteText:
        '21 апреля в 18:00. Музей русского импрессионизма. Я буду ждать)',
      confirmation: 'Прекрасный выбор. Тогда пусть этот вечер начнётся с правильного акцента.',
    },
    confident: {
      eyebrow: 'Приглашение',
      heroTitle: 'Есть места, которые хочется смотреть вместе с человеком со вкусом.',
      heroDescription:
        'И у меня есть точный адрес и дата — идеально для красивого и запоминающегося вечера.',
      personalTitle: 'София, это приглашение для тебя.',
      personalText:
        'Продуманная атмосфера, эстетика маскарада и музейный свет — формат, который тебе очень идёт.',
      eventTitle: 'Выставка «Под маской»',
      eventText:
        'Маски, переодевания, карнавальные образы и театрализация повседневности в самом сердце Москвы.',
      inviteTitle: 'Пойдём на «Под маской» 21 апреля.',
      inviteText:
        'Спокойно, красиво и без лишних слов: просто принимаем это приглашение и делаем вечер особенным.',
      confirmation: 'Идеально. Я подготовлю всё остальное — тебе остаётся только улыбнуться.',
    },
  },
  activeVariant: 'mysterious',
  audio: {
    volume: 0.42,
    fadeInDurationMs: 1800,
  },
  redirects: {
    delayAfterConfirmMs: 2100,
  },
  visuals: {
    sparkleCount: 20,
    parallaxStrength: 10,
  },
};

const refs = {
  introOverlay: document.getElementById('introOverlay'),
  startButton: document.getElementById('startButton'),
  bgMusic: document.getElementById('bgMusic'),
  soundToggle: document.getElementById('soundToggle'),
  soundState: document.getElementById('soundState'),
  agreeButton: document.getElementById('agreeButton'),
  confirmation: document.getElementById('confirmation'),
  confirmationText: document.getElementById('confirmationText'),
  sparkles: document.getElementById('sparkles'),
  hero: document.getElementById('hero'),
  maskOrb: document.getElementById('maskOrb'),
  orbHint: document.getElementById('orbHint'),
};

let audioReady = false;
let isMuted = false;
let fadeHandle = null;

function pickCopy() {
  return invitationConfig.copyVariants[invitationConfig.activeVariant] || invitationConfig.copyVariants.romantic;
}

function buildTelegramLink() {
  const username = invitationConfig.profile.telegramUsername.replace('@', '');
  const text = encodeURIComponent(invitationConfig.profile.telegramMessage);
  return `https://t.me/${username}?text=${text}`;
}

function applyMaskPhoto() {
  const imagePath = invitationConfig.profile.defaultMaskPhoto;
  if (!imagePath) {
    refs.orbHint.textContent = 'Добавьте фото в assets/images/couple-photo.jpg';
    return;
  }

  const probe = new Image();
  probe.onload = () => {
    refs.maskOrb.style.setProperty('--mask-image', `url('${imagePath}')`);
    refs.maskOrb.classList.add('has-photo');
    refs.orbHint.textContent = 'Ваше фото в маске';
  };
  probe.onerror = () => {
    refs.maskOrb.classList.remove('has-photo');
    refs.orbHint.textContent = 'Фото не найдено: assets/images/couple-photo.jpg';
  };
  probe.src = imagePath;
}

function applyTextContent() {
  const copy = pickCopy();
  const { name, date, time, exhibition, venue } = invitationConfig.profile;

  document.getElementById('eyebrowText').textContent = copy.eyebrow;
  document.getElementById('heroTitle').textContent = copy.heroTitle;
  document.getElementById('heroDescription').textContent = copy.heroDescription;
  document.getElementById('personalTitle').textContent = copy.personalTitle.replace('София', name);
  document.getElementById('personalText').textContent = copy.personalText;
  document.getElementById('eventTitle').textContent = copy.eventTitle;
  document.getElementById('eventText').textContent = copy.eventText;
  document.getElementById('inviteTitle').textContent = copy.inviteTitle;
  document.getElementById('inviteText').textContent = copy.inviteText;
  document.getElementById('factDate').textContent = date;
  document.getElementById('factPlace').textContent = venue;
  document.getElementById('factTime').textContent = `Начало в ${time}`;
  refs.confirmationText.textContent = copy.confirmation;

  document.title = `${name} — приглашение на ${exhibition}`;
  refs.bgMusic.src = invitationConfig.profile.musicPath || '';
  if (!invitationConfig.profile.musicPath) {
    refs.soundState.textContent = 'Add track';
  }
}

function initRevealAnimations() {
  const items = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((item) => observer.observe(item));
}

function initSparkles() {
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < invitationConfig.visuals.sparkleCount; i += 1) {
    const dot = document.createElement('span');
    dot.className = 'spark';
    dot.style.left = `${Math.random() * 100}%`;
    dot.style.top = `${Math.random() * 100}%`;
    dot.style.animationDelay = `${Math.random() * 8}s`;
    dot.style.animationDuration = `${7 + Math.random() * 8}s`;
    fragment.append(dot);
  }
  refs.sparkles.append(fragment);
}

function initParallax() {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;

  document.addEventListener('pointermove', (event) => {
    const x = (event.clientX / window.innerWidth - 0.5) * invitationConfig.visuals.parallaxStrength;
    const y = (event.clientY / window.innerHeight - 0.5) * invitationConfig.visuals.parallaxStrength;
    refs.hero.style.setProperty('--parallaxX', `${x.toFixed(2)}px`);
    refs.hero.style.setProperty('--parallaxY', `${y.toFixed(2)}px`);
  });
}

async function playMusicWithFade() {
  const audio = refs.bgMusic;
  if (!invitationConfig.profile.musicPath) return;
  audio.volume = 0;
  try {
    await audio.play();
    audioReady = true;
    refs.soundToggle.disabled = false;
    fadeAudio(audio, invitationConfig.audio.volume, invitationConfig.audio.fadeInDurationMs);
  } catch (error) {
    refs.soundState.textContent = 'Sound blocked';
  }
}

function fadeAudio(audio, targetVolume, duration) {
  if (fadeHandle) {
    window.clearInterval(fadeHandle);
  }

  const steps = 20;
  const interval = Math.max(30, Math.floor(duration / steps));
  const volumeStep = targetVolume / steps;

  fadeHandle = window.setInterval(() => {
    const next = Math.min(targetVolume, audio.volume + volumeStep);
    audio.volume = next;

    if (next >= targetVolume) {
      window.clearInterval(fadeHandle);
      fadeHandle = null;
    }
  }, interval);
}

function toggleSound() {
  if (!audioReady) return;

  isMuted = !isMuted;
  refs.bgMusic.muted = isMuted;
  refs.soundToggle.classList.toggle('muted', isMuted);
  refs.soundState.textContent = isMuted ? 'Sound off' : 'Sound on';
  refs.soundToggle.setAttribute('aria-label', isMuted ? 'Включить звук' : 'Выключить звук');
}

function onAgree() {
  refs.confirmation.classList.add('show');
  refs.confirmation.setAttribute('aria-hidden', 'false');

  window.setTimeout(() => {
    window.location.href = buildTelegramLink();
  }, invitationConfig.redirects.delayAfterConfirmMs);
}

async function openInvitation() {
  refs.introOverlay.classList.add('hidden');
  refs.introOverlay.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('.reveal').forEach((section, index) => {
    window.setTimeout(() => section.classList.add('show'), 120 * index);
  });
  await playMusicWithFade();
}

function attachEvents() {
  refs.startButton.addEventListener('click', openInvitation, { once: true });
  refs.soundToggle.addEventListener('click', toggleSound);
  refs.agreeButton.addEventListener('click', onAgree);
}

applyTextContent();
applyMaskPhoto();
initRevealAnimations();
initSparkles();
initParallax();
attachEvents();
