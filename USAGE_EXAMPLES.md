# 📚 自动化采集工具 - 使用示例

本文档提供详细的实际使用场景和示例。

## 场景 1：自动签到系统

**需求**：自动访问多个网站并点击签到按钮

### 配置步骤

1. **第一个链接**
   - URL: `https://example1.com/signin`
   - 选择器: `button.sign-in-btn`
   - 延迟: 2000ms

2. **第二个链接**
   - URL: `https://example2.com/check-in`
   - 选择器: `.daily-checkin`
   - 延迟: 2500ms

3. **第三个链接**
   - URL: `https://example3.com/sign`
   - 选择器: `#attendance-btn`
   - 延迟: 2000ms

### 配置检查

选中选项：
- ✅ 页面弹出后自动关闭标签页
- ✅ 自动打开下一个链接

### 运行结果

扩展会：
1. 打开 example1.com，等待 2 秒后点击签到按钮
2. 关闭该标签页，打开 example2.com，等待 2.5 秒后点击
3. 关闭该标签页，打开 example3.com，等待 2 秒后点击
4. 完成所有操作并显示成功提示

---

## 场景 2：自动任务收集

**需求**：游戏中自动点击领取任务奖励

### 配置步骤

1. **收集每日奖励**
   - URL: `https://game.example.com/rewards/daily`
   - 选择器: `.claim-reward`
   - 延迟: 1500ms

2. **收集新手奖励**
   - URL: `https://game.example.com/rewards/beginner`
   - 选择器: `button[data-reward="starter"]`
   - 延迟: 1500ms

3. **完成首次任务**
   - URL: `https://game.example.com/quests/first`
   - 选择器: `.complete-quest`
   - 延迟: 2000ms

### 选择器查找方法

**如何找到正确的选择器：**

```
1. 打开浏览器开发者工具（F12）
2. 右键点击要点击的元素
3. 选择"检查"或 "Inspect"
4. 在 HTML 代码中找到该元素
5. 复制相关的 class 或 id

示例代码：
<button class="claim-reward" data-id="123">领取奖励</button>

可用选择器：
- .claim-reward
- button[data-id="123"]
- [data-id="123"]
```

---

## 场景 3：批量表单提交

**需求**：依次打开多个表单并提交

### 配置步骤

1. **问卷调查 1**
   - URL: `https://survey.example.com/form1`
   - 选择器: `input[type="submit"]`
   - 延迟: 3000ms

2. **问卷调查 2**
   - URL: `https://survey.example.com/form2`
   - 选择器: `button.submit-form`
   - 延迟: 3000ms

3. **反馈表单**
   - URL: `https://feedback.example.com`
   - 选择器: `#submit-feedback`
   - 延迟: 2500ms

### 提示

- 确保每个表单已自动填充（或表单不需要填充）
- 调整延迟时间确保页面完全加载
- 在实际运行前测试每个链接和选择器

---

## 场景 4：链式操作

**需求**：依次打开页面并按顺序完成操作

### 配置步骤

1. **登录页面**
   - URL: `https://app.example.com/login`
   - 选择器: `button.login-btn`
   - 延迟: 2000ms

2. **首页**
   - URL: `https://app.example.com/home`
   - 选择器: `.start-action`
   - 延迟: 2500ms

3. **确认页面**
   - URL: `https://app.example.com/confirm`
   - 选择器: `[data-action="confirm"]`
   - 延迟: 2000ms

### 会话管理

⚠️ **重要**：

- 确保会话不会过期
- 如果需要登录，将登录作为第一个链接
- 使用适当的延迟时间让会话保持活跃

---

## 常见选择器模式

### 按钮相关

```html
<!-- 使用 class -->
<button class="submit-btn">提交</button>
选择器: .submit-btn

<!-- 使用 id -->
<button id="complete">完成</button>
选择器: #complete

<!-- 使用 type -->
<input type="submit" value="发送">
选择器: input[type="submit"]

<!-- 使用 data 属性 -->
<button data-action="confirm">确认</button>
选择器: [data-action="confirm"]
```

### 链接相关

```html
<!-- 简单链接 -->
<a href="...">领取</a>
选择器: a

<!-- 带 class 的链接 -->
<a class="claim-link" href="...">领取</a>
选择器: a.claim-link

<!-- 带多个 class -->
<a class="btn btn-primary" href="...">立即领取</a>
选择器: .btn.btn-primary
或
选择器: .btn.btn-primary // 两个类都有
```

