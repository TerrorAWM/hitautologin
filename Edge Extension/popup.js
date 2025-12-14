// popup.js — i18n + 即改即生效
const $ = (id) => document.getElementById(id);

// storage helpers
const get = (key, defVal) => new Promise(res => chrome.storage.local.get([key], o => res(o[key] !== undefined ? o[key] : defVal)));
const set = (key, val) => new Promise(res => chrome.storage.local.set({ [key]: val }, res));
function debounce(fn, ms = 500) { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; }

const I18N = {
  zh: {
    title: "HIT 自动登录",
    help: "使用教程",
    lang: " ",
    username: "用户名",
    user_ph: "学号/用户名",
    password: "密码",
    pass_ph: "密码",
    auto: "开启自动登录",
    fab: "显示悬浮按钮",
    saved_user: "用户名已自动保存",
    saved_pass: "密码已自动保存",
    enabled_auto: "已开启自动登录",
    disabled_auto: "已关闭自动登录",
    show_fab: "已显示悬浮按钮",
    hide_fab: "已隐藏悬浮按钮",
    cant_inject: "当前页面无法注入脚本，切换将于刷新后生效",
    hint: "提示：在 HIT 域名页面将自动尝试登录。",
    idp_auth: "自动同意校外授权",
    enabled_idp: "已开启自动授权",
    disabled_idp: "已关闭自动授权",
    webvpn_reload: "通过 WebVPN 访问",
    invalid_url: "无效的 URL"
  },
  en: {
    title: "HIT Auto Login",
    help: "Help",
    lang: " ",
    username: "Username",
    user_ph: "Username/ID",
    password: "Password",
    pass_ph: "Password",
    auto: "Enable Auto Login",
    fab: "Show Floating Button",
    saved_user: "Username saved automatically",
    saved_pass: "Password saved automatically",
    enabled_auto: "Auto login enabled",
    disabled_auto: "Auto login disabled",
    show_fab: "Floating button shown",
    hide_fab: "Floating button hidden",
    cant_inject: "This page blocks injection. Change takes effect after refresh.",
    hint: "Hint: Auto login triggers on HIT domains.",
    idp_auth: "Auto Authorize Off-campus",
    enabled_idp: "Auto auth enabled",
    disabled_idp: "Auto auth disabled",
    webvpn_reload: "Access via WebVPN",
    invalid_url: "Invalid URL"
  }
};
let LANG = 'zh';
const tr = (k) => (I18N[LANG] || I18N.zh)[k] || k;

function applyI18n() {
  $('ttl').textContent = tr('title');
  $('langLabel').textContent = tr('lang');
  $('help').title = tr('help');
  $('labUser').textContent = tr('username');
  $('username').placeholder = tr('user_ph');
  $('labPass').textContent = tr('password');
  $('password').placeholder = tr('pass_ph');
  $('kvAuto').textContent = tr('auto');
  $('kvAuto').textContent = tr('auto');
  $('kvFab').textContent = tr('fab');
  $('kvIdp').textContent = tr('idp_auth');
  $('btnWebVpn').textContent = tr('webvpn_reload');
  $('hint').textContent = tr('hint');
}

const showMsg = (txt) => {
  $('hint').textContent = txt;
  setTimeout(() => { $('hint').textContent = tr('hint'); }, 1500);
};

async function sendToActiveOrInject(msg) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return false;
  try {
    await chrome.tabs.sendMessage(tab.id, msg);
    return true;
  } catch {
    try {
      await chrome.scripting.executeScript({ target: { tabId: tab.id }, files: ['content.js'] });
      await chrome.tabs.sendMessage(tab.id, msg);
      return true;
    } catch {
      return false;
    }
  }
}

async function init() {
  LANG = await get('lang', 'zh');
  $('lang').value = LANG;

  $('username').value = await get('username', '');
  $('password').value = await get('password', '');
  $('autologin').checked = !!(await get('autoLogin', false));
  $('fab').checked = !!(await get('fabEnabled', true));
  $('idpAuth').checked = !!(await get('idpAutoAuth', true));

  applyI18n();
}
init();

// 语言切换
$('lang').addEventListener('change', async (e) => {
  LANG = e.target.value;
  await set('lang', LANG);
  applyI18n();
});

// 自动保存用户名/密码
const saveUser = debounce(async () => {
  await set('username', $('username').value.trim());
  showMsg(tr('saved_user'));
});
const savePass = debounce(async () => {
  await set('password', $('password').value);
  showMsg(tr('saved_pass'));
});
$('username').addEventListener('input', saveUser);
$('username').addEventListener('blur', saveUser);
$('password').addEventListener('input', savePass);
$('password').addEventListener('blur', savePass);

// 开关：立即写入 + 尝试通知当前页（FAB 显/隐需要实时更新）
$('autologin').addEventListener('change', async (e) => {
  await set('autoLogin', e.target.checked);
  showMsg(e.target.checked ? tr('enabled_auto') : tr('disabled_auto'));
});

$('fab').addEventListener('change', async (e) => {
  const enabled = e.target.checked;
  await set('fabEnabled', enabled);
  const ok = await sendToActiveOrInject({ type: 'HIT_SET_FAB', enabled });
  showMsg(ok
    ? (enabled ? tr('show_fab') : tr('hide_fab'))
    : tr('cant_inject'));
});

$('idpAuth').addEventListener('change', async (e) => {
  await set('idpAutoAuth', e.target.checked);
  showMsg(e.target.checked ? tr('enabled_idp') : tr('disabled_idp'));
});

// 右上角“？” → 打开内置教程
document.getElementById('help').addEventListener('click', async (e) => {
  e.preventDefault();
  const url = chrome.runtime.getURL('help.html');
  await chrome.tabs.create({ url });
});

// WebVPN Reload Logic
function getWebVpnUrl(url) {
  try {
    const urlObj = new URL(url);
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') return null;

    const host = urlObj.hostname;
    const modifiedHost = host.replace(/\./g, '-');
    const finalHost = `${modifiedHost}-s.ivpn.hit.edu.cn:1080`;

    return url.replace(host, finalHost).replace('https://', 'http://');
  } catch (e) {
    return null;
  }
}

$('btnWebVpn').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.url) return;

  const newUrl = getWebVpnUrl(tab.url);
  if (newUrl) {
    chrome.tabs.update(tab.id, { url: newUrl });
  } else {
    showMsg(tr('invalid_url') || "Invalid URL");
  }
});
