/* =========================================
   品作设计 Pinzuo Design — Main JS
   ========================================= */

(function () {
  'use strict';

  // ── i18n + Theme (sessionStorage) ──
  var _lang = sessionStorage.getItem('pinzuo_lang') || 'zh';
  var _theme = sessionStorage.getItem('pinzuo_theme') || 'light';
  document.documentElement.setAttribute('data-theme', _theme);

  var TR = {
    zh: {
      'nav.about':'关于我们','nav.advantages':'核心优势','nav.services':'服务范围',
      'nav.process':'项目流程','nav.portfolio':'作品集','nav.contact':'联系我们','nav.webdisk':'网盘后端',
      'hero.title':'品作设计','hero.subtitle':'PINZUO DESIGN',
      'hero.tagline':'设计与研究并重 · 艺术品质的人文环境',
      'hero.desc':'跨界城市环境 / 景观 / 空间 / 公共艺术','hero.btn':'探索作品',
      'about.label':'ABOUT US','about.title':'关于我们',
      'about.lead':'品作设计（南京）有限公司是一个以设计与艺术专业高校教师领衔的艺术创意专业团队。我们专注于艺术设计及其跨界城市环境、景观、空间、公共艺术领域的设计实践和研究项目。',
      'about.p1':'\u201c品作\u201d即富有价值的作品，值得品味的佳作，代表了我们对待设计的态度。\u201c作品\u201d是神圣的词，用专业力量与设计热情打造一件\u201c作品\u201d，期望以艺术品质、独特理念融入环境设计、景观设计、空间设计。',
      'about.p2':'品作设计致力于创造艺术品质的人文环境，是一支秉承设计与研究并重，聚合着城市设计、景观设计、艺术设计等多元学科的集体智慧、多元文化、持续创新的设计团队。',
      'adv.label':'CORE STRENGTHS','adv.title':'核心优势',
      'adv.1.t':'学术引领','adv.1.d':'以高校教师领衔的专业团队，设计与研究并重，学术视野赋能设计实践',
      'adv.2.t':'跨界融合','adv.2.d':'聚合城市设计、景观设计、艺术设计等多元学科的集体智慧与持续创新',
      'adv.3.t':'艺术品质','adv.3.d':'以独特理念和艺术品质融入每一件作品，致力于创造人文环境',
      'adv.4.t':'全程服务','adv.4.d':'从概念策划、方案设计到施工图纸及现场管理，提供全方位专业服务',
      'svc.label':'SERVICES','svc.title':'服务范围',
      'svc.intro':'品作设计长期从事环境设计、景观规划与设计、空间设计、公共艺术设计。擅长城市更新设计、特色文化环境景观、艺术空间设计、城市家具设计、公共艺术装置等类型项目。',
      'svc.1.t':'景观设计','svc.1.en':'Landscape Design','svc.1.d':'校园景观、城市公园、文化景观、滨水空间、城市更新景观规划与设计',
      'svc.2.t':'空间设计','svc.2.en':'Space Design','svc.2.d':'文化空间、教育空间、展示空间、办公空间、商业空间室内设计',
      'svc.3.t':'雕塑与艺术装置','svc.3.en':'Sculpture & Art Installation','svc.3.d':'公共雕塑、艺术装置、校园文化雕塑、城市公共艺术创作',
      'svc.4.t':'标识系统','svc.4.en':'Signage & Wayfinding','svc.4.d':'导视系统、标识设计、品牌视觉识别、环境标识规划与设计',
      'svc.5.t':'城市家具','svc.5.en':'City Furniture','svc.5.d':'公共座椅、景观灯具、花箱、候车亭等城市公共设施设计',
      'proc.label':'WORKFLOW','proc.title':'项目流程',
      'proc.1.t':'概念策划','proc.1.d':'深入调研场地与需求，提炼设计概念与核心理念',
      'proc.2.t':'方案设计','proc.2.d':'多轮方案推演，融合艺术美学与功能需求',
      'proc.3.t':'深化设计','proc.3.d':'细化材料、工艺、结构，完善设计方案',
      'proc.4.t':'扩初与施工图','proc.4.d':'输出完整的扩初设计与施工图纸',
      'proc.5.t':'施工管理','proc.5.d':'现场施工指导与质量把控，确保设计落地',
      'port.label':'PORTFOLIO','port.title':'作品集',
      'f.all':'全部','f.landscape':'景观设计','f.space':'空间设计',
      'f.sculpture':'雕塑与艺术装置','f.signage':'标识系统','f.furniture':'城市家具',
      'ct.label':'CONTACT','ct.title':'联系我们',
      'ct.company':'品作设计（南京）有限公司','ct.company.en':'Pinzuo Design (Nanjing) Co., Ltd.',
      'ct.addr.l':'地址','ct.addr':'南京市鼓楼区',
      'ct.email.l':'邮箱','ct.follow':'关注我们',
      'ct.name.ph':'您的姓名','ct.email.ph':'电子邮箱','ct.subj.ph':'项目类型','ct.msg.ph':'项目描述或留言...',
      'ct.submit':'发送咨询','ct.sent':'已发送 ✓',
      'ft.copy':'\u00a9 2007 \u2013 2026 品作设计（南京）有限公司 Pinzuo Design (Nanjing) Co., Ltd.',
      'ft.tag':'致力于创造艺术品质的人文环境',
      'ft.about':'关于','ft.svc':'服务','ft.port':'作品','ft.ct':'联系','ft.wd':'网盘',
      'pj.back':'\u2190 返回作品集','pj.all':'全部作品',
      'wd.title':'网盘后端','wd.sub':'WEBDISK MANAGEMENT',
      'wd.login':'登录网盘','wd.user':'用户名','wd.user.ph':'请输入用户名',
      'wd.pass':'密码','wd.pass.ph':'请输入密码','wd.submit':'登录',
      'wd.loading':'登录中...','wd.dev':'网盘功能开发中',
      'wd.c1.t':'用户登录','wd.c1.en':'USER LOGIN','wd.c1.d':'通过安全身份验证登录系统，管理个人账户与权限，支持多用户协同管理。',
      'wd.c2.t':'文件管理','wd.c2.en':'FILE MANAGEMENT','wd.c2.d':'上传、下载、预览和组织设计文件。支持文件夹分类管理，快捷搜索定位，高效管理项目素材与资料。',
      'wd.c3.t':'远程控制','wd.c3.en':'REMOTE CONTROL','wd.c3.d':'远程访问和管理公司服务器，支持文件同步和远程操作，随时随地掌控项目进度。',
      'wd.c4.t':'权限管理','wd.c4.en':'ACCESS CONTROL','wd.c4.d':'精细化权限设置，按角色分配文件访问与编辑权限，保障项目数据安全与信息保密。',
      'wd.c5.t':'文件传输','wd.c5.en':'FILE TRANSFER','wd.c5.d':'高速文件传输通道，支持大文件上传与下载，断点续传，确保设计文件安全高效传递。',
      'wd.c6.t':'AI 与 API 接口','wd.c6.en':'AI & API INTERFACE','wd.c6.d':'集成智能工具与 API 接口，提供自动化辅助功能，提升设计工作效率与团队协作水平。',
      'ft2.tag':'设计与研究并重\n艺术品质的人文环境',
      'ft2.ct':'联系方式','ft2.phone':'电话：025-86220928','ft2.email':'邮箱：pinzuodesign@163.com',
      'ft2.addr':'地址：南京市鼓楼区北京西路 72 号 16 楼',
      'ft2.links':'链接','ft2.port':'作品集','ft2.wd':'网盘'
    },
    en: {
      'nav.about':'About','nav.advantages':'Strengths','nav.services':'Services',
      'nav.process':'Workflow','nav.portfolio':'Portfolio','nav.contact':'Contact','nav.webdisk':'Webdisk',
      'hero.title':'Pinzuo Design','hero.subtitle':'PINZUO DESIGN',
      'hero.tagline':'Design & Research \u00b7 Artistic Humanistic Environments',
      'hero.desc':'Urban Environment / Landscape / Space / Public Art','hero.btn':'Explore Works',
      'about.label':'ABOUT US','about.title':'About Us',
      'about.lead':'Pinzuo Design (Nanjing) Co., Ltd. is a professional creative team led by university professors in art and design. We focus on design practice and research across urban environments, landscapes, spaces, and public art.',
      'about.p1':'\u201cPinzuo\u201d means a work of value \u2014 a masterpiece worth savoring. It represents our attitude toward design. With professional expertise and passion, we create works that infuse artistic quality and unique concepts into environmental, landscape, and spatial design.',
      'about.p2':'Pinzuo Design is committed to creating humanistic environments of artistic quality. We value design and research equally, bringing together collective wisdom from urban design, landscape architecture, and art design with continuous innovation.',
      'adv.label':'CORE STRENGTHS','adv.title':'Core Strengths',
      'adv.1.t':'Academic Leadership','adv.1.d':'A professional team led by university faculty, integrating academic vision with design practice',
      'adv.2.t':'Cross-disciplinary','adv.2.d':'Collective wisdom from urban design, landscape architecture, and art design with continuous innovation',
      'adv.3.t':'Artistic Quality','adv.3.d':'Infusing unique concepts and artistic quality into every work, creating humanistic environments',
      'adv.4.t':'Full Service','adv.4.d':'Comprehensive services from concept planning to construction documents and site management',
      'svc.label':'SERVICES','svc.title':'Services',
      'svc.intro':'Pinzuo Design specializes in environmental design, landscape planning, spatial design, and public art. We excel in urban renewal, cultural landscapes, art spaces, city furniture, and public art installations.',
      'svc.1.t':'Landscape Design','svc.1.en':'Landscape Design','svc.1.d':'Campus landscapes, urban parks, cultural landscapes, waterfront spaces, and urban renewal',
      'svc.2.t':'Space Design','svc.2.en':'Space Design','svc.2.d':'Cultural, educational, exhibition, office, and commercial interior design',
      'svc.3.t':'Sculpture & Installation','svc.3.en':'Sculpture & Art Installation','svc.3.d':'Public sculptures, art installations, campus sculptures, and urban public art',
      'svc.4.t':'Signage & Wayfinding','svc.4.en':'Signage & Wayfinding','svc.4.d':'Wayfinding systems, signage design, brand identity, and environmental signage',
      'svc.5.t':'City Furniture','svc.5.en':'City Furniture','svc.5.d':'Public seating, landscape lighting, planters, bus shelters, and urban facilities',
      'proc.label':'WORKFLOW','proc.title':'Workflow',
      'proc.1.t':'Concept Planning','proc.1.d':'In-depth site research and needs analysis to refine design concepts',
      'proc.2.t':'Schematic Design','proc.2.d':'Multiple design iterations blending aesthetics with functional requirements',
      'proc.3.t':'Design Development','proc.3.d':'Refining materials, craftsmanship, and structure to perfect the design',
      'proc.4.t':'Construction Docs','proc.4.d':'Delivering complete design development and construction documents',
      'proc.5.t':'Site Management','proc.5.d':'On-site guidance and quality control ensuring design realization',
      'port.label':'PORTFOLIO','port.title':'Portfolio',
      'f.all':'All','f.landscape':'Landscape','f.space':'Space',
      'f.sculpture':'Sculpture','f.signage':'Signage','f.furniture':'Furniture',
      'ct.label':'CONTACT','ct.title':'Contact Us',
      'ct.company':'Pinzuo Design (Nanjing) Co., Ltd.','ct.company.en':'Pinzuo Design (Nanjing) Co., Ltd.',
      'ct.addr.l':'Address','ct.addr':'Gulou District, Nanjing',
      'ct.email.l':'Email','ct.follow':'Follow Us',
      'ct.name.ph':'Your Name','ct.email.ph':'Email Address','ct.subj.ph':'Project Type','ct.msg.ph':'Project description or message...',
      'ct.submit':'Send Inquiry','ct.sent':'Sent \u2713',
      'ft.copy':'\u00a9 2007 \u2013 2026 Pinzuo Design (Nanjing) Co., Ltd.',
      'ft.tag':'Creating humanistic environments of artistic quality',
      'ft.about':'About','ft.svc':'Services','ft.port':'Portfolio','ft.ct':'Contact','ft.wd':'Webdisk',
      'pj.back':'\u2190 Back to Portfolio','pj.all':'All Works',
      'wd.title':'Webdisk','wd.sub':'WEBDISK MANAGEMENT',
      'wd.login':'Login','wd.user':'Username','wd.user.ph':'Enter username',
      'wd.pass':'Password','wd.pass.ph':'Enter password','wd.submit':'Login',
      'wd.loading':'Logging in...','wd.dev':'Under development',
      'wd.c1.t':'User Login','wd.c1.en':'USER LOGIN','wd.c1.d':'Securely log in to manage accounts and permissions with multi-user collaboration.',
      'wd.c2.t':'File Management','wd.c2.en':'FILE MANAGEMENT','wd.c2.d':'Upload, download, preview, and organize design files with folder management and search.',
      'wd.c3.t':'Remote Control','wd.c3.en':'REMOTE CONTROL','wd.c3.d':'Remotely access and manage servers with file sync and remote operations.',
      'wd.c4.t':'Access Control','wd.c4.en':'ACCESS CONTROL','wd.c4.d':'Fine-grained role-based permissions to ensure data security and confidentiality.',
      'wd.c5.t':'File Transfer','wd.c5.en':'FILE TRANSFER','wd.c5.d':'High-speed file transfer with large file support and resumable uploads.',
      'wd.c6.t':'AI & API','wd.c6.en':'AI & API INTERFACE','wd.c6.d':'Integrated smart tools and APIs for automation and enhanced team collaboration.',
      'ft2.tag':'Design & Research\nArtistic Humanistic Environments',
      'ft2.ct':'Contact','ft2.phone':'Tel: 025-86220928','ft2.email':'Email: pinzuodesign@163.com',
      'ft2.addr':'Address: 72 Beijing West Rd, Floor 16, Gulou, Nanjing',
      'ft2.links':'Links','ft2.port':'Portfolio','ft2.wd':'Webdisk'
    }
  };

  var DESC_EN = {
    'xinzheng-airport':'Themed "Dragon Soaring over Central Plains," abstracting dragon forms from Henan\'s rich history as the centerpiece of the airport plaza.',
    'xuancheng-alligator-lake':'The 3.73 km\u00b2 Alligator Lake scenic area features twelve landscape zones including a theater area, exhibition hall, and waterfront leisure.',
    'youth-olympic-village':'Landscape for the 2014 Nanjing Youth Olympic Village themed "Share Youth, Build the Future," using cloud motifs as the primary element.',
    'procuratorate-academy':'Landscape design harmonizing with existing architecture, creating a dignified campus emphasizing cultural landscape aesthetics.',
    'balihe':'Balihe waterfront design emphasizing recreational connectivity, divided into three themes: Wetland Garden, Green Water Fun, and Fitness Rhythm.',
    'beijing-science-park':'Landscape renovation for Zhongguancun Dongsheng Science Park based on "Work Relief + Healthy Recreation + Innovation Activities."',
    'zijinshan-villa':'Landscape design elevating spatial ambiance via a poetic approach, integrating mountain and water motifs with traditional aesthetics.',
    'binjiang-law-trail':'Themed "Life and Law, Journey of Love," dividing the trail into four sections: Budding Youth, Prime of Spring, Life\'s Vigor, and Return to Simplicity.',
    'nanjing-communications':'Campus landscape emphasizing rational and technological characteristics combined with humanistic care and modern garden aesthetics.',
    'nju-middle-school-landscape':'Cultural landscape for NJU Affiliated Middle School emphasizing historical heritage, reflecting its century-old tradition and spirit.',
    'ninghai-middle-school':'Landscape for the century-old Ninghai Middle School, expressing its unique philosophy of "Education through Beauty."',
    'fangcaoyuan-primary':'Landscape themed "The Power of Grass," using natural forces to highlight educational philosophy.',
    'gulou-experimental':'Campus landscape integrating traditional Chinese culture with the school\'s existing architecture and public spaces.',
    'suzhou-north-america':'International campus landscape combining global perspective with local culture for an open, diverse environment.',
    'yuying-foreign-lang':'Campus landscape creating a culturally rich and functional environment based on the school\'s unique character.',
    'xingzhi-primary':'Campus landscape based on the "Garden School" concept, showcasing the school\'s culture of agricultural education.',
    'longjiang-primary-landscape':'Campus planning and landscape themed "Green, LOHAS, Ecology."',
    'binjiang-middle-landscape':'Ecological garden campus landscape creating green spaces for modern educational environments.',
    'binjiang-facade':'Teaching building facade renovation using contemporary design language for a fresh visual identity.',
    'baiziting-34':'Landscape combining the historic cultural district\'s character with modern design approaches.',
    'procuratorate-concept':'Advanced landscape concept building upon existing completed design with deeper conceptual refinement.',
    'huangshan-jiaocun':'Rural landscape integrating natural mountain scenery with Huizhou cultural heritage in the context of rural revitalization.',
    'industrial-design-park':'Exhibition design using industrial visual language with steel and spider fittings to create a modern, futuristic atmosphere.',
    'nua-model-studio':'Interior design for NUA model studio, organizing teaching, model-making, and discussion spaces in an open layout.',
    'nua-library':'Library interior featuring natural wood tones and deconstructed geometric spaces creating an artistic atmosphere.',
    'nua-media-studio':'Media studio interior emphasizing modern, futuristic style with flowing ceiling forms.',
    'zijin-award-exhibition':'Exhibition design for the inaugural Zijin Award in a 4,000 m\u00b2 venue, designed for reassembly and touring.',
    'nju-scholarly-campus':'"Scholarly Campus" reading corridor, enclosing columns with glass to create weather-protected spaces.',
    'nju-anti-drug':'Anti-drug education room featuring interactive projection floors with "Poppy Fruits" theme, illustrating drug harm.',
    'nju-memory-corridor':'"Memory Corridor" elevated space design, creating immersive school history exhibition based on century-old history.',
    'nju-party-building':'Party building cultural space integrating party history education with campus culture in a visually impactful space.',
    'nju-drug-prevention-2020':'Redesigned drug prevention education room and school history corridor using innovative exhibition approaches.',
    'jinling-theater':'Interior for Jinling Theater blending classical Chinese elements with neo-classical design and traditional opera culture.',
    'qinhuai-family':'Boutique hotel blending classical and modern, traditional and contemporary, with a "Qinhuai Elegance" lifestyle concept.',
    'gupinggang-primary':'Nursery rhyme hall design inheriting traditional culture while respecting children\'s nature.',
    'yuying-reading-corridor':'Reading corridor transforming campus public spaces into open reading and communication areas.',
    'gulou-teacher-center':'Interior emphasizing the "Teachers\' Home" concept with minimalist grey and white tones plus natural wood.',
    'gulou-experimental-space':'Interior renovation integrating traditional culture to create functional and culturally inspiring educational spaces.',
    'fangcaoyuan-stilted':'Space renovation transforming columns into tree sculptures, creating a forest-like imagery in the open ground floor.',
    'suhe-exhibition':'Modern, minimalist exhibition center with interconnected yet independently usable gallery spaces.',
    'procuratorate-hotel':'Hotel interior with an elegant, understated style creating comfortable spaces with cultural sophistication.',
    'binjiang-middle-interior':'Interior renovation guided by modern educational philosophy, optimizing teaching space layout.',
    'fangcaoyuan-library':'"Seed Sprouting" themed library breaking conventional layouts by maximizing wall space utilization.',
    'fangcaoyuan-history':'School history museum presenting development journey and educational achievements through a timeline.',
    'wtc-26b03':'Modern minimalist high-end business office space in Nanjing World Trade Center.',
    'xian-forest-belt-sculpture':'Sculpture and art installations for Xi\'an Happy Forest Belt, inspired by the city\'s rich historical culture.',
    'beijing-science-sculpture':'Landscape sculpture for Zhongguancun Dongsheng Science Park themed around technology and nature.',
    'nantong-sculpture':'Public sculpture for Nantong Historical District, reflecting the city\'s industrial heritage at Tangzha.',
    'yuying-sculpture':'Campus sculpture centered on educational culture, integrating art with the school environment.',
    'eye-of-justice':'"Guardian of Justice" sculpture composed of letters "JCG" and emblem, with thirteen stars representing Jiangsu\'s prosecutors.',
    'rockery-series':'Rockery sculpture series inspired by traditional formations, reinterpreted through modern slicing and reassembly.',
    'ninghai-sculpture':'Sculpture and art installations embodying the school\'s century-old cultural heritage.',
    'longjiang-primary-sculpture':'Campus sculpture aligned with the "Green, LOHAS, Ecology" philosophy, creating vibrant works.',
    'lishui-sculpture':'Urban sculpture planning for key landmark locations in Lishui District.',
    'fangcaoyuan-public-art':'Public art for Fangcaoyuan Primary School themed around childhood wonder and nature.',
    'xian-forest-belt-signage':'Signage system for Xi\'an Happy Forest Belt, integrating city culture into a comprehensive wayfinding system.',
    'hohhot-signage':'Greenway signage for Hohhot, blending northern grassland cultural heritage with modern design.',
    'guochuangyuan-signage':'Signage for Nanjing National Pioneer Park, establishing a professional wayfinding system in modern style.',
    'nantong-signage':'Signage for Nantong Tangzha Industrial Historical District, centered on industrial heritage elements.',
    'zhongguancun-signage':'Signage for Zhongguancun Dongsheng Science Park with clean, modern design language.',
    'nanjing-communications-signage':'Campus signage establishing a unified, clear wayfinding and identification system.',
    'gulou-training-signage':'Signage for Gulou Teacher Development Center in elegant minimalist style.',
    'suzhou-north-america-signage':'International-style complete campus wayfinding system design.',
    'nju-middle-school-signage':'Campus signage rooted in the century-old institution\'s cultural heritage.',
    'ninghai-signage':'Signage system for Ninghai Middle School, grounded in its century of history.',
    'jiangnan-industrial-park':'Signage for Jiangnan Modern Industrial Heritage Park, centered on industrial heritage elements.',
    'xian-forest-belt-furniture':'City furniture weaving a harmonious system between people and nature with ecological design.',
    'nanjing-series-furniture':'City furniture inspired by traditional Nanjing residential forms combined with Jiangnan garden elements.',
    'viewing-scenery':'Landscape seating formed by combining Chinese characters, allowing flexible configurations with varied effects.',
    'undulating-garden':'City furniture with undulating wave forms accommodating multiple users for resting.',
    'puzzle-table':'Furniture incorporating puzzle elements with parametric design, creating cleverly interlocking tables.',
    'heat-wave-red-chair':'Furniture with graceful curves and passionate form, demonstrating expressive furniture "posture."'
  };

  var CAT_EN = {
    landscape:'Landscape Design', space:'Space Design',
    sculpture:'Sculpture & Installation', signage:'Signage & Wayfinding', furniture:'City Furniture'
  };

  function getLang() { return _lang; }
  function setLang(l) { _lang = l; sessionStorage.setItem('pinzuo_lang', l); applyLang(); }
  function toggleLang() { setLang(_lang === 'zh' ? 'en' : 'zh'); }
  function getTheme() { return _theme; }
  function setThemePZ(th) {
    _theme = th; sessionStorage.setItem('pinzuo_theme', th);
    document.documentElement.setAttribute('data-theme', th);
    var b = document.getElementById('themeToggle');
    if (b) b.textContent = th === 'dark' ? '\u2600' : '\u263E';
  }
  function toggleTheme() { setThemePZ(_theme === 'dark' ? 'light' : 'dark'); }

  function applyLang() {
    var d = TR[_lang] || TR.zh;
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n'); if (d[k] != null) el.textContent = d[k];
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(function (el) {
      var k = el.getAttribute('data-i18n-ph'); if (d[k] != null) el.placeholder = d[k];
    });
    document.documentElement.lang = _lang === 'zh' ? 'zh-CN' : 'en';
    var lb = document.getElementById('langToggle');
    if (lb) lb.textContent = _lang === 'zh' ? 'EN' : '\u4e2d';
    if (window.__rerender) window.__rerender();
  }

  // Init theme toggle text
  function initControls() {
    var tb = document.getElementById('themeToggle');
    if (tb) tb.textContent = _theme === 'dark' ? '\u2600' : '\u263E';
    var lb = document.getElementById('langToggle');
    if (lb) lb.textContent = _lang === 'zh' ? 'EN' : '\u4e2d';
    if (tb) tb.addEventListener('click', toggleTheme);
    if (lb) lb.addEventListener('click', toggleLang);
  }

  // Expose for other pages
  window.__pinzuo = {
    getLang: getLang, setLang: setLang, toggleLang: toggleLang,
    getTheme: getTheme, setThemePZ: setThemePZ, toggleTheme: toggleTheme,
    applyLang: applyLang, TR: TR, DESC_EN: DESC_EN, CAT_EN: CAT_EN
  };

  // ── Category labels ──
  var catLabels = {
    landscape: '景观设计',
    space: '空间设计',
    sculpture: '雕塑与艺术装置',
    signage: '标识系统',
    furniture: '城市家具'
  };

  // ── Project Data (72 projects) ──
  var projects = [
    {
      cat: 'landscape', slug: 'xinzheng-airport',
      name: '新郑国际机场', year: 2008, en: 'Zhengzhou Xinzheng International Airport',
      desc: '本方案以「龙腾中原」为主题，从中原的历史文化地位与龙的故乡中提炼出简洁抽象的龙的形态，作为整个广场环境的中心。',
      cover: 'assets/img/xinzheng-airport/00.jpg',
      images: ['assets/img/xinzheng-airport/01.jpg','assets/img/xinzheng-airport/02.jpg','assets/img/xinzheng-airport/03.jpg','assets/img/xinzheng-airport/04.jpg','assets/img/xinzheng-airport/05.jpg','assets/img/xinzheng-airport/06.jpg','assets/img/xinzheng-airport/07.jpg']
    },
    {
      cat: 'landscape', slug: 'xuancheng-alligator-lake',
      name: '宣城鳄鱼湖', year: 2007, en: 'Alligator Lake, Xuancheng',
      desc: '宣城鳄鱼湖景区面积为3.73平方公里，规划为大剧院景观区、文化展览馆景观区、滨水休闲景观区等十二个景观区。',
      cover: 'assets/img/xuancheng-alligator-lake/00.jpg',
      images: ['assets/img/xuancheng-alligator-lake/01.jpg','assets/img/xuancheng-alligator-lake/02.jpg','assets/img/xuancheng-alligator-lake/03.jpg','assets/img/xuancheng-alligator-lake/04.jpg','assets/img/xuancheng-alligator-lake/05.jpg','assets/img/xuancheng-alligator-lake/06.jpg','assets/img/xuancheng-alligator-lake/07.jpg','assets/img/xuancheng-alligator-lake/08.jpg','assets/img/xuancheng-alligator-lake/09.jpg']
    },
    {
      cat: 'landscape', slug: 'youth-olympic-village',
      name: '青奥村', year: 2014, en: 'Youth Olympic Village',
      desc: '2014年南京青年奥林匹克运动会奥运村景观设计理念：「分享青春 共筑未来」。以天空中的云朵为主要创意元素，构成整体青奥村的户外景观意向。',
      cover: 'assets/img/youth-olympic-village/00.jpg',
      images: ['assets/img/youth-olympic-village/01.jpg','assets/img/youth-olympic-village/02.jpg','assets/img/youth-olympic-village/03.jpg','assets/img/youth-olympic-village/04.jpg','assets/img/youth-olympic-village/05.jpg','assets/img/youth-olympic-village/06.jpg','assets/img/youth-olympic-village/07.jpg','assets/img/youth-olympic-village/08.jpg','assets/img/youth-olympic-village/09.jpg']
    },
    {
      cat: 'landscape', slug: 'procuratorate-academy',
      name: '检察官学院', year: 2018, en: 'Procuratorate Academy',
      desc: '江苏省检察官学院景观设计整体风格与原有建筑风格协调，视觉上形成庄重之感，力图突出校园环境视觉上的「文化景观」的观感。',
      cover: 'assets/img/procuratorate-academy/00.jpg',
      images: ['assets/img/procuratorate-academy/01.jpg','assets/img/procuratorate-academy/02.jpg','assets/img/procuratorate-academy/03.jpg','assets/img/procuratorate-academy/04.jpg','assets/img/procuratorate-academy/05.jpg','assets/img/procuratorate-academy/06.jpg','assets/img/procuratorate-academy/07.jpg','assets/img/procuratorate-academy/08.jpg','assets/img/procuratorate-academy/09.jpg']
    },
    {
      cat: 'landscape', slug: 'balihe',
      name: '八里河', year: 2019, en: 'Balihe Landscape',
      desc: '南京八里河景观设计注重整体滨水带的游憩性，使游览观赏性和市民日常生活紧密结合。分为三段主题：湿地花园、绿水意趣、健美节拍。',
      cover: 'assets/img/balihe/00.jpg',
      images: ['assets/img/balihe/01.jpg','assets/img/balihe/02.jpg','assets/img/balihe/03.jpg','assets/img/balihe/04.jpg','assets/img/balihe/05.jpg','assets/img/balihe/06.jpg','assets/img/balihe/07.jpg','assets/img/balihe/08.jpg','assets/img/balihe/09.jpg']
    },
    {
      cat: 'landscape', slug: 'beijing-science-park',
      name: '北京科学园', year: 2020, en: 'Beijing Science Park',
      desc: '北京海淀区中关村东升科学园景观升级改造设计概念基于「办公减压+健康游憩+科创活动」的全新理念。',
      cover: 'assets/img/beijing-science-park/00.jpg',
      images: ['assets/img/beijing-science-park/01.jpg','assets/img/beijing-science-park/02.jpg','assets/img/beijing-science-park/03.jpg','assets/img/beijing-science-park/04.jpg','assets/img/beijing-science-park/05.jpg','assets/img/beijing-science-park/06.jpg','assets/img/beijing-science-park/07.jpg','assets/img/beijing-science-park/08.jpg','assets/img/beijing-science-park/09.jpg']
    },
    {
      cat: 'landscape', slug: 'zijinshan-villa',
      name: '紫金山庄', year: 2018, en: 'Zijinshan Villa',
      desc: '南京市紫金山庄景观绿化设计重在景观意境上的提升设计。寄情山水，将山水意趣融入现有的景观中。以诗入画，以画入景。',
      cover: 'assets/img/zijinshan-villa/00.jpg',
      images: ['assets/img/zijinshan-villa/01.jpg','assets/img/zijinshan-villa/02.jpg','assets/img/zijinshan-villa/03.jpg','assets/img/zijinshan-villa/04.jpg','assets/img/zijinshan-villa/05.jpg','assets/img/zijinshan-villa/06.jpg','assets/img/zijinshan-villa/07.jpg','assets/img/zijinshan-villa/08.jpg','assets/img/zijinshan-villa/09.jpg']
    },
    {
      cat: 'landscape', slug: 'binjiang-law-trail',
      name: '滨江法治步道', year: 2018, en: 'Binjiang Law-themed Trail',
      desc: '南京市鼓楼区「生命与法 爱的历程」滨江主题步道景观概念设计。将带状场地划分为四大板块：稚子萌芽、青春韶华、生命劲节、返璞归真。',
      cover: 'assets/img/binjiang-law-trail/00.jpg',
      images: ['assets/img/binjiang-law-trail/01.jpg','assets/img/binjiang-law-trail/02.jpg','assets/img/binjiang-law-trail/03.jpg','assets/img/binjiang-law-trail/04.jpg','assets/img/binjiang-law-trail/05.jpg','assets/img/binjiang-law-trail/06.jpg','assets/img/binjiang-law-trail/07.jpg']
    },
    {
      cat: 'landscape', slug: 'nanjing-communications',
      name: '交通学院', year: 2010, en: 'Nanjing Communications Institute',
      desc: '南京交通职业技术学院景观规划与设计，突出理性与技术的特征，结合人文关怀、园林造景、风格现代、体现特色。',
      cover: 'assets/img/nanjing-communications/00.jpg',
      images: ['assets/img/nanjing-communications/01.jpg','assets/img/nanjing-communications/02.jpg','assets/img/nanjing-communications/03.jpg','assets/img/nanjing-communications/04.jpg','assets/img/nanjing-communications/05.jpg','assets/img/nanjing-communications/06.jpg','assets/img/nanjing-communications/07.jpg','assets/img/nanjing-communications/08.jpg','assets/img/nanjing-communications/09.jpg']
    },
    {
      cat: 'landscape', slug: 'nju-middle-school-landscape',
      name: '南大附中', year: 2012, en: 'NJU Affiliated Middle School',
      desc: '南京大学附属中学校园文化景观建造中特别强调历史人文环境。赋予南大附中的校园环境以生命的活力，体现百年历史传统、精神面貌、文化底蕴。',
      cover: 'assets/img/nju-middle-school-landscape/00.jpg',
      images: ['assets/img/nju-middle-school-landscape/01.jpg','assets/img/nju-middle-school-landscape/02.jpg','assets/img/nju-middle-school-landscape/03.jpg','assets/img/nju-middle-school-landscape/04.jpg','assets/img/nju-middle-school-landscape/05.jpg','assets/img/nju-middle-school-landscape/06.jpg','assets/img/nju-middle-school-landscape/07.jpg','assets/img/nju-middle-school-landscape/08.jpg','assets/img/nju-middle-school-landscape/09.jpg']
    },
    {
      cat: 'landscape', slug: 'ninghai-middle-school',
      name: '宁海中学', year: 2015, en: 'Ninghai Middle School',
      desc: '百年历史的宁海中学，学校将「美的教育」作为办学追求，景观设计注重呈现对独特办学理念的校园形象的表达。',
      cover: 'assets/img/ninghai-middle-school/00.jpg',
      images: ['assets/img/ninghai-middle-school/01.jpg','assets/img/ninghai-middle-school/02.jpg','assets/img/ninghai-middle-school/03.jpg','assets/img/ninghai-middle-school/04.jpg','assets/img/ninghai-middle-school/05.jpg','assets/img/ninghai-middle-school/06.jpg','assets/img/ninghai-middle-school/07.jpg','assets/img/ninghai-middle-school/08.jpg','assets/img/ninghai-middle-school/09.jpg']
    },
    {
      cat: 'landscape', slug: 'fangcaoyuan-primary',
      name: '芳草园小学', year: 2016, en: 'Fangcaoyuan Primary School',
      desc: '南京市芳草园小学景观设计理念定位于「小草的力量」，以各种自然力量的展望，突出教育的理念。',
      cover: 'assets/img/fangcaoyuan-primary/00.jpg',
      images: ['assets/img/fangcaoyuan-primary/01.jpg','assets/img/fangcaoyuan-primary/02.jpg','assets/img/fangcaoyuan-primary/03.jpg','assets/img/fangcaoyuan-primary/04.jpg','assets/img/fangcaoyuan-primary/05.jpg','assets/img/fangcaoyuan-primary/06.jpg','assets/img/fangcaoyuan-primary/07.jpg','assets/img/fangcaoyuan-primary/08.jpg','assets/img/fangcaoyuan-primary/09.jpg']
    },
    {
      cat: 'landscape', slug: 'gulou-experimental',
      name: '鼓楼实验中学', year: 2019, en: 'Gulou Experimental Middle School',
      desc: '南京市鼓楼实验中学景观设计整合现有的文化景观与校园的建筑、地面、公共空间。将中国传统文化融入校园空间。',
      cover: 'assets/img/gulou-experimental/00.jpg',
      images: ['assets/img/gulou-experimental/01.jpg','assets/img/gulou-experimental/02.jpg','assets/img/gulou-experimental/03.jpg','assets/img/gulou-experimental/04.jpg','assets/img/gulou-experimental/05.jpg','assets/img/gulou-experimental/06.jpg','assets/img/gulou-experimental/07.jpg','assets/img/gulou-experimental/08.jpg','assets/img/gulou-experimental/09.jpg']
    },
    {
      cat: 'landscape', slug: 'suzhou-north-america',
      name: '苏州北美', year: 2018, en: 'Suzhou North American International HS',
      desc: '苏州北美国际高中景观设计项目，以国际化视野与在地文化融合，营造开放、多元的校园景观空间。',
      cover: 'assets/img/suzhou-north-america/00.jpg',
      images: ['assets/img/suzhou-north-america/01.jpg','assets/img/suzhou-north-america/02.jpg','assets/img/suzhou-north-america/03.jpg','assets/img/suzhou-north-america/04.jpg','assets/img/suzhou-north-america/05.jpg']
    },
    {
      cat: 'landscape', slug: 'yuying-foreign-lang',
      name: '育英外国语中学', year: 2016, en: 'Yuying Foreign Language School',
      desc: '南京育英外国语学校景观设计，依据校园特色打造具有文化内涵与功能性的景观环境空间。',
      cover: 'assets/img/yuying-foreign-lang/00.jpg',
      images: ['assets/img/yuying-foreign-lang/01.jpg','assets/img/yuying-foreign-lang/02.jpg','assets/img/yuying-foreign-lang/03.jpg']
    },
    {
      cat: 'landscape', slug: 'xingzhi-primary',
      name: '行知小学', year: 2013, en: 'Xingzhi Primary School',
      desc: '南京市浦口区行知小学景观设计依托「田园校园」的定位，展现校园农业生产的独特校园文化。',
      cover: 'assets/img/xingzhi-primary/00.jpg',
      images: ['assets/img/xingzhi-primary/01.jpg','assets/img/xingzhi-primary/02.jpg','assets/img/xingzhi-primary/03.jpg','assets/img/xingzhi-primary/04.jpg','assets/img/xingzhi-primary/05.jpg','assets/img/xingzhi-primary/06.jpg']
    },
    {
      cat: 'landscape', slug: 'longjiang-primary-landscape',
      name: '龙江小学', year: 2011, en: 'Longjiang Primary School',
      desc: '龙江小学校园规划与景观设计理念：「绿色·乐活·生态」校园。',
      cover: 'assets/img/longjiang-primary-landscape/00.jpg',
      images: ['assets/img/longjiang-primary-landscape/01.jpg','assets/img/longjiang-primary-landscape/02.jpg','assets/img/longjiang-primary-landscape/03.jpg','assets/img/longjiang-primary-landscape/04.jpg','assets/img/longjiang-primary-landscape/05.jpg','assets/img/longjiang-primary-landscape/06.jpg','assets/img/longjiang-primary-landscape/07.jpg','assets/img/longjiang-primary-landscape/08.jpg','assets/img/longjiang-primary-landscape/09.jpg']
    },
    {
      cat: 'landscape', slug: 'binjiang-middle-landscape',
      name: '滨江中学景观设计', year: 2020, en: 'Binjiang Middle School Landscape',
      desc: '滨江中学景观设计以生态和田园校园为定位，营造现代教育理念的校园绿色空间。',
      cover: 'assets/img/binjiang-middle-landscape/00.jpg',
      images: ['assets/img/binjiang-middle-landscape/01.jpg','assets/img/binjiang-middle-landscape/02.jpg','assets/img/binjiang-middle-landscape/03.jpg','assets/img/binjiang-middle-landscape/04.jpg','assets/img/binjiang-middle-landscape/05.jpg','assets/img/binjiang-middle-landscape/06.jpg','assets/img/binjiang-middle-landscape/07.jpg','assets/img/binjiang-middle-landscape/08.jpg','assets/img/binjiang-middle-landscape/09.jpg']
    },
    {
      cat: 'landscape', slug: 'binjiang-facade',
      name: '滨江中学立面改造', year: 2020, en: 'Binjiang Middle School Facade Renovation',
      desc: '南京市滨江中学教学楼外立面改造设计，以现代化的设计语言赋予校园建筑崭新的视觉形象。',
      cover: 'assets/img/binjiang-facade/00.jpg',
      images: ['assets/img/binjiang-facade/01.jpg','assets/img/binjiang-facade/02.jpg','assets/img/binjiang-facade/03.jpg','assets/img/binjiang-facade/04.jpg']
    },
    {
      cat: 'landscape', slug: 'baiziting-34',
      name: '百子亭34号', year: 2020, en: 'Baiziting No.34',
      desc: '百子亭34号景观设计项目，结合历史文化街区的独特风貌，以现代手法演绎传统空间。',
      cover: 'assets/img/baiziting-34/00.jpg',
      images: ['assets/img/baiziting-34/01.jpg','assets/img/baiziting-34/02.jpg','assets/img/baiziting-34/03.jpg','assets/img/baiziting-34/04.jpg','assets/img/baiziting-34/05.jpg','assets/img/baiziting-34/06.jpg','assets/img/baiziting-34/07.jpg']
    },
    {
      cat: 'landscape', slug: 'procuratorate-concept',
      name: '检察官学院景观概念设计', year: 2020, en: 'Procuratorate Academy Concept Design',
      desc: '江苏省检察官学院景观概念设计方案，在已建成景观基础上提出更深层次的景观升级与概念深化。',
      cover: 'assets/img/procuratorate-concept/00.jpg',
      images: ['assets/img/procuratorate-concept/01.jpg','assets/img/procuratorate-concept/02.jpg','assets/img/procuratorate-concept/03.jpg','assets/img/procuratorate-concept/04.jpg']
    },
    {
      cat: 'landscape', slug: 'huangshan-jiaocun',
      name: '黄山焦村', year: 2019, en: 'Huangshan Jiaocun',
      desc: '黄山焦村景观设计项目，以乡村振兴为背景，打造融合自然山水与徽派文化的乡村景观空间。',
      cover: 'assets/img/huangshan-jiaocun/00.jpg',
      images: ['assets/img/huangshan-jiaocun/01.jpg','assets/img/huangshan-jiaocun/02.jpg','assets/img/huangshan-jiaocun/03.jpg','assets/img/huangshan-jiaocun/04.jpg','assets/img/huangshan-jiaocun/05.jpg','assets/img/huangshan-jiaocun/06.jpg','assets/img/huangshan-jiaocun/07.jpg','assets/img/huangshan-jiaocun/08.jpg','assets/img/huangshan-jiaocun/09.jpg']
    },
    {
      cat: 'space', slug: 'industrial-design-park',
      name: '工业设计园', year: 2006, en: 'Jiangsu Industrial Design Park',
      desc: '江苏省工业设计园展示设计以工业的视觉语言强调展示设计的符号感。展架利用圆钢+驳接爪的构造方式，营造现代与未来的工业风格。',
      cover: 'assets/img/industrial-design-park/00.jpg',
      images: ['assets/img/industrial-design-park/01.jpg','assets/img/industrial-design-park/02.jpg','assets/img/industrial-design-park/03.jpg','assets/img/industrial-design-park/04.jpg','assets/img/industrial-design-park/05.jpg','assets/img/industrial-design-park/06.jpg','assets/img/industrial-design-park/07.jpg','assets/img/industrial-design-park/08.jpg','assets/img/industrial-design-park/09.jpg']
    },
    {
      cat: 'space', slug: 'nua-model-studio',
      name: '南艺模型工作室', year: 2009, en: 'NUA Model Studio',
      desc: '南京艺术学院设计学院模型工作室室内设计，以开敞式方式组织教学空间、模型制作空间、讨论空间。',
      cover: 'assets/img/nua-model-studio/00.jpg',
      images: ['assets/img/nua-model-studio/01.jpg','assets/img/nua-model-studio/02.jpg','assets/img/nua-model-studio/03.jpg','assets/img/nua-model-studio/04.jpg','assets/img/nua-model-studio/05.jpg','assets/img/nua-model-studio/06.jpg','assets/img/nua-model-studio/07.jpg','assets/img/nua-model-studio/08.jpg']
    },
    {
      cat: 'space', slug: 'nua-library',
      name: '南艺图书馆', year: 2010, en: 'NUA Library',
      desc: '南京艺术学院图书馆室内设计。主色调为原木色，解构的几何空间营造出浓厚而个性的设计感气氛。',
      cover: 'assets/img/nua-library/00.jpg',
      images: ['assets/img/nua-library/01.jpg','assets/img/nua-library/02.jpg','assets/img/nua-library/03.jpg','assets/img/nua-library/04.jpg','assets/img/nua-library/05.jpg','assets/img/nua-library/06.jpg','assets/img/nua-library/07.jpg']
    },
    {
      cat: 'space', slug: 'nua-media-studio',
      name: '南艺媒体工作室', year: 2011, en: 'NUA Media Studio',
      desc: '南京艺术学院设计学院媒体工作室室内设计，强调现代、未来的风格。吊顶以流动的造型形成未来风。',
      cover: 'assets/img/nua-media-studio/00.jpg',
      images: ['assets/img/nua-media-studio/01.jpg','assets/img/nua-media-studio/02.jpg','assets/img/nua-media-studio/03.jpg','assets/img/nua-media-studio/04.jpg','assets/img/nua-media-studio/05.jpg','assets/img/nua-media-studio/06.jpg','assets/img/nua-media-studio/07.jpg','assets/img/nua-media-studio/08.jpg','assets/img/nua-media-studio/09.jpg']
    },
    {
      cat: 'space', slug: 'zijin-award-exhibition',
      name: '首届紫金奖展示设计', year: 2014, en: 'Zijin Award Exhibition',
      desc: '首届紫金奖江苏省文化创意大赛展示设计，在4000平方的展区中，满足二次搭建、运输、赴港澳台办展的需求。',
      cover: 'assets/img/zijin-award-exhibition/00.jpg',
      images: ['assets/img/zijin-award-exhibition/01.jpg','assets/img/zijin-award-exhibition/02.jpg','assets/img/zijin-award-exhibition/03.jpg','assets/img/zijin-award-exhibition/04.jpg','assets/img/zijin-award-exhibition/05.jpg','assets/img/zijin-award-exhibition/06.jpg','assets/img/zijin-award-exhibition/07.jpg','assets/img/zijin-award-exhibition/08.jpg','assets/img/zijin-award-exhibition/09.jpg']
    },
    {
      cat: 'space', slug: 'nju-scholarly-campus',
      name: '南大附中·书香校园', year: 2012, en: 'NJU Middle School Scholarly Campus',
      desc: '南京大学附属中学「书香校园」读书廊设计，以玻璃封闭了几处柱体连线，形成遮蔽风雨的空间。',
      cover: 'assets/img/nju-scholarly-campus/00.jpg',
      images: ['assets/img/nju-scholarly-campus/01.jpg','assets/img/nju-scholarly-campus/02.jpg','assets/img/nju-scholarly-campus/03.jpg','assets/img/nju-scholarly-campus/04.jpg','assets/img/nju-scholarly-campus/05.jpg','assets/img/nju-scholarly-campus/06.jpg','assets/img/nju-scholarly-campus/07.jpg']
    },
    {
      cat: 'space', slug: 'nju-anti-drug',
      name: '南大附中·禁毒教育室', year: 2012, en: 'NJU Middle School Anti-Drug Education',
      desc: '南京大学附属中学禁毒教育室，以互动投影地面呈现「罂粟的果实」。空间设计分为多个板块，鲜明生动地解说毒品的侵害。',
      cover: 'assets/img/nju-anti-drug/00.jpg',
      images: ['assets/img/nju-anti-drug/01.jpg','assets/img/nju-anti-drug/02.jpg','assets/img/nju-anti-drug/03.jpg','assets/img/nju-anti-drug/04.jpg','assets/img/nju-anti-drug/05.jpg','assets/img/nju-anti-drug/06.jpg','assets/img/nju-anti-drug/07.jpg','assets/img/nju-anti-drug/08.jpg','assets/img/nju-anti-drug/09.jpg']
    },
    {
      cat: 'space', slug: 'nju-memory-corridor',
      name: '南大附中·岁月留声', year: 2012, en: 'NJU Middle School Memory Corridor',
      desc: '南京大学附属中学「岁月留声」架空层空间设计，以学校百年历史为线索，打造沉浸式校史展示与纪念空间。',
      cover: 'assets/img/nju-memory-corridor/00.jpg',
      images: ['assets/img/nju-memory-corridor/01.jpg','assets/img/nju-memory-corridor/02.jpg','assets/img/nju-memory-corridor/03.jpg']
    },
    {
      cat: 'space', slug: 'nju-party-building',
      name: '南大附中·党建', year: 2018, en: 'NJU Middle School Party Building',
      desc: '南京大学附属中学党建文化空间设计，将党史教育与校园文化相融合，打造富有教育意义和视觉感染力的文化展示空间。',
      cover: 'assets/img/nju-party-building/00.jpg',
      images: ['assets/img/nju-party-building/01.jpg','assets/img/nju-party-building/02.jpg','assets/img/nju-party-building/03.jpg','assets/img/nju-party-building/04.jpg','assets/img/nju-party-building/05.jpg','assets/img/nju-party-building/06.jpg','assets/img/nju-party-building/07.jpg','assets/img/nju-party-building/08.jpg','assets/img/nju-party-building/09.jpg']
    },
    {
      cat: 'space', slug: 'nju-drug-prevention-2020',
      name: '南大附中·毒品预防教育室', year: 2020, en: 'NJU Middle School Drug Prevention 2020',
      desc: '南京大学附属中学毒品预防教育室及校史长廊改造设计，以全新的展陈方式呈现禁毒知识教育与校园历史文化。',
      cover: 'assets/img/nju-drug-prevention-2020/00.jpg',
      images: ['assets/img/nju-drug-prevention-2020/01.jpg','assets/img/nju-drug-prevention-2020/02.jpg','assets/img/nju-drug-prevention-2020/03.jpg','assets/img/nju-drug-prevention-2020/04.jpg','assets/img/nju-drug-prevention-2020/05.jpg','assets/img/nju-drug-prevention-2020/06.jpg','assets/img/nju-drug-prevention-2020/07.jpg','assets/img/nju-drug-prevention-2020/08.jpg','assets/img/nju-drug-prevention-2020/09.jpg']
    },
    {
      cat: 'space', slug: 'jinling-theater',
      name: '金陵戏坊', year: 2014, en: 'Jinling Theater',
      desc: '老门东「金陵戏坊」室内设计，突出古典中式元素，以新颖的手法打造新古典设计风格。将戏曲文化中的形式、色彩、图案提炼成各个设计元素。',
      cover: 'assets/img/jinling-theater/00.jpg',
      images: ['assets/img/jinling-theater/01.jpg','assets/img/jinling-theater/02.jpg','assets/img/jinling-theater/03.jpg','assets/img/jinling-theater/04.jpg','assets/img/jinling-theater/05.jpg','assets/img/jinling-theater/06.jpg','assets/img/jinling-theater/07.jpg','assets/img/jinling-theater/08.jpg','assets/img/jinling-theater/09.jpg']
    },
    {
      cat: 'space', slug: 'qinhuai-family',
      name: '秦淮人家', year: 2015, en: 'Qinhuai Family Hotel',
      desc: '夫子庙「秦淮人家」主题精品酒店集古典与时尚、传统与现代、婉约与华贵为一体。倡导「秦淮风韵，悠闲风雅」的现代生活理念。',
      cover: 'assets/img/qinhuai-family/00.jpg',
      images: ['assets/img/qinhuai-family/01.jpg','assets/img/qinhuai-family/02.jpg','assets/img/qinhuai-family/03.jpg','assets/img/qinhuai-family/04.jpg','assets/img/qinhuai-family/05.jpg','assets/img/qinhuai-family/06.jpg','assets/img/qinhuai-family/07.jpg','assets/img/qinhuai-family/08.jpg','assets/img/qinhuai-family/09.jpg']
    },
    {
      cat: 'space', slug: 'gupinggang-primary',
      name: '古平岗小学', year: 2016, en: 'Gupinggang Primary School',
      desc: '南京市古平岗小学童谣馆设计。建设「悦动童谣」特色文化既是对传统文化的传承，也是尊重儿童天性的需求。',
      cover: 'assets/img/gupinggang-primary/00.jpg',
      images: ['assets/img/gupinggang-primary/01.jpg','assets/img/gupinggang-primary/02.jpg','assets/img/gupinggang-primary/03.jpg','assets/img/gupinggang-primary/04.jpg','assets/img/gupinggang-primary/05.jpg','assets/img/gupinggang-primary/06.jpg','assets/img/gupinggang-primary/07.jpg','assets/img/gupinggang-primary/08.jpg','assets/img/gupinggang-primary/09.jpg']
    },
    {
      cat: 'space', slug: 'yuying-reading-corridor',
      name: '育英外国语阅读廊', year: 2016, en: 'Yuying Foreign Language Reading Corridor',
      desc: '南京育英外国语学校阅读廊设计，将校园公共空间转化为开放式的阅读与交流场所，营造书香氛围。',
      cover: 'assets/img/yuying-reading-corridor/00.jpg',
      images: ['assets/img/yuying-reading-corridor/01.jpg','assets/img/yuying-reading-corridor/02.jpg','assets/img/yuying-reading-corridor/03.jpg','assets/img/yuying-reading-corridor/04.jpg','assets/img/yuying-reading-corridor/05.jpg','assets/img/yuying-reading-corridor/06.jpg','assets/img/yuying-reading-corridor/07.jpg','assets/img/yuying-reading-corridor/08.jpg','assets/img/yuying-reading-corridor/09.jpg']
    },
    {
      cat: 'space', slug: 'gulou-teacher-center',
      name: '鼓楼区教师发展中心', year: 2018, en: 'Gulou Teacher Development Center',
      desc: '鼓楼区教师发展中心室内空间设计突出「教师之家」的概念。色彩设计上采用极简风格，以灰色、白色为主色调，搭配木质色调。',
      cover: 'assets/img/gulou-teacher-center/00.jpg',
      images: ['assets/img/gulou-teacher-center/01.jpg','assets/img/gulou-teacher-center/02.jpg','assets/img/gulou-teacher-center/03.jpg','assets/img/gulou-teacher-center/04.jpg','assets/img/gulou-teacher-center/05.jpg','assets/img/gulou-teacher-center/06.jpg','assets/img/gulou-teacher-center/07.jpg','assets/img/gulou-teacher-center/08.jpg','assets/img/gulou-teacher-center/09.jpg']
    },
    {
      cat: 'space', slug: 'gulou-experimental-space',
      name: '鼓楼实验中学空间改造', year: 2019, en: 'Gulou Experimental MS Interior',
      desc: '南京市鼓楼实验中学空间改造设计，以传统文化为核心，将校园室内空间打造为兼具功能性与文化感染力的教育场所。',
      cover: 'assets/img/gulou-experimental-space/00.jpg',
      images: ['assets/img/gulou-experimental-space/01.jpg','assets/img/gulou-experimental-space/02.jpg','assets/img/gulou-experimental-space/03.jpg','assets/img/gulou-experimental-space/04.jpg','assets/img/gulou-experimental-space/05.jpg','assets/img/gulou-experimental-space/06.jpg','assets/img/gulou-experimental-space/07.jpg','assets/img/gulou-experimental-space/08.jpg','assets/img/gulou-experimental-space/09.jpg']
    },
    {
      cat: 'space', slug: 'fangcaoyuan-stilted',
      name: '芳草园架空层', year: 2019, en: 'Fangcaoyuan Stilted Space',
      desc: '芳草园小学空间改造设计将原有柱体与座椅拆除，使空间开敞最大化。8根柱体改造为大树造型，形成一片森林的意象。',
      cover: 'assets/img/fangcaoyuan-stilted/00.jpg',
      images: ['assets/img/fangcaoyuan-stilted/01.jpg','assets/img/fangcaoyuan-stilted/02.jpg','assets/img/fangcaoyuan-stilted/03.jpg','assets/img/fangcaoyuan-stilted/04.jpg','assets/img/fangcaoyuan-stilted/05.jpg','assets/img/fangcaoyuan-stilted/06.jpg','assets/img/fangcaoyuan-stilted/07.jpg','assets/img/fangcaoyuan-stilted/08.jpg','assets/img/fangcaoyuan-stilted/09.jpg']
    },
    {
      cat: 'space', slug: 'suhe-exhibition',
      name: '苏合展厅', year: 2019, en: 'Suhe Exhibition Hall',
      desc: '苏合集团企业文化展示中心展示设计方案以现代、简约为主要风格。展厅内互通，又可独立使用。',
      cover: 'assets/img/suhe-exhibition/00.jpg',
      images: ['assets/img/suhe-exhibition/01.jpg','assets/img/suhe-exhibition/02.jpg','assets/img/suhe-exhibition/03.jpg','assets/img/suhe-exhibition/04.jpg','assets/img/suhe-exhibition/05.jpg','assets/img/suhe-exhibition/06.jpg','assets/img/suhe-exhibition/07.jpg','assets/img/suhe-exhibition/08.jpg','assets/img/suhe-exhibition/09.jpg']
    },
    {
      cat: 'space', slug: 'procuratorate-hotel',
      name: '检察官学院清风园宾馆', year: 2019, en: 'Procuratorate Academy Hotel',
      desc: '江苏省检察官学院清风园宾馆室内设计，以简约、庄重的风格打造兼具舒适与文化品位的接待空间。',
      cover: 'assets/img/procuratorate-hotel/00.jpg',
      images: ['assets/img/procuratorate-hotel/01.jpg','assets/img/procuratorate-hotel/02.jpg','assets/img/procuratorate-hotel/03.jpg','assets/img/procuratorate-hotel/04.jpg','assets/img/procuratorate-hotel/05.jpg','assets/img/procuratorate-hotel/06.jpg','assets/img/procuratorate-hotel/07.jpg','assets/img/procuratorate-hotel/08.jpg','assets/img/procuratorate-hotel/09.jpg']
    },
    {
      cat: 'space', slug: 'binjiang-middle-interior',
      name: '滨江中学空间改造', year: 2020, en: 'Binjiang Middle School Interior',
      desc: '南京市滨江中学空间改造设计，以现代教育理念为指导，优化教学空间功能布局。',
      cover: 'assets/img/binjiang-middle-interior/00.jpg',
      images: ['assets/img/binjiang-middle-interior/01.jpg','assets/img/binjiang-middle-interior/02.jpg','assets/img/binjiang-middle-interior/03.jpg','assets/img/binjiang-middle-interior/04.jpg','assets/img/binjiang-middle-interior/05.jpg','assets/img/binjiang-middle-interior/06.jpg','assets/img/binjiang-middle-interior/07.jpg','assets/img/binjiang-middle-interior/08.jpg','assets/img/binjiang-middle-interior/09.jpg']
    },
    {
      cat: 'space', slug: 'fangcaoyuan-library',
      name: '芳草园图书馆', year: 2020, en: 'Fangcaoyuan Library',
      desc: '芳草园小学图书馆「种子萌芽」——能豆豆图书馆。打破原有图书馆格局，将墙面空间利用起来。',
      cover: 'assets/img/fangcaoyuan-library/00.jpg',
      images: ['assets/img/fangcaoyuan-library/01.jpg','assets/img/fangcaoyuan-library/02.jpg','assets/img/fangcaoyuan-library/03.jpg','assets/img/fangcaoyuan-library/04.jpg','assets/img/fangcaoyuan-library/05.jpg','assets/img/fangcaoyuan-library/06.jpg','assets/img/fangcaoyuan-library/07.jpg','assets/img/fangcaoyuan-library/08.jpg','assets/img/fangcaoyuan-library/09.jpg']
    },
    {
      cat: 'space', slug: 'fangcaoyuan-history',
      name: '芳草园校史馆', year: 2020, en: 'Fangcaoyuan School History Museum',
      desc: '芳草园小学校史馆概念设计，以时间线索展示学校发展历程与教育成果。',
      cover: 'assets/img/fangcaoyuan-history/00.jpg',
      images: ['assets/img/fangcaoyuan-history/01.jpg','assets/img/fangcaoyuan-history/02.jpg','assets/img/fangcaoyuan-history/03.jpg','assets/img/fangcaoyuan-history/04.jpg','assets/img/fangcaoyuan-history/05.jpg']
    },
    {
      cat: 'space', slug: 'wtc-26b03',
      name: '世贸中心大厦', year: 2020, en: 'World Trade Center 26B03',
      desc: '南京世贸中心大厦26B03空间设计项目，以现代简约风格打造高端商务办公空间。',
      cover: 'assets/img/wtc-26b03/00.jpg',
      images: ['assets/img/wtc-26b03/01.jpg','assets/img/wtc-26b03/02.jpg','assets/img/wtc-26b03/03.jpg','assets/img/wtc-26b03/04.jpg']
    },
    {
      cat: 'sculpture', slug: 'xian-forest-belt-sculpture',
      name: '西安幸福林带雕塑', year: 2020, en: 'Xian Happy Forest Belt Sculpture',
      desc: '西安幸福林带雕塑与艺术装置设计，以西安深厚的历史文化为灵感，创作彰显地域特色的公共艺术作品。',
      cover: 'assets/img/xian-forest-belt-sculpture/00.jpg',
      images: ['assets/img/xian-forest-belt-sculpture/01.jpg','assets/img/xian-forest-belt-sculpture/02.jpg','assets/img/xian-forest-belt-sculpture/03.jpg','assets/img/xian-forest-belt-sculpture/04.jpg','assets/img/xian-forest-belt-sculpture/05.jpg','assets/img/xian-forest-belt-sculpture/06.jpg','assets/img/xian-forest-belt-sculpture/07.jpg','assets/img/xian-forest-belt-sculpture/08.jpg','assets/img/xian-forest-belt-sculpture/09.jpg']
    },
    {
      cat: 'sculpture', slug: 'beijing-science-sculpture',
      name: '北京科学园雕塑', year: 2020, en: 'Beijing Science Park Sculpture',
      desc: '北京海淀区中关村东升科学园景观雕塑设计，以科技与自然为主题。',
      cover: 'assets/img/beijing-science-sculpture/00.jpg',
      images: ['assets/img/beijing-science-sculpture/01.jpg','assets/img/beijing-science-sculpture/02.jpg','assets/img/beijing-science-sculpture/03.jpg','assets/img/beijing-science-sculpture/04.jpg','assets/img/beijing-science-sculpture/05.jpg','assets/img/beijing-science-sculpture/06.jpg','assets/img/beijing-science-sculpture/07.jpg']
    },
    {
      cat: 'sculpture', slug: 'nantong-sculpture',
      name: '南通历史文化街区雕塑', year: 2014, en: 'Nantong Historical District Sculpture',
      desc: '南通历史文化街区雕塑设计，以南通唐闸工业历史遗产为文化背景，创作反映城市工业记忆与时代精神的公共雕塑作品。',
      cover: 'assets/img/nantong-sculpture/00.jpg',
      images: ['assets/img/nantong-sculpture/01.jpg','assets/img/nantong-sculpture/02.jpg','assets/img/nantong-sculpture/03.jpg']
    },
    {
      cat: 'sculpture', slug: 'yuying-sculpture',
      name: '育英外国语学校雕塑', year: 2016, en: 'Yuying Foreign Language School Sculpture',
      desc: '南京育英外国语学校雕塑设计，以教育文化为核心主题，创作融入校园环境的艺术雕塑作品。',
      cover: 'assets/img/yuying-sculpture/00.jpg',
      images: ['assets/img/yuying-sculpture/01.jpg','assets/img/yuying-sculpture/02.jpg','assets/img/yuying-sculpture/03.jpg','assets/img/yuying-sculpture/04.jpg']
    },
    {
      cat: 'sculpture', slug: 'eye-of-justice',
      name: '正义之眼', year: 2018, en: 'Eye of Justice',
      desc: '江苏省检察官学院「守望正义」主题雕塑设计。主体部分由检察官首字母「JCG」和徽标组成。十三颗星代表江苏十三个检察院。',
      cover: 'assets/img/eye-of-justice/00.jpg',
      images: ['assets/img/eye-of-justice/01.jpg','assets/img/eye-of-justice/02.jpg','assets/img/eye-of-justice/03.jpg','assets/img/eye-of-justice/04.jpg','assets/img/eye-of-justice/05.jpg']
    },
    {
      cat: 'sculpture', slug: 'rockery-series',
      name: '假山系列', year: 2017, en: 'Rockery Series',
      desc: '「假山」系列雕塑小品设计，以传统假山造型为灵感，结合现代切片与重组手法。',
      cover: 'assets/img/rockery-series/00.jpg',
      images: ['assets/img/rockery-series/01.jpg','assets/img/rockery-series/02.jpg']
    },
    {
      cat: 'sculpture', slug: 'ninghai-sculpture',
      name: '宁海中学雕塑', year: 2015, en: 'Ninghai MS Sculpture',
      desc: '南京市宁海中学雕塑艺术装置设计，将学校百年文化底蕴以艺术雕塑的形式呈现于校园空间中。',
      cover: 'assets/img/ninghai-sculpture/00.jpg',
      images: ['assets/img/ninghai-sculpture/01.jpg','assets/img/ninghai-sculpture/02.jpg','assets/img/ninghai-sculpture/03.jpg','assets/img/ninghai-sculpture/04.jpg','assets/img/ninghai-sculpture/05.jpg','assets/img/ninghai-sculpture/06.jpg','assets/img/ninghai-sculpture/07.jpg','assets/img/ninghai-sculpture/08.jpg','assets/img/ninghai-sculpture/09.jpg']
    },
    {
      cat: 'sculpture', slug: 'longjiang-primary-sculpture',
      name: '龙江小学雕塑', year: 2011, en: 'Longjiang Primary School Sculpture',
      desc: '南京龙江小学雕塑设计，以「绿色·乐活·生态」校园理念为核心，创作富有生命力的校园雕塑作品。',
      cover: 'assets/img/longjiang-primary-sculpture/00.jpg',
      images: ['assets/img/longjiang-primary-sculpture/01.jpg','assets/img/longjiang-primary-sculpture/02.jpg','assets/img/longjiang-primary-sculpture/03.jpg','assets/img/longjiang-primary-sculpture/04.jpg','assets/img/longjiang-primary-sculpture/05.jpg']
    },
    {
      cat: 'sculpture', slug: 'lishui-sculpture',
      name: '溧水雕塑布局研究', year: 2018, en: 'Lishui Sculpture Planning',
      desc: '溧水区城市标志性地段雕塑规划，针对城市重要节点进行雕塑布局研究与设计。',
      cover: 'assets/img/lishui-sculpture/00.jpg',
      images: ['assets/img/lishui-sculpture/01.jpg','assets/img/lishui-sculpture/02.jpg','assets/img/lishui-sculpture/03.jpg']
    },
    {
      cat: 'sculpture', slug: 'fangcaoyuan-public-art',
      name: '芳草园公共艺术', year: 2019, en: 'Fangcaoyuan Public Art',
      desc: '芳草园小学公共艺术设计，以童趣与自然为主题，创作融入校园景观的艺术装置。',
      cover: 'assets/img/fangcaoyuan-public-art/00.jpg',
      images: ['assets/img/fangcaoyuan-public-art/01.jpg','assets/img/fangcaoyuan-public-art/02.jpg','assets/img/fangcaoyuan-public-art/03.jpg','assets/img/fangcaoyuan-public-art/04.jpg','assets/img/fangcaoyuan-public-art/05.jpg','assets/img/fangcaoyuan-public-art/06.jpg','assets/img/fangcaoyuan-public-art/07.jpg','assets/img/fangcaoyuan-public-art/08.jpg','assets/img/fangcaoyuan-public-art/09.jpg']
    },
    {
      cat: 'signage', slug: 'xian-forest-belt-signage',
      name: '西安幸福林带标识', year: 2020, en: 'Xian Happy Forest Belt Signage',
      desc: '西安幸福林带标识系统设计，以西安城市文化为设计元素，建立完整的林带景观导视标识体系。',
      cover: 'assets/img/xian-forest-belt-signage/00.jpg',
      images: ['assets/img/xian-forest-belt-signage/01.jpg','assets/img/xian-forest-belt-signage/02.jpg','assets/img/xian-forest-belt-signage/03.jpg','assets/img/xian-forest-belt-signage/04.jpg','assets/img/xian-forest-belt-signage/05.jpg','assets/img/xian-forest-belt-signage/06.jpg','assets/img/xian-forest-belt-signage/07.jpg','assets/img/xian-forest-belt-signage/08.jpg','assets/img/xian-forest-belt-signage/09.jpg']
    },
    {
      cat: 'signage', slug: 'hohhot-signage',
      name: '呼和浩特标识设计', year: 2020, en: 'Hohhot Signage Design',
      desc: '呼和浩特市绿道标识系统设计，融合北方草原文化特色与现代设计语言。',
      cover: 'assets/img/hohhot-signage/00.jpg',
      images: ['assets/img/hohhot-signage/01.jpg','assets/img/hohhot-signage/02.jpg','assets/img/hohhot-signage/03.jpg','assets/img/hohhot-signage/04.jpg','assets/img/hohhot-signage/05.jpg','assets/img/hohhot-signage/06.jpg','assets/img/hohhot-signage/07.jpg','assets/img/hohhot-signage/08.jpg','assets/img/hohhot-signage/09.jpg']
    },
    {
      cat: 'signage', slug: 'guochuangyuan-signage',
      name: '国创园标识', year: 2012, en: 'National Pioneer Park Signage',
      desc: '南京国家领军人才创业园标识设计，以简约现代的设计风格为高科技园区建立专业化的导视标识体系。',
      cover: 'assets/img/guochuangyuan-signage/00.jpg',
      images: ['assets/img/guochuangyuan-signage/01.jpg','assets/img/guochuangyuan-signage/02.jpg','assets/img/guochuangyuan-signage/03.jpg','assets/img/guochuangyuan-signage/04.jpg','assets/img/guochuangyuan-signage/05.jpg','assets/img/guochuangyuan-signage/06.jpg','assets/img/guochuangyuan-signage/07.jpg','assets/img/guochuangyuan-signage/08.jpg','assets/img/guochuangyuan-signage/09.jpg']
    },
    {
      cat: 'signage', slug: 'nantong-signage',
      name: '南通历史街区标识', year: 2014, en: 'Nantong Historical District Signage',
      desc: '南通唐闸工业历史街区标识系统设计，以工业遗产的历史文化元素为核心。',
      cover: 'assets/img/nantong-signage/00.jpg',
      images: ['assets/img/nantong-signage/01.jpg','assets/img/nantong-signage/02.jpg','assets/img/nantong-signage/03.jpg','assets/img/nantong-signage/04.jpg','assets/img/nantong-signage/05.jpg','assets/img/nantong-signage/06.jpg','assets/img/nantong-signage/07.jpg','assets/img/nantong-signage/08.jpg']
    },
    {
      cat: 'signage', slug: 'zhongguancun-signage',
      name: '北京中关村科学园标识', year: 2021, en: 'Zhongguancun Science Park Signage',
      desc: '北京海淀区中关村东升科学园标识系统设计，以简洁现代的设计语言建立导视标识体系。',
      cover: 'assets/img/zhongguancun-signage/00.jpg',
      images: ['assets/img/zhongguancun-signage/01.jpg','assets/img/zhongguancun-signage/02.jpg','assets/img/zhongguancun-signage/03.jpg','assets/img/zhongguancun-signage/04.jpg','assets/img/zhongguancun-signage/05.jpg','assets/img/zhongguancun-signage/06.jpg','assets/img/zhongguancun-signage/07.jpg','assets/img/zhongguancun-signage/08.jpg','assets/img/zhongguancun-signage/09.jpg']
    },
    {
      cat: 'signage', slug: 'nanjing-communications-signage',
      name: '交通学院标识', year: 2010, en: 'Nanjing Communications Inst. Signage',
      desc: '南京交通职业技术学院标识设计，为校园空间建立统一、清晰的导视标识系统。',
      cover: 'assets/img/nanjing-communications-signage/00.jpg',
      images: ['assets/img/nanjing-communications-signage/01.jpg','assets/img/nanjing-communications-signage/02.jpg','assets/img/nanjing-communications-signage/03.jpg','assets/img/nanjing-communications-signage/04.jpg','assets/img/nanjing-communications-signage/05.jpg','assets/img/nanjing-communications-signage/06.jpg','assets/img/nanjing-communications-signage/07.jpg','assets/img/nanjing-communications-signage/08.jpg','assets/img/nanjing-communications-signage/09.jpg']
    },
    {
      cat: 'signage', slug: 'gulou-training-signage',
      name: '鼓楼区教师发展中心标识', year: 2018, en: 'Gulou Training Center Signage',
      desc: '南京鼓楼区教师发展中心标识系统设计，以简约优雅的设计风格打造专业导视标识体系。',
      cover: 'assets/img/gulou-training-signage/00.jpg',
      images: ['assets/img/gulou-training-signage/01.jpg','assets/img/gulou-training-signage/02.jpg','assets/img/gulou-training-signage/03.jpg','assets/img/gulou-training-signage/04.jpg','assets/img/gulou-training-signage/05.jpg','assets/img/gulou-training-signage/06.jpg','assets/img/gulou-training-signage/07.jpg','assets/img/gulou-training-signage/08.jpg','assets/img/gulou-training-signage/09.jpg']
    },
    {
      cat: 'signage', slug: 'suzhou-north-america-signage',
      name: '苏州北美标识', year: 2018, en: 'Suzhou North American HS Signage',
      desc: '苏州北美国际高级中学标识系统设计，以国际化风格打造完整的校园导视系统。',
      cover: 'assets/img/suzhou-north-america-signage/00.jpg',
      images: ['assets/img/suzhou-north-america-signage/01.jpg','assets/img/suzhou-north-america-signage/02.jpg','assets/img/suzhou-north-america-signage/03.jpg','assets/img/suzhou-north-america-signage/04.jpg','assets/img/suzhou-north-america-signage/05.jpg','assets/img/suzhou-north-america-signage/06.jpg','assets/img/suzhou-north-america-signage/07.jpg','assets/img/suzhou-north-america-signage/08.jpg','assets/img/suzhou-north-america-signage/09.jpg']
    },
    {
      cat: 'signage', slug: 'nju-middle-school-signage',
      name: '南大附中标识', year: 2012, en: 'NJU Affiliated MS Signage',
      desc: '南京大学附属中学标识设计，以百年学府的文化底蕴为根基，设计统一的校园导视与标识系统。',
      cover: 'assets/img/nju-middle-school-signage/00.jpg',
      images: ['assets/img/nju-middle-school-signage/01.jpg','assets/img/nju-middle-school-signage/02.jpg','assets/img/nju-middle-school-signage/03.jpg','assets/img/nju-middle-school-signage/04.jpg','assets/img/nju-middle-school-signage/05.jpg','assets/img/nju-middle-school-signage/06.jpg','assets/img/nju-middle-school-signage/07.jpg','assets/img/nju-middle-school-signage/08.jpg','assets/img/nju-middle-school-signage/09.jpg']
    },
    {
      cat: 'signage', slug: 'ninghai-signage',
      name: '宁海中学标识设计', year: 2019, en: 'Ninghai MS Signage',
      desc: '南京市宁海中学标识系统设计，以学校百年历史文化为根基。',
      cover: 'assets/img/ninghai-signage/00.jpg',
      images: ['assets/img/ninghai-signage/01.jpg','assets/img/ninghai-signage/02.jpg','assets/img/ninghai-signage/03.jpg','assets/img/ninghai-signage/04.jpg','assets/img/ninghai-signage/05.jpg','assets/img/ninghai-signage/06.jpg','assets/img/ninghai-signage/07.jpg','assets/img/ninghai-signage/08.jpg','assets/img/ninghai-signage/09.jpg']
    },
    {
      cat: 'signage', slug: 'jiangnan-industrial-park',
      name: '江南近现代工业遗存公园', year: 2016, en: 'Jiangnan Industrial Heritage Park',
      desc: '江南近现代工业遗存公园标识设计，以工业遗产的历史文化元素为核心。',
      cover: 'assets/img/jiangnan-industrial-park/00.jpg',
      images: ['assets/img/jiangnan-industrial-park/01.jpg','assets/img/jiangnan-industrial-park/02.jpg','assets/img/jiangnan-industrial-park/03.jpg','assets/img/jiangnan-industrial-park/04.jpg','assets/img/jiangnan-industrial-park/05.jpg','assets/img/jiangnan-industrial-park/06.jpg','assets/img/jiangnan-industrial-park/07.jpg','assets/img/jiangnan-industrial-park/08.jpg','assets/img/jiangnan-industrial-park/09.jpg']
    },
    {
      cat: 'furniture', slug: 'xian-forest-belt-furniture',
      name: '西安幸福林带城市家具', year: 2020, en: 'Xian Happy Forest Belt Furniture',
      desc: '西安幸福林带城市家具设计，以高品质、生态持续的设计理念，编织出人与自然「和谐、共生」的城市家具体系。',
      cover: 'assets/img/xian-forest-belt-furniture/00.jpg',
      images: ['assets/img/xian-forest-belt-furniture/01.jpg','assets/img/xian-forest-belt-furniture/02.jpg','assets/img/xian-forest-belt-furniture/03.jpg','assets/img/xian-forest-belt-furniture/04.jpg','assets/img/xian-forest-belt-furniture/05.jpg','assets/img/xian-forest-belt-furniture/06.jpg','assets/img/xian-forest-belt-furniture/07.jpg','assets/img/xian-forest-belt-furniture/08.jpg','assets/img/xian-forest-belt-furniture/09.jpg']
    },
    {
      cat: 'furniture', slug: 'nanjing-series-furniture',
      name: '「南京」系列城市家具', year: 2017, en: 'Nanjing Series City Furniture',
      desc: '取自南京传统民居的造型，加以艺术化手段，结合江南园林元素。实现休息、闲坐、等待、花器、候车等功能。',
      cover: 'assets/img/nanjing-series-furniture/00.jpg',
      images: ['assets/img/nanjing-series-furniture/01.jpg','assets/img/nanjing-series-furniture/02.jpg','assets/img/nanjing-series-furniture/03.jpg','assets/img/nanjing-series-furniture/04.jpg','assets/img/nanjing-series-furniture/05.jpg','assets/img/nanjing-series-furniture/06.jpg','assets/img/nanjing-series-furniture/07.jpg','assets/img/nanjing-series-furniture/08.jpg','assets/img/nanjing-series-furniture/09.jpg']
    },
    {
      cat: 'furniture', slug: 'viewing-scenery',
      name: '观「景」', year: 2018, en: 'Viewing Scenery',
      desc: '「观景」座椅是将「又」「见」「景」三个字进行组合形成的景观座椅。座椅随意组合，可形成不同的意趣。',
      cover: 'assets/img/viewing-scenery/00.jpg',
      images: ['assets/img/viewing-scenery/01.jpg','assets/img/viewing-scenery/02.jpg','assets/img/viewing-scenery/03.jpg','assets/img/viewing-scenery/04.jpg','assets/img/viewing-scenery/05.jpg','assets/img/viewing-scenery/06.jpg','assets/img/viewing-scenery/07.jpg','assets/img/viewing-scenery/08.jpg','assets/img/viewing-scenery/09.jpg']
    },
    {
      cat: 'furniture', slug: 'undulating-garden',
      name: '「起伏花园」', year: 2017, en: 'Undulating Garden',
      desc: '「起伏花园」城市家具设计。起伏的波浪造型，可以实现多人坐憩。',
      cover: 'assets/img/undulating-garden/00.jpg',
      images: ['assets/img/undulating-garden/01.jpg','assets/img/undulating-garden/02.jpg','assets/img/undulating-garden/03.jpg','assets/img/undulating-garden/04.jpg','assets/img/undulating-garden/05.jpg','assets/img/undulating-garden/06.jpg','assets/img/undulating-garden/07.jpg','assets/img/undulating-garden/08.jpg','assets/img/undulating-garden/09.jpg']
    },
    {
      cat: 'furniture', slug: 'puzzle-table',
      name: '「拼合桌」', year: 2011, en: 'Puzzle Table',
      desc: '「拼合桌」城市家具设计。在拼图元素基础上加入参数化手段，可分可合的桌子巧妙地实现拼合。',
      cover: 'assets/img/puzzle-table/00.jpg',
      images: ['assets/img/puzzle-table/01.jpg','assets/img/puzzle-table/02.jpg','assets/img/puzzle-table/03.jpg','assets/img/puzzle-table/04.jpg','assets/img/puzzle-table/05.jpg','assets/img/puzzle-table/06.jpg','assets/img/puzzle-table/07.jpg']
    },
    {
      cat: 'furniture', slug: 'heat-wave-red-chair',
      name: '「热浪」红椅子', year: 2017, en: 'Heat Wave Red Chair',
      desc: '「热浪」主题家具设计。造型婀娜，曲线动人，热情逼人。家具也可以有动人的「姿态」。',
      cover: 'assets/img/heat-wave-red-chair/00.jpg',
      images: ['assets/img/heat-wave-red-chair/01.jpg','assets/img/heat-wave-red-chair/02.jpg','assets/img/heat-wave-red-chair/03.jpg','assets/img/heat-wave-red-chair/04.jpg','assets/img/heat-wave-red-chair/05.jpg']
    }
  ];

  // ── Expose globally for project detail page ──
  window.__PINZUO_PROJECTS = projects;
  window.__PINZUO_CAT_LABELS = catLabels;
  window.__PINZUO_CAT_EN = CAT_EN;
  window.__PINZUO_DESC_EN = DESC_EN;

  // ── Helper ──
  function escapeHtml(s) {
    var d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
  }

  // ── Portfolio Grid (index.html only) ──
  var grid = document.getElementById('portfolioGrid');
  if (grid) {
    var currentFilter = 'all';
    function renderGrid(filter) {
      if (filter != null) currentFilter = filter;
      var lang = getLang();
      grid.innerHTML = '';
      var filtered = currentFilter === 'all' ? projects : projects.filter(function (p) { return p.cat === currentFilter; });
      filtered.forEach(function (proj, idx) {
        var displayName = lang === 'en' ? proj.en : proj.name;
        var subText = lang === 'en' ? (proj.year + ' \u00b7 ' + proj.name) : (proj.year + ' \u00b7 ' + proj.en);
        var card = document.createElement('a');
        card.className = 'port-card';
        card.href = 'project.html?slug=' + proj.slug;
        card.style.animationDelay = Math.min(idx * 0.05, 0.8) + 's';
        card.innerHTML =
          '<img src="' + escapeHtml(proj.cover) + '" alt="' + escapeHtml(displayName) + '" loading="lazy">' +
          '<div class="port-overlay">' +
            '<h3>' + escapeHtml(displayName) + '</h3>' +
            '<p>' + escapeHtml(subText) + '</p>' +
          '</div>';
        grid.appendChild(card);
      });
    }
    window.__rerender = function () { renderGrid(); };

    renderGrid('all');

    var filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function (btn) {
      btn.addEventListener('click', function () {
        filterBtns.forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        renderGrid(btn.getAttribute('data-filter'));
      });
    });
  } else {
    window.__rerender = function () {};
  }

  // ── Lightbox (shared across pages) ──
  var lightbox = document.getElementById('lightbox');
  if (lightbox) {
    var lbImg = document.getElementById('lbImg');
    var lbCaption = document.getElementById('lbCaption');
    var lbCounter = document.getElementById('lbCounter');
    var lbClose = document.getElementById('lbClose');
    var lbPrev = document.getElementById('lbPrev');
    var lbNext = document.getElementById('lbNext');
    var currentImages = [];
    var currentLbIdx = 0;
    var lbCaptionText = '';

    window.openLightbox = function (images, startIdx, caption) {
      currentImages = images;
      currentLbIdx = startIdx || 0;
      lbCaptionText = caption || '';
      showLbImage();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    };

    function showLbImage() {
      lbImg.src = currentImages[currentLbIdx];
      lbCaption.textContent = lbCaptionText;
      lbCounter.textContent = (currentLbIdx + 1) + ' / ' + currentImages.length;
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
      lbImg.src = '';
    }

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function (e) {
      if (e.target === lightbox) closeLightbox();
    });
    lbPrev.addEventListener('click', function (e) {
      e.stopPropagation();
      currentLbIdx = (currentLbIdx - 1 + currentImages.length) % currentImages.length;
      showLbImage();
    });
    lbNext.addEventListener('click', function (e) {
      e.stopPropagation();
      currentLbIdx = (currentLbIdx + 1) % currentImages.length;
      showLbImage();
    });
    document.addEventListener('keydown', function (e) {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') { currentLbIdx = (currentLbIdx - 1 + currentImages.length) % currentImages.length; showLbImage(); }
      if (e.key === 'ArrowRight') { currentLbIdx = (currentLbIdx + 1) % currentImages.length; showLbImage(); }
    });
  }

  // ── Nav scroll style ──
  var nav = document.getElementById('nav');
  var navLinks = document.querySelectorAll('.nav-links a');
  var sections = document.querySelectorAll('.section, .hero');

  function onScroll() {
    if (!nav) return;
    if (window.scrollY > 80) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
    var scrollPos = window.scrollY + 120;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos && sec.offsetTop + sec.offsetHeight > scrollPos) {
        var id = sec.getAttribute('id');
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }
  if (sections.length > 0) {
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── Mobile nav toggle ──
  var navToggle = document.getElementById('navToggle');
  var navLinksEl = document.getElementById('navLinks');
  if (navToggle && navLinksEl) {
    navToggle.addEventListener('click', function () {
      navLinksEl.classList.toggle('open');
    });
    navLinksEl.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') navLinksEl.classList.remove('open');
    });
  }

  // ── Scroll animations ──
  var animEls = document.querySelectorAll('.anim-fade-up');
  if ('IntersectionObserver' in window && animEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    animEls.forEach(function (el) { observer.observe(el); });
  } else {
    animEls.forEach(function (el) { el.classList.add('visible'); });
  }

  // ── Contact form (visual only) ──
  window.handleForm = function (e) {
    e.preventDefault();
    var isEn = getLang() === 'en';
    var btn = e.target.querySelector('.form-submit');
    btn.textContent = isEn ? 'Sent \u2713' : '\u5df2\u53d1\u9001 \u2713';
    btn.style.background = '#8a7252';
    setTimeout(function () {
      btn.textContent = isEn ? 'Send Inquiry' : '\u53d1\u9001\u54a8\u8be2';
      btn.style.background = '';
      e.target.reset();
    }, 2500);
    return false;
  };

  // ── Init controls + apply saved language ──
  initControls();
  applyLang();

})();
