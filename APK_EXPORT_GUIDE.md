# Safe Space Studio — GitHub to Android Test APK Guide

Welcome to the **Safe Space Studio** development workspace. Since your prototype includes a complete, fully engineered suite of **Jetpack Compose (Kotlin)** screens and architectural configurations, you can easily compile these sources to create a real, fully interactive physical `.apk` file for testing on any Android device.

Follow this step-by-step guide to export your generated code, push it to GitHub, and use an automated **GitHub Actions** pipeline to compile and deliver a downloadable test APK instantly.

---

## 📋 Architectural Overview

The generated code consists of:
*   **Version Catalog (`libs.versions.toml`):** Manages dependencies for Material Design 3, Jetpack Navigation, and Lifecycles.
*   **Module Gradle (`build.gradle.kts`):** Standardizes compiler and SDK settings (target SDK 35, Java 11 rules).
*   **MainActivity & Compose Screens:** Modular Kotlin views representing the breathing modules, somatic coping engines, emergency panic buttons, and crisis lists.

To compile these, you will need a basic Android project layout.

---

## 🛠️ Step 1: Create a Local Android Studio Project

First, create a clean Android container shell on your computer to host the generated code:

1.  **Download Android Studio:** Install the latest stable version of Android Studio (such as Arctic Fox or Ladybug).
2.  **Initialize empty layout:**
    *   Click **New Project** in the launch panel.
    *   Select the **Empty Activity** template (the modern template optimized for Jetpack Compose).
    *   Click **Next**.
3.  **Specify Project details exactly:**
    *   **Name:** `Safe Space Studio`
    *   **Package Name:** `com.mentalhealth.firstaid` *(Make sure this matches the package declarations at the top of the Kotlin files).*
    *   **Language:** `Kotlin`
    *   **Minimum SDK:** `API 26` (Android 8.0 Oreo - matches device capabilities).
    *   **Build Configuration Language:** `Kotlin DSL (build.gradle.kts)`
4.  Click **Finish** and wait for Gradle to index the preliminary workspace.

---

## ✒️ Step 2: Swap the Build Configuration Files

Next, configure Android Studio with the exact dependencies required by our mental health components:

1.  **Dependency Versions:** Open `gradle/libs.versions.toml` in your project and replace its entire contents with the generated **`libs.versions.toml`** code from our app's workspace.
2.  **App Gradle Settings:** Open `app/build.gradle.kts` in your project and replace its complete contents with the generated **`build.gradle.kts`** code.
3.  **Sync Dependencies:** Click **"Sync Project with Gradle Files"** (often shown as an elephant icon or as a yellow warning bar at the top of your editors). Android Studio will automatically download all required libraries including **Material 3 Icons**, **Jetpack Navigation**, and **ViewModel Compose**.

---

## 📁 Step 3: Populate the Source Code

Add the high-quality interactive features you built to your new application package:

1.  Navigate to your app directory: `app/src/main/java/com/mentalhealth/firstaid/`.
2.  **MainActivity.kt:** Replace your local file completely with the generated **`MainActivity.kt`** source code.
3.  **Create Screens folder:** Right-click the `com.mentalhealth.firstaid` directory, select **New -> Package**, and name it `ui.screens`. (This creates the standard UI subdirectory structure).
4.  **Add screens:** Inside `ui/screens/`, create a new Kotlin class/file for each screen, then paste the corresponding code from the workspace:
    *   `DashboardScreen.kt`
    *   `GuidedBreathingScreen.kt`
    *   `GroundingExerciseScreen.kt`
    *   `EmergencyContactsScreen.kt`
    *   `CopingReliefScreen.kt`
    *   `ThoughtReframerScreen.kt`
    *   `NeuroVitalsScreen.kt`
    *   `GratitudeJarScreen.kt`
    *   `SomaticRelaxationScreen.kt`
    *   `StanleyBrownSafetyPlan.kt`
    *   `SoundscapeScreen.kt`
    *   `WorryLockboxScreen.kt`
    *   `EmdrPacerScreen.kt`
    *   `EmotionWheelScreen.kt`
    *   `VagusResetScreen.kt`
    *   `PanicRescueScreen.kt`

---

## 🚀 Step 4: Build Options (Local Offline or Free Auto-Builds)

You don't need GitHub Premium or any paid account to build your app! You can compile your APK in two different ways: **Option A (100% Local & Offline)** or **Option B (Free GitHub Actions automated build)**.

### 🔌 Option A: Compile Automatically on Your Local Computer (Recommended)
You can build the APK right on your machine instantly, completely offline.

1. **Inside Android Studio:**
   * Go to the top menu bar and select **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   * Wait a few seconds for the build task to complete.
   * A small popup notification will appear at the bottom right. Click **locate** to instantly open your computer's file explorer showing your newly compiled **`app-debug.apk`**!

2. **Via Local Terminal (CLI):**
   * Open the local terminal inside Android Studio or your command prompt.
   * Run the following command:
     * **Mac/Linux:** `./gradlew assembleDebug`
     * **Windows:** `gradlew.bat assembleDebug`
   * Once it prints `BUILD SUCCESSFUL`, you can find your compiled test APK file in your local directory at:
     `app/build/outputs/apk/debug/app-debug.apk`

---

### ☁️ Option B: Free Automation using GitHub Actions (No Paid Account Needed)
*Note: GitHub Actions is completely **free** (with 2,000+ build minutes every month) for all standard free accounts. No GitHub Pro/Premium subscription is required!*

1. In the root folder of your local project, create the following path:
   `.github/workflows/`
2. Inside `.github/workflows/`, create a new text file named **`build-apk.yml`**.
3. Paste the following automated script into **`build-apk.yml`**:

```yaml
name: Compile & Package Safe Space Android APK

on:
  push:
    branches: [ "main", "master" ]
  pull_request:
    branches: [ "main", "master" ]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
    - name: Check out Repository
      uses: actions/checkout@v4

    - name: Set up JDK 17
      uses: actions/setup-java@v4
      with:
        distribution: 'zulu'
        java-version: '17'
        cache: 'gradle'

    - name: Grant Execute Permission for Gradle Wrapper
      run: chmod +x gradlew

    - name: Build Android Debug APK
      run: ./gradlew assembleDebug

    - name: Upload Compiled Test APK
      uses: actions/upload-artifact@v4
      with:
        name: safe-space-test-apk
        path: app/build/outputs/apk/debug/app-debug.apk
        retention-days: 7
```

4. Commit your files and push them to your repository on GitHub:
   ```bash
   git init
   git add .
   git commit -m "feat: Initial commit with Kotlin modules & workflow"
   git remote add origin <your-github-repo-url>
   git branch -M main
   git push -u origin main
   ```

---

## 📥 Step 5: Download and Install Your Test APK

### If you used Option A (Local Build):
1. Simply copy the generated file from `app/build/outputs/apk/debug/app-debug.apk` to your phone via USB cable, email, or Google Drive.
2. Tap the file in your phone's File Manager app to install it!

### If you used Option B (GitHub Workflow):
1. Open your repository on **GitHub** in your web browser.
2. Click on the **Actions** tab at the top.
3. Select the latest run of the **"Compile & Package Safe Space Android APK"** workflow.
4. Scroll down to the bottom of the page to find the **Artifacts** section.
5. Click on **`safe-space-test-apk`** to download a ZIP archive containing your built **`app-debug.apk`**.
6. Extract the ZIP and install the APK on your device! *(Ensure you have "Install Unknown Apps" enabled in your browser/file explorer settings).*

*You now have a fully responsive, native Material 3 self-care app running on your physical phone!*
