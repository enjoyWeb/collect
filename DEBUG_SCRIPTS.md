# 🪜 快速诊断脚本集合

将下面的代码片段复制粘贴到 Chrome DevTools Console 中运行，快速诊断问题。

---

## 1️⃣ 检查目前保存的配置

```javascript
// 检查 Chrome Storage 中保存了什么
chrome.storage.local.get(['automationConfig'], (result) => {
  console.log('=== 保存的配置 ===')
  if (result.automationConfig) {
    console.log('找到配置！')
    console.log('总共有', result.automationConfig.urls.length, '个 URL')
    result.automationConfig.urls.forEach((item, i) => {
      console.log(`[${i}] URL: ${item.url}`)
      console.log(`    选择器: ${item.selector || '未配置'}`)
      console.log(`    等待弹窗: ${item.waitForPopup}`)
    })
  } else {
    console.warn('没有找到保存的配置！')
  }
})
```

---

## 2️⃣ 手动测试消息发送

```javascript
// 测试 popup → content-script 消息是否能发送
chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
  if (tabs.length === 0) {
    console.error('没有活跃的标签页！')
    return
  }
  
  const tab = tabs[0]
  console.log('向标签页', tab.id, '发送测试消息：', tab.url)
  
  chrome.tabs.sendMessage(tab.id, {
    action: 'test',
    message: 'Hello from popup'
  }, response => {
    if (chrome.runtime.lastError) {
      console.error('❌ 发送失败:', chrome.runtime.lastError.message)
      console.log('可能原因：内容脚本未注入或标签页不允许脚本注入')
    } else {
      console.log('✅ 发送成功，响应:', response)
    }
  })
})
```

---

## 3️⃣ 测试选择器是否有效

```javascript
// 测试某个选择器在当前页面是否能找到元素
(() => {
  // 替换为你的实际选择器
  const selector = 'a#btn_1' // 示例
  
  console.log('测试选择器:', selector)
  const element = document.querySelector(selector)
  
  if (element) {
    console.log('✅ 找到元素！')
    console.log('标签: ', element.tagName)
    console.log('文本: ', element.textContent.substring(0, 50))
    console.log('ID: ', element.id)
    console.log('Class: ', element.className)
  } else {
    console.error('❌ 没找到元素！')
    console.log('可能原因：选择器不正确或元素不存在')
    
    // 尝试帮助调试
    console.log('\n建议操作：')
    console.log('1. 检查选择器是否正确')
    console.log('2. 右键检查元素 → 获取正确的选择器')
    console.log('3. 验证页面是否已完全加载')
  }
})()
```

---

## 4️⃣ 强制保存配置测试

```javascript
// 强制保存一个测试配置
const testConfig = {
  urls: [
    {
      url: 'https://www.amazon.com/test',
      selector: null,
      waitForPopup: false
    }
  ]
}

chrome.storage.local.set({ automationConfig: testConfig }, () => {
  if (chrome.runtime.lastError) {
    console.error('❌ 保存失败:', chrome.runtime.lastError)
  } else {
    console.log('✅ 测试配置已保存')
    
    // 立即验证
    chrome.storage.local.get(['automationConfig'], (result) => {
      console.log('验证保存结果:', result.automationConfig)
    })
  }
})
```

---

## 5️⃣ 模拟完整的元素选择流程

```javascript
// 这个脚本模拟整个选择元素的流程（用于测试）
async function testFullFlow() {
  console.log('=== 开始完整流程测试 ===\n')
  
  // 第 1 步：获取当前配置
  console.log('第 1 步：加载配置...')
  chrome.storage.local.get(['automationConfig'], (result) => {
    const config = result.automationConfig
    if (!config || !config.urls.length) {
      console.error('❌ 配置为空！')
      return
    }
    
    console.log('✅ 配置加载成功，有', config.urls.length, '个 URL\n')
    
    // 第 2 步：为每个 URL 生成选择器
    console.log('第 2 步：生成选择器...')
    config.urls.forEach((item, index) => {
      console.log(`[${index}] ${item.url}`)
      console.log(`    当前选择器: ${item.selector || '未配置'}`)
    })
    
    console.log('\n第 3 步：验证选择器是否有效...')
    config.urls.forEach((item, index) => {
      if (item.selector) {
        const elem = document.querySelector(item.selector)
        if (elem) {
          console.log(`✅ [${index}] 选择器有效`)
          console.log(`    元素文本: ${elem.textContent.substring(0, 30)}`)
        } else {
          console.log(`❌ [${index}] 选择器无效！`)
          console.log(`    选择器: ${item.selector}`)
        }
      }
    })
  })
}

testFullFlow()
```

---

## 6️⃣ 检查内容脚本是否已加载

