#!/bin/bash

# 色彩输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   Chrome 自动化扩展 - 项目验证脚本${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

# 项目根目录
PROJECT_DIR="/Users/zhuyun/www/collect"

# 检查计数器
CHECKS_PASSED=0
CHECKS_FAILED=0

# 验证函数
check_file() {
  local file=$1
  local description=$2
  
  if [ -f "$PROJECT_DIR/$file" ]; then
    echo -e "${GREEN}✓${NC} $description: ${YELLOW}$file${NC}"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} ${RED}缺失${NC} $description: ${YELLOW}$file${NC}"
    ((CHECKS_FAILED++))
  fi
}

check_directory() {
  local dir=$1
  local description=$2
  
  if [ -d "$PROJECT_DIR/$dir" ]; then
    echo -e "${GREEN}✓${NC} $description: ${YELLOW}$dir/${NC}"
    ((CHECKS_PASSED++))
  else
    echo -e "${RED}✗${NC} ${RED}缺失${NC} $description: ${YELLOW}$dir/${NC}"
    ((CHECKS_FAILED++))
  fi
}

# 检查 JSON 格式
check_json() {
  local file=$1
  local description=$2
  
  if [ -f "$PROJECT_DIR/$file" ]; then
    if python3 -m json.tool "$PROJECT_DIR/$file" > /dev/null 2>&1; then
      echo -e "${GREEN}✓${NC} $description 格式检查: ${YELLOW}✅ 有效${NC}"
      ((CHECKS_PASSED++))
    else
      echo -e "${YELLOW}⚠${NC} $description 格式检查: ${RED}❌ 无效${NC}"
      ((CHECKS_FAILED++))
    fi
  else
    echo -e "${RED}✗${NC} $description: ${RED}文件不存在${NC}"
    ((CHECKS_FAILED++))
  fi
}

# 检查 CSS 注释
check_css() {
  local file=$1
  local description=$2
  
  if [ -f "$PROJECT_DIR/$file" ]; then
    # 简单的语法检查（检查是否有明显的等号和冒号）
    if grep -q ":" "$PROJECT_DIR/$file" && grep -q "{" "$PROJECT_DIR/$file"; then
      echo -e "${GREEN}✓${NC} $description 语法检查: ${YELLOW}✅ OK${NC}"
      ((CHECKS_PASSED++))
    else
      echo -e "${YELLOW}⚠${NC} $description 语法检查: ${YELLOW}可能有问题${NC}"
      ((CHECKS_FAILED++))
    fi
  fi
}

# 开始检查
echo -e "${BLUE}1. 核心代码文件${NC}"
echo "────────────────────────────────"
check_file "manifest.json" "扩展配置"
check_file "popup.html" "扩展 UI"
check_file "popup.css" "扩展样式"
check_file "popup.js" "UI 交互逻辑"
check_file "background.js" "后台脚本"
check_file "content-script.js" "内容脚本"
echo ""

echo -e "${BLUE}2. 图像和资源${NC}"
echo "────────────────────────────────"
check_directory "images" "图标目录"
check_file "images/icon-16.png" "16x16 图标"
check_file "images/icon-48.png" "48x48 图标"
check_file "images/icon-128.png" "128x128 图标"
echo ""

echo -e "${BLUE}3. 文档文件${NC}"
echo "────────────────────────────────"
check_file "README.md" "项目 README"
check_file "INSTALLATION.md" "安装指南"
check_file "USAGE_EXAMPLES.md" "使用示例"
check_file "PROJECT_SUMMARY.md" "项目总结"
check_file "CHANGELOG.md" "版本变更"
check_file "TESTING_GUIDE.md" "测试指南"
check_file "IMPLEMENTATION_SUMMARY.md" "实现细节"
check_file "COMPLETION_SUMMARY.md" "完成总结"
echo ""

echo -e "${BLUE}4. 测试和示例${NC}"
echo "────────────────────────────────"
check_file "test-page.html" "测试页面"
check_file "EXAMPLES.json" "配置示例"
echo ""

echo -e "${BLUE}5. 工具脚本${NC}"
echo "────────────────────────────────"
check_file "QUICK_START.sh" "快速启动脚本"
check_file "installation-check.sh" "安装检查脚本"
echo ""

echo -e "${BLUE}6. 文件格式检查${NC}"
echo "────────────────────────────────"
check_json "manifest.json" "manifest.json"
check_json "EXAMPLES.json" "EXAMPLES.json"
check_css "popup.css" "popup.css"
echo ""

echo -e "${BLUE}7. 代码文件大小${NC}"
echo "────────────────────────────────"

get_file_lines() {
  local file=$1
  [ -f "$PROJECT_DIR/$file" ] && wc -l < "$PROJECT_DIR/$file" || echo "0"
}

manifest_lines=$(get_file_lines "manifest.json")
popup_js_lines=$(get_file_lines "popup.js")
popup_css_lines=$(get_file_lines "popup.css")
popup_html_lines=$(get_file_lines "popup.html")
bg_lines=$(get_file_lines "background.js")
cs_lines=$(get_file_lines "content-script.js")

