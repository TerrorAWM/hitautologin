# HIT 校园网站自动登录脚本

> 一位被 HIT 本科教育系统反复登录"折磨到疯"的同学写下的脚本；既能**自动填**也能**自动登**，还提供**悬浮入口**随时直达校园服务。

<img src="https://github.com/user-attachments/assets/dbd0b218-d5a6-486a-a00b-75a23713fe98" width="60%" />

## 项目简介

`HIT 校园网站自动登录脚本` 是一个基于 Tampermonkey / Chrome 扩展 / Firefox 扩展的自动化登录工具，可以在 HIT 各类登录页面自动填充账号密码并自动登录，同时在所有网页右下角显示可折叠的「HIT」悬浮入口，且有随时跳转 HIT 内网 / 外网 / HIT-WLAN，尽量把"反复登录"这件事从你的日常里抹掉。

- **脚本名**：HIT 校园网站自动登录 2.0
- **当前版本**：`v1.3.4`
- **授权协议**：MIT

---

## 快速开始

请查看 → [**安装教程 (INSTALL.md)**](./INSTALL.md)

### 发布平台


| 平台         | 安装方式                                                                                                                                         | 状态       |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- |
| Firefox      | [Add-ons 商店](https://addons.mozilla.org/zh-CN/firefox/addon/hit-%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95-2-0/) | 已上架     |
| Edge         | [Add-ons 商店](https://microsoftedge.microsoft.com/addons/detail/hit-%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95-20/dlpdlfndlmeaepiabdonndfbjpdciefo) | 已上架     |
| Tampermonkey | [GreasyFork](https://greasyfork.org/zh-CN/scripts/507678-hit-%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%952-0)        | 已上架     |
| Chrome       | 手动加载扩展 ([教程](./INSTALL.md#chrome-插件版))                                                                                                | -          |
| iOS (Safari) | TestFlight 内测 ([安装教程](./IOS_test.md))                                                                                                      | 内测中     |

### 生效范围

- **悬浮入口**：全站生效
- **自动填充/自动登录**：仅在 HIT 域名生效（如 `*.hit.edu.cn`、`ivpn.hit.edu.cn`、`webportal.hit.edu.cn` 等）

---

## 功能对比


| 功能                                     | Chrome 插件版 | Firefox 扩展版 | Edge 扩展版 | Tampermonkey 版 |
| ---------------------------------------- | ------------- | -------------- | ----------- | --------------- |
| 自动识别 HIT 登录页面并填充账号          | ✅            | ✅             | ✅          | ✅              |
| 自动点击登录按钮                         | ✅            | ✅             | ✅          | ✅              |
| 检测错误提示与验证码                     | ✅            | ✅             | ✅          | ✅              |
| 悬浮操作面板（FAB）                      | ✅            | ✅             | ✅          | ✅              |
| 弹出页配置（用户名、密码、自动登录开关） | ✅            | ✅             | ✅          | ✅（轻量版）    |
| 设置实时保存                             | ✅            | ✅             | ✅          | ✅（轻量版）    |
| 实时同步（账号/密码/状态动态刷新）       | ✅            | ✅             | ✅          | ✅（轻量版）    |
| 动态注入脚本                             | ✅            | ✅             | ✅          | ⚠️ 需更新     |
| 翻译功能                                 | 💡 未启用     | 💡 未启用      | 💡 未启用   | ❌              |
| 自动关闭功能（检测错误或验证码）         | ✅            | ✅             | ✅          | ✅              |
| "接管中"浮层                             | ✅            | ✅             | ✅          | ✅              |
| 通过 WebVPN 访问                         | ✅            | ✅             | ✅          | ✅              |
| 校外访问自动授权                         | ✅            | ✅             | ✅          | ✅              |
| 暗色模式适配                             | ✅            | ✅             | ✅          | ✅              |

---

## 项目结构

```bash
hitautologin/
├── Chrome Extension/
│   ├── manifest.json
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   └── help.html
│
├── Edge Extension/
│   ├── manifest.json (Manifest V3)
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   └── help.html
│
├── Firefox Extension/
│   ├── manifest.json (Manifest V2)
│   ├── background.js
│   ├── content.js
│   ├── popup.html
│   ├── popup.js
│   └── help.html
│
└── Tampermonkey/
    └── app.js
```

---

## 隐私说明

- 所有账号密码仅保存在本地（`chrome.storage` 或 `GM_setValue`）
- 不上传、不联网、不共享
- 推荐在**个人设备**上使用

---

## API 使用

脚本在 `window` 暴露对象：`HITLoginAuto2`

### 覆盖选择器

```js
HITLoginAuto2.setCustomIds({
  username_ids: ["IDToken1", "username"],
  password_ids: ["IDToken2", "password"]
});
```

### 手动触发登录

```js
HITLoginAuto2.triggerLogin();
```

### 控制浮层

```js
HITLoginAuto2.showOverlay("自动填充中...");
HITLoginAuto2.hideOverlay();
```

---

## 更新记录

详细更新记录请查看 [HISTORY.md](./HISTORY.md)


| 版本   | 日期       | 内容                                                                  |
| ------ | ---------- | --------------------------------------------------------------------- |
| v1.3.2 | 2026-01-04 | 系统更新弹窗自动刷新、Float Button 位置自动调整、修复 mail.hit.edu.cn 兼容性 |
| v1.3.1 | 2025-12-03 | 修复 Firefox/Safari 显示 Bug (Shadow DOM 重构)；发布 Firefox 扩展版本 |
| v1.3.0 | 2025-11-21 | 新增 WebVPN、校外授权自动同意、暗色模式适配                           |
| v1.2.2 | 2025-11-04 | Chrome 插件增强：实时同步、动态 FAB、帮助页                           |
| v1.2.1 | 2025-11    | Tampermonkey 新增悬浮入口                                             |
| v1.0.0 | 2024-09    | 初版发布                                                              |

---

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=TerrorAWM/hitautologin&type=date&legend=bottom-right)](https://www.star-history.com/#TerrorAWM/hitautologin&type=date&legend=bottom-right)

---

## 免责声明

本脚本/扩展仅供**个人学习与研究**使用。

1. **法律责任**：作者不对使用本软件产生的任何直接或间接后果（包括但不限于账号被封禁、信息泄露等）承担任何法律责任。用户应自行承担使用风险。
2. **数据安全**：本软件所有账号密码数据仅保存在用户本地浏览器环境（`chrome.storage` 或 `GM_setValue`），绝不上传、不分享、不收集任何用户隐私信息。
3. **合规性**：请遵守哈尔滨工业大学相关网络安全规定，勿将本工具用于任何非授权或恶意用途。
4. **已知缺陷**：软件可能存在未知 Bug，作者会尽力维护但不保证完全无误，亦不保证永久可用。

**下载或使用本软件即代表您完全接受上述条款。**

---

## 交流与反馈

**QQ群：1072138406**

- 获取 iOS TestFlight 内测链接
- 讨论工具使用问题
- 反馈 Bug 和建议

---

## 作者

**Ricardo Zheng**
GitHub: [@TerrorAWM](https://github.com/TerrorAWM)
MIT License © 2025
