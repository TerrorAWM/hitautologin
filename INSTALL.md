# 安装教程

---

## 选择适合你的版本


| 你的情况                  | 推荐版本            |
| ------------------------- | ------------------- |
| 使用 Chrome 浏览器        | Chrome 插件版       |
| 使用 Edge 浏览器          | Edge 扩展版         |
| 使用 Firefox 浏览器       | Firefox 扩展版      |
| 其他浏览器 / 不想安装扩展 | Tampermonkey 脚本版 |

---

## Firefox 扩展版

1. 打开 [Firefox Add-ons 商店](https://addons.mozilla.org/zh-CN/firefox/addon/hit-%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95-2-0/)
2. 点击「添加到 Firefox」
3. 完成

---

## Tampermonkey 脚本版

### 第一步：安装 Tampermonkey 扩展

根据你的浏览器，点击对应链接安装 Tampermonkey：

- [Chrome 版 Tampermonkey](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Edge 版 Tampermonkey](https://microsoftedge.microsoft.com/addons/detail/tampermonkey/iikmkjmpaadaobahmlepeloendndfphd)
- [Firefox 版 Tampermonkey](https://addons.mozilla.org/firefox/addon/tampermonkey/)
- [Safari 版 Tampermonkey](https://apps.apple.com/app/tampermonkey/id1482490089)

### 第二步：安装脚本

1. 打开 [GreasyFork 脚本页面](https://greasyfork.org/zh-CN/scripts/507678-hit-%E6%A0%A1%E5%9B%AD%E7%BD%91%E7%AB%99%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%952-0)
2. 点击绿色的「安装此脚本」按钮
3. 在弹出的页面点击「安装」
4. 完成

---

## Chrome 插件版

### 第一步：下载插件文件

1. 在本仓库页面，点击绿色的 **Code** 按钮
2. 选择 **Download ZIP**
3. 解压下载的 ZIP 文件

### 第二步：安装插件

1. 打开 Chrome 浏览器
2. 在地址栏输入 `chrome://extensions/` 并回车
3. 打开右上角的「开发者模式」开关
4. 点击「加载已解压的扩展程序」
5. 选择解压后的 `Chrome Extension` 文件夹
6. 完成，你会在浏览器右上角看到 HIT 图标

---

## Edge 扩展版

> Edge Add-ons 商店审核中，目前请使用手动安装方式。

### 第一步：下载扩展文件

1. 在本仓库页面，点击绿色的 **Code** 按钮
2. 选择 **Download ZIP**
3. 解压下载的 ZIP 文件

### 第二步：安装扩展

1. 打开 Edge 浏览器
2. 在地址栏输入 `edge://extensions/` 并回车
3. 打开左下角的「开发人员模式」开关
4. 点击「加载解压缩的扩展」
5. 选择解压后的 `Edge Extension` 文件夹
6. 完成，你会在浏览器工具栏看到 HIT 图标

---

## 安装后配置

无论你安装的是哪个版本，第一次使用都需要设置账号密码：

### 方法一：通过扩展弹出页

1. 点击浏览器右上角的 HIT 图标
2. 输入你的校园网用户名和密码
3. 开启「自动登录」开关
4. 设置会自动保存

### 方法二：通过悬浮按钮

1. 在任意网页右下角找到「HIT」悬浮按钮
2. 点击展开面板
3. 点击「设置用户名」和「设置密码」
4. 点击「切换自动登录」开启

---

## 常见问题

### Q：安全吗？密码会被上传吗？

所有账号密码只保存在你的浏览器本地，不会上传到任何服务器。

### Q：支持哪些 HIT 网站？

支持所有 `*.hit.edu.cn` 域名的登录页面，包括：

- 统一身份认证 (ids.hit.edu.cn)
- 校园网登录 (webportal.hit.edu.cn)
- WebVPN (ivpn.hit.edu.cn)
- 教务系统、图书馆等

### Q：悬浮按钮挡住了页面内容怎么办？

点击悬浮按钮展开后，可以在扩展设置中关闭「显示悬浮按钮」。

### Q：自动登录失败了怎么办？

1. 确认用户名和密码输入正确
2. 如果出现验证码，脚本会自动暂停，请手动完成验证
3. 某些页面可能需要手动点击登录按钮

---

## 需要帮助？

如果遇到问题，欢迎在 [GitHub Issues](https://github.com/TerrorAWM/hitautologin/issues) 提问。
