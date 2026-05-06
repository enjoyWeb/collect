# Content Script 详细日志指南

## 概述

已向 content-script.js 添加了全面的日志记录，用于诊断自动化流程中的问题。所有关键步骤都会输出详细的日志信息。

## 日志查看方法

### 打开新标签页的 DevTools

1. 自动化运行时，新标签页会自动打开
2. 在新标签页中按 **F12** 打开 DevTools
3. 切换到 **Console** 标签页
4. 即可看到 Content Script 的所有日志

## 完整日志流程

### 场景 1：成功检测到弹窗

```
[Content Script] ⬇️ 收到来自 Background 的消息: {
  action: "clickElement",
  selector: ".el-button.el-button--primary",
  waitForSuccess: true
}
[Content Script] 📍 开始处理点击指令
[Content Script] 📍  选择器: .el-button.el-button--primary
[Content Script] 📍  等待弹窗: true
[Content Script] 找到元素: <button class="el-button el-button--primary">
[Content Script] ✅ 元素点击成功
[Content Script] 开始等待成功弹窗...
[Content Script] 继续检测弹窗... 已耗时 2.5 秒
[Content Script] 弹窗检测结果: {
  found: true,
  message: "操作成功",
  details: [...]
}
[Content Script] ✅ 检测到成功弹窗，发送 elementClicked 消息
[Content Script] → Background 消息: {
  action: "elementClicked",
  selector: ".el-button.el-button--primary",
  success: true,
  popupDetected: true,
  popupMessage: "操作成功"
}
[Content Script] ← sendResponse 数据: {
  success: true,
  message: "元素已点击，成功弹窗已检测到",
  popupDetected: true
}
```

### 场景 2：未检测到弹窗（超时）

```
[Content Script] ⬇️ 收到来自 Background 的消息: {
  action: "clickElement",
  selector: ".button-wrong-selector",
  waitForSuccess: true
}
[Content Script] 📍 开始处理点击指令
[Content Script] 📍  选择器: .button-wrong-selector
[Content Script] 📍  等待弹窗: true
[Content Script] 找到元素: <button class="button-wrong-selector">
[Content Script] ✅ 元素点击成功
[Content Script] 开始等待成功弹窗...
[Content Script] 继续检测弹窗... 已耗时 10 秒
[Content Script] 继续检测弹窗... 已耗时 20 秒
... (继续等待30秒) ...
[Content Script] 등待弹窗超时（60秒）
[Content Script] 弹窗检测结果: {
  found: false,
  message: "未找到成功弹窗（超时）"
}
[Content Script] ❌ 未检测到成功弹窗 (超时: 未找到成功弹窗（超时）)，停止自动化
[Content Script] → Background 消息: {
  action: "failedToDetectSuccess",
  selector: ".button-wrong-selector",
  message: "未检测到\"成功\"弹窗，自动化已停止",
  popupMessage: "未找到成功弹窗（超时）"
}
[Content Script] ← sendResponse 数据: {
  success: false,
  message: "未检测到\"成功\"弹窗",
  popupDetected: false
}
```

### 场景 3：未找到元素

```
[Content Script] ⬇️ 收到来自 Background 的消息: {
  action: "clickElement",
  selector: ".non-existent-selector",
  waitForSuccess: false
}
[Content Script] 📍 开始处理点击指令
[Content Script] 📍  选择器: .non-existent-selector
[Content Script] 📍  等待弹窗: false
[Content Script] ❌ 未找到元素，选择器: .non-existent-selector
[Content Script] ← sendResponse 数据: {
  success: false,
  message: "未找到元素",
  selector: ".non-existent-selector"
}
```

### 场景 4：点击出错

```
[Content Script] ⬇️ 收到来自 Background 的消息: {
  action: "clickElement",
  selector: ".button",
  waitForSuccess: true
}
[Content Script] 📍 开始处理点击指令
[Content Script] 📍  选择器: .button
[Content Script] 📍  等待弹窗: true
[Content Script] ❌ 点击元素时出错: ReferenceError: someUndefinedVar is not defined
[Content Script] ← sendResponse 数据: {
  success: false,
  message: "someUndefinedVar is not defined",
  error: "ReferenceError: someUndefinedVar is not defined"
}
```

