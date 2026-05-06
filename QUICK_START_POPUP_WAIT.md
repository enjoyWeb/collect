# 🚀 快速入门 - 等待弹窗功能

## ⚡ 5 步快速上手

### 步骤 1️⃣: 刷新扩展
```
1. 打开 Chrome → 菜单 → 更多工具 → 管理扩展
2. 找到 "Amazon 自动购买助手"
3. 点击刷新按钮 🔄
4. 等待 3 秒加载完成
```

### 步骤 2️⃣: 打开扩展
```
1. 打开任何网页（建议打开 Amazon）
2. 点击右上角扩展图标
3. 弹窗显示配置界面
```

### 步骤 3️⃣: 输入 URL
```
1. 在「📋 URL 列表」框中输入要处理的链接
2. 一行一个 URL
3. 示例：
   https://amazon.com/product/123
   https://amazon.com/product/456
```

### 步骤 4️⃣: 设置选择器
```
1. 在「🎯 要点击的元素」框中输入 CSS 选择器
2. 已预填常用值：.el-button.el-button--primary.el-button--mini
3. 如果需要修改，可以清空后输入自己的选择器
   例如：.add-to-cart, #buy-button, [data-action="click"]
```

### 步骤 5️⃣: 运行自动化
```
1. 点击【✅ 应用配置】保存设置
2. 点击【开始运行】开始自动化
3. 扩展会自动：
   ✅ 打开每个 URL
   ✅ 点击指定元素
   ✅ 等待成功弹窗显示
   ✅ 关闭当前页面
   ✅ 打开下一个 URL
   ✅ 循环直到完成
```

---

## 🎯 工作演示

### 场景：批量购买 Amazon 产品

```
[输入]
URL: https://amazon.com/product/A
    https://amazon.com/product/B
    https://amazon.com/product/C
选择器: .add-to-cart-button

[自动化过程]
1️⃣ 打开 https://amazon.com/product/A
   └─ 等待 2 秒页面加载
2️⃣ 点击「加入购物车」按钮
   └─ 触发 mouseover 事件
   └─ 触发 click 事件
   └─ 调用 click() 方法
3️⃣ 监听成功弹窗
   ├─ 页面出现「✅ 成功加入购物车」
   ├─ 扩展检测到"成功"文字 ✅
   ├─ 记录成功消息
4️⃣ 等待 2 秒让弹窗显示
5️⃣ 关闭当前页面
6️⃣ 等待 1 秒

7️⃣ 打开 https://amazon.com/product/B
   （重复 2-6 步）

8️⃣ 打开 https://amazon.com/product/C
   （重复 2-6 步）

9️⃣ 自动化完成 ✅
   └─ 所有 3 个产品都已成功添加

[日志输出]
🔗 打开链接: https://amazon.com/product/A
✅ 已点击元素，弹窗提示: ✅ 成功加入购物车
⏳ 正在关闭标签页...
🔗 打开链接: https://amazon.com/product/B
...
```

---

## 🎮 控制按钮说明

| 按钮 | 功能 | 何时使用 |
|------|------|---------|
| **✅ 应用配置** | 保存 URL 和选择器 | 首次配置或修改设置时 |
| **▶️ 开始运行** | 开始自动化 | 设置完成后 |
| **⏸️ 暂停** | 暂停当前运行 | 想要暂时中止时 |
| **⏹️ 停止** | 停止并重置 | 想要彻底停止时 |

---

## 📊 实时监控

### 状态框显示内容

```
当前进度:   2 / 5
│ └─ 表示已完成 2 个，共 5 个

当前链接:   https://amazon.com/product/B
│ └─ 显示正在处理的 URL

运行状态:   ✅ 运行中 / ⏸️ 已暂停 / ⏹️ 已停止
│ └─ 实时显示当前状态
```

### 日志窗口

每一步操作都会记录到日志：

