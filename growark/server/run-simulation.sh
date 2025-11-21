#!/bin/bash

echo "🎮 课堂英雄 - 模拟数据生成器"
echo "=================================="
echo ""

# 检查是否在正确的目录
if [ ! -f "server.js" ]; then
  echo "❌ 错误: 请在 server.js 所在目录运行此脚本"
  exit 1
fi

# 安装依赖
echo "📦 检查并安装依赖..."
npm list mysql2 dotenv cors express >/dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "   正在安装依赖..."
  npm install
  echo "✅ 依赖安装完成"
else
  echo "✅ 依赖已安装"
fi
echo ""

# 检查环境配置
if [ ! -f ".env" ]; then
  echo "❌ 错误: 未找到 .env 文件"
  echo "   请确保配置了数据库连接信息"
  exit 1
fi

echo "📊 开始生成模拟数据..."
echo ""

# 运行模拟脚本
node simulate-activity.js

echo ""
echo "✨ 模拟数据生成流程已完成！"
echo ""
echo "接下来可以："
echo "1. 启动服务器: npm run dev"
echo "2. 打开大屏端查看实时数据"
echo "3. 打开手机端进行操作"
echo ""
