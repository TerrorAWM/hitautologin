# HIT AutoLogin iOS App Version (`ios-app.js`)

`ios-app.js` 是专门为 HIT AutoLogin iOS App 准备的脚本版本。它与通用的 Userscript (`hit_autologin.js`) 功能一致，但包含了特定的元数据以配合 App 的脚本管理和更新机制。

## 主要区别

### 1. 专用标识符 (`@ios-app-id`)

为了让 iOS App 识别并正确管理此脚本，我们在元数据中添加了 `@ios-app-id` 字段：

```javascript
// @ios-app-id   hit_autologin_ios
```

App 会读取此字段以确认脚本身份，而不只依赖 `@name` 或 `@namespace`。

### 2. 更新机制适配

此脚本作为 iOS App 的内置或推荐更新源。App 内置的 `ScriptUpdateService` 会检查此脚本的更新。

**校验规则**:
- `@name` 必须为 `HIT 校园网站自动登录2.0`
- `@namespace` 必须为 `https://github.com/TerrorAWM`

## 连接 App 的特殊字段与通信

虽然脚本本身通过 Safari Web Extension 运行，但它可以通过 `GM_` 函数（由 App 的 Extension Handler 注入）获取 App 设置。

### 1. 配置注入

App 的 `content.js` 会通过 Native Messaging 从 App 获取设置，并注入到脚本的执行环境中：

- `GM_getValue("username")`: 获取 App 中保存的用户名。
- `GM_getValue("password")`: 获取 App Keychain 中保存的密码。
- `GM_getValue("autoLogin")`: 获取“自动登录”开关状态。
- `GM_getValue("idpAutoAuth")`: 获取“校外授权自动同意”开关状态。

### 2. ID 选择器配置

脚本使用一组可配置的 ID 列表来查找登录表单元素。如果由于学校网页更新导致 ID 变更，可以通过 `window.HITLoginAuto2.setCustomIds(options)` 进行运行时热修复（虽然 App 目前未直接暴露此 UI，但脚本支持此扩展性）。

```javascript
let username_ids = ["username", "user", "loginUser", "IDToken1"];
let password_ids = ["password", "passwd", "loginPwd", "IDToken2"];
// ...
```
