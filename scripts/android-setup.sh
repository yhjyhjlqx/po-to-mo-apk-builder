#!/bin/bash
set -e

echo "📥 安装Gradle..."
wget -q https://services.gradle.org/distributions/gradle-7.6-bin.zip -O /tmp/gradle.zip
unzip -q /tmp/gradle.zip -d /opt/
export PATH=$PATH:/opt/gradle-7.6/bin

echo "📦 安装Android SDK..."
yes | sdkmanager "platform-tools" "platforms;android-33" "build-tools;34.0.0"
