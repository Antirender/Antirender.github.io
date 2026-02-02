/*************************************************************
 *  js/script.js
 *  针对所有页面的交互逻辑，包括：
 *   - 多语言切换
 *   - 作品筛选 (Portfolio)
 *   - 表单提交示例 (Contact)
 *   - 登录提交示例 (Web Disk)
 *  使用大量注释和分区块，便于后续维护
 *************************************************************/

/* ==========================
   1. 全局变量 & 多语言切换 
   ========================== */

/**
 * 当前使用的语言，默认中文（可改为 'en'）
 */
let currentLanguage = 'zh';

/**
 * 切换语言函数
 * @param {string} lang 'zh' 或 'en'
 */
function switchLanguage(lang) {
  currentLanguage = lang;

  // 为语言切换按钮增加/移除“active”样式，方便在CSS中做颜色区分
  document.getElementById('lang-zh').classList.toggle('active', lang === 'zh');
  document.getElementById('lang-en').classList.toggle('active', lang === 'en');

  // 找到页面上所有带有 data-lang-zh / data-lang-en 属性的元素
  const allElements = document.querySelectorAll('[data-lang-zh], [data-lang-en]');

  allElements.forEach((el) => {
    const textZh = el.getAttribute('data-lang-zh');
    const textEn = el.getAttribute('data-lang-en');

    // 根据所选语言，仅显示对应的文本
    if (lang === 'zh' && textZh) {
      el.textContent = textZh;
    } else if (lang === 'en' && textEn) {
      el.textContent = textEn;
    }
  });
}

/**
 * 在页面加载完后，初始化语言切换
 */
document.addEventListener('DOMContentLoaded', () => {
  // 默认执行一次，以保证进入页面就能同步到 currentLanguage
  switchLanguage(currentLanguage);
});

   /* ==========================
      2. 作品展示 (Portfolio) 交互逻辑
      ========================== */
   
   /**
    * initPortfolioFilter()
    * 功能：给作品筛选下拉菜单添加事件监听，实现简单的前端筛选逻辑
    */
   function initPortfolioFilter() {
     const filterSelect = document.querySelector('#portfolio-list .filter select');
     const portfolioItems = document.querySelectorAll('.portfolio-thumbnails .portfolio-item');
   
     if (!filterSelect || !portfolioItems.length) return;
   
     filterSelect.addEventListener('change', (e) => {
       const selectedCategory = e.target.value;
   
       portfolioItems.forEach((item) => {
         // 这里可以根据 item.dataset.category 等自定义属性来判断
         // 目前只是示例，因此当 selectedCategory 为 "全部 / All" 时，显示所有项目
         // 如果要做更细分类，比如 data-category="分类1", data-category="分类2" 等，
         // 可以对比 selectedCategory 和 item.dataset.category
         if (selectedCategory === '全部 / All') {
           item.style.display = 'inline-block';
         } else {
           // 以下仅作演示：如果项目名称包含 selectedCategory 就显示，否则隐藏
           // 真实项目中应使用更可靠的方式
           const projectName = item.textContent || '';
           if (projectName.indexOf(selectedCategory) !== -1) {
             item.style.display = 'inline-block';
           } else {
             item.style.display = 'none';
           }
         }
       });
     });
   }
   
   /* ==========================
      3. 联系我们 (Contact) 表单提交示例
      ========================== */
   
   /**
    * initContactForm()
    * 功能：监听 "联系我们" 页面表单提交事件，阻止默认提交并在控制台输出信息
    */
   function initContactForm() {
     const contactForm = document.querySelector('#contact-form form');
     if (contactForm) {
       contactForm.addEventListener('submit', (e) => {
         e.preventDefault();
         const name = document.querySelector('#contact-form #name').value;
         const email = document.querySelector('#contact-form #email').value;
         const message = document.querySelector('#contact-form #message').value;
   
         console.log(`提交表单: 姓名=${name}, 邮箱=${email}, 需求描述=${message}`);
   
         // 这里可以添加 AJAX 提交逻辑或跳转到成功页面
         alert('您的需求已经提交，我们会尽快与您联系！');
       });
     }
   }
   
   /* ==========================
      4. 网盘 & AI使用 后端 (Web Disk) 登录示例
      ========================== */
   
   /**
    * initLoginForm()
    * 功能：监听 "网盘 & AI使用 后端" 登录页面的登录按钮，阻止默认提交并输出用户输入
    */
   function initLoginForm() {
     const loginForm = document.querySelector('#login form');
     if (loginForm) {
       loginForm.addEventListener('submit', (e) => {
         e.preventDefault();
         const username = document.querySelector('#login #username').value;
         const password = document.querySelector('#login #password').value;
   
         console.log(`尝试登录: 用户名=${username}, 密码=${password}`);
   
         // 这里可以添加实际的登录验证逻辑
         alert('登录请求已发送，请检查控制台信息。');
       });
     }
   }
   
   /* ==========================
      5. 页面初始化
      ========================== */
   
   /**
    * initPage()
    * 功能：在 DOM 加载完毕后，初始化所有需要的功能
    */
   function initPage() {
     // 初始化语言（默认中文，可根据需求改成自动检测）
     switchLanguage(currentLanguage);
   
     // 初始化作品筛选
     initPortfolioFilter();
   
     // 初始化联系表单
     initContactForm();
   
     // 初始化网盘登录表单
     initLoginForm();
   }
   
   // DOM 加载完成后执行 initPage
   document.addEventListener('DOMContentLoaded', initPage);
   