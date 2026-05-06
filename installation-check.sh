#!/usr/bin/env bash

# installation-check.sh - 检查扩展安装是否正确

echo ""
echo "=================================="
echo "  自动化采集工具 - 安装检查"
echo "=================================="
echo ""

# 定义项目目录
PROJECT_DIR="/Users/zhuyun/www/collect"

# 颜色定义
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 检查计数
PASSED=0
FAILED=0

# 函数：检查文件是否存在
check_file() {
    if [ -f "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        echo "  文件未找到: $1"
        ((FAILED++))
    fi
}

# 函数：检查目录是否存在
check_dir() {
    if [ -d "$1" ]; then
        echo -e "${GREEN}✓${NC} $2"
        ((PASSED++))
    else
        echo -e "${RED}✗${NC} $2"
        echo "  目录未找到: $1"
        ((FAILED++))
    fi
}

echo "📁 检查项目结构..."
echo ""

# 检查核心文件
check_file "$PROJECT_DIR/manifest.json" "manifest.json (扩展配置)"
check_file "$PROJECT_DIR/popup.html" "popup.html (UI 界面)"
check_file "$PROJECT_DIR/popup.css" "popup.css (样式文件)"
check_file "$PROJECT_DIR/popup.js" "popup.js (界面逻辑)"
check_file "$PROJECT_DIR/background.js" "background.js (后台脚本)"
check_file "$PROJECT_DIR/content-script.js" "content-script.js (内容脚本)"

echo ""
echo "📚 检查文档文件..."
echo ""

# 检查文档
check_file "$PROJECT_DIR/README.md" "README.md (主文档)"
check_file "$PROJECT_DIR/USAGE_EXAMPLES.md" "USAGE_EXAMPLES.md (使用示例)"
check_file "$PROJECT_DIR/CHANGELOG.md" "CHANGELOG.md (更新日志)"
check_file "$PROJECT_DIR/EXAMPLES.json" "EXAMPLES.json (配置例子)"

echo ""
echo "🖼️  检查图标文件..."
echo ""

# 检查图标目录
check_dir "$PROJECT_DIR/images" "images/ (图标目录)"

echo ""
echo "📊 检查结果："
echo ""
echo -e "${GREEN}✓ 成功${NC}: $PASSED 个"
echo -e "${RED}✗ 失败${NC}: $FAILED 个"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}装状态: 完美! ✨${NC}"
    echo ""
    echo "✅ 下一步:"
    echo "   1. 打开 Chrome 浏览器"
    echo "   2. 进入 chrome://extensions/"
    echo "   3. 启用【开发者模式】"
    echo "   4. 点击【加载已解压的扩展程序】"
    echo "   5. 选择项目文件夹"
    echo ""
else
    echo -e "${RED}安装状态: 有问题 ⚠️${NC}"
    echo ""
    echo "❌ 缺少文件！请确保所有文件都已创建。"
    echo "$FAILED 个文件需要修复。"
    echo ""
fi

echo "=================================="
echo ""
