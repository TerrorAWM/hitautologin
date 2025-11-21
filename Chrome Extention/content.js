// content.js — i18n（中文/English）、FAB 与遮罩文本随语言切换
(() => {
  'use strict';

  // ========== 简易存储 ==========
  const store = {
    async get(key, defVal) {
      return new Promise((resolve) => {
        chrome.storage.local.get([key], (o) => resolve(o[key] !== undefined ? o[key] : defVal));
      });
    },
    async set(key, val) {
      return new Promise((resolve) => {
        chrome.storage.local.set({ [key]: val }, resolve);
      });
    }
  };

  // 语言包
  const T = {
    zh: {
      site_hit: "当前站点：HIT",
      site_non: "当前站点：非HIT",
      common_intranet: "访问HIT内网",
      common_extranet: "访问HIT外网",
      common_wlan: "访问HIT-WLAN",
      fab_title_links: "常用入口",
      fab_title_login: "登录助手",
      fab_set_user: "设置用户名",
      fab_set_pass: "设置密码",
      fab_toggle_auto: "切换自动登录",
      fab_toggle_idp: "切换校外授权",
      fab_trigger_once: "手动接管登录",
      kv_username: "用户名",
      kv_password: "密码",
      kv_autologin: "自动登录",
      kv_idp_auth: "校外授权",
      val_on: "已开启",
      val_off: "未开启",
      val_unset: "未设置",
      overlay_title: "接管中",
      overlay_msg: "接管中…正在自动填写/登录",
      overlay_go_portal: "登录校园网",
      err_fail: "登录失败: ",
      err_autoclosed: "。自动登录已关闭。",
      err_captcha: "检测到验证码弹窗，自动登录已关闭。",
      fab_title_tools: "常用工具",
      tool_webvpn: "通过 WebVPN 访问"
    },
    en: {
      site_hit: "Current site: HIT",
      site_non: "Current site: Non-HIT",
      common_intranet: "Open HIT Internal",
      common_extranet: "Open HIT External",
      common_wlan: "Open HIT-WLAN",
      fab_title_links: "Quick Links",
      fab_title_login: "Login Assistant",
      fab_set_user: "Set Username",
      fab_set_pass: "Set Password",
      fab_toggle_auto: "Auto Login",
      fab_toggle_idp: "Toggle IDP Auth",
      fab_trigger_once: "Trigger Login Once",
      kv_username: "Username",
      kv_password: "Password",
      kv_autologin: "Auto Login",
      kv_idp_auth: "IDP Auth",
      val_on: "On",
      val_off: "Off",
      val_unset: "Not set",
      overlay_title: "Taking Over",
      overlay_msg: "Taking over… filling & logging in",
      overlay_go_portal: "Go to HIT-WLAN Login",
      err_fail: "Login failed: ",
      err_autoclosed: ". Auto-login is turned off.",
      err_captcha: "Captcha dialog detected. Auto-login is turned off.",
      fab_title_tools: "Common Tools",
      tool_webvpn: "Access via WebVPN"
    }
  };
  let LANG = 'zh';
  const t = (k) => (T[LANG] || T.zh)[k] || k;

  // —— 悬浮入口开关（默认开启）——
  const FAB_KEY = 'fabEnabled';

  // ---- 目标链接 ----
  const URL_INTRANET = 'http://i.hit.edu.cn/';
  const URL_EXTRANET = 'http://ivpn.hit.edu.cn/';
  const URL_WLAN = 'https://webportal.hit.edu.cn/';

  // ---- HIT 站点判定 ----
  const isHitSite =
    /\.hit\.edu\.cn$/i.test(location.hostname) ||
    /(^|\.)ivpn\.hit\.edu\.cn$/i.test(location.hostname);

  // ====== 可配置 ID 列表（兼容历史）======
  let username_ids = ["username", "user", "loginUser", "IDToken1"];
  let password_ids = ["password", "passwd", "loginPwd", "IDToken2"];
  let rememberMe_ids = ["rememberMe", "remember", "stayLogged"];
  let login_submit_ids = ["login_submit", "login", "submitButton", "btn-login", "submit"];
  let errorTip_ids = ["showErrorTip"];
  let captcha_ids = ["captcha-id", "layui-layer1", "captcha-box"];

  function setCustomIds(options) {
    if (options.username_ids) username_ids = options.username_ids;
    if (options.password_ids) password_ids = options.password_ids;
    if (options.rememberMe_ids) rememberMe_ids = options.rememberMe_ids;
    if (options.login_submit_ids) login_submit_ids = options.login_submit_ids;
    if (options.errorTip_ids) errorTip_ids = options.errorTip_ids;
    if (options.captcha_ids) captcha_ids = options.captcha_ids;
  }

  // ====== 工具 ======
  const byIds = (ids) => ids.map(id => document.getElementById(id)).find(Boolean) || null;
  const q = (sel) => document.querySelector(sel);

  const findUsernameInput = () =>
    byIds(username_ids) ||
    q('input[autocomplete="username"]') ||
    q('input[name="username"],input[name="user"],input[name="j_username"]') ||
    q('input[type="text"][placeholder*="用户名"],input[type="text"][placeholder*="学号"]') ||
    q('input[type="text"],input[type="email"]');

  const findPasswordInput = () =>
    byIds(password_ids) ||
    q('input[autocomplete="current-password"],input[autocomplete="password"]') ||
    q('input[name="password"],input[name="j_password"]') ||
    q('input[type="password"]');

  const findRememberMe = () =>
    byIds(rememberMe_ids) ||
    q('input[type="checkbox"][name*="remember"],input[type="checkbox"][id*="remember"]');

  const findLoginButton = () =>
    byIds(login_submit_ids) ||
    q('button[type="submit"],input[type="submit"],button[id*="login"],button[name*="login"]');

  function setInputValue(el, value) {
    if (!el) return;
    try {
      const setter =
        Object.getOwnPropertyDescriptor(el.__proto__, 'value')?.set ||
        Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      setter?.call(el, value);
    } catch (_) { el.value = value; }
    el.dispatchEvent(new Event('input', { bubbles: true }));
    el.dispatchEvent(new Event('change', { bubbles: true }));
  }

  const pageLooksLoggedIn = () => !(findUsernameInput() || findPasswordInput());

  // ====== 样式注入 ======
  function addStyle(css) {
    const s = document.createElement('style');
    s.textContent = css;
    document.documentElement.appendChild(s);
  }

  // ====== “接管中”浮层 ======
  let interrupted = false;
  let pollTimer = null;

  function ensureOverlayStyle() {
    addStyle(`
      #hit-overlay { position: fixed; inset:0; z-index:2147483647;
        background: rgba(0,0,0,.35); display:flex; align-items:center; justify-content:center; backdrop-filter: blur(2px);}
      #hit-overlay-box{ position: relative; min-width:300px; max-width:90vw; background:#fff; color:#111; border-radius:16px;
        padding:20px 24px; text-align:center; box-shadow: 0 10px 30px rgba(0,0,0,.25);
        font-family: system-ui, -apple-system, Segoe UI, Roboto, "PingFang SC","Microsoft YaHei",sans-serif;}
      #hit-overlay-close { position:absolute; top:8px; right:10px; width:28px; height:28px; line-height:28px; border:none;
        border-radius:50%; background:#f1f3f5; color:#444; cursor:pointer; font-size:18px; font-weight:700;}
      #hit-overlay-close:hover { background:#e9ecef; }
      #hit-overlay-title{ font-size:18px; font-weight:700; }
      #hit-overlay-spinner{ margin:12px auto 8px; width:22px; height:22px; border-radius:50%;
        border:3px solid #e5e7eb; border-top-color:#6366f1; animation: hitspin 1s linear infinite;}
      #hit-overlay-actions{ margin-top:12px; display:flex; justify-content:center; gap:10px; flex-wrap:wrap;}
      .hit-btn{ border:none; padding:8px 14px; border-radius:999px; cursor:pointer; font-size:14px; box-shadow: 0 2px 6px rgba(0,0,0,.08);}
      .hit-btn-primary{ background:#eef2ff; }
      .hit-btn-primary:hover{ background:#e0e7ff; }
      @keyframes hitspin { to { transform: rotate(360deg); } }
    `);
  }

  function renderOverlayTexts() {
    const tl = document.getElementById('hit-overlay-title');
    const msg = document.getElementById('hit-overlay-msg');
    const go = document.getElementById('hit-go-portal');
    if (tl) tl.textContent = t('overlay_title');
    if (msg) msg.textContent = t('overlay_msg');
    if (go) go.textContent = t('overlay_go_portal');
  }

  function showOverlay() {
    if (document.getElementById('hit-overlay')) return;
    interrupted = false;
    ensureOverlayStyle();
    const wrap = document.createElement('div');
    wrap.id = 'hit-overlay';
    wrap.innerHTML = `
      <div id="hit-overlay-box" role="dialog" aria-modal="true">
        <button id="hit-overlay-close" aria-label="Close">×</button>
        <div id="hit-overlay-title"></div>
        <div id="hit-overlay-spinner"></div>
        <div id="hit-overlay-msg"></div>
        <div id="hit-overlay-actions">
          <button class="hit-btn hit-btn-primary" id="hit-go-portal"></button>
        </div>
      </div>`;
    document.documentElement.appendChild(wrap);
    renderOverlayTexts();

    document.getElementById('hit-overlay-close')?.addEventListener('click', () => {
      interrupted = true; hideOverlay();
    });
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap) { interrupted = true; hideOverlay(); }
    });
    document.getElementById('hit-go-portal')?.addEventListener('click', () => { location.href = URL_WLAN; });
  }

  function hideOverlay() {
    if (pollTimer) { clearInterval(pollTimer); pollTimer = null; }
    document.getElementById('hit-overlay')?.remove();
  }

  // ====== 悬浮入口（全站显示）======
  // ====== 悬浮入口（全站显示）======
  let fabDocHandler = null;
  let fabShadowRoot = null;

  function getFabCss() {
    return `
      :host { position: fixed; right:14px; bottom:16px; z-index:2147483646;
        font-family: system-ui, -apple-system, Segoe UI, Roboto, "PingFang SC","Microsoft YaHei",sans-serif; }
      #hit-fab-toggle{ width:48px; height:48px; border-radius:50%; border:none; cursor:pointer; background:#005375; color:#fff;
        font-weight:700; font-size:14px; box-shadow:0 8px 20px rgba(0,0,0,.25); transition: transform 0.2s; }
      #hit-fab-toggle:hover { transform: scale(1.05); }
      #hit-fab-panel{ position:absolute; right:0; bottom:60px; min-width:260px; max-width:86vw; background:#fff; color:#111;
        border-radius:14px; padding:12px; box-shadow:0 16px 40px rgba(0,0,0,.25); display:none;
        transform-origin: bottom right; animation: hit-pop-in 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
      #hit-fab-panel.open{ display:block; }
      @keyframes hit-pop-in { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
      .hit-fab-title{ font-size:14px; font-weight:700; margin:2px 0 8px; }
      .hit-fab-row{ display:flex; gap:8px; flex-wrap:wrap; }
      .hit-fab-btn{ border:none; border-radius:999px; padding:8px 12px; background:#eef2ff; cursor:pointer; font-size:13px; color: #111; transition: background 0.2s; }
      .hit-fab-btn:hover{ background:#e0e7ff; }
      .hit-fab-sec{ margin-top:10px; padding-top:8px; border-top:1px dashed #e5e7eb; }
      .hit-fab-meta{ font-size:12px; color:#6b7280; }
      .hit-fab-kv{ display:flex; justify-content:space-between; gap:8px; font-size:12px; padding:4px 0; }

      @media (prefers-color-scheme: dark) {
        #hit-fab-panel { background: #1f2937; color: #f3f4f6; box-shadow: 0 16px 40px rgba(0,0,0,.5); }
        .hit-fab-btn { background: #374151; color: #e5e7eb; }
        .hit-fab-btn:hover { background: #4b5563; }
        .hit-fab-sec { border-top-color: #4b5563; }
        .hit-fab-meta { color: #9ca3af; }
      }
    `;
  }

  const mask = (str) => (!str ? t('val_unset') : '•'.repeat(Math.min(8, Math.max(6, Math.floor(str.length * 0.8)))));

  function renderFabStaticTexts() {
    // 标题与按钮文案
    if (!fabShadowRoot) return;
    const p = fabShadowRoot.getElementById('hit-fab-panel');
    if (!p) return;
    const titleEls = p.querySelectorAll('.hit-fab-title');
    if (titleEls[0]) titleEls[0].textContent = t('fab_title_links');
    if (titleEls[1]) titleEls[1].textContent = t('fab_title_tools');
    if (titleEls[2]) titleEls[2].textContent = t('fab_title_login');

    const btns = p.querySelectorAll('[data-goto]');
    btns.forEach((btn) => {
      const g = btn.getAttribute('data-goto');
      if (g === 'intranet') btn.textContent = t('common_intranet');
      if (g === 'extranet') btn.textContent = t('common_extranet');
      if (g === 'wlan') btn.textContent = t('common_wlan');
    });

    const btnSetU = fabShadowRoot.getElementById('hit-fab-set-username');
    const btnSetP = fabShadowRoot.getElementById('hit-fab-set-password');
    const btnTgl = fabShadowRoot.getElementById('hit-fab-toggle-autologin');
    const btnTglIdp = fabShadowRoot.getElementById('hit-fab-toggle-idp');
    const btnTrig = fabShadowRoot.getElementById('hit-fab-trigger-login');
    if (btnSetU) btnSetU.textContent = t('fab_set_user');
    if (btnSetP) btnSetP.textContent = t('fab_set_pass');
    if (btnTgl) btnTgl.textContent = t('fab_toggle_auto');
    if (btnTglIdp) btnTglIdp.textContent = t('fab_toggle_idp');
    if (btnTrig) btnTrig.textContent = t('fab_trigger_once');

    const btnWebVpn = fabShadowRoot.getElementById('hit-fab-tool-webvpn');
    if (btnWebVpn) btnWebVpn.textContent = t('tool_webvpn');

    const siteMeta = fabShadowRoot.getElementById('hit-fab-site-meta');
    if (siteMeta) siteMeta.textContent = isHitSite ? t('site_hit') : t('site_non');
  }

  // —— 提升为外层函数，便于 storage 变化时重渲染 ——
  async function renderFabKV() {
    if (!isHitSite || !fabShadowRoot) return;
    const kvBox = fabShadowRoot.getElementById('hit-fab-kv-box');
    if (!kvBox) return;
    const savedUsername = await store.get("username", "");
    const savedPassword = await store.get("password", "");
    const autoLogin = !!(await store.get("autoLogin", false));
    const idpAuth = !!(await store.get("idpAutoAuth", true));
    kvBox.innerHTML = `
      <div class="hit-fab-kv"><span>${t('kv_username')}</span><span>${savedUsername || t('val_unset')}</span></div>
      <div class="hit-fab-kv"><span>${t('kv_password')}</span><span>${savedPassword ? mask(savedPassword) : t('val_unset')}</span></div>
      <div class="hit-fab-kv"><span>${t('kv_autologin')}</span><span>${autoLogin ? t('val_on') : t('val_off')}</span></div>
      <div class="hit-fab-kv"><span>${t('kv_idp_auth')}</span><span>${idpAuth ? t('val_on') : t('val_off')}</span></div>
    `;
  }

  async function createFab() {
    if (document.getElementById('hit-fab-host')) return;

    const host = document.createElement('div');
    host.id = 'hit-fab-host';
    const shadow = host.attachShadow({ mode: 'open' });
    fabShadowRoot = shadow;

    const style = document.createElement('style');
    style.textContent = getFabCss();
    shadow.appendChild(style);

    const container = document.createElement('div');
    container.innerHTML = `
      <button id="hit-fab-toggle" title="HIT">HIT</button>
      <div id="hit-fab-panel" role="dialog" aria-label="HIT">
        <div class="hit-fab-title"></div>
        <div class="hit-fab-row">
          <button class="hit-fab-btn" data-goto="intranet"></button>
          <button class="hit-fab-btn" data-goto="extranet"></button>
          <button class="hit-fab-btn" data-goto="wlan"></button>
        </div>
        <div class="hit-fab-sec">
          <div class="hit-fab-title"></div>
          <div class="hit-fab-row">
             <button class="hit-fab-btn" id="hit-fab-tool-webvpn"></button>
          </div>
        </div>
        ${isHitSite ? `
          <div class="hit-fab-sec">
            <div class="hit-fab-title"></div>
            <div id="hit-fab-kv-box" class="hit-fab-meta"></div>
            <div class="hit-fab-row" style="margin-top:6px;">
              <button class="hit-fab-btn" id="hit-fab-set-username"></button>
              <button class="hit-fab-btn" id="hit-fab-set-password"></button>
              <button class="hit-fab-btn" id="hit-fab-toggle-autologin"></button>
              <button class="hit-fab-btn" id="hit-fab-toggle-idp"></button>
              <button class="hit-fab-btn" id="hit-fab-trigger-login" style="display:none;"></button>
            </div>
          </div>
        ` : ``}
        <div class="hit-fab-sec">
          <div class="hit-fab-kv"><span class="hit-fab-meta" id="hit-fab-site-meta"></span><span></span></div>
        </div>
      </div>
    `;
    while (container.firstChild) shadow.appendChild(container.firstChild);
    document.documentElement.appendChild(host);

    const panel = shadow.getElementById('hit-fab-panel');
    const toggle = shadow.getElementById('hit-fab-toggle');

    toggle.addEventListener('click', (e) => {
      e.stopPropagation(); panel.classList.toggle('open');
    });

    fabDocHandler = (e) => {
      // If click target is not the host, it means it's outside the shadow DOM (or at least outside our component)
      if (e.target !== host) {
        panel.classList.remove('open');
      }
    };
    document.addEventListener('click', fabDocHandler, true);

    panel.querySelectorAll('[data-goto]').forEach(btn => {
      btn.addEventListener('click', () => {
        const tgo = btn.getAttribute('data-goto');
        if (tgo === 'intranet') window.open(URL_INTRANET, '_self');
        else if (tgo === 'extranet') window.open(URL_EXTRANET, '_self');
        else if (tgo === 'wlan') window.open(URL_WLAN, '_self');
      });
    });

    renderFabStaticTexts();

    if (isHitSite) {
      await renderFabKV();

      shadow.getElementById('hit-fab-set-username').addEventListener('click', async () => {
        const cur = await store.get("username", "");
        const v = prompt(LANG === 'zh' ? "请输入用户名:" : "Enter username:", cur || "");
        if (v !== null) { await store.set("username", v); await renderFabKV(); alert(LANG === 'zh' ? "用户名已保存" : "Username saved"); }
      });
      shadow.getElementById('hit-fab-set-password').addEventListener('click', async () => {
        const cur = await store.get("password", "");
        const v = prompt(LANG === 'zh' ? "请输入密码:" : "Enter password:", cur || "");
        if (v !== null) { await store.set("password", v); await renderFabKV(); alert(LANG === 'zh' ? "密码已保存" : "Password saved"); }
      });
      shadow.getElementById('hit-fab-toggle-autologin').addEventListener('click', async () => {
        const cur = !!(await store.get("autoLogin", false));
        await store.set("autoLogin", !cur);
        await renderFabKV();
        alert(!cur ? (LANG === 'zh' ? "自动登录已开启" : "Auto-login enabled")
          : (LANG === 'zh' ? "自动登录已关闭" : "Auto-login disabled"));
      });
      shadow.getElementById('hit-fab-toggle-idp').addEventListener('click', async () => {
        const cur = !!(await store.get("idpAutoAuth", true));
        await store.set("idpAutoAuth", !cur);
        await renderFabKV();
        alert(!cur ? (LANG === 'zh' ? "校外授权自动同意已开启" : "IDP Auto-Auth enabled")
          : (LANG === 'zh' ? "校外授权自动同意已关闭" : "IDP Auto-Auth disabled"));
      });
      shadow.getElementById('hit-fab-trigger-login').addEventListener('click', () => {
        triggerAutoLoginOnce();
      });
    }

    shadow.getElementById('hit-fab-tool-webvpn').addEventListener('click', () => {
      const url = location.href;
      try {
        const urlObj = new URL(url);
        if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') return;

        const host = urlObj.hostname;
        const modifiedHost = host.replace(/\./g, '-');
        const finalHost = `${modifiedHost}-s.ivpn.hit.edu.cn:1080`;

        const newUrl = url.replace(host, finalHost).replace('https://', 'http://');
        window.open(newUrl, '_self');
      } catch (e) {
        console.error(e);
      }
    });
  }

  function destroyFab() {
    if (fabDocHandler) {
      document.removeEventListener('click', fabDocHandler, true);
      fabDocHandler = null;
    }
    document.getElementById('hit-fab-host')?.remove();
    fabShadowRoot = null;
  }

  // ====== 自动登录核心 ======
  async function doHitAutoLogin({ force = false } = {}) {
    if (!isHitSite && !force) return false;

    const savedUsername = await store.get("username", "");
    const savedPassword = await store.get("password", "");
    const autoLogin = !!(await store.get("autoLogin", false));

    const usernameInput = findUsernameInput();
    const passwordInput = findPasswordInput();
    const rememberMe = findRememberMe();
    const loginButton = findLoginButton();

    const errorTip = byIds(errorTip_ids);
    const captchaDlg = byIds(captcha_ids);

    if (errorTip && (errorTip.title?.includes("该账号非常用账号或用户名密码有误") ||
      errorTip.title?.includes("图形动态码错误"))) {
      await store.set("autoLogin", false);
      hideOverlay();
      alert((t('err_fail')) + errorTip.title + (t('err_autoclosed')));
      return true;
    }
    if (captchaDlg) {
      await store.set("autoLogin", false);
      hideOverlay();
      alert(t('err_captcha'));
      return true;
    }

    if (!usernameInput || !passwordInput) return false;

    showOverlay();

    if (savedUsername) setInputValue(usernameInput, savedUsername);
    if (savedPassword) setInputValue(passwordInput, savedPassword);
    if (rememberMe) rememberMe.checked = true;

    if (!autoLogin && !force) {
      setTimeout(() => { if (!interrupted) hideOverlay(); }, 150);
      return true;
    }

    if (loginButton) {
      setTimeout(() => {
        if (!interrupted) { try { loginButton.click(); } catch (_) { } }
      }, 150);
    }

    pollTimer = setInterval(() => {
      if (interrupted) { hideOverlay(); return; }
      if (pageLooksLoggedIn()) { hideOverlay(); }
    }, 500);

    return true;
  }

  function autoLoginWithRetry() {
    if (!isHitSite) return;
    const deadline = Date.now() + 10000;
    const tid = setInterval(async () => {
      const done = await doHitAutoLogin();
      if (done || Date.now() > deadline) clearInterval(tid);
    }, 300);
  }

  function triggerAutoLoginOnce() {
    doHitAutoLogin({ force: true });
  }

  async function handleIdpAuth() {
    if (location.hostname !== 'idp.hit.edu.cn') return;

    // 检查开关
    const enabled = !!(await store.get("idpAutoAuth", true));
    if (!enabled) return;

    // 1. 身份认证与隐私声明页
    // 页面特征：checkbox#accept, button[name="_eventId_proceed"]
    const acceptBox = document.getElementById('accept');
    const proceedBtn = document.querySelector('button[name="_eventId_proceed"]');

    if (acceptBox && proceedBtn) {
      // 自动勾选
      if (!acceptBox.checked) {
        acceptBox.checked = true;
        acceptBox.dispatchEvent(new Event('change', { bubbles: true }));
      }
      // 提交
      setTimeout(() => {
        proceedBtn.click();
      }, 200);

      showOverlay();
      const msg = document.getElementById('hit-overlay-msg');
      if (msg) msg.textContent = "正在自动同意校外访问授权...";
      return;
    }

    // 2. 信息发布页 (Information Release)
    // 页面特征：input[value="_shib_idp_globalConsent"], button[name="_eventId_proceed"]
    const globalConsentRadio = document.querySelector('input[type="radio"][value="_shib_idp_globalConsent"]');

    if (globalConsentRadio && proceedBtn) {
      // 选中“不要再次提示我”
      if (!globalConsentRadio.checked) {
        globalConsentRadio.checked = true;
        globalConsentRadio.dispatchEvent(new Event('change', { bubbles: true }));
      }
      // 提交
      setTimeout(() => {
        proceedBtn.click();
      }, 200);

      showOverlay();
      const msg = document.getElementById('hit-overlay-msg');
      if (msg) msg.textContent = "正在自动同意信息发布...";
    }
  }

  async function boot() {
    LANG = await store.get('lang', 'zh');
    const fabOn = await store.get(FAB_KEY, true);
    if (fabOn) await createFab();

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        autoLoginWithRetry();
        handleIdpAuth();
      });
      window.addEventListener('load', () => {
        autoLoginWithRetry();
        handleIdpAuth();
      });
    } else {
      autoLoginWithRetry();
      handleIdpAuth();
      window.addEventListener('load', () => {
        autoLoginWithRetry();
        handleIdpAuth();
      });
    }
  }
  boot();

  // ========== 联动：消息 + storage 监听 ==========
  chrome.runtime.onMessage.addListener(async (msg, sender, sendResponse) => {
    if (msg?.type === "HIT_TRIGGER_LOGIN") {
      triggerAutoLoginOnce();
      sendResponse?.({ ok: true });
      return true;
    }
    if (msg?.type === "HIT_SET_FAB" && typeof msg.enabled === "boolean") {
      await store.set(FAB_KEY, msg.enabled);
      if (msg.enabled) await createFab(); else destroyFab();
      sendResponse?.({ ok: true });
      return true;
    }
  });

  chrome.storage.onChanged.addListener(async (changes, area) => {
    if (area !== 'local') return;

    if ('fabEnabled' in changes) {
      const on = !!changes.fabEnabled.newValue;
      on ? createFab() : destroyFab();
    }
    if ('username' in changes || 'password' in changes || 'autoLogin' in changes || 'idpAutoAuth' in changes) {
      renderFabKV();
    }
    if ('lang' in changes) {
      LANG = changes.lang.newValue || 'zh';
      // 语言切换：刷新 FAB 和遮罩文案
      renderFabStaticTexts();
      renderFabKV();
      renderOverlayTexts();
    }
  });

  // 暴露给页面（可选）
  window.HITLoginAuto2 = { setCustomIds, triggerLogin: triggerAutoLoginOnce, showOverlay, hideOverlay };
})();
