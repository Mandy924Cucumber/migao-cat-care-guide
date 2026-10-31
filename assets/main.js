(() => {
  const root = document.documentElement;
  const themeToggle = document.querySelector('[data-theme-toggle]');
  const savedTheme = localStorage.getItem('warm-cat-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const setTheme = (theme) => {
    root.dataset.theme = theme;
    themeToggle.textContent = theme === 'dark' ? '日间' : '夜间';
    themeToggle.setAttribute('aria-label', theme === 'dark' ? '切换为日间模式' : '切换为夜间模式');
  };

  setTheme(savedTheme || (prefersDark ? 'dark' : 'light'));
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('warm-cat-theme', nextTheme);
  });

  const header = document.querySelector('[data-header]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const navLinks = document.querySelector('[data-nav-links]');
  navLinks.id = 'mobile-navigation';

  const closeMenu = () => {
    navLinks.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  };

  menuToggle.addEventListener('click', () => {
    const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
    menuToggle.setAttribute('aria-expanded', String(!isOpen));
    navLinks.classList.toggle('open', !isOpen);
    document.body.classList.toggle('menu-open', !isOpen);
  });

  navLinks.querySelectorAll('a').forEach((link) => link.addEventListener('click', closeMenu));
  window.addEventListener('resize', () => {
    if (window.innerWidth > 980) closeMenu();
  });

  const headerObserver = new IntersectionObserver(([entry]) => {
    header.classList.toggle('scrolled', !entry.isIntersecting);
  }, { rootMargin: '-80px 0px 0px 0px' });
  headerObserver.observe(document.querySelector('#top'));

  const sectionLinks = [...navLinks.querySelectorAll('a')];
  const sections = sectionLinks.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        if (active) link.setAttribute('aria-current', 'true');
        else link.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-35% 0px -55% 0px', threshold: 0 });
  sections.forEach((section) => sectionObserver.observe(section));

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.14 });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const mealData = {
    kitten: {
      title: '幼猫成长餐',
      desc: '成长速度快，需要能量密度更高、适合幼猫阶段的完整营养主食。',
      frequency: '少量多餐',
      frequencyNote: '按包装建议分成多次喂食',
      focus: '关注成长',
      focusNote: '定期记录体重与精神状态'
    },
    adult: {
      title: '成猫日常餐',
      desc: '选择适合活动量和体况的完整营养主食，避免零食挤占正餐。',
      frequency: '规律定量',
      frequencyNote: '把每日总量分成固定餐次',
      focus: '保持体态',
      focusNote: '能摸到肋骨，但不应明显突出'
    },
    senior: {
      title: '熟龄安心餐',
      desc: '食欲、咀嚼和代谢可能改变，主食调整最好结合健康检查结果。',
      frequency: '温和调整',
      frequencyNote: '换粮时逐步过渡并观察排便',
      focus: '记录变化',
      focusNote: '关注体重、饮水与排尿习惯'
    }
  };

  const mealFields = {
    title: document.querySelector('[data-meal-title]'),
    desc: document.querySelector('[data-meal-desc]'),
    frequency: document.querySelector('[data-meal-frequency]'),
    frequencyNote: document.querySelector('[data-meal-frequency-note]'),
    focus: document.querySelector('[data-meal-focus]'),
    focusNote: document.querySelector('[data-meal-focus-note]')
  };

  document.querySelectorAll('[data-age]').forEach((tab) => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('[data-age]').forEach((item) => item.setAttribute('aria-selected', String(item === tab)));
      const content = mealData[tab.dataset.age];
      Object.entries(mealFields).forEach(([key, element]) => {
        element.textContent = content[key];
      });
    });
  });

  const soundData = {
    meow: {
      title: '可能是在打招呼',
      copy: '短促、音量适中的叫声，常出现在迎接你或寻求关注时。',
      action: '先看它走向哪里，再决定是陪玩、添水还是留出空间。'
    },
    purr: {
      title: '可能很放松，也可能在安抚自己',
      copy: '呼噜常与舒适有关，但身体不适或紧张时也可能出现。',
      action: '结合食欲、姿势与活动判断。若同时出现异常，请咨询兽医。'
    },
    trill: {
      title: '可能在邀请你跟上',
      copy: '轻快颤音常用于友好问候，猫妈妈也会用类似声音招呼幼猫。',
      action: '轻声回应，并看看它是否在引导你去食盆、玩具或门边。'
    },
    hiss: {
      title: '它需要更大的安全距离',
      copy: '哈气和低吼通常是在警告，说明猫咪害怕、疼痛或不想被靠近。',
      action: '立即停下接触，留出退路，不要追赶或强行安抚。'
    }
  };

  const soundTitle = document.querySelector('[data-sound-title]');
  const soundCopy = document.querySelector('[data-sound-copy]');
  const soundAction = document.querySelector('[data-sound-action]');
  document.querySelectorAll('[data-sound]').forEach((button) => {
    button.addEventListener('click', () => {
      document.querySelectorAll('[data-sound]').forEach((item) => item.setAttribute('aria-pressed', String(item === button)));
      const content = soundData[button.dataset.sound];
      soundTitle.textContent = content.title;
      soundCopy.textContent = content.copy;
      soundAction.textContent = content.action;
    });
  });

  const checklist = [...document.querySelectorAll('[data-check]')];
  const savedChecks = JSON.parse(localStorage.getItem('warm-cat-checklist') || '{}');
  checklist.forEach((input) => {
    input.checked = Boolean(savedChecks[input.dataset.check]);
  });

  const updateProgress = () => {
    const complete = checklist.filter((input) => input.checked).length;
    const state = Object.fromEntries(checklist.map((input) => [input.dataset.check, input.checked]));
    document.querySelector('[data-progress-text]').textContent = `${complete} / ${checklist.length}`;
    document.querySelector('[data-progress-bar]').style.width = `${complete / checklist.length * 100}%`;
    document.querySelector('.progress-line').setAttribute('aria-valuenow', String(complete));
    localStorage.setItem('warm-cat-checklist', JSON.stringify(state));
  };

  checklist.forEach((input) => input.addEventListener('change', updateProgress));
  updateProgress();

  document.querySelectorAll('.fact-button').forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!expanded));
    });
  });
})();
