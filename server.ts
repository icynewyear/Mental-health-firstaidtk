import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import AdmZip from "adm-zip";
import { androidProjectFiles } from "./src/androidCode";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API endpoint health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // API to package and download the complete Android Studio Importable ZIP project
  app.get("/api/download-android-zip", (req, res) => {
    try {
      const zip = new AdmZip();

      // 1. Add all virtual target androidProjectFiles from androidCode.ts
      androidProjectFiles.forEach(file => {
        zip.addFile(file.path, Buffer.from(file.code, "utf8"), file.description || "");
      });

      // 2. Add structural Android boilerplate settings & files so Android Studio loads it instantly
      
      // build.gradle.kts (Project root)
      const projectBuildGradle = `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
}`;
      zip.addFile("build.gradle.kts", Buffer.from(projectBuildGradle, "utf8"));

      // settings.gradle.kts (Project root)
      const settingsGradle = `pluginManagement {
    repositories {
        google()
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "Mental Health Toolkit"
include(":app")`;
      zip.addFile("settings.gradle.kts", Buffer.from(settingsGradle, "utf8"));

      // gradle.properties (Project root)
      const gradleProperties = `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.nonTransitiveRClass=true
kotlin.code.style=official`;
      zip.addFile("gradle.properties", Buffer.from(gradleProperties, "utf8"));

      // gradle-wrapper.properties (gradle/wrapper/)
      const gradleWrapperProperties = `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.10.2-bin.zip
networkTimeout=10000
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists`;
      zip.addFile("gradle/wrapper/gradle-wrapper.properties", Buffer.from(gradleWrapperProperties, "utf8"));

      // AndroidManifest.xml (app/src/main/)
      const manifestXml = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.mentalhealth.firstaid">
    <application
        android:allowBackup="true"
        android:icon="@android:drawable/sym_def_app_icon"
        android:label="Mental Health Toolkit"
        android:supportsRtl="true"
        android:theme="@android:style/Theme.Material.NoActionBar">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@android:style/Theme.Material.NoActionBar">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
      zip.addFile("app/src/main/AndroidManifest.xml", Buffer.from(manifestXml, "utf8"));

      // Color.kt (app/src/main/java/com/mentalhealth/firstaid/ui/theme/)
      const colorKt = `package com.mentalhealth.firstaid.ui.theme

import androidx.compose.ui.graphics.Color

val SageGreenDark = Color(0xFF334E2B)
val SageGreenPrimary = Color(0xFF4A6741)
val SageGreenLight = Color(0xFFE1E8E3)
val SageGreenBackground = Color(0xFFF1F5F2)
val SageGreenSecondary = Color(0xFF8E9A8F)

val SageDarkPrimary = Color(0xFF90B486)
val SageDarkBackground = Color(0xFF1E241E)
val SageDarkSurface = Color(0xFF252D25)`;
      zip.addFile("app/src/main/java/com/mentalhealth/firstaid/ui/theme/Color.kt", Buffer.from(colorKt, "utf8"));

      // Theme.kt (app/src/main/java/com/mentalhealth/firstaid/ui/theme/)
      const themeKt = `package com.mentalhealth.firstaid.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = SageDarkPrimary,
    secondary = SageGreenSecondary,
    tertiary = SageGreenLight,
    background = SageDarkBackground,
    surface = SageDarkSurface,
    onPrimary = Color(0xFF1C2B19),
    onSecondary = Color.White,
    onBackground = Color(0xFFE2EBE2),
    onSurface = Color(0xFFE2EBE2)
)

private val LightColorScheme = lightColorScheme(
    primary = SageGreenPrimary,
    secondary = SageGreenSecondary,
    tertiary = SageGreenLight,
    background = SageGreenBackground,
    surface = Color.White,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = Color(0xFF1C1D1C),
    onSurface = Color(0xFF1C1D1C),
    surfaceVariant = SageGreenLight,
    onSurfaceVariant = SageGreenPrimary
)

@Composable
fun MentalHealthFirstAidTheme(
    darkTheme: Boolean = false,
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}`;
      zip.addFile("app/src/main/java/com/mentalhealth/firstaid/ui/theme/Theme.kt", Buffer.from(themeKt, "utf8"));

      const zipBuffer = zip.toBuffer();

      res.writeHead(200, {
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=MentalHealthToolkit_AndroidStudio_Project.zip",
        "Content-Length": zipBuffer.length
      });
      res.end(zipBuffer);
    } catch (error) {
      console.error("Failed to generate ZIP:", error);
      res.status(500).json({ error: "Failed to generate project ZIP archive." });
    }
  });

  // Vite integration middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
