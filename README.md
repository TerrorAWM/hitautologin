# HIT 校园网站自动登录脚本

> 一位被 HIT 本科教育系统反复登录“折磨到疯”的同学写下的脚本；既能**自动填**也能**自动登**，还提供**悬浮入口**随时直达校园服务。

<img src="https://github.com/user-attachments/assets/dbd0b218-d5a6-486a-a00b-75a23713fe98" width="60%" />

## 项目简介

`HIT 校园网站自动登录脚本` 是一个基于 Tampermonkey / Chrome 扩展 / Firefox 扩展的自动化登录工具，可以在 HIT 各类登录页面自动填充账号密码并自动登录，同时在所有网页右下角显示可折叠的「HIT」悬浮入口，且有随时跳转 HIT 内网 / 外网 / HIT-WLAN，尽量把“反复登录”这件事从你的日常里抹掉。

- **脚本名**：HIT 校园网站自动登录 2.0
- **当前版本**：`v1.3.1`
- **授权协议**：MIT
- **发布平台**：
  - **GreasyFork**：[https://greasyfork.org/zh-CN/scripts/507678](https://greasyfork.org/zh-CN/scripts/507678-hit-%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%952-0)
  - **Firefox Add-ons**：[https://addons.mozilla.org/zh-CN/firefox/addon/hit-校园网站自动登录-2-0/](https://addons.mozilla.org/zh-CN/firefox/addon/hit-%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95-2-0/)
  - **Microsoft Edge Add-ons**：*(审核中)*
- **生效范围**：
  - **悬浮入口**：全站生效
  - **自动填充/自动登录**：仅在 HIT 域名生效（如 `*.hit.edu.cn`、`ivpn.hit.edu.cn`、`webportal.hit.edu.cn` 等）

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
| 动态注入脚本                             | ✅            | ✅             | ✅          | ⚠️ 需更新       |
| 翻译功能                                 | 💡 未启用     | 💡 未启用      | 💡 未启用   | ❌              |
| 自动关闭功能（检测错误或验证码）         | ✅            | ✅             | ✅          | ✅              |
| "接管中"浮层                             | ✅            | ✅             | ✅          | ✅              |
| 通过 WebVPN 访问                         | ✅            | ✅             | ✅          | ✅              |
| 校外访问自动授权                         | ✅            | ✅             | ✅          | ✅              |
| 暗色模式适配                             | ✅            | ✅             | ✅          | ✅              |

---

## Chrome 插件版

### 安装步骤

1. 打开 `chrome://extensions/`
2. 启用右上角 **开发者模式**
3. 点击“加载已解压的扩展程序”
4. 选择 `Chrome Extension` 文件夹

安装成功后，可在右上角看到 “HIT 自动登录” 图标。

安装成功后，可在右上角看到 “HIT 自动登录” 图标。

---

## Edge 扩展版

### 安装步骤

1. 打开 `edge://extensions/`
2. 开启左下角 **开发人员模式**
3. 点击“加载解压缩的扩展”
4. 选择 `Edge Extension` 文件夹

安装成功后，可在工具栏看到图标。

---

## Firefox 扩展版

### 安装步骤

#### 方式一：通过 Firefox Add-ons 商店安装（推荐）

直接访问 [Firefox Add-ons 商店](https://addons.mozilla.org/zh-CN/firefox/addon/hit-%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95-2-0/)，点击「添加到 Firefox」即可安装。

#### 方式二：手动安装（开发者模式）

1. 打开 `about:debugging`
2. 点击「此 Firefox」
3. 点击「临时载入附加组件」
4. 选择 `Firefox Extension` 文件夹中的 `manifest.json` 文件

安装成功后，可在右上角看到 "HIT 自动登录" 图标。

### 功能说明

Firefox 扩展版功能与 Chrome 插件版完全一致，包括弹出页配置、悬浮面板（FAB）、校外访问自动授权、WebVPN 访问、实时同步更新以及内置使用教程等所有功能。

---

## Chrome / Edge / Firefox 插件功能说明

#### 弹出页（Popup）

- 自动保存用户名、密码
- 动态实时保存设置
- 开关选项：
  - **开启自动登录**
  - **显示悬浮按钮（FAB）**
  - **自动同意校外授权**
- 通过 WebVPN 访问：一键通过 WebVPN 访问当前页
- 右上角 “？” 打开内置 **help.html** 教程页面

#### 悬浮面板（FAB）

右下角点击 “HIT” 可展开：

- 快捷入口：HIT 内网 / 外网 / WLAN
- 通过 WebVPN 访问：一键通过 WebVPN 访问当前站点，轻松获取学术资源或访问校内服务
- 登录助手：查看当前用户名、密码掩码、自动登录状态
- 一键设置用户名/密码
- 一键切换自动登录 / 校外授权
- 手动触发登录流程

实时同步更新，无需刷新页面。

#### 其他增强

- **校外访问自动授权**：自动勾选并提交校外访问授权页面的同意条款（支持在 FAB 中一键开关）。

#### 同步机制

当你在弹出页修改用户名或密码时：

- 悬浮面板会**即时刷新**显示新值
- 自动登录与 FAB 开关**实时同步**
- 无需手动刷新页面

#### 使用教程（help.html）

点击右上角 “？” 按钮跳转到扩展内的教程页面，包含：

- 安装说明
- 功能介绍
- 常见问题
- 调试与隐私说明

---

## Tampermonkey 版

### 简介

Tampermonkey 脚本与 Chrome 插件共用核心逻辑，代码基本一致，去除了扩展 API，仅依赖 `GM_*` 接口完成存储与菜单交互。

### 安装方式

#### 推荐方式（自动更新）

前往 [GreasyFork](https://greasyfork.org/zh-CN/scripts/507678-hit-%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%952-0)，点击 **安装此脚本**。
安装后即可自动更新至最新版本。

#### 手动安装方式

1. 安装浏览器扩展 **Tampermonkey**
2. 点击「添加新脚本」
3. 将 `Tampermonkey/app.js` 内容复制进去并保存
4. 打开 HIT 登录页测试效果

### 功能总览

1. **自动填充用户名与密码**
2. **自动勾选“一周内免登录”**
3. **自动登录（可开关）**
4. **错误与验证码检测（自动关闭自动登录）**
5. **“接管中”浮层（可中断）**
6. **全站悬浮入口（右下角 HIT）**
7. **一键开/关悬浮按钮**
8. **可自定义选择器（API）**

### 快速开始

1. 安装脚本后访问任意 HIT 登录页（如 `https://ids.hit.edu.cn/`）
2. 通过菜单：
   - 设置用户名 / 密码
   - 开启或关闭自动登录
3. 任意页面右下角点击 **HIT** 可展开悬浮入口

---

## 适配范围

- 悬浮入口：`http://*/*`、`https://*/*`
- 自动登录域名：
  - `*.hit.edu.cn`
  - `ivpn.hit.edu.cn`
  - `webportal.hit.edu.cn`

---

## 隐私说明

- 所有账号密码仅保存在本地（`chrome.storage` 或 `GM_setValue`）。
- 不上传、不联网、不共享。
- 推荐在**个人设备**上使用。

---

## API 使用

脚本在 `window` 暴露对象：`HITLoginAuto2`

### 1. 覆盖选择器

```js
HITLoginAuto2.setCustomIds({
  username_ids: ["IDToken1", "username"],
  password_ids: ["IDToken2", "password"]
});
```

### 2. 手动触发登录

```js
HITLoginAuto2.triggerLogin();
```

### 3. 控制浮层

```js
HITLoginAuto2.showOverlay("自动填充中...");
HITLoginAuto2.hideOverlay();
```

---

## 作者

**Ricardo Zheng**
GitHub: [@TerrorAWM](https://github.com/TerrorAWM)
MIT License © 2025

---

## 更新记录

详细更新记录请查看 [HISTORY.md](./HISTORY.md)


| 版本   | 日期       | 内容                                                                       |
| ------ | ---------- | -------------------------------------------------------------------------- |
| v1.3.1 | 2025-12-03 | 修复 Firefox/Safari 显示 Bug (Shadow DOM 重构)；发布 Firefox 扩展版本      |
| v1.3.0 | 2025-11-21 | 新增 WebVPN、校外授权自动同意、暗色模式适配                                |
| v1.2.2 | 2025-11-04 | Chrome 插件增强：实时同步、动态 FAB、帮助页                                |
| v1.2.1 | 2025-11    | Tampermonkey 新增悬浮入口                                                  |
| v1.0.0 | 2024-09    | 初版发布                                                                   |

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
