// background.js (Firefox MV2 persistent script) — i18n + 菜单动态更新
// Firefox 支持 chrome.* API，但也支持 browser.* API
// 为了兼容性，这里保持使用 chrome.* API（Firefox 会自动适配）

// 简单存储读
const get = (k, d) => new Promise(res => chrome.storage.local.get([k], o => res(o[k] !== undefined ? o[k] : d)));
const set = (k, v) => new Promise(res => chrome.storage.local.set({ [k]: v }, res));

// 语言包
function t(lang, key) {
  const L = {
    zh: { menu_manual: "HIT: 手动接管登录" },
    en: { menu_manual: "HIT: Trigger Login Manually" }
  };
  return (L[lang] || L.zh)[key] || key;
}

async function createOrUpdateMenu() {
  const lang = await get('lang', 'zh');
  const title = t(lang, 'menu_manual');
  try {
    await chrome.contextMenus.update("hit_trigger_login", { title });
  } catch {
    chrome.contextMenus.create({
      id: "hit_trigger_login",
      title,
      contexts: ["all"]
    });
  }
}

// 安装/更新时创建右键菜单
chrome.runtime.onInstalled.addListener(createOrUpdateMenu);

// 监听语言变化，实时更新菜单
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === 'local' && 'lang' in changes) {
    createOrUpdateMenu();
  }
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "hit_trigger_login" && tab && tab.id) {
    try {
      await chrome.tabs.sendMessage(tab.id, { type: "HIT_TRIGGER_LOGIN" });
    } catch (e) {
      // Firefox 的 content script 在 MV2 中应该已经自动注入了
      // 如果失败，可能是页面还没加载完成，忽略即可
      console.warn("无法触发手动接管登录: ", e);
    }
  }
});
