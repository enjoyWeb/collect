# ⚡ 30 秒快速诊断清单

## 现在就做这些（按顺序）

### 第 0 秒：准备工作
- [ ] 重新加载扩展（chrome://extensions → 刷新按钮）
- [ ] 关闭所有 Amazon 标签页

### 第 5 秒：打开调试工具
```
1. 在扩展弹窗中按 F12
2. 选择 Console 标签页
3. 不要关闭 DevTools
```

### 第 15 秒：执行第一个测试
在 Console 中粘贴这段代码，然后按 Enter：

```javascript
chrome.storage.local.get(['automationConfig'], (result) => {
  console.log('[诊断] 当前保存的配置：')
  console.table(result.automationConfig?.urls || [])
})
```

**预期看到：**
- ✅ 一个表格显示你的 URL 和选择器状态
- ❌ 空白或报错 → 说明配置没有被保存

### 第 30 秒：执行第二个测试
在 Console 中粘贴这段代码：

```javascript
// 清空旧日志
console.clear()
console.log('开始诊断前的日志清理...')

// 显示当前时间
console.log('诊断开始时间:', new Date().toLocaleTimeString())
```

然后立即执行：
1. 粘贴一个 URL 到扩展的输入框
2. 点击【🎯 选择元素】
3. 在新页面随意点击一个元素
4. 点击【✅ 确认选择】

### 第 45 秒：查看 Console 输出

你应该看到这样的日志序列（从上往下）：

```
✅ 第 1 行: [Popup] 开始元素选择，索引: 0
✅ 第 2 行: [Popup] selectorMode.currentUrl 已设置: {...}
✅ 第 3 行: [Popup] 新标签页已打开，tab.id: 123
✅ 第 4 行: [Popup] 发送 enableElementSelection 消息到 tab.id: 123
✅ 第 5 行: [Popup] 收到消息： elementSelected
✅ 第 6 行: [Popup] 元素已选择，选择器: ...
✅ 第 7 行: [Popup] 确认选择按钮被点击
✅ 第 8 行: [Popup] 配置已保存并更新 UI
```

---

## 问题诊断矩阵

| 看到的现象 | 检查项 | 可能原因 |
|----------|------|--------|
| **没有任何日志** | URL 是否为空或格式错误 | 按钮点击事件未绑定 / 扩展文件损坏 |
| **只有 1-3 行日志** | 标签页是否打开 | URL 无法访问 / 权限问题 |
| **5-6 行日志出现但之后断** | 新页面 Console 中是否有日志 | 内容脚本未注入 / 点击事件未触发 |
| **全部 8 行日志都有** | URL 是否仍显示"⚠️ 未配置" | renderUrlList() 未更新 UI (需要刷新) |

---

## 🎯 按问题类型快速修复

### 如果看到："❌ 错误：未找到对应的 URL"

```
原因：URL 被修改或删除
解决：
1. 检查输入框中的 URL 是否完整
2. 删除并重新粘贴一次 URL
3. 点击【🎯 选择元素】重试
```

### 如果看到："❌ 错误：未选择任何元素"

```
原因：没有成功点击页面元素
解决：
1. 等待元素弹窗完全显示（有黑色半透明背景）
2. 在页面上明确的按钮/链接上点击（不要点文字）
3. 确保点击的是网页内容，不是浏览器 UI
```

### 如果看到："❌ 超时"

```
原因：等待时间过长，可能页面没加载完
解决：
1. 等待页面完全加载（所有元素可见）
2. 重新开始流程
3. 如果 Amazon 页面需要登录，先登录再试
```

### 如果配置已保存但刷新后消失

```
原因：浏览器缓存或权限问题
解决：
1. 确认【没有】使用隐身模式（隐身模式不保存数据）
2. 在 chrome://extensions 中确认扩展已启用
3. 点击扩展图标重新打开弹窗
4. 执行诊断代码验证配置是否真的被保存
```

---

## 📋 完整的信息收集检查表

当你准备好寻求帮助时，提供这些信息：

```
【1】Chrome 版本
  → 打开 chrome://version
  → 复制版本号

【2】扩展版本
  → 打开 chrome://extensions
  → 找到"Amazon 采集助手"
  → 复制版本号

【3】有问题的 Amazon URL
  例：https://www.amazon.com/-/zh/dp/B123456

【4】从 Console 中复制的错误日志（全部）
  → 右键选择 "Save as..." 保存为 .txt
  或全选复制粘贴

【5】你期望的选择器是什么？
  例：["采集"按钮，还是["添加到愿望单"？

【6】按照上面的 30 秒清单做完后，告诉我：
  ✅ 看到了全部 8 行日志 / ✅ 只看到几行 / ❌ 没有看到任何日志
```

---

## 🔧 如果诊断没有帮助

### 终极核重置方案（最后手段）

```bash
# 1. 卸载扩展
# chrome://extensions → 移除

# 2. 清除所有扩展数据
# chrome://settings/clearBrowsingData
# 勾选"Cookie and other site data"
# 选择"All time"
# 点击清除

# 3. 重新安装扩展
# 打开 /Users/zhuyun/www/collect
# 拖拽到 chrome://extensions

# 4. 重新开始配置
```

### 检查文件完整性

```bash
# 在终端中运行，确认所有文件都存在
cd /Users/zhuyun/www/collect
ls -la | grep -E "\.(js|html|css|json)$"

# 应该看到：
# manifest.json
# popup.html popup.css popup.js
# content-script.js
# background.js
```

---

## 🎓 理解日志含义

| 日志文本 | 含义 | 成功/失败 |
|--------|------|---------|
| `[Popup] 开始元素选择，索引: 0` | 检测到按钮点击 | ✅ |
| `[Popup] selectorMode.currentUrl 已设置` | URL 已加载到内存 | ✅ |
| `[Popup] 新标签页已打开，tab.id: 123` | 成功打开新标签页 | ✅ |
| `[Popup] 发送 enableElementSelection 消息到 tab.id` | 消息已发送 | ✅ |
| `[Popup] 收到消息： elementSelected` | 内容脚本的响应收到 | ✅ |
| `[Popup] 元素已选择，选择器: a.button` | 成功提取了选择器 | ✅ |
| `[Popup] 确认选择按钮被点击` | 用户确认了 | ✅ |
| `[Popup] 配置已保存并更新 UI` | 配置已写入存储并 UI 已更新 | ✅ |

如果某一步之后没有继续的日志，说明流程在那里中断了。

---

## ⏱️ 时间表

```
T+0s    按 F12，打开 DevTools Console
T+5s    粘贴查询脚本，查看当前配置
T+10s   清除日志，开始测试
T+15s   粘贴 URL，点击【选择元素】
T+20s   在新页面点击元素
T+25s   点击【确认选择】
T+30s   观察 Console 输出
T+45s   根据矩阵判断问题
T+60s   如果看到全部日志【成功】或执行修复
```

---

## 💾 保存你的日志

```javascript
// 在 Console 中运行，会下载完整的日志文件
(() => {
  const logs = []
  const originalLog = console.log
  
  console.log = function(...args) {
    logs.push(args.map(a => JSON.stringify(a)).join(' '))
    originalLog.apply(console, args)
  }
  
  // ... 现在执行你的操作 ...
  
  // 操作完成后运行：
  const txt = logs.join('\n')
  const blob = new Blob([txt], {type: 'text/plain'})
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'debug-' + Date.now() + '.txt'
  a.click()
})()
```

---

**现在就开始！按照 30 秒清单从第 0 秒开始。** ⏱️