```
🔗 打开链接: https://amazon.com/product/A
⏳ 等待 2 秒后点击元素...
✅ 元素已点击
✅ 已点击元素，弹窗提示: 成功加入购物车
⏳ 正在关闭标签页...
🔗 打开链接: https://amazon.com/product/B
```

---

## 🐛 快速故障排除

### 问题 1: 页面打开但没有点击

**检查列表**：
- [ ] 选择器是否正确？
- [ ] 元素是否在页面上可见？
- [ ] 是否需要滚动到元素？

**解决**：
```javascript
// 在浏览器控制台运行（F12）
document.querySelector('.selector-here')
// 如果返回 null，说明选择器不对
```

---

### 问题 2: 没有检测到"成功"弹窗

**检查列表**：
- [ ] 弹窗是否真的显示了？
- [ ] 弹窗中是否真的有"成功"二字？
- [ ] 弹窗的 class 或 id 是什么？

**解决**：
```javascript
// 在浏览器控制台运行（F12）
// 查找所有包含"成功"的可见元素
document.querySelectorAll('*').forEach(el => {
  if (el.textContent.includes('成功') && el.offsetParent !== null) {
    console.log('找到:', el.className, el.id, el.tagName);
  }
});
```

---

### 问题 3: 超时等待 60 秒还是失败

**原因可能**：
1. 网络太慢，弹窗加载超过 60 秒
2. 弹窗的文字不是"成功"（可能是"已添加"等）
3. 弹窗是用 JavaScript 动态生成的

**解决**：
1. 检查网络连接速度
2. 查看实际弹窗文字并告诉我们
3. 如需帮助，提供弹窗的 HTML 代码

---

## 💡 使用技巧

### 技巧 1: 测试选择器

在目标网页打开 F12 控制台，粘贴以下代码：

```javascript
const selector = '.add-to-cart-button';  // 改为你的选择器
const element = document.querySelector(selector);
if (element) {
  console.log('✅ 找到元素:', element);
  console.log('可见:', element.offsetParent !== null);
  element.scrollIntoView({ block: 'center' });
} else {
  console.log('❌ 未找到元素');
}
```

### 技巧 2: 测试点击

如果上面的选择器找到了元素，再运行：

```javascript
const element = document.querySelector('.add-to-cart-button');
// 模拟点击
element.click();
console.log('✅ 已点击');
```

### 技巧 3: 获取选择器

如果不知道选择器，在网页上：
1. 右键点击目标按钮
2. 选择「检查」(Inspect)
3. 查看 HTML 中的 `class` 或 `id` 属性
4. 组合成选择器：
   - ID: `#button-id`
   - Class: `.button-class`
   - 多个 Class: `.class1.class2`
   - 属性: `[data-action="click"]`

---

## 📞 获取帮助

如果遇到问题，请：

1. **查看日志** - 打开 F12 Console，复制完整的日志
2. **检查选择器** - 使用上面的测试代码验证
3. **检查网页** - 使用右键「检查」查看 HTML 结构
4. **提供信息** - 告诉我们：
   - 什么选择器不工作？
   - 弹窗长什么样？
   - HTML 代码是什么？

---

## ✅ 成功标志

当一切正常工作时，你会看到：

```
✅ 所有 URL 都被打开           → 标签页自动刷新
✅ 所有元素都被点击             → 页面有反应
✅ 所有成功弹窗都被检测到      → 日志显示「弹窗提示:」
✅ 所有标签页都自动关闭        → 标签页自动消失
✅ 所有下一个 URL 都被打开     → 新标签页自动打开
✅ 任务完成                      → 日志显示「自动化已完成」
```

---

## 🎉 就这样！

现在您已经掌握了如何使用扩展的等待弹窗功能。

**下一步**：
1. 准备您的 URL 列表
2. 找到正确的选择器
3. 运行自动化
4. 看着它自动完成！✨

**需要更多帮助**？查看 `WAIT_FOR_SUCCESS_GUIDE.md` 获取完整文档。

---

**版本**：v2.2.1  
**最后更新**：2026-05-02  
**不要忘记刷新扩展！** 🔄
