#!/bin/bash
set -e

# 🔥 新增：创建临时目录
temp_dir=$(mktemp -d -t apk-build-XXXXXX)

echo "🛠️ 生成最小Android项目..."
mkdir -p "$temp_dir/app/src/main/{java/com/example,res}"

cat > "$temp_dir/app/build.gradle" <<EOF
plugins { id 'com.android.application' }

android {
    compileSdk 33
    defaultConfig {
        applicationId "com.example.app"
        minSdk 24
        targetSdk 33
    }
    buildTypes {
        release {
            minifyEnabled false
            signingConfig signingConfigs.debug
        }
    }
}
EOF

cat > "$temp_dir/app/src/main/AndroidManifest.xml" <<EOF
<?xml version="1.0" encoding="utf-8"?>
<manifest package="com.example.app">
    <application android:label="Dynamic APK">
        <activity android:name=".MainActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

echo "⚙️ 编译APK..."
cp "$1" "$temp_dir/app/src/main/java/com/example/MainActivity.java"
cd "$temp_dir"
./gradlew assembleRelease
mv "app/build/outputs/apk/release/app-release.apk" ../../public/
cd ../..

# 🔥 新增：强制清理临时目录
echo "🧹 清理临时文件..."
rm -rf "$temp_dir"
