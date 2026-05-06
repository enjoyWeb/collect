# 📚 完整文档索引

## 🚀 快速开始

这个项目现在包含完整的诊断和使用指南。按以下顺序阅读：

### 第一次使用？从这里开始 ⭐

1. **[快速诊断清单](QUICK_DIAGNOSTIC_CHECKLIST.md)** ⏱️ 2 分钟
   - 30 秒快速诊断步骤
   - 问题矩阵：根据现象找原因
   - 快速修复方案
   - **→ 如果不知道从哪开始，先读这个！**

2. **[选择器配置排故指南](SELECTOR_CONFIG_TROUBLESHOOTING.md)** ⏱️ 5 分钟
   - 完整流程检查清单
   - 常见问题快速修复
   - 终极解决方案
   - 调试信息收集方法

3. **[快速诊断脚本集合](DEBUG_SCRIPTS.md)** ⏱️ 3 分钟
   - 10 个复制粘贴脚本
   - 用于 Chrome DevTools Console 中运行
   - 每个脚本解决一个具体问题

### 遇到问题？查看这些 🔧

4. **[执行轨迹详解](EXECUTION_TRACE_GUIDE.md)** ⏱️ 10 分钟
   - 代码执行的完整轨迹
   - 日志含义解释
   - 常见中断点日志示例
   - 逐句调试步骤

### 完整文档库 📖

5. **[功能更新 v2.1.0](FEATURE_UPDATE_v2.1.md)**
   - Popup 检测功能
   - 新增的 per-URL 弹窗等待选项

6. **[使用指南](AMAZON_AUTOMATION_GUIDE.md)**
   - 详细的使用步骤
   - 所有功能说明
   - 常见 Q&A

7. **[项目架构文档](PROJECT_ARCHITECTURE.md)**
   - 代码结构解释
   - 文件说明
   - 函数文档
   - 数据流图

8. **[解决方案总结](SOLUTION_SUMMARY.md)**
   - 项目概要
   - 完整功能列表
   - 按问题类型的导航

9. **[配置文件说明](CONFIG_FILE_REFERENCE.md)**
   - manifest.json 解释
   - 权限说明
   - 可配置参数

---

## 📊 问题类型导航

### 🎯 "所有 URL 都显示'⚠️ 未配置选择器'"

**→ 先读：** [快速诊断清单](QUICK_DIAGNOSTIC_CHECKLIST.md)  
**→ 然后：** [选择器配置排故指南](SELECTOR_CONFIG_TROUBLESHOOTING.md)  
**→ 使用：** [调试脚本 1️⃣4️⃣](DEBUG_SCRIPTS.md)  
**→ 深入：** [执行轨迹详解](EXECUTION_TRACE_GUIDE.md)

### 🔧 "弹窗不出现"

