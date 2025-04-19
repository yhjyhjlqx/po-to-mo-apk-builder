#!/bin/bash
echo "Building APK..."
cp -r public/android-template ./android-project
cp $1 android-project/app/src/main/java/com/example/MainActivity.java
cd android-project
./gradlew assembleRelease
