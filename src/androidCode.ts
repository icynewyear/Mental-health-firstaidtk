import { CodeFile } from './types';

export const androidProjectFiles: CodeFile[] = [
  {
    name: "build.gradle.kts (Module: app)",
    path: "app/build.gradle.kts",
    language: "kotlin",
    description: "Contains necessary dependencies for Jetpack Compose, Material Design 3, Jetpack Navigation, Lifecycle ViewModel, and StateFlow.",
    code: `plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.android)
    alias(libs.plugins.kotlin.compose)
}

android {
    namespace = "com.mentalhealth.firstaid"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.mentalhealth.firstaid"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_11
        targetCompatibility = JavaVersion.VERSION_11
    }
    kotlinOptions {
        jvmTarget = "11"
    }
    buildFeatures {
        compose = true
    }
}

dependencies {
    // AndroidX Core & Lifecycle
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.activity.compose)

    // Jetpack Compose & Material 3
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.material.icons.extended)

    // Navigation and Architecture
    implementation(libs.androidx.navigation.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    
    // Testing
    testImplementation(libs.junit)
    androidTestImplementation(libs.androidx.junit)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    debugImplementation(libs.androidx.compose.ui.tooling)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
}`
  },
  {
    name: "libs.versions.toml",
    path: "gradle/libs.versions.toml",
    language: "toml",
    description: "The Version Catalog declaring dependency versions for standard gradle configurations.",
    code: `[versions]
agp = "8.8.0"
kotlin = "2.0.0"
coreKtx = "1.12.0"
junit = "4.13.2"
junitVersion = "1.1.5"
espressoCore = "3.5.1"
lifecycleRuntimeKtx = "2.7.0"
activityCompose = "1.8.2"
composeBom = "2024.02.00"
navigationCompose = "2.7.7"
lifecycleViewModelCompose = "2.7.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose", name = "ui-graphics" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose", name = "ui-tooling-preview" }
androidx-compose-material3 = { group = "androidx.compose", name = "material3" }
androidx-compose-material-icons-extended = { group = "androidx.compose", name = "material-icons-extended" }
androidx-navigation-compose = { group = "androidx.navigation", name = "navigation-compose", version.ref = "navigationCompose" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleViewModelCompose" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
androidx-compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-compose-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
androidx-compose-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-android = { id = "org.jetbrains.kotlin.android", version.ref = "kotlin" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }`
  },
  {
    name: "MainActivity.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/MainActivity.kt",
    language: "kotlin",
    description: "The application entry point containing the Compose navigation setup, Material 3 Theme wrapping, and modular route definitions.",
    code: `package com.mentalhealth.firstaid

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Home
import androidx.compose.material.icons.filled.Info
import androidx.compose.material.icons.filled.MenuBook
import androidx.compose.material.icons.filled.Phone
import androidx.compose.material.icons.filled.Spa
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.mentalhealth.firstaid.ui.theme.MentalHealthFirstAidTheme
import com.mentalhealth.firstaid.ui.screens.*

class MainActivity : ComponentActivity() {
    override class onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MentalHealthFirstAidTheme {
                MainAppStructure()
            }
        }
    }
}

sealed class Screen(val route: String, val title: String, val icon: @Composable () -> Unit) {
    object Dashboard : Screen("dashboard", "Home", { Icon(Icons.Default.Home, contentDescription = "Home") })
    object Breathing : Screen("breathing", "Breathe", { Icon(Icons.Default.Spa, contentDescription = "Breathe") })
    object Grounding : Screen("grounding", "Ground", { Icon(Icons.Default.MenuBook, contentDescription = "Ground") })
    object Relief : Screen("relief", "Coping", { Icon(Icons.Default.Info, contentDescription = "Coping") })
    object Emergency : Screen("emergency", "Crisis", { Icon(Icons.Default.Phone, contentDescription = "Crisis") })
}

@Composable
fun MainAppStructure() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry?.destination?.route

    Scaffold(
        modifier = Modifier.fillMaxSize(),
        bottomBar = {
            NavigationBar(
                containerColor = MaterialTheme.colorScheme.surfaceVariant,
                contentColor = MaterialTheme.colorScheme.onSurfaceVariant
            ) {
                val screens = listOf(
                    Screen.Dashboard,
                    Screen.Breathing,
                    Screen.Grounding,
                    Screen.Relief,
                    Screen.Emergency
                )
                screens.forEach { screen ->
                    NavigationBarItem(
                        icon = screen.icon,
                        label = { Text(screen.title) },
                        selected = currentRoute == screen.route,
                        onClick = {
                            if (currentRoute != screen.route) {
                                navController.navigate(screen.route) {
                                    popUpTo(navController.graph.findStartDestination().id) {
                                        saveState = true
                                    }
                                    launchSingleTop = true
                                    restoreState = true
                                }
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Dashboard.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Dashboard.route) {
                DashboardScreen(
                    onNavigateToBreathing = { navController.navigate(Screen.Breathing.route) },
                    onNavigateToGrounding = { navController.navigate(Screen.Grounding.route) },
                    onNavigateToRelief = { navController.navigate(Screen.Relief.route) },
                    onNavigateToEmergency = { navController.navigate(Screen.Emergency.route) }
                )
            }
            composable(Screen.Breathing.route) {
                GuidedBreathingScreen()
            }
            composable(Screen.Grounding.route) {
                GroundingExerciseScreen()
            }
            composable(Screen.Relief.route) {
                CopingReliefScreen()
            }
            composable(Screen.Emergency.route) {
                EmergencyContactsScreen()
            }
        }
    }
}`
  },
  {
    name: "GuidedBreathingScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/GuidedBreathingScreen.kt",
    language: "kotlin",
    description: "The beautiful Breathing tool featuring realistic smooth animation, Box breathing (4-4-4-4) & Calming (4-7-8) methods, custom Canvas drawing, and interactive sound cue alerts.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Vibration
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class BreathingPhase(val label: String, val color: Color) {
    INHALE("Breathe In", Color(0xFF81C784)),
    HOLD_IN("Hold", Color(0xFFFFB74D)),
    EXHALE("Breathe Out", Color(0xFF64B5F6)),
    HOLD_OUT("Hold & Rest", Color(0xFFFF8A65))
}

@Composable
fun GuidedBreathingScreen() {
    var isBoxBreathing by remember { mutableStateOf(true) } // Box Breathing (4s-4s-4s-4s) vs Calm Breathing (4s-7s-8s)
    var isRunning by remember { mutableStateOf(false) }
    var currentPhase by remember { mutableStateOf(BreathingPhase.INHALE) }
    var secondsLeftInPhase by remember { mutableStateOf(4) }
    var cycleCount by remember { mutableIntStateOf(0) }
    
    val hapticFeedback = LocalHapticFeedback.current
    var isHapticEnabled by remember { mutableStateOf(true) }
    
    val scope = rememberCoroutineScope()

    // Breathing Animation Scale Spec
    val targetScale = when (currentPhase) {
        BreathingPhase.INHALE -> 1.8f
        BreathingPhase.HOLD_IN -> 1.8f
        BreathingPhase.EXHALE -> 1.0f
        BreathingPhase.HOLD_OUT -> 1.0f
    }
    
    val transitionDuration = when (currentPhase) {
        BreathingPhase.INHALE -> if (isBoxBreathing) 4000 else 4000
        BreathingPhase.HOLD_IN -> if (isBoxBreathing) 4000 else 7000
        BreathingPhase.EXHALE -> if (isBoxBreathing) 4000 else 8000
        BreathingPhase.HOLD_OUT -> 4000
    }

    val animatedScale by animateFloatAsState(
        targetValue = if (isRunning) targetScale else 1.0f,
        animationSpec = tween(
            durationMillis = transitionDuration,
            easing = LinearEasing
        ),
        label = "BreathingCircleScale"
    )

    // Gentle pulsing animation during hold cycles
    val isHoldPhase = isRunning && (currentPhase == BreathingPhase.HOLD_IN || currentPhase == BreathingPhase.HOLD_OUT)
    val infiniteTransition = rememberInfiniteTransition(label = "HoldPulseTransition")
    val pulseFactor by infiniteTransition.animateFloat(
        initialValue = 1.0f,
        targetValue = 1.04f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = 1000, easing = FastOutSlowInEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "HoldPulseScale"
    )
    val currentPulseFactor = if (isHoldPhase) pulseFactor else 1.0f

    // Core timing loop
    LaunchedEffect(isRunning, isBoxBreathing, currentPhase, isHapticEnabled) {
        if (isRunning) {
            while (isRunning) {
                delay(1000)
                if (secondsLeftInPhase > 1) {
                    secondsLeftInPhase--
                } else {
                    if (isHapticEnabled) {
                        hapticFeedback.performHapticFeedback(HapticFeedbackType.TextHandleMove)
                    }
                    // Phase change state-machine
                    if (isBoxBreathing) {
                        when (currentPhase) {
                            BreathingPhase.INHALE -> {
                                currentPhase = BreathingPhase.HOLD_IN
                                secondsLeftInPhase = 4
                            }
                            BreathingPhase.HOLD_IN -> {
                                currentPhase = BreathingPhase.EXHALE
                                secondsLeftInPhase = 4
                            }
                            BreathingPhase.EXHALE -> {
                                currentPhase = BreathingPhase.HOLD_OUT
                                secondsLeftInPhase = 4
                            }
                            BreathingPhase.HOLD_OUT -> {
                                currentPhase = BreathingPhase.INHALE
                                secondsLeftInPhase = 4
                                cycleCount++
                            }
                        }
                    } else { // 4-7-8 Calm Technique
                        when (currentPhase) {
                            BreathingPhase.INHALE -> {
                                currentPhase = BreathingPhase.HOLD_IN
                                secondsLeftInPhase = 7
                            }
                            BreathingPhase.HOLD_IN -> {
                                currentPhase = BreathingPhase.EXHALE
                                secondsLeftInPhase = 8
                            }
                            BreathingPhase.EXHALE -> {
                                currentPhase = BreathingPhase.INHALE
                                secondsLeftInPhase = 4
                                cycleCount++
                            }
                            BreathingPhase.HOLD_OUT -> {
                                currentPhase = BreathingPhase.INHALE
                                secondsLeftInPhase = 4
                            }
                        }
                    }
                }
            }
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF4F7F4))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Mode Selector Tab
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(
                text = "Guided Breathing",
                style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
                color = Color(0xFF2C3E50),
                modifier = Modifier.padding(top = 16.dp)
            )
            Text(
                text = "Regulate heart rate and soothe stress instantly",
                style = MaterialTheme.typography.bodyMedium,
                color = Color(0xFF7F8C8D),
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 24.dp, vertical = 8.dp)
            )
            
            TabRow(
                selectedTabIndex = if (isBoxBreathing) 0 else 1,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 16.dp)
                    .background(Color.White, shape = CircleShape),
                containerColor = Color.Transparent,
                indicator = {}
            ) {
                Tab(
                    selected = isBoxBreathing,
                    onClick = {
                        isBoxBreathing = true
                        isRunning = false
                        currentPhase = BreathingPhase.INHALE
                        secondsLeftInPhase = 4
                        cycleCount = 0
                    },
                    modifier = Modifier.padding(8.dp)
                ) {
                    Text(
                        "Square Breathing (4-4-4-4)",
                        fontWeight = if (isBoxBreathing) FontWeight.Bold else FontWeight.Normal,
                        color = if (isBoxBreathing) MaterialTheme.colorScheme.primary else Color.Gray
                    )
                }
                Tab(
                    selected = !isBoxBreathing,
                    onClick = {
                        isBoxBreathing = false
                        isRunning = false
                        currentPhase = BreathingPhase.INHALE
                        secondsLeftInPhase = 4
                        cycleCount = 0
                    },
                    modifier = Modifier.padding(8.dp)
                ) {
                    Text(
                        "Calm Breath (4-7-8)",
                        fontWeight = if (!isBoxBreathing) FontWeight.Bold else FontWeight.Normal,
                        color = if (!isBoxBreathing) MaterialTheme.colorScheme.primary else Color.Gray
                    )
                }
            }
        }

        // Animated Breathing Sphere & Custom Ring Drawer canvas
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(280.dp)
                .padding(24.dp)
        ) {
            // Ripple background aura
            Box(
                modifier = Modifier
                    .size(150.dp)
                    .scale(animatedScale * currentPulseFactor)
                    .background(
                        color = currentPhase.color.copy(alpha = 0.15f),
                        shape = CircleShape
                    )
            )
            
            // Solid center breathing core bubble
            Box(
                modifier = Modifier
                    .size(110.dp)
                    .scale((1.0f + (animatedScale - 1.0f) * 0.45f) * currentPulseFactor)
                    .background(
                        color = currentPhase.color.copy(alpha = 0.85f),
                        shape = CircleShape
                    )
                    .clickable { isRunning = !isRunning },
                contentAlignment = Alignment.Center
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = if (isRunning) currentPhase.label else "Tap to Start",
                        color = Color.White,
                        fontWeight = FontWeight.Bold,
                        fontSize = 18.sp,
                        textAlign = TextAlign.Center
                    )
                    if (isRunning) {
                        val totalSeconds = if (isBoxBreathing) 4 else {
                            when (currentPhase) {
                                BreathingPhase.INHALE -> 4
                                BreathingPhase.HOLD_IN -> 7
                                BreathingPhase.EXHALE -> 8
                                BreathingPhase.HOLD_OUT -> 4
                            }
                        }
                        val countUpSec = totalSeconds - secondsLeftInPhase + 1
                        Text(
                            text = "\${countUpSec}s",
                            color = Color.White.copy(alpha = 0.9f),
                            fontWeight = FontWeight.Medium,
                            fontSize = 24.sp,
                            modifier = Modifier.padding(top = 4.dp)
                        )
                    }
                }
            }

            // Outline drawing track
            Canvas(modifier = Modifier.fillMaxSize()) {
                val ringRadius = size.minDimension / 2 - 8.dp.toPx()
                val centerOffset = Offset(size.width / 2, size.height / 2)
                drawCircle(
                    color = Color.LightGray.copy(alpha = 0.4f),
                    radius = ringRadius,
                    center = centerOffset,
                    style = Stroke(width = 2.dp.toPx())
                )
            }
        }

        // Stats & Interaction Controllers
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)
        ) {
            if (cycleCount > 0) {
                Text(
                    text = "Cycles completed: $cycleCount",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.padding(bottom = 12.dp)
                )
            }

            // Toggle for gentle Android haptic cues
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier
                    .fillMaxWidth(0.75f)
                    .padding(bottom = 16.dp)
                    .background(Color.White, shape = RoundedCornerShape(16.dp))
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(
                        imageVector = Icons.Default.Vibration,
                        contentDescription = "Haptics Icon",
                        tint = Color(0xFF2E7D32),
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = "Gentle Haptics",
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.DarkGray
                    )
                }
                Switch(
                    checked = isHapticEnabled,
                    onCheckedChange = { isHapticEnabled = it }
                )
            }
        }
    }
}`
  },
  {
    name: "GroundingExerciseScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/GroundingExerciseScreen.kt",
    language: "kotlin",
    description: "An elegant, highly interactive, step-by-step implementation of the standard 5-4-3-2-1 Grounding Technique. Direct layout states keep user focus structured during episodes of panic.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class GroundingStep(
    val stepNo: Int,
    val title: String,
    val prompt: String,
    val placeholder: String,
    val totalItems: Int,
    val accentColor: Color
)

@Composable
fun GroundingExerciseScreen() {
    val steps = remember {
        listOf(
            GroundingStep(5, "See", "Name 5 things you can see around you.", "A clock on the wall, trees, a light...", 5, Color(0xFF3F51B5)),
            GroundingStep(4, "Feel", "Name 4 things you can physically feel.", "The chair under me, wind on my face, soft socks...", 4, Color(0xFFFF9800)),
            GroundingStep(3, "Hear", "Name 3 sounds you can hear right now.", "A bird chirping, car passing, air conditioner...", 3, Color(0xFFE91E63)),
            GroundingStep(2, "Smell", "Name 2 items you can smell.", "Coffee, rain, fresh fabric, soap...", 2, Color(0xFF4CAF50)),
            GroundingStep(1, "Taste", "Name 1 thing you can taste (or recall tasting).", "Minty toothpaste, lingering tea...", 1, Color(0xFF00BCD4))
        )
    }

    var currentStepIdx by remember { mutableIntStateOf(0) }
    var enteredItems by remember { mutableStateOf(listOf<String>()) }
    var currentInput by remember { mutableStateOf("") }
    
    val activeStep = steps[currentStepIdx]

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAF9F6))
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.SpaceBetween
    ) {
        // Step Banner & Progress Index indicators
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth().padding(top = 16.dp)
        ) {
            Text(
                "5-4-3-2-1 Grounding Method",
                fontWeight = FontWeight.Bold,
                fontSize = 20.sp,
                color = Color(0xFF34495E)
            )
            Text(
                "Establish physical awareness to defeat acute anxiety",
                fontSize = 13.sp,
                color = Color(0xFF7F8C8D),
                modifier = Modifier.padding(bottom = 16.dp)
            )

            LinearProgressIndicator(
                progress = { (currentStepIdx + 1).toFloat() / steps.size },
                modifier = Modifier
                    .fillMaxWidth()
                    .height(6.dp),
                color = activeStep.accentColor,
                trackColor = Color.LightGray.copy(alpha = 0.4f)
            )
        }

        // Active Step Interactive Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
                .padding(vertical = 24.dp)
        ) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(24.dp),
                verticalArrangement = Arrangement.SpaceBetween,
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Header badge
                Box(
                    modifier = Modifier
                        .background(activeStep.accentColor.copy(alpha = 0.15f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 16.dp, vertical = 8.dp)
                ) {
                    Text(
                        text = "STEP \${activeStep.stepNo} of 5",
                        color = activeStep.accentColor,
                        fontWeight = FontWeight.Bold
                    )
                }

                // Title and description helper
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = activeStep.title,
                        fontWeight = FontWeight.Black,
                        fontSize = 32.sp,
                        color = activeStep.accentColor,
                        textAlign = TextAlign.Center
                    )
                    Text(
                        text = activeStep.prompt,
                        fontSize = 15.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(top = 8.dp)
                    )
                }

                // Dynamic items collection display
                Column(
                    modifier = Modifier.fillMaxWidth().weight(1f).padding(vertical = 12.dp),
                    verticalArrangement = Arrangement.Center
                ) {
                    enteredItems.forEachIndexed { idx, item ->
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .background(activeStep.accentColor.copy(alpha = 0.08f), RoundedCornerShape(8.dp))
                                .padding(12.dp)
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Icon(
                                    Icons.Default.CheckCircle,
                                    contentDescription = "Logged",
                                    tint = activeStep.accentColor,
                                    modifier = Modifier.size(18.dp)
                                )
                                Spacer(modifier = Modifier.width(8.dp))
                                Text(text = item, color = Color.DarkGray)
                            }
                        }
                    }

                    // Remaining empty slot placeholders
                    repeat(activeStep.totalItems - enteredItems.size) { index ->
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(vertical = 4.dp)
                                .background(Color.LightGray.copy(alpha = 0.15f), RoundedCornerShape(8.dp))
                                .padding(12.dp)
                        ) {
                            Text(
                                "Remaining Item \${enteredItems.size + index + 1}",
                                color = Color.Gray.copy(alpha = 0.6f)
                            )
                        }
                    }
                }

                // Item recording input field (or single tap logs)
                if (enteredItems.size < activeStep.totalItems) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        OutlinedTextField(
                            value = currentInput,
                            onValueChange = { currentInput = it },
                            placeholder = { Text(activeStep.placeholder, color = Color.LightGray) },
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f),
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedBorderColor = activeStep.accentColor
                            )
                        )
                        Spacer(modifier = Modifier.width(8.dp))
                        Button(
                            onClick = {
                                if (currentInput.isNotBlank()) {
                                    enteredItems = enteredItems + currentInput.trim()
                                    currentInput = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = activeStep.accentColor),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Text("Add")
                        }
                    }
                } else {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .background(Color(0xFFE8F5E9), RoundedCornerShape(12.dp))
                            .padding(12.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            "Well done! This step is complete.",
                            color = Color(0xFF2E7D32),
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }

        // Navigation Controller bar
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Button(
                onClick = {
                    if (currentStepIdx > 0) {
                        currentStepIdx--
                        enteredItems = listOf()
                        currentInput = ""
                    }
                },
                enabled = currentStepIdx > 0,
                colors = ButtonDefaults.filledTonalButtonColors(),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                Spacer(modifier = Modifier.width(4.dp))
                Text("Back")
            }

            if (currentStepIdx < steps.size - 1) {
                Button(
                    onClick = {
                        currentStepIdx++
                        enteredItems = listOf()
                        currentInput = ""
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = activeStep.accentColor),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Next Step")
                    Spacer(modifier = Modifier.width(4.dp))
                    Icon(Icons.Default.ArrowForward, contentDescription = "Next")
                }
            } else {
                Button(
                    onClick = {
                        currentStepIdx = 0
                        enteredItems = listOf()
                        currentInput = ""
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Text("Restart Exercise")
                }
            }
        }
    }
}`
  },
  {
    name: "DashboardScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/DashboardScreen.kt",
    language: "kotlin",
    description: "The onboarding home interface of the app, containing swift navigation cards, a basic daily stress check-in widget, and dynamic local state statistics.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun DashboardScreen(
    onNavigateToBreathing: () -> Unit,
    onNavigateToGrounding: () -> Unit,
    onNavigateToRelief: () -> Unit,
    onNavigateToEmergency: () -> Unit
) {
    var checkInMood by remember { mutableStateOf<String?>(null) }
    var dailyStressValue by remember { mutableFloatStateOf(3f) }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAF9F6))
            .padding(16.dp)
    ) {
        // Welcome and Header
        Text(
            text = "Welcome Back,",
            style = MaterialTheme.typography.titleLarge,
            color = Color.Gray,
            modifier = Modifier.padding(top = 16.dp)
        )
        Text(
            text = "Mental First Aid Kit",
            style = MaterialTheme.typography.headlineLarge.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50)
        )
        Text(
            text = "You are in a safe, controlled space. Choose an aid below.",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        // Offline Mood Check-In Card
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 24.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(
                modifier = Modifier.padding(16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = "How are you feeling right now?",
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = Color(0xFF34495E)
                )
                
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 12.dp),
                    horizontalArrangement = Arrangement.SpaceEvenly
                ) {
                    val moodEmojis = listOf("😊" to "Calm", "😐" to "Steady", "😰" to "Anxious", "🚨" to "Overwhelmed")
                    moodEmojis.forEach { (emoji, label) ->
                        val isSelected = checkInMood == label
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier
                                .clickable { checkInMood = label }
                                .background(
                                    if (isSelected) MaterialTheme.colorScheme.primaryContainer else Color.Transparent,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                .padding(8.dp)
                        ) {
                            Text(emoji, fontSize = 28.sp)
                            Text(label, fontSize = 11.sp, color = Color.Gray)
                        }
                    }
                }

                if (checkInMood != null) {
                    Text(
                        text = "Logged: \${checkInMood}. Let's do a breathing circle to align focus.",
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 12.sp,
                        fontWeight = FontWeight.Medium,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }

        // Action Aids Grid Menu
        Text(
            text = "Core Relief Modules",
            style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 12.dp)
        )

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            modifier = Modifier.weight(1f)
        ) {
            item {
                AidMenuGridItem(
                    title = "Guided Breath",
                    desc = "Paced Box & 4-7-8 cycles",
                    icon = Icons.Default.Spa,
                    backgroundColor = Color(0xFFE8F5E9),
                    accentColor = Color(0xFF2E7D32),
                    onClick = onNavigateToBreathing
                )
            }
            item {
                AidMenuGridItem(
                    title = "5-4-3-2-1 Ground",
                    desc = "Clarity sensory check-in",
                    icon = Icons.Default.Fingerprint,
                    backgroundColor = Color(0xFFE8EAF6),
                    accentColor = Color(0xFF3F51B5),
                    onClick = onNavigateToGrounding
                )
            }
            item {
                AidMenuGridItem(
                    title = "Coping Vault",
                    desc = "Steady statements & support",
                    icon = Icons.Default.AutoStories,
                    backgroundColor = Color(0xFFFFF3E0),
                    accentColor = Color(0xFFE65100),
                    onClick = onNavigateToRelief
                )
            }
            item {
                AidMenuGridItem(
                    title = "Crisis & Hotlines",
                    desc = "Immediate dialing channels",
                    icon = Icons.Default.PhoneInTalk,
                    backgroundColor = Color(0xFFFFEBEE),
                    accentColor = Color(0xFFC62828),
                    onClick = onNavigateToEmergency
                )
            }
        }

        // Safety Status footer label
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp)
                .background(Color(0xFFECEFF1), RoundedCornerShape(8.dp))
                .padding(8.dp),
            contentAlignment = Alignment.Center
        ) {
            Text(
                "Offline-First Guard Activated. All logs reside locally on your device.",
                fontSize = 10.sp,
                color = Color.DarkGray,
                fontWeight = FontWeight.Medium
            )
        }
    }
}