**→ 先读：** [快速诊断清单 - 问题诊断矩阵](QUICK_DIAGNOSTIC_CHECKLIST.md#问题诊断矩阵)  
**→ 使用：** [调试脚本 5️⃣7️⃣](DEBUG_SCRIPTS.md)  
**→ 详见：** [选择器配置排故 - 问题 1](SELECTOR_CONFIG_TROUBLESHOOTING.md#问题-1弹窗不显示)

### ❌ "点击后没有反应"

**→ 先读：** [快速诊断清单 - 按问题类型快速修复](QUICK_DIAGNOSTIC_CHECKLIST.md#🎯-按问题类型快速修复)  
**→ 使用：** [调试脚本 3️⃣9️⃣](DEBUG_SCRIPTS.md)  
**→ 详见：** [选择器配置排故 - 问题 2](SELECTOR_CONFIG_TROUBLESHOOTING.md#问题-2点击选择器弹窗后没有反应)

### 📦 "配置显示为'未配置'但之前配置过"

**→ 先读：** [快速诊断清单](QUICK_DIAGNOSTIC_CHECKLIST.md)  
**→ 使用：** [调试脚本 1️⃣4️⃣🔟](DEBUG_SCRIPTS.md)

### 🐛 "出现错误消息或异常信息"

**→ 使用：** [快速诊断清单 - 快速修复](QUICK_DIAGNOSTIC_CHECKLIST.md)  
**→ 详见：** [执行轨迹详解 - 常见错误输出](EXECUTION_TRACE_GUIDE.md#快速参考常见错误输出)

---

## 📝 按功能分类

### 配置管理
- [快速诊断清单](QUICK_DIAGNOSTIC_CHECKLIST.md) - 检查配置是否保存
- [配置文件说明](CONFIG_FILE_REFERENCE.md) - 配置文件格式
- [调试脚本 1️⃣4️⃣](DEBUG_SCRIPTS.md) - 保存/读取配置

### 元素选择
- [选择器配置排故指南](SELECTOR_CONFIG_TROUBLESHOOTING.md) - 完整流程
- [执行轨迹详解](EXECUTION_TRACE_GUIDE.md) - 代码执行细节
- [调试脚本 3️⃣](DEBUG_SCRIPTS.md) - 测试选择器有效性

### 消息传递
- [项目架构文档](PROJECT_ARCHITECTURE.md) - 消息流图
- [执行轨迹详解](EXECUTION_TRACE_GUIDE.md) - 消息流执行
- [调试脚本 2️⃣](DEBUG_SCRIPTS.md) - 测试消息发送

### 自动化执行
- [使用指南](AMAZON_AUTOMATION_GUIDE.md) - 运行方法
- [功能更新 v2.1.0](FEATURE_UPDATE_v2.1.md) - Popup 检测功能

---

## 🎓 学习路径

### 初级用户（想快速解决问题）
```
1. QUICK_DIAGNOSTIC_CHECKLIST.md (2 min)
   ↓
2. SELECTOR_CONFIG_TROUBLESHOOTING.md (5 min)
   ↓
3. DEBUG_SCRIPTS.md (运行脚本)
   ↓
4. 问题解决 ✅ 或 
   ↓ 转向中级路径
```

### 中级用户（想理解问题所在）
```
1. QUICK_DIAGNOSTIC_CHECKLIST.md
   ↓
2. EXECUTION_TRACE_GUIDE.md (10 min - 理解流程)
   ↓
3. 使用 DEBUG_SCRIPTS.md 验证假设
   ↓
4. PROJECT_ARCHITECTURE.md (理解代码结构)
   ↓
5. 深入理解 + 自己修复 ✅
```

### 高级用户（想修改/扩展功能）
```
1. PROJECT_ARCHITECTURE.md
   ↓
2. CONFIG_FILE_REFERENCE.md
   ↓
3. 查看源代码:
   - popup.js
   - content-script.js
   - background.js
   ↓
4. 修改 + 测试 ✅
```

---

## 🌍 语言版本

所有文档已提供中文版本。

---

## 📌 文档维护说明

### 最后更新时间
- **快速诊断清单**: 添加了 30 秒诊断流程和问题矩阵
- **选择器配置排故**: 添加了完整的故障排除步骤
- **执行轨迹详解**: 添加了代码级别的执行跟踪
- **调试脚本**: 新增 10 个复制粘贴脚本

### 如何使用这些文档

**场景 1：快速诊断**
```
时间：2-3 分钟
文档：QUICK_DIAGNOSTIC_CHECKLIST.md
目的：确定问题具体在哪一步
```

**场景 2：深入理解**
```
时间：15-30 分钟
文档：选择诊断文档 + 执行轨迹详解
目的：理解根本原因
```

**场景 3：自己修复**
```
时间：30 分钟 - 1 小时
文档：项目架构 + 源代码
目的：定位和修复 bug
```

---

## 💡 快速参考

### 常用检查
| 问题 | 快速检查命令 |
|------|-----------|
| 配置是否保存 | `chrome.storage.local.get(['automationConfig'], (r)=>console.log(r))` |
| 选择器是否有效 | `document.querySelector('your-selector')` |
| 内容脚本是否加载 | 检查 Chrome DevTools 是否有 content-script 日志 |
| 消息是否到达 | F12 Console 查看 `[Popup]` 和 `[Content Script]` 日志 |

### 常用文件
- `popup.js` - 弹窗 UI 逻辑
- `content-script.js` - 网页内容处理
- `background.js` - 后台服务
- `manifest.json` - 扩展配置

---

## 🆘 需要帮助？

1. **快速问题？** → [快速诊断清单](QUICK_DIAGNOSTIC_CHECKLIST.md)
2. **配置问题？** → [选择器配置排故指南](SELECTOR_CONFIG_TROUBLESHOOTING.md)
3. **想要脚本？** → [快速诊断脚本集合](DEBUG_SCRIPTS.md)
4. **理解代码？** → [项目架构文档](PROJECT_ARCHITECTURE.md)
5. **更新说明？** → [功能更新 v2.1.0](FEATURE_UPDATE_v2.1.md)

---

**当前项目版本**: v2.1.0  
**文档更新时间**: 2024  
**总代码行数**: 1,587 lines  
**总文档行数**: 16,000+ lines