## 日志类型说明

| 符号 | 含义 | 示例 |
|------|------|------|
| ⬇️ | 收到消息 | 来自 Background 的新指令 |
| 📍 | 处理步骤 | 开始处理、选择器、参数 |
| ✅ | 成功 | 元素点击成功、检测到弹窗 |
| ❌ | 失败/错误 | 未找到元素、超时、错误异常 |
| → | 发送消息 | 到 Background 的消息 |
| ← | 响应数据 | sendResponse 的数据 |

## 关键日志点

### 1. 消息接收
```javascript
console.log('[Content Script] ⬇️ 收到来自 Background 的消息:', request);
```
**用途**：验证是否收到消息，消息内容是否正确

### 2. 参数提取
```javascript
console.log('[Content Script] 📍 开始处理点击指令');
console.log('[Content Script] 📍  选择器:', selector);
console.log('[Content Script] 📍  等待弹窗:', waitForSuccess);
```
**用途**：核实传入参数是否正确

### 3. 元素查找结果
```javascript
if (element) {
  console.log('[Content Script] 找到元素:', element);
} else {
  console.log('[Content Script] ❌ 未找到元素，选择器:', selector);
}
```
**用途**：确认选择器是否能找到元素

### 4. 点击成功
```javascript
console.log('[Content Script] ✅ 元素点击成功');
```
**用途**：确认点击事件已触发

### 5. 弹窗检测结果
```javascript
console.log('[Content Script] 弹窗检测结果:', result);
// result = { found: true/false, message: "...", details: [...] }
```
**用途**：查看是否找到"成功"弹窗，弹窗内容是什么

### 6. 消息发送（成功情况）
```javascript
if (result.found) {
  console.log('[Content Script] ✅ 检测到成功弹窗，发送 elementClicked 消息');
  console.log('[Content Script] → Background 消息:', bgMessage);
  chrome.runtime.sendMessage(bgMessage);
  console.log('[Content Script] ← sendResponse 数据:', responseData);
  sendResponse(responseData);
}
```
**用途**：确认成功时发送的两条消息内容

### 7. 消息发送（失败情况）
```javascript
else {
  console.log('[Content Script] ❌ 未检测到成功弹窗 (超时: ..., 停止自动化');
  console.log('[Content Script] → Background 消息:', bgMessage);
  chrome.runtime.sendMessage(bgMessage);
  console.log('[Content Script] ← sendResponse 数据:', responseData);
  sendResponse(responseData);
}
```
**用途**：确认失败时发送的两条消息内容

## 常见问题排查

| 问题 | 检查日志 | 原因 |
|------|---------|------|
| 元素没被点击 | 看不到"✅ 元素点击成功" | 选择器错误或元素不存在 |
| 点击后卡住 | 看到"开始等待弹窗..." 但无后续 | Browser DevTools 关闭了或新标签崩溃 |
| 弹窗判断错误 | ❌ 超时 vs ✅ 检测到 | 弹窗文本不包含"成功"或隐藏太快 |
| 消息没发送 | 没看到"→ Background 消息" | 代码出错（查看错误日志） |
| Background 没收到 | 检查 Background console | Content Script 消息格式错误 |

## 性能优化提示

- 每 500ms 检查一次弹窗（最多 120 次 = 60 秒时间）
- 每 10 次检查输出一条进度日志（避免日志过多）
- 检查可见元素（offsetParent !== null）以排除隐藏的 DOM

## 相关文件

- [content-script.js](content-script.js) - 主要实现
- [background.js](background.js) - 消息处理方
- [DIAGNOSIS_GUIDE.md](DIAGNOSIS_GUIDE.md) - 完整诊断指南

---

**版本**：v2.2.3+ 详细日志版  
**修改日期**：2026-05-04