```javascript
// 在任何页面的 Console 中运行（不是扩展 popup）
console.log('检查内容脚本是否已加载...')

// 如果内容脚本已加载，这个消息会有响应
window.addEventListener('message', (event) => {
  if (event.data.type === 'FROM_CONTENT_SCRIPT') {
    console.log('✅ 内容脚本已加载！')
  }
})

// 发送测试消息
window.postMessage({ type: 'FROM_PAGE', test: true }, '*')

// 等待 1 秒看是否有响应
setTimeout(() => {
  console.log('检查完毕')
}, 1000)
```

---

## 7️⃣ 查看所有 DOM 错误

```javascript
// 收集页面中所有发生的错误
window.addEventListener('error', (event) => {
  console.error('捕获的错误:', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    error: event.error
  })
})

// 同时查看 console 中的错误日志
// 如果扩展执行出错，会显示在这里
console.log('错误监听已启用，请重新操作一遍，所有错误都会记录')
```

---

## 8️⃣ 验证 manifest.json 权限

```javascript
// 检查扩展是否有必要的权限
// 在 popup.js 中可以运行这个
chrome.runtime.getManifest && (() => {
  const manifest = chrome.runtime.getManifest()
  console.log('=== manifest.json 信息 ===')
  console.log('扩展名:', manifest.name)
  console.log('版本:', manifest.version)
  console.log('权限:', manifest.permissions)
  console.log('内容脚本匹配:', manifest.content_scripts?.[0]?.matches)
})()
```

---

## 9️⃣ 显示当前 URL 和 Elements

```javascript
// 显示当前页面的信息，帮助验证是否是正确的页面
console.log('=== 当前页面信息 ===')
console.log('页面 URL:', window.location.href)
console.log('页面标题:', document.title)

// 显示可能的"采集"按钮
const buttons = Array.from(document.querySelectorAll('button, a, [role="button"]'))
  .filter(el => el.textContent.toLowerCase().includes('采集') || 
                el.textContent.toLowerCase().includes('collect') ||
                el.textContent.toLowerCase().includes('add') ||
                el.className.toLowerCase().includes('collect'))

if (buttons.length > 0) {
  console.log('找到可能的采集按钮:')
  buttons.forEach((btn, i) => {
    console.log(`[${i}] ${btn.tagName}`)
    console.log(`    文本: ${btn.textContent.substring(0, 50)}`)
    console.log(`    ID: ${btn.id || '无'}`)
    console.log(`    Class: ${btn.className}`)
    console.log(`    选择器: ${btn.id ? `#${btn.id}` : `.${btn.className.split(' ')[0] || '?'}`}`)
  })
} else {
  console.warn('⚠️ 没找到采集按钮，页面可能没有加载完')
}
```

---

## 🔟 清空所有配置（重置）

```javascript
// ⚠️ 警告：这会删除所有保存的配置！
if (confirm('确定要清空所有保存的配置吗？（无法撤销）')) {
  chrome.storage.local.clear(() => {
    console.log('✅ 所有配置已清空')
    console.log('请重新加载扩展')
  })
}
```

---

## 使用步骤

### 第 1 步：打开 Console
- **Chrome**: 按 F12 → Console 选项卡
- **Firefox**: 按 F12 → Console 选项卡

### 第 2 步：选择要运行的脚本
从上面选择一个诊断脚本

### 第 3 步：复制整个代码块
```
从 (() => {
    ...
})()
或从 chrome.storage.local.get...
```

### 第 4 步：粘贴到 Console
- 右键 → 粘贴
- 或 Ctrl+V / Cmd+V

### 第 5 步：按 Enter 执行
观察输出结果

### 第 6 步：根据输出调整
- ✅ 如果看到成功消息，问题在别的地方
- ❌ 如果看到错误，记下错误信息

---

## 使用建议

| 症状 | 应该运行 | 预期结果 |
|------|--------|--------|
| 配置没有保存 | 脚本 1️⃣ + 脚本 4️⃣ | 应该看到 URL 和选择器 |
| 弹窗不显示 | 脚本 2️⃣ | 应该看到消息发送成功 |
| 选择器无效 | 脚本 3️⃣ + 脚本 9️⃣ | 应该找到该元素 |
| 不知道问题在哪 | 脚本 5️⃣  | 全流程测试 |
| 想重新开始 | 脚本 🔟 | 清空后重新设置 |

---

## 快速参考：常见错误输出

```
❌ "Cannot access contents of url..."
  → URL 不能被背景脚本访问
  → 确保 URL 是 HTTP/HTTPS 开头

❌ "Error: Could not establish connection"
  → 内容脚本未注入
  → 重新加载扩展或检查 manifest.json

❌ "runtime.lastError"
  → Chrome 运行时错误
  → 通常是权限不足或脚本崩溃

⚠️ "undefined" 或 "null"
  → 某个变量没有被正确赋值
  → 检查前面的步骤是否成功
```

---

祝调试顺利！如果还有问题，请收集上述脚本的输出结果告诉我。