### 复杂选择器

```html
<!-- 使用多个条件 -->
<div class="container">
  <button class="action-btn" data-type="reward">领取</button>
</div>
选择器: button.action-btn[data-type="reward"]

<!-- 使用后代选择器 -->
<div class="rewards">
  <div class="item">
    <button class="claim">领取</button>
  </div>
</div>
选择器: .rewards button.claim

<!-- 使用属性选择器 -->
<button onclick="claim()">领取</button>
选择器: button[onclick*="claim"]
```

---

## 延迟时间参考

| 网络情况 | 推荐延迟 | 说明 |
|---------|--------|------|
| 极快网络 | 500ms | 本地服务器或超快速网络 |
| 快速网络 | 1000ms | 高速 WiFi 或光纤 |
| 标准网络 | 2000ms | 普通 WiFi 或 4G |
| 较慢网络 | 3000ms | 较慢的 3G 或边远地区 |
| 包含动画 | 3500ms+ | 页面有动画效果需要更多时间 |

### 调整建议

- **首次运行**：使用保守的延迟时间（如 3000ms）
- **测试完成**：根据实际情况逐步减少延迟
- **如果失败**：增加延迟时间重试
- **查看日志**：观察运行日志来判断是否延迟不足

---

## 故障排除指南

### 问题：点击无效，日志显示"未找到元素"

**诊断步骤：**

```
1. 在浏览器中手动打开该 URL
2. 按 F12 打开开发者工具
3. 在控制台运行：document.querySelector("你的选择器")
4. 如果返回 null，说明选择器错误
5. 更正选择器并重试
```

**解决方案：**

- 检查选择器是否有拼写错误
- 确认元素在 DOM 中确实存在
- 尝试更具体的选择器
- 增加延迟时间，确保元素已加载

### 问题：某些链接总是失败

**检查项：**

1. 链接是否需要登录
2. 链接是否个已过期
3. IP 地址是否被限制
4. 是否有反爬虫机制

### 问题：自动化运行到中间停止

**可能原因：**

1. 某个链接返回 404
2. 选择器在某个页面找不到
3. 网络中断
4. 扩展崩溃

**解决方案：**

- 查看运行日志找到具体是哪个链接失败
- 检查该链接的配置
- 测试该链接是否正常打开
- 重新开始运行

---

## 性能建议

### 链接数量

- 建议单次运行 **10-50 个链接**
- 大于 100 个链接时建议分批运行
- 每批之间留 5-10 分钟的间隔

### 时间间隔

- 同一网站的链接间隔不应太短
- 建议最小延迟 1000ms
- 不同网站之间建议间隔 2-3 秒

### 服务器友好

- ✅ 勤快使用，避免被识别为非法请求
- ✅ 尊重网站的 robots.txt
- ✅ 不要过度重复相同操作
- ✅ 遵守网站的使用条款

---

## 💡 实用技巧

### 技巧 1：快速测试选择器

```javascript
// 在浏览器控制台中运行以测试选择器
document.querySelector(".button").click(); // 测试点击
console.log(document.querySelectorAll(".button")); // 查找所有匹配
```

### 技巧 2：获取元素的所有 class

```javascript
// 找到目标元素
const el = document.querySelector("button");

// 获取所有 class
console.log(el.className);  // 返回: "btn primary active"

// 基于第一个 class 创建选择器
console.log("." + el.className.split(" ")[0]); // 返回: ".btn"
```

### 技巧 3：精确查找元素

```javascript
// 如果有多个相似元素，使用更具体的选择器
document.querySelector("div.container button.submit");

// 或使用属性
document.querySelector('button[data-test-id="confirm"]');

// 或使用索引（不推荐，易变）
document.querySelectorAll("button")[3];
```

---

## 📋 检查清单

在运行自动化前，请检查：

- [ ] 所有 URL 都是有效且可访问的
- [ ] 已的验证每个 CSS 选择器都能找到元素
- [ ] 延迟时间设置合理
- [ ] 已阅读目标网站的使用条款
- [ ] 浏览器已登录相关账户（如需要）
- [ ] 网络连接稳定
- [ ] 备份了重要配置

---

**祝您使用愉快！** 如有问题，请查阅主 README.md 文件获取更多帮助。
