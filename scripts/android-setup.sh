#!/bin/bash
set -e

echo "🔍 验证系统依赖..."
required_commands=(java wget unzip md5sum)
for cmd in "${required_commands[@]}"; do
  if ! command -v "$cmd" &> /dev/null; then
    echo "❌ 缺少必要命令: $cmd"
    exit 1
  fi
done

echo "📥 从腾讯镜像下载SDK..."
SDK_URL="https://mirrors.cloud.tencent.com/android/repository/commandlinetools-linux-9477386_latest.zip"
wget -q --show-progress "$SDK_URL" -O /tmp/cmdline-tools.zip

echo "🔄 校验文件完整性..."
expected_md5="6b15f540b6dee6f6d23c1d0f855fe623"
actual_md5=$(md5sum /tmp/cmdline-tools.zip | cut -d' ' -f1)

if [ "$expected_md5" != "$actual_md5" ]; then
  echo "❌ 文件校验失败 (预期: $expected_md5, 实际: $actual_md5)"
  exit 1
fi

echo "📦 设置Android环境..."
mkdir -p ~/android-sdk
unzip -q /tmp/cmdline-tools.zip -d ~/android-sdk
mv ~/android-sdk/cmdline-tools ~/android-sdk/cmdline-tools/latest

export ANDROID_HOME=~/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

echo "⚙️ 安装必要组件..."
yes | sdkmanager --licenses > /dev/null
sdkmanager "platform-tools" "platforms;android-33" "build-tools;34.0.0"

echo "✅ Android环境配置完成"
