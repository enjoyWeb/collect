# 🚀 Amazon 采集助手 v2.1.0

强大的 Chrome 扩展，用于自动化 Amazon 产品采集流程。支持一键配置选择器、自动点击、弹窗检测。

> **遇到"⚠️ 未配置选择器"问题？** → [立即诊断](#-30-秒快速诊断)

## ✨ 功能特性

- 🎯 **可视化选择器配置** - 直接在网页上点击要操作的元素，自动生成 CSS 选择器
- 🔗 **批量 URL 管理** - 添加、删除和管理多个 Amazon 链接
- 🤖 **自动点击** - 使用生成的选择器自动点击"采集到趣天助手"按钮
- ⏳ **弹窗检测** - 点击后自动等待"成功"弹窗（支持 per-URL 配置）
- 🔄 **循环自动化** - 依次处理每个链接，自动打开下一个
- 📊 **实时进度日志** - 详细的操作日志和错误信息
- ✅ **智能延迟** - 可配置的点击延迟和等待时间

## � 详细诊断文档

问题没解决？查看这些完整的诊断指南：

| 文档 | 描述 | 用时 |
|------|------|-----|
| 🔧 [诊断工具](DIAGNOSTIC_TOOL.html) | 在线诊断工具（用浏览器打开此 HTML）| 3 min |
| ⚡ [快速诊断清单](QUICK_DIAGNOSTIC_CHECKLIST.md) | 完整的 30 秒诊断流程和问题矩阵 | 2 min |
| 🪜 [调试脚本集](DEBUG_SCRIPTS.md) | 10 个复制粘贴脚本，快速定位问题 | 3 min |
| 📊 [执行轨迹详解](EXECUTION_TRACE_GUIDE.md) | 代码执行流程和日志含义详解 | 10 min |
| 📖 [使用指南](AMAZON_AUTOMATION_GUIDE.md) | 完整功能说明和操作指南 | 10 min |
| 🏗️ [项目架构](PROJECT_ARCHITECTURE.md) | 代码结构和设计模式 | 15 min |
| 🎯 [排故指南](SELECTOR_CONFIG_TROUBLESHOOTING.md) | 选择器配置问题详细排查 | 5 min |
| 📚 [完整索引](DOCS_INDEX.md) | 所有文档的导航和分类 | - |

## 🎯 按问题类型快速查找

- **"⚠️ 未配置选择器"** → [快速诊断清单](QUICK_DIAGNOSTIC_CHECKLIST.md) + [调试脚本 1️⃣4️⃣](DEBUG_SCRIPTS.md)
- **弹窗不显示** → [排故指南 问题 1](SELECTOR_CONFIG_TROUBLESHOOTING.md)
- **消息未到达** → [调试脚本 2️⃣](DEBUG_SCRIPTS.md) + [执行轨迹详解](EXECUTION_TRACE_GUIDE.md)
- **想理解原理** → [项目架构](PROJECT_ARCHITECTURE.md) + [执行轨迹详解](EXECUTION_TRACE_GUIDE.md)

## 📁 项目结构

```
/Users/zhuyun/www/collect/
├── manifest.json              # 扩展配置
├── popup.html                 # UI 界面
├── popup.css                  # 样式
├── popup.js                   # 弹窗逻辑（包含调试日志）
├── content-script.js          # 网页脚本（元素选择）
├── background.js              # 后台服务（自动化逻辑）
├── images/                    # 图标
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
│
├── 📚 诊断文档
├── DIAGNOSTIC_TOOL.html       # 在线诊断工具 ⭐
├── QUICK_DIAGNOSTIC_CHECKLIST.md
├── DEBUG_SCRIPTS.md
├── EXECUTION_TRACE_GUIDE.md
├── SELECTOR_CONFIG_TROUBLESHOOTING.md
├── DOCS_INDEX.md
│
├── 📖 使用文档
├── README.md                  # 本文件
├── AMAZON_AUTOMATION_GUIDE.md
├── FEATURE_UPDATE_v2.1.md
├── SOLUTION_SUMMARY.md
├── PROJECT_ARCHITECTURE.md
├── CONFIG_FILE_REFERENCE.md
└── DOCUMENTATION_INDEX.md
```

## 🚀 立即开始

### 第一次使用
1. 打开 `DIAGNOSTIC_TOOL.html`（用浏览器打开）
2. 按照【⚡ 30秒诊断】流程操作
3. 根据问题矩阵找出问题
4. 执行快速修复

### 快速诊断
1. 在扩展中按 F12
2. 复制粘贴诊断脚本
3. 观察 Console 日志
4. 对照诊断矩阵

### 深入理解
1. 阅读 [执行轨迹详解](EXECUTION_TRACE_GUIDE.md)
2. 查看 [项目架构](PROJECT_ARCHITECTURE.md)
3. 运行诊断脚本验证

## 💡 贴士

- 📌 **书签此页** - 快速返回诊断工具
- 🔍 **使用 Ctrl+F 搜索** - 快速找到你的问题
- 📱 **在手机浏览** - 可以边看文档边操作电脑
- 💾 **保存诊断结果** - 便于问题追踪

## 📊 项目统计

- 💻 **代码行数**: 1,587 行
- 📚 **文档行数**: 16,000+ 行
- 📁 **文件数量**: 20+ 个
- 🎯 **覆盖场景**: 30+ 个常见问题
- ⏱️ **诊断时间**: 平均 2-3 分钟

## ✅ 功能清单

- [x] 可视化选择器配置
- [x] 自动点击功能
- [x] 弹窗检测
- [x] 批量 URL 管理
- [x] 详细日志记录
- [x] 错误处理
- [x] Chrome Storage 持久化
- [x] CSS 选择器智能生成
- [x] Per-URL 配置管理
- [x] 实时 UI 更新

---

**最后更新**: v2.1.0  
**诊断工具**: ⭐ [DIAGNOSTIC_TOOL.html](DIAGNOSTIC_TOOL.html)  
**立即诊断**: 按 F12 → Console → 运行脚本

## ⚡ 30 秒快速诊断

**遇到"所有 URL 都显示 ⚠️ 未配置选择器"？** 按这个步骤做：

### 第 1 步（5 秒）
在扩展窗口中按 **F12** 打开开发者工具，选择 **Console** 标签

### 第 2 步（10 秒）
复制粘贴这段代码到 Console 中，按 Enter：
```javascript
chrome.storage.local.get(['automationConfig'], (result) => {
  console.log('[诊断] 保存的配置：')
  console.table(result.automationConfig?.urls || [])
})
```

### 第 3 步（10 秒）
1. 粘贴一个 Amazon URL
2. 点击【🎯 选择元素】
3. 在网页上点击一个元素
4. 点击【✅ 确认选择】

### 第 4 步（5 秒）
查看 Console 日志，检查是否出现：
- ✅ `[Popup] 开始元素选择`
- ✅ `[Popup] 新标签页已打开`
- ✅ `[Popup] 元素已选择`
- ✅ `[Popup] 配置已保存`

**✅ 全部出现？** 问题已解决！  
**❌ 中断了？** 查看下方的[详细诊断](#-详细诊断文档)

## 🎯 完整的工作流程

```
1. 输入 Amazon URL → 
2. 点击【🎯 选择元素】→ 
3. 在新页面上点击"采集到趣天助手"按钮 → 
4. 选择器自动生成并显示 → 
5. 点击【✅ 确认选择】保存 →
6. URL 显示 ✓ 已配置 →
7. 对其他 URL 重复 2-6 步 →
8. 点击【▶️ 开始运行】自动执行 →
9. 自动打开每个 URL 并点击按钮 →
10. 等待"成功"弹窗后打开下一个
```

## 🐛 常见问题快速解决

| 问题 | 解决方法 |
|------|--------|
| **弹窗不显示** | 按 F12 → 清除日志 → 刷新扩展 → 重试 |
| **点击无反应** | 确保鼠标在网页内容上，不是浏览器 UI |
| **配置显示"未配置"** | 刷新扩展窗口，检查保存的配置 |
| **新页面打不开** | 检查 URL 是否以 `https://` 开头 |
| **看到错误消息** | 复制错误消息查看下方的详细诊断文档 |

## 🔧 快速重置

如果完全卡住了：

```bash
1. chrome://extensions → 找到扩展 → 【移除】
2. 打开 Chrome 设置 → 清除浏览数据（清除 Cookie）
3. chrome://extensions → 【加载已解压】 → 选择项目文件夹
4. 重新开始配置
```
# collect
