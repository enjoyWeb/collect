# 数据持久化修复 - URL 列表保留

## 问题描述

❌ **旧行为**：URL 列表在 popup 每次显示/隐藏时都会自动清空，无法保留之前输入的数据。

## 根本原因

`popup.js` 中的 `updateDisplay()` 函数只更新了计数显示，但没有将保存在 `config` 对象中的 URL 列表和选择器恢复到 HTML 的输入框中。

```javascript
// 旧代码 - 只显示计数，不恢复值
function updateDisplay() {
  urlCount.textContent = `已添加：${config.urls.length} 个URL`;
}
```

## 解决方案

✅ **新行为**：修改 `updateDisplay()` 函数，将保存的数据恢复到输入框中。

```javascript
// 新代码 - 完整恢复数据
function updateDisplay() {
  // 恢复 URL 列表到 textarea
  urlsInput.value = config.urls.join('\n');
  
  // 恢复选择器到 input
  selectorInput.value = config.selector || '.el-button.el-button--primary.el-button--mini';
  
  // 更新计数显示
  urlCount.textContent = `已添加：${config.urls.length} 个URL`;
}
```

## 数据流通图

```
用户输入 URL 和选择器
         ↓
【应用配置】按钮
         ↓
config.urls = [url1, url2, url3]
config.selector = ".el-button"
         ↓
saveConfig() → chrome.storage.local
         ↓
updateDisplay() → 显示计数 (旧)
         ↓
点击关闭 popup
       ↓↓↓
再次打开 popup
         ↓
DOMContentLoaded 事件
         ↓
initConfig() → 从存储恢复 config
         ↓
updateStatus() + updateDisplay() ← 新增：恢复输入框值
         ↓
urlsInput.value = config.urls.join('\n')  ← NEW
selectorInput.value = config.selector      ← NEW
urlCount.textContent = ...
         ↓
用户看到之前保存的 URL 和选择器 ✅
```

## 修改位置

**文件**：[popup.js](popup.js#L80-L89)

**行数**：第 80-89 行

**函数**：`updateDisplay()`

## 关键点

| 方面 | 说明 |
|------|------|
| `config.urls` | 数组类型，通过 `.join('\n')` 转换为多行字符串 |
| `urlsInput.value` | textarea 的值，直接显示在 UI 上 |
| `selectorInput.value` | input 的值，使用默认值作为备选 |
| 调用时机 | 1. popup 打开时 (initConfig 内) 2. 配置改变时 (applyConfig 内) 3. 状态检查时 (setInterval 内) |

## 验证方式

1. **添加 URL**：在 textarea 中输入多个 URL，点击【应用配置】
2. **关闭 popup**：点击扩展图标或其他地方关闭 popup
3. **重新打开 popup**：点击扩展图标重新打开
4. **验证**：✅ URL 列表和选择器应该仍匿存在

## 相关文件

- [popup.js](popup.js) - 主要修改
- [popup.html](popup.html) - URL 输入框定义
- [log-manager.js](log-manager.js) - 日志持久化相关

---

**版本**：v2.2.3+ (数据持久化修复)
**修改日期**：2026-05-04
