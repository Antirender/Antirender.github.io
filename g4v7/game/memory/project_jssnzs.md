---
name: project-jssnzs
description: 江苏省室内装饰协会官网视觉升级项目 — CSS重写，保留所有内容架构
metadata:
  type: project
---

网站目录：/Users/zhangyiyang/Desktop/university/Sheridan/jssnzs/www.jssnzs.com

**核心文件：** `mb/01/style.css` — 控制全站所有页面样式（已完成重写）

**Why:** 原网站视觉老旧，需在不改动HTML内容结构的前提下完成整体视觉升级。

**技术架构：**
- 静态HTML网站，GB2312编码的HTML文件
- CSS文件自身改为UTF-8编码（`@charset "utf-8"`）
- jQuery + nff.js 驱动轮播和导航
- 固定1000px宽度布局，float-based
- 所有页面均引用同一个 `mb/01/style.css`

**栏目结构（7个一级）：**
- 首页 (index.html)
- 协会动态 (htm/127/)
- 行业动态 (htm/200/)
- 设计师认证 (htm/201/)
- 职业标准 (htm/202/)
- 会员之家 (htm/203/)
- 通知通告 (htm/204/)
- 下载区 (htm/207/)

**设计规范（已落地）：**
- 主色：#C0392B（深专业红）
- 深色：#8B1A1A（暗红，用于深色背景辅助色）
- 导航底色：#1C2133（深海军蓝）
- 背景：#F2F2F2（浅灰，区分各模块）
- 文字主色：#2C2C2C
- 字体：微软雅黑/Microsoft YaHei 为主

**关键布局尺寸（验证正确）：**
- mxwzx(663) + mtzgg(326) + 11px gap = 1000
- mprt(136) + mprc(864) = 1000（mpr无水平padding）
- mlink_title2(860) + mdown(140) = 1000
- wle(196) + wri(790) + 14px gap = 1000

**本地预览：** `python3 -m http.server 8765` 然后访问 http://localhost:8765

**How to apply:** 后续如需调整颜色/间距，只需修改这一个CSS文件即可影响全站。
