#!/bin/bash
# 使用国内镜像源安装Android SDK
set -e

echo "🔧 配置清华镜像源"
mkdir -p ~/.android
cat > ~/.android/repositories.cfg <<EOL
disabled=0
enableRepoSources=1
useRemote=1
EOL

echo "📥 下载SDK工具包"
SDK_URL="https://mirrors.tuna.tsinghua.edu.cn/android/repository/commandlinetools-linux-9477386_latest.zip"
wget -q --show-progress -O /tmp/cmdline-tools.zip $SDK_URL

echo "📦 解压SDK"
unzip -q /tmp/cmdline-tools.zip -d ~/android-sdk
mv ~/android-sdk/cmdline-tools ~/android-sdk/cmdline-tools/latest

echo "⚙️ 设置环境变量"
export ANDROID_HOME=~/android-sdk
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin

echo "📝 修改gradle镜像配置"
mkdir -p ~/.gradle
cat > ~/.gradle/init.gradle <<EOL
allprojects {
    repositories {
        maven { url 'https://maven.aliyun.com/repository/public' }
        maven { url 'https://maven.aliyun.com/repository/google' }
        mavenLocal()
        mavenCentral()
    }
}
EOL

echo "🛠️ 安装必要组件"
yes | $ANDROID_HOME/cmdline-tools/latest/bin/sdkmanager \
  --sdk_root=$ANDROID_HOME \
  --channel=0 \
  "platform-tools" \
  "platforms;android-33" \
  "build-tools;34.0.0"

echo "✅ Android环境配置完成"