echo -e "  ${YELLOW}manifest.json${NC}: $manifest_lines 行"
echo -e "  ${YELLOW}popup.html${NC}: $popup_html_lines 行"
echo -e "  ${YELLOW}popup.css${NC}: $popup_css_lines 行"
echo -e "  ${YELLOW}popup.js${NC}: $popup_js_lines 行"
echo -e "  ${YELLOW}background.js${NC}: $bg_lines 行"
echo -e "  ${YELLOW}content-script.js${NC}: $cs_lines 行"

total_lines=$((manifest_lines + popup_js_lines + popup_css_lines + popup_html_lines + bg_lines + cs_lines))
echo -e "  ${GREEN}合计: $total_lines 行代码${NC}"
echo ""

echo -e "${BLUE}8. 功能检查${NC}"
echo "────────────────────────────────"

# 检查 content-script 中是否有元素选择功能
if grep -q "enableElementSelection" "$PROJECT_DIR/content-script.js"; then
  echo -e "${GREEN}✓${NC} 元素选择模式: ${YELLOW}✅ 已实现${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} 元素选择模式: ${YELLOW}❌ 未找到${NC}"
  ((CHECKS_FAILED++))
fi

# 检查 popup.js 中是否有 selectorMode
if grep -q "selectorMode" "$PROJECT_DIR/popup.js"; then
  echo -e "${GREEN}✓${NC} 选择器模式管理: ${YELLOW}✅ 已实现${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} 选择器模式管理: ${YELLOW}❌ 未找到${NC}"
  ((CHECKS_FAILED++))
fi

# 检查是否有自动点击功能
if grep -q "clickElement" "$PROJECT_DIR/content-script.js"; then
  echo -e "${GREEN}✓${NC} 自动点击功能: ${YELLOW}✅ 已实现${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} 自动点击功能: ${YELLOW}❌ 未找到${NC}"
  ((CHECKS_FAILED++))
fi

# 检查 Storage 使用
if grep -q "chrome.storage" "$PROJECT_DIR/popup.js" "$PROJECT_DIR/background.js"; then
  echo -e "${GREEN}✓${NC} 数据持久化: ${YELLOW}✅ 已实现${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} 数据持久化: ${YELLOW}❌ 未找到${NC}"
  ((CHECKS_FAILED++))
fi

# 检查消息传递
if grep -q "chrome.runtime.onMessage" "$PROJECT_DIR/content-script.js" "$PROJECT_DIR/popup.js"; then
  echo -e "${GREEN}✓${NC} 跨脚本通信: ${YELLOW}✅ 已实现${NC}"
  ((CHECKS_PASSED++))
else
  echo -e "${RED}✗${NC} 跨脚本通信: ${YELLOW}❌ 未找到${NC}"
  ((CHECKS_FAILED++))
fi

echo ""
echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   验证结果总结${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""

TOTAL_CHECKS=$((CHECKS_PASSED + CHECKS_FAILED))
PASS_PERCENTAGE=$((CHECKS_PASSED * 100 / TOTAL_CHECKS))

echo -e "  ${GREEN}✓ 通过: $CHECKS_PASSED${NC}"
echo -e "  ${RED}✗ 失败: $CHECKS_FAILED${NC}"
echo -e "  ${YELLOW}总计: $TOTAL_CHECKS${NC}"
echo ""
echo -e "  ${BLUE}通过率: ${PASS_PERCENTAGE}%${NC}"
echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
  echo -e "${GREEN}🎉 所有检查通过！项目完整性验证成功！${NC}"
  echo ""
  echo -e "${YELLOW}下一步：${NC}"
  echo -e "  1. 打开 ${BLUE}chrome://extensions/${NC}"
  echo -e "  2. 启用\"${BLUE}开发者模式${NC}\""
  echo -e "  3. 点击\"${BLUE}加载已解压的扩展程序${NC}\""
  echo -e "  4. 选择 ${YELLOW}/Users/zhuyun/www/collect/${NC}"
  echo ""
else
  echo -e "${YELLOW}⚠️  发现 $CHECKS_FAILED 个问题，请检查上述失败项。${NC}"
  echo ""
fi

echo -e "${BLUE}================================================${NC}"
echo -e "${BLUE}   详细文档${NC}"
echo -e "${BLUE}================================================${NC}"
echo ""
echo -e "📖 快速开始: 查看 ${YELLOW}README.md${NC}"
echo -e "🚀 安装指南: 查看 ${YELLOW}INSTALLATION.md${NC}"
echo -e "📝 测试指南: 查看 ${YELLOW}TESTING_GUIDE.md${NC}"
echo -e "📋 使用示例: 查看 ${YELLOW}USAGE_EXAMPLES.md${NC}"
echo -e "🔧 实现细节: 查看 ${YELLOW}IMPLEMENTATION_SUMMARY.md${NC}"
echo -e "✅ 完成总结: 查看 ${YELLOW}COMPLETION_SUMMARY.md${NC}"
echo ""

exit $CHECKS_FAILED