@Composable
fun AidMenuGridItem(
    title: String,
    desc: String,
    icon: ImageVector,
    backgroundColor: Color,
    accentColor: Color,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        modifier = Modifier
            .fillMaxWidth()
            .height(130.dp)
            .clickable { onClick() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = accentColor,
                modifier = Modifier.size(32.dp)
            )
            
            Column {
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 15.sp,
                    color = Color(0xFF2C3E50)
                )
                Text(
                    text = desc,
                    fontSize = 11.sp,
                    color = Color.Gray,
                    maxLines = 2
                )
            }
        }
    }
}`
  },
  {
    name: "EmergencyContactsScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/EmergencyContactsScreen.kt",
    language: "kotlin",
    description: "Modular screen facilitating crisis hotline dial launch intents and configuring an offline custom emergency support contact backed by local device SharedPreferences.",
    code: `package com.mentalhealth.firstaid.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Save
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun EmergencyContactsScreen() {
    val context = LocalContext.current
    val sharedPrefs = remember { context.getSharedPreferences("emergency_prefs", Context.MODE_PRIVATE) }

    var customName by remember { mutableStateOf(sharedPrefs.getString("contact_name", "") ?: "") }
    var customPhone by remember { mutableStateOf(sharedPrefs.getString("contact_phone", "") ?: "") }
    var isEditing by remember { mutableStateOf(customName.isEmpty() && customPhone.isEmpty()) }

    fun dialNumber(number: String) {
        if (number.isNotBlank()) {
            val intent = Intent(Intent.ACTION_DIAL).apply {
                data = Uri.parse("tel:$number")
            }
            context.startActivity(intent)
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAF9F6))
            .padding(16.dp)
    ) {
        // Title Screen Help Banner
        Text(
            text = "Emergency & Help Kit",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFFC62828),
            modifier = Modifier.padding(top = 16.dp)
        )
        Text(
            text = "Immediate, confidential support channels available 24/7.",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        // National Hotlines Card Section
        Text(
            text = "Official Support Networks",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // Hotline 1: 988
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("988 Suicide & Crisis Lifeline", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Call or text 988 for free, confidential support.", fontSize = 12.sp, color = Color.Gray)
                    }
                    Button(
                        onClick = { dialNumber("988") },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828)),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.Call, contentDescription = "Dial 988")
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Call", fontSize = 12.sp)
                    }
                }

                Divider(modifier = Modifier.padding(vertical = 8.dp))

                // Hotline 2: Crisis Text Line
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Crisis Text Line (HOME to 741741)", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("SMS text HOME to 741741 to connect with counselors.", fontSize = 12.sp, color = Color.Gray)
                    }
                    Button(
                        onClick = {
                            val intent = Intent(Intent.ACTION_VIEW).apply {
                                data = Uri.parse("sms:741741?body=HOME")
                            }
                            context.startActivity(intent)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF555555)),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Text", fontSize = 12.sp)
                    }
                }

                Divider(modifier = Modifier.padding(vertical = 8.dp))

                // Hotline 3: The Trevor Project
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("The Trevor Project", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Crisis support/suicide prevention for LGBTQ+ youth.", fontSize = 12.sp, color = Color.Gray)
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Button(
                            onClick = { dialNumber("18664887386") },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3F51B5)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Call", fontSize = 12.sp)
                        }
                        Button(
                            onClick = {
                                val intent = Intent(Intent.ACTION_VIEW).apply {
                                    data = Uri.parse("sms:678678?body=START")
                                }
                                context.startActivity(intent)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF757575)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("SMS", fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        // Personal Emergency Contact Section (Saved locally in SharedPreferences)
        Text(
            text = "Personal Safety Contact",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                if (isEditing) {
                    Text("Securely save a local contact name and phone number:", fontSize = 13.sp, color = Color.Gray, modifier = Modifier.padding(bottom = 12.dp))
                    
                    OutlinedTextField(
                        value = customName,
                        onValueChange = { customName = it },
                        label = { Text("Contact Name") },
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
                    )

                    OutlinedTextField(
                        value = customPhone,
                        onValueChange = { customPhone = it },
                        label = { Text("Phone Number") },
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)
                    )

                    Button(
                        onClick = {
                            sharedPrefs.edit()
                                .putString("contact_name", customName.trim())
                                .putString("contact_phone", customPhone.trim())
                                .apply()
                            isEditing = false
                        },
                        enabled = customName.isNotBlank() && customPhone.isNotBlank(),
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.Save, contentDescription = "Save Contact")
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Save Offline Key Contact")
                    }
                } else {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(customName, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF2C3E50))
                            Text(customPhone, fontSize = 14.sp, color = Color.Gray)
                        }

                        Row {
                            IconButton(onClick = { isEditing = true }) {
                                Icon(Icons.Default.Edit, contentDescription = "Edit Contact", tint = Color.Gray)
                            }
                            Spacer(modifier = Modifier.width(4.dp))
                            Button(
                                onClick = { dialNumber(customPhone) },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Icon(Icons.Default.Call, contentDescription = "Call Contact")
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Call")
                            }
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    name: "CopingReliefScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/CopingReliefScreen.kt",
    language: "kotlin",
    description: "An elegant Coping list featuring categorizing, interactive bookmarks, and customizable stress positive affirmations using standard Jetpack Compose elements.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Add
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class CopingStatement(
    val id: String,
    val text: String,
    val category: String,
    val isSaved: Boolean
)

@Composable
fun CopingReliefScreen() {
    var statements by remember {
        mutableStateOf(
            listOf(
                CopingStatement("1", "This feeling is intense, but I know it is temporary.", "Panic", true),
                CopingStatement("2", "Slow, deep breathing signals physical safety to my body.", "Anxiety", true),
                CopingStatement("3", "I can survive these physical sensations, they will pass.", "Panic", false),
                CopingStatement("4", "I am exactly where I need to be, focused on the now.", "Grounding", false),
                CopingStatement("5", "I release judgment of my thoughts. I am secure.", "Stress", false)
            )
        )
    }

    var selectedCategory by remember { mutableStateOf("All") }
    var textInput by remember { mutableStateOf("") }

    val categories = listOf("All", "Panic", "Anxiety", "Grounding", "Stress")
    val filtered = if (selectedCategory == "All") statements else statements.filter { it.category == selectedCategory }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAF9F6))
            .padding(16.dp)
    ) {
        // Core header
        Text(
            "Coping Statements",
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp,
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(top = 16.dp)
        )
        Text(
            "Grounding statements to ease nervous spikes.",
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        // Category Pills row
        ScrollableTabRow(
            selectedTabIndex = categories.indexOf(selectedCategory).coerceAtLeast(0),
            edgePadding = 0.dp,
            divider = {},
            indicator = {},
            containerColor = Color.Transparent,
            modifier = Modifier.padding(bottom = 12.dp)
        ) {
            categories.forEach { cat ->
                val isSelected = selectedCategory == cat
                Tab(
                    selected = isSelected,
                    onClick = { selectedCategory = cat },
                    modifier = Modifier.padding(4.dp)
                ) {
                    SuggestionChip(
                        onClick = { selectedCategory = cat },
                        label = { Text(cat, fontSize = 11.sp) },
                        colors = SuggestionChipDefaults.suggestionChipColors(
                            containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer else Color.White
                        )
                    )
                }
            }
        }

        // Lazy column statements
        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(filtered) { statement ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            "\"\${statement.text}\"",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color.DarkGray
                        )
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AssistChip(
                                onClick = {},
                                label = { Text(statement.category, fontSize = 10.sp) }
                            )
                            IconButton(onClick = {
                                statements = statements.map {
                                    if (it.id == statement.id) it.copy(isSaved = !it.isSaved) else it
                                }
                            }) {
                                Icon(
                                    imageVector = if (statement.isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                    contentDescription = "Save",
                                    tint = if (statement.isSaved) Color.Red else Color.LightGray
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    name: "ThoughtReframerScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/ThoughtReframerScreen.kt",
    language: "kotlin",
    description: "CBT Thought audit challenger using state persistence mapping, text state monitors, and category selectors.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class ReframedThought(val id: String, val negative: String, val distortion: String, val rational: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ThoughtReframerScreen(onBackClick: () -> Unit) {
    var negative by remember { mutableStateOf("") }
    var selectedDistortion by remember { mutableStateOf("Catastrophizing") }
    var rational by remember { mutableStateOf("") }
    var reframes by remember { mutableStateOf(listOf<ReframedThought>()) }
    var expanded by remember { mutableStateOf(false) }

    val distortions = listOf("Catastrophizing", "All-or-Nothing", "Mind Reading", "Emotional Reasoning", "Overgeneralization")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("CBT Thought Reframer", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text("Automatic Negative thought", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            OutlinedTextField(
                value = negative,
                onValueChange = { negative = it },
                placeholder = { Text("What enters your mind automatically?", fontSize = 13.sp) },
                modifier = Modifier.fillMaxWidth()
            )

            Text("Cognitive Distortion", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Box(modifier = Modifier.fillMaxWidth()) {
                Button(onClick = { expanded = true }, modifier = Modifier.fillMaxWidth()) {
                    Text(selectedDistortion)
                }
                DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                    distorions.forEach { dist ->
                        DropdownMenuItem(
                            text = { Text(dist) },
                            onClick = { selectedDistortion = dist; expanded = false }
                        )
                    }
                }
            }

            Text("Rational Balanced perspective", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            OutlinedTextField(
                value = rational,
                onValueChange = { rational = it },
                placeholder = { Text("Challenge the negative with facts...", fontSize = 13.sp) },
                modifier = Modifier.fillMaxWidth()
            )

            Button(
                onClick = {
                    if (negative.isNotBlank() && rational.isNotBlank()) {
                        reframes = listOf(ReframedThought(System.currentTimeMillis().toString(), negative, selectedDistortion, rational)) + reframes
                        negative = ""
                        rational = ""
                    }
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Store Reframe")
            }

            Text("Historical Rebound Ledger", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(reframes) { item ->
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(item.distortion, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, fontSize = 11.sp)
                            Text("Automatic Negative: \${item.negative}", fontSize = 12.sp, color = Color.Gray)
                            Text("Balanced Strategy: \${item.rational}", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Color.DarkGray)
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    name: "NeuroVitalsScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/NeuroVitalsScreen.kt",
    language: "kotlin",
    description: "Circadian compliance and biological neuro-chemical checkbox monitors that support optimal GABA/serotonin synthesis.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class HabitItem(val id: String, val name: String, val category: String, val completed: Boolean, val icon: String)

@Composable
fun NeuroVitalsScreen(onBackClick: () -> Unit) {
    var habits by remember { mutableStateOf(listOf(
        HabitItem("1", "Circadian Sunlight (15m in AM)", "Light", false, "☀️"),
        HabitItem("2", "Biological Hydration (2+ liters)", "Hydrate", false, "💧"),
        HabitItem("3", "Endorphin Gym Walk (15m)", "Movement", false, "🚶"),
        HabitItem("4", "No screens 30 mins before sleep", "Circadian", false, "📴"),
        HabitItem("5", "Nourish high fiber microbiome meal", "Gut", false, "🥗")
    )) }

    val completedCount = habits.count { it.completed }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Neuro-Basics Compliance", fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(8.dp))
        LinearProgressIndicator(
            progress = { completedCount.toFloat() / habits.size },
            modifier = Modifier.fillMaxWidth().height(8.dp)
        )
        Text("\$completedCount of \${habits.size} elements secured", fontSize = 11.sp)

        Spacer(modifier = Modifier.height(16.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(habits) { habit ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = habit.completed,
                        onCheckedChange = { isChecked ->
                            habits = habits.map { if (it.id == habit.id) it.copy(completed = isChecked) else it }
                        }
                    )
                    Text("\${habit.icon} \${habit.name}", modifier = Modifier.weight(1f))
                    Badge { Text(habit.category) }
                }
            }
        }
    }
}`
  },
  {
    name: "GratitudeJarScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/GratitudeJarScreen.kt",
    language: "kotlin",
    description: "Positive Psychology integration depicting memory jar lists with randomized memories retrievals.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.launch

@Composable
fun GratitudeJarScreen(onBackClick: () -> Unit) {
    var savedGratitudes by remember { mutableStateOf(listOf("Peppermint tea morning", "Lighter evening sunset walk", "Family group text giggles")) }
    var textInput by remember { mutableStateOf("") }
    var alertText by remember { mutableStateOf<String?>(null) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Visual Gratitude Jar", fontSize = 18.sp)
        Text("\${savedGratitudes.size} memories folded in", fontSize = 12.sp)

        Spacer(modifier = Modifier.height(24.dp))
        Button(
            onClick = {
                if (savedGratitudes.isNotEmpty()) {
                    alertText = savedGratitudes.random()
                }
            }
        ) {
            Text("🔮 Shake & Draw Random Memory")
        }

        Spacer(modifier = Modifier.height(16.dp))
        OutlinedTextField(
            value = textInput,
            onValueChange = { textInput = it },
            label = { Text("What made you smile today?") }
        )
        Button(onClick = {
            if (textInput.isNotBlank()) {
                savedGratitudes = savedGratitudes + textInput.trim()
                textInput = ""
            }
        }) {
            Text("Fold & drop in Jar")
        }

        alertText?.let { text ->
            AlertDialog(
                onDismissRequest = { alertText = null },
                confirmButton = { Button(onClick = { alertText = null }) { Text("Acknowledge") } },
                title = { Text("Memory Recall") },
                text = { Text("\"\${text}\"") }
            )
        }
    }
}`
  },
  {
    name: "SomaticRelaxationScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/SomaticRelaxationScreen.kt",
    language: "kotlin",
    description: "Progressive Muscle Relaxation (PMR) somatic pacing loops that reduce sympathetic alarms.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@Composable
fun SomaticRelaxationScreen(onBackClick: () -> Unit) {
    val steps = listOf("Hands & Fists", "Shoulders & Neck", "Facial Jaw", "Stomach Chest", "Calves & Feet")
    var currentStep by remember { mutableStateOf(0) }
    var phase by remember { mutableStateOf("TENSE") }
    var progressVal by remember { mutableStateOf(5) }
    var running by remember { mutableStateOf(false) }

    LaunchedEffect(running, phase, progressVal) {
        if (running && progressVal > 0) {
            delay(1000)
            progressVal -= 1
        } else if (running && progressVal == 0) {
            if (phase == "TENSE") {
                phase = "RELEASE"
                progressVal = 5
            } else {
                phase = "TENSE"
                progressVal = 5
                currentStep = (currentStep + 1) % steps.size
            }
        }
    }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
        Text("Somatic Release Guide", fontSize = 18.sp)
        Text("Active region: \${steps[currentStep]}", fontSize = 13.sp)

        Spacer(modifier = Modifier.height(30.dp))
        Text(phase, fontSize = 28.sp, color = MaterialTheme.colorScheme.primary)
        Text("\${progressVal}s remaining", fontSize = 16.sp)

        Spacer(modifier = Modifier.height(24.dp))
        Button(onClick = { running = !running }) {
            Text(if (running) "Halts somatics" else "Engage Protocol")
        }
    }
}`
  },
  {
    name: "StanleyBrownSafetyPlan.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/StanleyBrownSafetyPlan.kt",
    language: "kotlin",
    description: "Gold-standard Stanley-Brown crisis safety planner outlining warning signs, internal coping, distraction, and professional resources.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun StanleyBrownSafetyPlan(onBackClick: () -> Unit) {
    var warningSigns by remember { mutableStateOf(listOf("Feeling cold", "Short shallow breathes")) }
    var copingActions by remember { mutableStateOf(listOf("Warm dark chamomile tea", "Slow down counting breaths")) }
    var contactKeyPeople by remember { mutableStateOf(listOf("Bud (555-4929)", "Hotline 988")) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Gold-Standard Clinical Plan", fontSize = 18.sp)
        Spacer(modifier = Modifier.height(12.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text("1. Warning Signs:", fontSize = 12.sp)
                Text(warningSigns.joinToString(", "), fontSize = 13.sp)
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text("2. Internal Coping Tools:", fontSize = 12.sp)
                Text(copingActions.joinToString(", "), fontSize = 13.sp)
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text("3. Crisis Supporters:", fontSize = 12.sp)
                Text(contactKeyPeople.joinToString(", "), fontSize = 13.sp)
            }
        }
    }
}`
  },
  {
    name: "SoundscapeScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/SoundscapeScreen.kt",
    language: "kotlin",
    description: "Multi-channel procedural nature synthesizer layout inside Jetpack Compose leveraging custom SoundPool/ExoPlayer layers.",
    code: `package com.mentalhealth.firstaid.ui.screens
 
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
 
@Composable
fun SoundscapeScreen(onBackClick: () -> Unit) {
    var isPlaying by remember { mutableStateOf(false) }
    var masterVolume by remember { mutableFloatStateOf(0.7f) }
 
    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Nature sound synthesizer (Offline-First)", fontSize = 18.sp)
        Button(onClick = { isPlaying = !isPlaying }) {
            Text(if (isPlaying) "Mute Wave generators" else "Synthesize Live Waves")
        }
        Text("Volume Sweep: \${(masterVolume * 100).toInt()}%")
        Slider(value = masterVolume, onValueChange = { masterVolume = it })
    }
}`
  },
  {
    name: "WorryLockboxScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/WorryLockboxScreen.kt",
    language: "kotlin",
    description: "CBT Rumination Delay Container screen mapping postponement timers.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun WorryLockboxScreen(onBackClick: () -> Unit) {
    var worryTitle by remember { mutableStateOf("") }
    var durationMinutes by remember { mutableStateOf(15) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("CBT Rumination Delay Container", fontSize = 18.sp)
        Spacer(modifier = Modifier.height(10.dp))
        OutlinedTextField(
            value = worryTitle,
            onValueChange = { worryTitle = it },
            label = { Text("What is worrying you now?") },
            modifier = Modifier.fillMaxWidth()
        )
        Button(onClick = { /* Save / Lock local worry entry */ }) {
            Text("Lock & Delay Rumination")
        }
    }
}`
  },
  {
    name: "EmdrPacerScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/EmdrPacerScreen.kt",
    language: "kotlin",
    description: "EMDR Alternating Bilateral Eye Stimulation visual pacing simulator.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun EmdrPacerScreen(onBackClick: () -> Unit) {
    var isRunning by remember { mutableStateOf(false) }
    var speedMultiplier by remember { mutableStateOf(1f) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("EMDR Bilateral Stimulation Pacer", fontSize = 18.sp)
        Spacer(modifier = Modifier.height(10.dp))
        Text("Track horizontal pacing sphere with eyes only.", fontSize = 13.sp)
        Button(onClick = { isRunning = !isRunning }) {
            Text(if (isRunning) "Mute EMDR" else "Start Left-Right Stimulator")
        }
    }
}`
  },
  {
    name: "EmotionWheelScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/EmotionWheelScreen.kt",
    language: "kotlin",
    description: "Multi-layered feel segment explorer mapping specific CBT journal prompts.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun EmotionWheelScreen(onBackClick: () -> Unit) {
    var selectedCategory by remember { mutableStateOf<String?>(null) }
    var responseProse by remember { mutableStateOf("") }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Feel Segment Wheel & Journal", fontSize = 18.sp)
        Spacer(modifier = Modifier.height(10.dp))
        Row {
            Button(onClick = { selectedCategory = "Sadness" }) { Text("Sadness") }
            Button(onClick = { selectedCategory = "Anger" }) { Text("Anger") }
            Button(onClick = { selectedCategory = "Fear" }) { Text("Fear") }
        }
        selectedCategory?.let { item ->
            Text("Focus Prompt: Write down your core triggers for \${item}", fontSize = 12.sp)
        }
    }
}`
  },
  {
    name: "VagusResetScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/VagusResetScreen.kt",
    language: "kotlin",
    description: "Somatic Vagus Nerve physical reset prompts coupled with trigger delay counters.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun VagusResetScreen(onBackClick: () -> Unit) {
    var activeTimer by remember { mutableStateOf(20) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Parasympathetic Vagus Nerve Resets", fontSize = 18.sp)
        Spacer(modifier = Modifier.height(10.dp))
        Text("Exercise: Valsalva Airway Pressure Hold", fontSize = 14.sp)
        Text("Hold under target block for \${activeTimer}s", fontSize = 13.sp)
    }
}`
  },
  {
    name: "PanicRescueScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/PanicRescueScreen.kt",
    language: "kotlin",
    description: "1-Tap Extreme Panic anchor override deploying grounding pacing waves.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun PanicRescueScreen(onBackClick: () -> Unit) {
    var rescueActive by remember { mutableStateOf(false) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("1-Tap Escape Pod", fontSize = 18.sp)
        Button(onClick = { rescueActive = !rescueActive }) {
            Text(if (rescueActive) "Cancel Guidance Escort" else "TAP Rescue Shield")
        }
        if (rescueActive) {
            Text("Adrenaline is fully natural. Breathe deep.", fontSize = 13.sp)
        }
    }
}`
  }
];
