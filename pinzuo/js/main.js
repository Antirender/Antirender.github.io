// ===================== 移动端菜单功能 =====================
// 创建移动端菜单按钮
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
document.querySelector('.navbar').appendChild(menuToggle);

const navMenu = document.querySelector('.nav-menu');

// 点击菜单按钮展开或收起导航
menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

// 点击页面其他区域时关闭菜单
document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

// ===================== 响应式图片加载 =====================
// 根据屏幕宽度加载合适的图片
function loadResponsiveImages() {
    document.querySelectorAll('img[data-src]').forEach(img => {
        const src = window.innerWidth >= 768 ? img.dataset.srcDesktop : img.dataset.srcMobile;
        if (src) img.src = src;
    });
}

window.addEventListener('resize', loadResponsiveImages);
window.addEventListener('load', loadResponsiveImages);

// ===================== 语言切换功能 =====================
// 语言切换
function switchLanguage(lang) {
    if (!lang) return;
    localStorage.setItem('preferredLang', lang);  // 统一存储语言
    document.documentElement.lang = lang;

    // 更新所有 data-lang 元素的显示状态
    document.querySelectorAll('[data-lang]').forEach(el => {
        el.style.display = el.dataset.lang === lang ? 'block' : 'none';
    });

    // 更新语言切换按钮状态
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });
}

// 页面加载时初始化语言
document.addEventListener('DOMContentLoaded', () => {
    const savedLang = localStorage.getItem('preferredLang') || 'zh';
    switchLanguage(savedLang);

    // 监听语言按钮点击事件
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => switchLanguage(btn.dataset.lang));
    });

    // 监听 localStorage 变化（支持多页面同步语言切换）
    window.addEventListener('storage', (e) => {
        if (e.key === 'preferredLang') {
            switchLanguage(e.newValue);
        }
    });
});

// ===================== 滚动动画 =====================
// 监听元素进入视口，添加动画类
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .portfolio-item').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// ===================== 表单验证 =====================
// 表单提交时验证输入
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        const inputs = form.querySelectorAll('input, textarea');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.checkValidity()) {
                isValid = false;
                input.classList.add('invalid');
            }
        });

        if (!isValid) {
            e.preventDefault();
            inputs.forEach(input => {
                input.addEventListener('input', () => {
                    if (input.checkValidity()) {
                        input.classList.remove('invalid');
                    }
                });
            });
        }
    });
});

// ===================== 图片懒加载 =====================
// 监听图片进入视口后加载
const lazyImages = document.querySelectorAll('img[loading="lazy"]');
const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
            }
            observer.unobserve(img);
        }
    });
});

lazyImages.forEach(img => {
    img.dataset.src = img.src;
    img.removeAttribute('src');
    imgObserver.observe(img);
});

// ===================== 办公状态更新 =====================
// 根据当前时间显示营业状态
function updateOfficeStatus() {
    const hours = new Date().getHours();
    const isOpen = hours >= 9 && hours < 18;
    document.querySelectorAll('.office-status').forEach(el => {
        el.textContent = isOpen ? '营业中' : '已下班';
    });
}

// ===================== 语言切换系统（备用） =====================
// 该功能已优化到 `switchLanguage`，这里保持备用
function initLanguageSwitch() {
    const langElements = document.querySelectorAll('[data-lang]');
    let currentLang = localStorage.getItem('preferredLang') || 'zh';

    function updateDisplay() {
        langElements.forEach(el => {
            el.style.display = el.dataset.lang === currentLang ? 'block' : 'none';
        });
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        });
        document.documentElement.lang = currentLang;
    }

    function changeLanguage(lang) {
        if (lang === currentLang) return;
        currentLang = lang;
        localStorage.setItem('preferredLang', lang);
        updateDisplay();
    }

    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => changeLanguage(btn.dataset.lang));
    });

    updateDisplay();
    window.addEventListener('storage', (e) => {
        if (e.key === 'preferredLang') {
            currentLang = e.newValue;
            updateDisplay();
        }
    });
}

// 仅在 `DOMContentLoaded` 时调用一次备用的 `initLanguageSwitch`
document.addEventListener('DOMContentLoaded', initLanguageSwitch);
