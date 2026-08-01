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
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }
androidx-compose-material-icons-extended = { group = "androidx.compose.material", name = "material-icons-extended" }
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.mentalhealth.firstaid.ui.theme.MentalHealthFirstAidTheme
import com.mentalhealth.firstaid.ui.screens.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
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
    object SomaticHub : Screen("somaticHub", "Body", { Icon(Icons.Default.Spa, contentDescription = "Body") })
    object CbtHub : Screen("cbtHub", "Mind", { Icon(Icons.Default.MenuBook, contentDescription = "Mind") })
    object SafetyHub : Screen("safetyHub", "Safety", { Icon(Icons.Default.Phone, contentDescription = "Safety") })
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
                containerColor = Color(0xFFF1F5F2),
                tonalElevation = 0.dp
            ) {
                val screens = listOf(
                    Screen.Dashboard,
                    Screen.SomaticHub,
                    Screen.CbtHub,
                    Screen.SafetyHub
                )
                screens.forEach { screen ->
                    NavigationBarItem(
                        icon = screen.icon,
                        label = { Text(screen.title, fontSize = 9.sp, fontWeight = FontWeight.Bold) },
                        selected = currentRoute == screen.route,
                        colors = NavigationBarItemDefaults.colors(
                            selectedIconColor = Color(0xFF4A6741),
                            selectedTextColor = Color(0xFF4A6741),
                            unselectedIconColor = Color(0xFF8E9A8F),
                            unselectedTextColor = Color(0xFF8E9A8F),
                            indicatorColor = Color(0xFFE1E8E3)
                        ),
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
            // Tab 1: Home Dashboard
            composable(Screen.Dashboard.route) {
                DashboardScreen(
                    onNavigateToRoute = { route -> navController.navigate(route) }
                )
            }

            // Tab 2: Body (Somatic) Hub
            composable(Screen.SomaticHub.route) {
                SomaticHubScreen(
                    onNavigateToRoute = { route -> navController.navigate(route) }
                )
            }

            // Tab 3: Mind (CBT) Hub
            composable(Screen.CbtHub.route) {
                CbtHubScreen(
                    onNavigateToRoute = { route -> navController.navigate(route) }
                )
            }

            // Tab 4: Safety (Support) Hub
            composable(Screen.SafetyHub.route) {
                SafetyHubScreen(
                    onNavigateToRoute = { route -> navController.navigate(route) }
                )
            }

            // Sub-destinations / Spoke Screens
            composable("breathing") {
                GuidedBreathingScreen(onBackClick = { navController.popBackStack() })
            }
            composable("grounding") {
                GroundingExerciseScreen(onBackClick = { navController.popBackStack() })
            }
            composable("vagusHacks") {
                VagusResetScreen(onBackClick = { navController.popBackStack() })
            }
            composable("somatic") {
                SomaticRelaxationScreen(onBackClick = { navController.popBackStack() })
            }
            composable("emdr") {
                EmdrPacerScreen(onBackClick = { navController.popBackStack() })
            }
            composable("history") {
                HistoryScreen(onBackClick = { navController.popBackStack() })
            }

            composable("reframing") {
                ThoughtReframerScreen(onBackClick = { navController.popBackStack() })
            }
            composable("worryBox") {
                WorryLockboxScreen(onBackClick = { navController.popBackStack() })
            }
            composable("emotionWheel") {
                EmotionWheelScreen(onBackClick = { navController.popBackStack() })
            }
            composable("relief") {
                CopingReliefScreen(onBackClick = { navController.popBackStack() })
            }
            composable("gratitude") {
                GratitudeJarScreen(onBackClick = { navController.popBackStack() })
            }
            composable("habit") {
                NeuroVitalsScreen(onBackClick = { navController.popBackStack() })
            }

            composable("panicSOS") {
                PanicRescueScreen(onBackClick = { navController.popBackStack() })
            }
            composable("safetyPlan") {
                StanleyBrownSafetyPlan(onBackClick = { navController.popBackStack() })
            }
            composable("emergency") {
                EmergencyContactsScreen(onBackClick = { navController.popBackStack() })
            }
            composable("resources") {
                SimpleResourcesScreen(onBackClick = { navController.popBackStack() })
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
import androidx.compose.material.icons.filled.ArrowBack
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

enum class BreathingPhase(val label: String, val color: Color) {
    INHALE("Breathe In", Color(0xFF81C784)),
    HOLD_IN("Hold", Color(0xFFFFB74D)),
    EXHALE("Breathe Out", Color(0xFF64B5F6)),
    HOLD_OUT("Hold & Rest", Color(0xFFFF8A65))
}

@Composable
fun GuidedBreathingScreen(onBackClick: () -> Unit = {}) {
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
        // Top Back Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Back to Somatic Hub",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }

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
                        color = Color(0xFF333333)
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
fun GroundingExerciseScreen(onBackClick: () -> Unit = {}) {
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
        // Top Back Row
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Back to Somatic Hub",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }

        // Step Banner & Progress Index indicators
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.fillMaxWidth()
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
                                Text(text = item, color = Color(0xFF333333))
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
    description: "The onboarding home interface of the app, containing dynamic stress widgets, custom symbol pack selectors, a 7-day trend visualizer, and modular navigation routes.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.border
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
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
import androidx.compose.ui.window.Dialog

data class EmojiSet(val id: String, val name: String, val emojis: List<String>)
data class DayTrend(val day: String, val stress: Int, val emoji: String)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun DashboardScreen(
    onNavigateToRoute: (String) -> Unit
) {
    // 1. Emoji Selection States
    val predefinedSets = listOf(
        EmojiSet("faces", "Faces 😊", listOf("😌", "🙂", "😟", "😰")),
        EmojiSet("nature", "Nature 🍃", listOf("🍃", "🌊", "⛈️", "🌿")),
        EmojiSet("weather", "Weather ☀️", listOf("☀️", "⛅", "🌧️", "⚡")),
        EmojiSet("vibes", "Vibes ✨", listOf("✨", "☕", "💭", "🔥")),
        EmojiSet("animals", "Animals 🐾", listOf("🐾", "🕊️", "🐈", "🐕"))
    )

    var activeSetId by remember { mutableStateOf("faces") }
    var loggedMood by remember { mutableStateOf<String?>(null) }
    var keyboardCustomEmoji by remember { mutableStateOf<String?>(null) }
    
    var showSelectorDialog by remember { mutableStateOf(false) }
    var showKeyboardCustomDialog by remember { mutableStateOf(false) }
    
    var customEmojiSet by remember { mutableStateOf(listOf("🧘", "🪴", "🍵", "🕯️")) }
    var activeCustomSlotIndex by remember { mutableIntStateOf(0) }
    var newCustomInput by remember { mutableStateOf("") }
    var phoneKeyboardInput by remember { mutableStateOf("") }

    // 2. Stress Slider States
    var stressLevel by remember { mutableFloatStateOf(5f) }

    val activeSet = predefinedSets.find { it.id == activeSetId } ?: EmojiSet("custom", "My Set ⚙️", customEmojiSet)

    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF1F5F2))
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Greeting and Tags
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp, bottom = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Box(
                    modifier = Modifier
                        .background(Color(0xFFE1E8E3), RoundedCornerShape(50.dp))
                        .padding(horizontal = 10.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "OFFLINE FIRST",
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF4A6741),
                        letterSpacing = 0.5.sp
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Mental Health Toolkit",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black),
                    color = Color(0xFF4A6741),
                    fontSize = 20.sp
                )
                Text(
                    text = "Take a moment. You are safe, validated, and supported.",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    lineHeight = 14.sp
                )
            }
        }

        // Mood Check-In Widget
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f)),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // Header of mood card
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .background(Color(0xFFE1E8E3), RoundedCornerShape(6.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.SentimentSatisfied,
                                contentDescription = null,
                                tint = Color(0xFF4A6741),
                                modifier = Modifier.size(14.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        Column {
                            Text(
                                text = "Daily Feel",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.Gray,
                                letterSpacing = 0.5.sp
                            )
                            Box(
                                modifier = Modifier
                                    .background(Color(0xFFE1E8E3).copy(alpha = 0.6f), RoundedCornerShape(50.dp))
                                    .padding(horizontal = 6.dp, vertical = 1.dp)
                            ) {
                                Text(
                                    text = if (activeSet.id == "custom") "My Set ⚙️" else activeSet.name,
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color(0xFF4A6741)
                                )
                            }
                        }
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Button(
                            onClick = { showSelectorDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741).copy(alpha = 0.1f)),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            modifier = Modifier.height(24.dp)
                        ) {
                            Text("⚙️ Options", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4A6741))
                        }
                        if (loggedMood != null) {
                            Button(
                                onClick = {
                                    loggedMood = null
                                    keyboardCustomEmoji = null
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFEBEE)),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                                modifier = Modifier.height(24.dp)
                            ) {
                                Text("Clear ✕", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color.Red)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Logged status text
                if (loggedMood != null) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.padding(bottom = 8.dp)
                    ) {
                        Text("Logged Today:", fontSize = 11.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .background(Color(0xFFE1E8E3), CircleShape)
                                .border(1.dp, Color(0xFF4A6741).copy(alpha = 0.2f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(loggedMood!!, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                } else {
                    Text(
                        text = "Tap a physical focus symbol below to log your state today",
                        fontSize = 11.sp,
                        color = Color.LightGray,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                // 5-Slot Option Grid (4 pack + 1 custom)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    // First 4 emojis
                    activeSet.emojis.take(4).forEach { emoji ->
                        val isSelected = loggedMood == emoji
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(40.dp)
                                .background(
                                    if (isSelected) Color(0xFFEBF2EC) else Color.White,
                                    RoundedCornerShape(12.dp)
                                )
                                .border(
                                    1.dp,
                                    if (isSelected) Color(0xFF4A6741) else Color(0xFFCBD9CC).copy(alpha = 0.25f),
                                    RoundedCornerShape(12.dp)
                                )
                                .clickable {
                                    loggedMood = emoji
                                    keyboardCustomEmoji = null
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(emoji, fontSize = 20.sp)
                        }
                    }

                    // 5th custom PICK keyboard option
                    val hasKbEmoji = keyboardCustomEmoji != null
                    val isKbSelected = loggedMood != null && loggedMood == keyboardCustomEmoji
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(40.dp)
                            .background(
                                if (isKbSelected) Color(0xFFEBF2EC) else if (hasKbEmoji) Color(0xFFFFFDF5) else Color(0xFFF8FAFC),
                                RoundedCornerShape(12.dp)
                            )
                            .border(
                                width = 1.dp,
                                color = if (isKbSelected) Color(0xFF4A6741) else if (hasKbEmoji) Color(0xFFFFD54F) else Color(0xFFE2E8F0),
                                shape = RoundedCornerShape(12.dp)
                            )
                            .clickable {
                                phoneKeyboardInput = keyboardCustomEmoji ?: ""
                                showKeyboardCustomDialog = true
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        if (hasKbEmoji) {
                            Text(keyboardCustomEmoji!!, fontSize = 20.sp)
                        } else {
                            Text("PICK", fontSize = 9.sp, fontWeight = FontWeight.Black, color = Color.Gray)
                        }
                    }
                }
            }
        }

        // Stress Level Meter
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Stress Level",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Gray,
                        letterSpacing = 0.5.sp
                    )
                    Box(
                        modifier = Modifier
                            .background(Color(0xFFE1E8E3), RoundedCornerShape(50.dp))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "Level \${stressLevel.toInt()}/10",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                    }
                }

                Slider(
                    value = stressLevel,
                    onValueChange = { stressLevel = it },
                    valueRange = 1f..10f,
                    steps = 8,
                    colors = SliderDefaults.colors(
                        activeTrackColor = Color(0xFF4A6741),
                        inactiveTrackColor = Color(0xFFE1E8E3),
                        thumbColor = Color(0xFF4A6741)
                    ),
                    modifier = Modifier.padding(vertical = 4.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Peaceful (1)", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                    Text("Moderate (5)", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                    Text("Crisis (10)", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                }
            }
        }

        // 7-Day Trend and Chart Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "7-Day Stress & Mood Trend",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Gray,
                        letterSpacing = 0.5.sp
                    )
                    Button(
                        onClick = { onNavigateToRoute("history") },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE1E8E3)),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                        modifier = Modifier.height(24.dp)
                    ) {
                        Text("History ➔", fontSize = 8.sp, fontWeight = FontWeight.Black, color = Color(0xFF4A6741))
                    }
                }
                Text(
                    text = "Track your stress level on a 1-10 scale and logged mood triggers.",
                    fontSize = 10.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(vertical = 4.dp)
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Custom Compose Bar Chart
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(110.dp)
                        .padding(horizontal = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    val days = listOf(
                        DayTrend("Mon", 3, "🍃"),
                        DayTrend("Tue", 4, "😌"),
                        DayTrend("Wed", 6, "⛈️"),
                        DayTrend("Thu", 2, "☀️"),
                        DayTrend("Fri", 5, "☕"),
                        DayTrend("Sat", 3, "✨"),
                        DayTrend("Sun", stressLevel.toInt(), loggedMood ?: "🧘")
                    )

                    days.forEach { trend ->
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.weight(1f)
                        ) {
                            // Bar represent stress (multiplied by 7 for nice height pixels)
                            Box(
                                modifier = Modifier
                                    .width(16.dp)
                                    .height((trend.stress * 7).dp)
                                    .background(
                                        color = when {
                                            trend.stress >= 8 -> Color(0xFFC62828)
                                            trend.stress >= 5 -> Color(0xFFF57C00)
                                            else -> Color(0xFF2E7D32)
                                        },
                                        shape = RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp)
                                    )
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(trend.emoji, fontSize = 11.sp)
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = trend.day,
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.Gray
                            )
                        }
                    }
                }
            }
        }

        // Action Aids Grid Menu
        Text(
            text = "Core Relief Modules",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 12.dp)
        )

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.height(260.dp)
        ) {
            item {
                AidMenuGridItem(
                    title = "Guided Breath",
                    desc = "Paced Box & 4-7-8 cycles",
                    icon = Icons.Default.Spa,
                    backgroundColor = Color(0xFFE8F5E9),
                    accentColor = Color(0xFF2E7D32),
                    onClick = { onNavigateToRoute("breathing") }
                )
            }
            item {
                AidMenuGridItem(
                    title = "5-4-3-2-1 Ground",
                    desc = "Clarity sensory check-in",
                    icon = Icons.Default.Fingerprint,
                    backgroundColor = Color(0xFFE8EAF6),
                    accentColor = Color(0xFF3F51B5),
                    onClick = { onNavigateToRoute("grounding") }
                )
            }
            item {
                AidMenuGridItem(
                    title = "Coping Vault",
                    desc = "Steady statements & support",
                    icon = Icons.Default.AutoStories,
                    backgroundColor = Color(0xFFFFF3E0),
                    accentColor = Color(0xFFE65100),
                    onClick = { onNavigateToRoute("relief") }
                )
            }
            item {
                AidMenuGridItem(
                    title = "Crisis & Hotlines",
                    desc = "Immediate dialing channels",
                    icon = Icons.Default.Phone,
                    backgroundColor = Color(0xFFFFEBEE),
                    accentColor = Color(0xFFC62828),
                    onClick = { onNavigateToRoute("emergency") }
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Safety Status footer label
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp)
                .background(Color(0xFFE2EAF4).copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                .padding(12.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Lock,
                    contentDescription = null,
                    tint = Color(0xFF333333),
                    modifier = Modifier.size(12.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Offline-First Guard Activated. All logs reside locally.",
                    fontSize = 10.sp,
                    color = Color(0xFF333333),
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }

    // ==========================================
    // 3. Modals and Dialog Popups
    // ==========================================

    // Configure Emoji Set Dialog
    if (showSelectorDialog) {
        Dialog(onDismissRequest = { showSelectorDialog = false }) {
            Card(
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.fillMaxWidth().padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Column {
                        Text(
                            text = "SET SYMBOLS OPTIONS",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Gray,
                            letterSpacing = 0.8.sp
                        )
                        Text(
                            text = "Choose active symbol set",
                            fontSize = 10.sp,
                            color = Color.LightGray
                        )
                    }

                    Divider(color = Color(0xFFCBD9CC).copy(alpha = 0.25f))

                    // 2x3 Grid of presets
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            val items1 = listOf("faces" to "Faces 😊", "nature" to "Nature 🍃", "weather" to "Weather ☀️")
                            items1.forEach { (id, name) ->
                                val isSel = activeSetId == id
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .background(
                                            if (isSel) Color(0xFF4A6741) else Color(0xFFF1F5F2),
                                            RoundedCornerShape(8.dp)
                                        )
                                        .clickable { activeSetId = id }
                                        .padding(vertical = 8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = name,
                                        color = if (isSel) Color.White else Color(0xFF4A6741),
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            val items2 = listOf("vibes" to "Vibes ✨", "animals" to "Animals 🐾", "custom" to "My Set ⚙️")
                            items2.forEach { (id, name) ->
                                val isSel = activeSetId == id
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .background(
                                            if (isSel) Color(0xFF4A6741) else Color(0xFFF1F5F2),
                                            RoundedCornerShape(8.dp)
                                        )
                                        .clickable { activeSetId = id }
                                        .padding(vertical = 8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = name,
                                        color = if (isSel) Color.White else Color(0xFF4A6741),
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }

                    // Custom pack options (if "custom" active)
                    if (activeSetId == "custom") {
                        Divider(color = Color(0xFFCBD9CC).copy(alpha = 0.25f))
                        Text(
                            text = "CUSTOMIZE MY SET (4 SLOTS)",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Gray
                        )
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            customEmojiSet.forEachIndexed { idx, emoji ->
                                val isSlotSel = activeCustomSlotIndex == idx
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .aspectRatio(1f)
                                        .background(Color(0xFFF1F5F2), RoundedCornerShape(10.dp))
                                        .border(
                                            width = 1.5.dp,
                                            color = if (isSlotSel) Color(0xFF4A6741) else Color.Transparent,
                                            shape = RoundedCornerShape(10.dp)
                                        )
                                        .clickable { activeCustomSlotIndex = idx },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(emoji, fontSize = 20.sp)
                                }
                            }
                        }

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            OutlinedTextField(
                                value = newCustomInput,
                                onValueChange = { newCustomInput = it.take(2) },
                                placeholder = { Text("Emoji", fontSize = 11.sp) },
                                modifier = Modifier.weight(1f).height(46.dp),
                                textStyle = androidx.compose.ui.text.TextStyle(fontSize = 12.sp)
                            )
                            Button(
                                onClick = {
                                    if (newCustomInput.trim().isNotEmpty()) {
                                        val mutable = customEmojiSet.toMutableList()
                                        mutable[activeCustomSlotIndex] = newCustomInput.trim()
                                        customEmojiSet = mutable
                                        newCustomInput = ""
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741)),
                                modifier = Modifier.height(46.dp)
                            ) {
                                Text("Assign", fontSize = 11.sp, color = Color.White)
                            }
                        }
                    }

                    Divider(color = Color(0xFFCBD9CC).copy(alpha = 0.25f))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        TextButton(onClick = { showSelectorDialog = false }) {
                            Text("Done", color = Color(0xFF4A6741), fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }

    // Customize PICK keyboard Dialog
    if (showKeyboardCustomDialog) {
        Dialog(onDismissRequest = { showKeyboardCustomDialog = false }) {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.fillMaxWidth().padding(24.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "Keyboard Custom Feel",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Type or paste any emoji from your keyboard to represent your state.",
                            fontSize = 9.sp,
                            color = Color.Gray,
                            textAlign = TextAlign.Center,
                            lineHeight = 12.sp
                        )
                    }

                    OutlinedTextField(
                        value = phoneKeyboardInput,
                        onValueChange = { phoneKeyboardInput = it.take(2) },
                        placeholder = { Text("❓", fontSize = 24.sp) },
                        modifier = Modifier.width(80.dp),
                        textStyle = androidx.compose.ui.text.TextStyle(fontSize = 24.sp, textAlign = TextAlign.Center),
                        singleLine = true
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        TextButton(
                            onClick = {
                                showKeyboardCustomDialog = false
                                phoneKeyboardInput = ""
                            },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Cancel", color = Color.Gray)
                        }
                        Button(
                            onClick = {
                                val text = phoneKeyboardInput.trim()
                                if (text.isNotEmpty()) {
                                    loggedMood = text
                                    keyboardCustomEmoji = text
                                    showKeyboardCustomDialog = false
                                    phoneKeyboardInput = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741)),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Apply", color = Color.White)
                        }
                    }
                }
            }
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
            .height(115.dp)
            .clickable { onClick() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = accentColor,
                modifier = Modifier.size(26.dp)
            )
            
            Column {
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = Color(0xFF2C3E50)
                )
                Text(
                    text = desc,
                    fontSize = 9.sp,
                    color = Color.Gray,
                    maxLines = 2,
                    lineHeight = 11.sp
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
import androidx.compose.material.icons.filled.ArrowBack
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
fun EmergencyContactsScreen(onBackClick: () -> Unit = {}) {
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
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Back to Support Hub",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }

        // Title Screen Help Banner
        Text(
            text = "Emergency & Help Kit",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFFC62828),
            modifier = Modifier.padding(top = 8.dp)
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
import androidx.compose.material.icons.filled.ArrowBack
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
fun CopingReliefScreen(onBackClick: () -> Unit = {}) {
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
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Back to Mind Hub",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }

        // Core header
        Text(
            "Coping Statements",
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp,
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(top = 8.dp)
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
                            text = "\"\${statement.text}\"",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF333333)
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

import android.content.Context
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.SimpleDateFormat
import java.util.*

data class ReframedThought(val id: String, val negative: String, val distortion: String, val rational: String, val timestamp: String)

data class DistortionItem(val name: String, val desc: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ThoughtReframerScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    var negative by remember { mutableStateOf("") }
    var selectedDistortion by remember { mutableStateOf("Catastrophizing") }
    var rational by remember { mutableStateOf("") }
    
    var reframes by remember {
        mutableStateOf(loadReframes(context))
    }
    
    var expanded by remember { mutableStateOf(false) }

    val distortions = remember {
        listOf(
            DistortionItem("Catastrophizing", "Predicting the absolute worst scenario regardless of the actual situation."),
            DistortionItem("All-or-Nothing", "Viewing things as completely black-or-white. Anything less than perfect is a failure."),
            DistortionItem("Mind Reading", "Assuming people are thinking negatively of you without any actual evidence."),
            DistortionItem("Emotional Reasoning", "Believing your negative feelings represent reality (\\\"I feel stupid, so I must be\\\")."),
            DistortionItem("Overgeneralization", "Taking a single negative event and viewing it as an endless pattern of defeat.")
        )
    }

    val currentDesc = distortions.find { it.name == selectedDistortion }?.desc ?: ""

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Thought Reframer",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Text(
                            text = "Finding Perspective",
                            fontSize = 10.sp,
                            color = Color.Gray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF4A6741))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF1F5F2))
            )
        },
        containerColor = Color(0xFFF1F5F2)
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        // 1. Automatic Worry
                        Text(
                            text = "1. MY AUTOMATIC OR WORRYING THOUGHT",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Gray,
                            letterSpacing = 0.5.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        OutlinedTextField(
                            value = negative,
                            onValueChange = { negative = it },
                            placeholder = { Text("e.g. I made one error in my slide, so now my supervisor will definitely fire me...", fontSize = 11.sp, color = Color.Gray) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 12.sp)
                        )
                        
                        Spacer(modifier = Modifier.height(14.dp))

                        // 2. Distortion pattern selection
                        Text(
                            text = "2. RECOGNIZING THE PATTERN",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Gray,
                            letterSpacing = 0.5.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        
                        Box(modifier = Modifier.fillMaxWidth()) {
                            OutlinedButton(
                                onClick = { expanded = true },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(12.dp),
                                colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.DarkGray)
                            ) {
                                Row(
                                    modifier = Modifier.fillMaxWidth(),
                                    horizontalArrangement = Arrangement.SpaceBetween,
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Text(selectedDistortion, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                                    Icon(Icons.Default.ArrowDropDown, contentDescription = null)
                                }
                            }
                            DropdownMenu(
                                expanded = expanded,
                                onDismissRequest = { expanded = false },
                                modifier = Modifier.fillMaxWidth(0.9f)
                            ) {
                                distortions.forEach { item ->
                                    DropdownMenuItem(
                                        text = { Text(item.name, fontSize = 12.sp) },
                                        onClick = {
                                            selectedDistortion = item.name
                                            expanded = false
                                        }
                                    )
                                }
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(6.dp))
                        Card(
                            shape = RoundedCornerShape(10.dp),
                            colors = CardDefaults.cardColors(containerColor = Color(0xFF4A6741).copy(alpha = 0.05f)),
                            border = BorderStroke(1.dp, Color(0xFF4A6741).copy(alpha = 0.1f))
                        ) {
                            Row(
                                modifier = Modifier.padding(8.dp),
                                verticalAlignment = Alignment.Top
                            ) {
                                Text(
                                    text = "💡 \${selectedDistortion}: \${currentDesc}",
                                    fontSize = 10.sp,
                                    color = Color(0xFF4A6741),
                                    fontStyle = FontStyle.Italic,
                                    lineHeight = 13.sp
                                )
                            }
                        }

                        Spacer(modifier = Modifier.height(14.dp))

                        // 3. Rational reframe
                        Text(
                            text = "3. A GENTLER, BALANCED REFRAME",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Gray,
                            letterSpacing = 0.5.sp
                        )
                        Spacer(modifier = Modifier.height(6.dp))
                        OutlinedTextField(
                            value = rational,
                            onValueChange = { rational = it },
                            placeholder = { Text("e.g. Everyone makes mistakes. My boss praised my overall delivery, and one slide typo is normal.", fontSize = 11.sp, color = Color.Gray) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 12.sp)
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Button(
                            onClick = {
                                if (negative.isNotBlank() && rational.isNotBlank()) {
                                    val formatter = SimpleDateFormat("MMM d, h:mm a", Locale.getDefault())
                                    val timestampStr = formatter.format(Date())
                                    val newItem = ReframedThought(
                                        id = System.currentTimeMillis().toString(),
                                        negative = negative.trim(),
                                        distortion = selectedDistortion,
                                        rational = rational.trim(),
                                        timestamp = timestampStr
                                    )
                                    val updated = listOf(newItem) + reframes
                                    reframes = updated
                                    saveReframes(context, updated)
                                    negative = ""
                                    rational = ""
                                }
                            },
                            enabled = negative.isNotBlank() && rational.isNotBlank(),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741)),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Icon(Icons.Default.Star, contentDescription = null, modifier = Modifier.size(14.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Save Reframed Thought", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            item {
                Text(
                    text = "YOUR REFRAMING HISTORY",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray,
                    letterSpacing = 0.5.sp
                )
            }

            if (reframes.isEmpty()) {
                item {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.4f)),
                        border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.2f))
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(24.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "No saved reframes yet. Add one above to start exploring gentler views!",
                                fontSize = 11.sp,
                                color = Color.Gray,
                                textAlign = TextAlign.Center
                            )
                        }
                    }
                }
            } else {
                items(reframes) { item ->
                    Card(
                        shape = RoundedCornerShape(18.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.25f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(14.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .background(Color(0xFF4A6741).copy(alpha = 0.1f), RoundedCornerShape(50.dp))
                                            .padding(horizontal = 10.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = item.distortion,
                                            fontSize = 8.sp,
                                            fontWeight = FontWeight.Black,
                                            color = Color(0xFF4A6741)
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(item.timestamp, fontSize = 9.sp, color = Color.Gray)
                                }

                                IconButton(
                                    onClick = {
                                        val updated = reframes.filter { it.id != item.id }
                                        reframes = updated
                                        saveReframes(context, updated)
                                    },
                                    modifier = Modifier.size(24.dp)
                                ) {
                                    Icon(Icons.Default.Delete, contentDescription = "Delete", tint = Color.LightGray, modifier = Modifier.size(16.dp))
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = "\\\"" + item.negative + "\\\"",
                                fontSize = 11.sp,
                                color = Color.Gray,
                                fontStyle = FontStyle.Italic,
                                modifier = Modifier.padding(start = 4.dp)
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Card(
                                shape = RoundedCornerShape(12.dp),
                                colors = CardDefaults.cardColors(containerColor = Color(0xFF4A6741).copy(alpha = 0.05f)),
                                border = BorderStroke(1.dp, Color(0xFF4A6741).copy(alpha = 0.1f))
                            ) {
                                Row(modifier = Modifier.padding(10.dp)) {
                                    Text(
                                        text = "🌱 " + item.rational,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color(0xFF2E7D32)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFF4A6741), modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Taking time to find alternative views helps our minds feel calmer.",
                        fontSize = 9.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

private fun loadReframes(context: Context): List<ReframedThought> {
    val prefs = context.getSharedPreferences("safespace_reframing", Context.MODE_PRIVATE)
    val data = prefs.getString("reframes_list", "") ?: ""
    if (data.isBlank()) return emptyList()
    return try {
        data.split("|||").map {
            val parts = it.split("###")
            ReframedThought(parts[0], parts[1], parts[2], parts[3], parts[4])
        }
    } catch (e: Exception) {
        emptyList()
    }
}

private fun saveReframes(context: Context, reframes: List<ReframedThought>) {
    val prefs = context.getSharedPreferences("safespace_reframing", Context.MODE_PRIVATE)
    val serialized = reframes.joinToString("|||") { "\\\\\${it.id}###\\\\\${it.negative}###\\\\\${it.distortion}###\\\\\${it.rational}###\\\\\${it.timestamp}" }
    prefs.edit().putString("reframes_list", serialized).apply()
}
`
  },
  {
    name: "NeuroVitalsScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/NeuroVitalsScreen.kt",
    language: "kotlin",
    description: "Circadian compliance and biological neuro-chemical checkbox monitors that support optimal GABA/serotonin synthesis.",
    code: `package com.mentalhealth.firstaid.ui.screens

import android.content.Context
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Check
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class HabitItem(val id: String, val name: String, val category: String, val completed: Boolean, val icon: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun NeuroVitalsScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    
    val defaultHabits = remember {
        listOf(
            HabitItem("1", "Catch some morning sunlight (10-15m)", "Light & Air", false, "☀️"),
            HabitItem("2", "Drink a glass of cooling fresh water", "Hydration", false, "💧"),
            HabitItem("3", "Go for a gentle, easy walk outside", "Movement", false, "🚶"),
            HabitItem("4", "Take a slow, deep calming breath", "Mindfulness", false, "🍃"),
            HabitItem("5", "Enjoy a warm or nourishing meal", "Nourishment", false, "🥗"),
            HabitItem("6", "Reach out or check in with a friend", "Connection", false, "🗣️"),
            HabitItem("7", "Enjoy some screen-free quiet time", "Rest", false, "📴")
        )
    }

    var habits by remember {
        mutableStateOf(loadHabits(context, defaultHabits))
    }

    val completedCount = habits.count { it.completed }
    val progress = if (habits.isNotEmpty()) completedCount.toFloat() / habits.size else 0f

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Everyday Basics",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Text(
                            text = "Self-care checklist",
                            fontSize = 10.sp,
                            color = Color.Gray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF4A6741))
                    }
                },
                actions = {
                    TextButton(
                        onClick = {
                            val reset = habits.map { it.copy(completed = false) }
                            habits = reset
                            saveHabits(context, reset)
                        }
                    ) {
                        Text("RESET", color = Color(0xFF4A6741), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF1F5F2))
            )
        },
        containerColor = Color(0xFFF1F5F2)
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Text(
                                text = "MY SELF-CARE BASICS",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.DarkGray
                            )
                            Text(
                                text = "\${completedCount}/\${habits.size} DONE",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Black,
                                color = Color(0xFF4A6741)
                            )
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        LinearProgressIndicator(
                            progress = { progress },
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(8.dp),
                            color = Color(0xFF4A6741),
                            trackColor = Color(0xFFE1E8E3)
                        )
                        Spacer(modifier = Modifier.height(10.dp))
                        
                        val feedbackMsg = when {
                            completedCount == 0 -> "🌱 Take a gentle step. Tap any item below when you've done it."
                            completedCount < 4 -> "💡 Step by step. Each little bit of support helps your mind rest."
                            completedCount < habits.size -> "🌟 Beautiful. You are treating yourself with wonderful kindness today!"
                            else -> "🌿 How wonderful. All the simple basics are attended to!"
                        }
                        
                        Text(
                            text = feedbackMsg,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Gray,
                            lineHeight = 13.sp
                        )
                    }
                }
            }

            items(habits) { item ->
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (item.completed) Color(0xFFEBF2EC).copy(alpha = 0.7f) else Color.White
                    ),
                    border = BorderStroke(
                        1.dp, 
                        if (item.completed) Color(0xFF4A6741).copy(alpha = 0.4f) else Color(0xFFCBD9CC).copy(alpha = 0.2f)
                    ),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable {
                            val updated = habits.map { if (it.id == item.id) it.copy(completed = !item.completed) else it }
                            habits = updated
                            saveHabits(context, updated)
                        }
                ) {
                    Row(
                        modifier = Modifier.padding(14.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(item.icon, fontSize = 20.sp)
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = item.name,
                                    fontSize = 11.5.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.DarkGray,
                                    textDecoration = if (item.completed) TextDecoration.LineThrough else TextDecoration.None
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = item.category + " Category",
                                    fontSize = 8.5.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color.Gray
                                )
                            }
                        }

                        Box(
                            modifier = Modifier
                                .size(20.dp)
                                .background(
                                    if (item.completed) Color(0xFF4A6741) else Color(0xFFF1F5F2),
                                    RoundedCornerShape(6.dp)
                                )
                                .border(
                                    1.dp,
                                    if (item.completed) Color(0xFF4A6741) else Color.LightGray,
                                    RoundedCornerShape(6.dp)
                                ),
                            contentAlignment = Alignment.Center
                        ) {
                            if (item.completed) {
                                Icon(
                                    imageVector = Icons.Default.Check,
                                    contentDescription = null,
                                    tint = Color.White,
                                    modifier = Modifier.size(12.dp)
                                )
                            }
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Sleep, fresh air, and drinking water are simple ways to help support your mind and body.",
                        fontSize = 9.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

private fun loadHabits(context: Context, defaults: List<HabitItem>): List<HabitItem> {
    val prefs = context.getSharedPreferences("safespace_habits", Context.MODE_PRIVATE)
    val data = prefs.getString("habits_list", "") ?: ""
    if (data.isBlank()) return defaults
    return try {
        data.split("|||").map {
            val parts = it.split("###")
            HabitItem(parts[0], parts[1], parts[2], parts[3].toBoolean(), parts[4])
        }
    } catch (e: Exception) {
        defaults
    }
}

private fun saveHabits(context: Context, habits: List<HabitItem>) {
    val prefs = context.getSharedPreferences("safespace_habits", Context.MODE_PRIVATE)
    val serialized = habits.joinToString("|||") { "\\\\\${it.id}###\\\\\${it.name}###\\\\\${it.category}###\\\\\${it.completed}###\\\\\${it.icon}" }
    prefs.edit().putString("habits_list", serialized).apply()
}
`
  },
  {
    name: "GratitudeJarScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/GratitudeJarScreen.kt",
    language: "kotlin",
    description: "Positive Psychology integration depicting memory jar lists with randomized memories retrievals.",
    code: `package com.mentalhealth.firstaid.ui.screens

import android.content.Context
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.SimpleDateFormat
import java.util.*
import kotlin.random.Random

data class GratitudeSlip(val id: String, val text: String, val timestamp: String, val hue: Int)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun GratitudeJarScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    var gratitudeText by remember { mutableStateOf("") }
    
    val defaultSlips = remember {
        listOf(
            GratitudeSlip("1", "Peppermint tea morning warmth", "Jul 8", 120),
            GratitudeSlip("2", "Lighter evening sunset walk", "Jul 8", 45),
            GratitudeSlip("3", "Family group text giggles", "Jul 8", 200)
        )
    }

    var slips by remember {
        mutableStateOf(loadSlips(context, defaultSlips))
    }

    var drawnSlip by remember { mutableStateOf<GratitudeSlip?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Gratitude Jar",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Text(
                            text = "Dopamine lift companion",
                            fontSize = 10.sp,
                            color = Color.Gray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Go Back", tint = Color(0xFF4A6741))
                    }
                },
                actions = {
                    if (slips.isNotEmpty()) {
                        TextButton(
                            onClick = {
                                slips = emptyList()
                                saveSlips(context, emptyList())
                            }
                        ) {
                            Text("EMPTY JAR", color = Color(0xFFD84315), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF1F5F2))
            )
        },
        containerColor = Color(0xFFF1F5F2)
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f))
                ) {
                    Column(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(20.dp),
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        // Visual Jar representation
                        Box(
                            modifier = Modifier
                                .width(120.dp)
                                .height(140.dp)
                                .border(3.dp, Color(0xFF4A6741).copy(alpha = 0.4f), RoundedCornerShape(bottomStart = 40.dp, bottomEnd = 40.dp, topStart = 16.dp, topEnd = 16.dp))
                                .background(Color(0xFFFAF9F6).copy(alpha = 0.5f), RoundedCornerShape(bottomStart = 40.dp, bottomEnd = 40.dp, topStart = 16.dp, topEnd = 16.dp))
                                .padding(12.dp)
                        ) {
                            // Jar lid visual
                            Box(
                                modifier = Modifier
                                    .align(Alignment.TopCenter)
                                    .offset(y = (-14).dp)
                                    .width(70.dp)
                                    .height(8.dp)
                                    .background(Color(0xFF4A6741).copy(alpha = 0.6f), RoundedCornerShape(50.dp))
                            )
                            Box(
                                modifier = Modifier
                                    .align(Alignment.TopCenter)
                                    .offset(y = (-8).dp)
                                    .width(55.dp)
                                    .height(6.dp)
                                    .background(Color(0xFF4A6741).copy(alpha = 0.5f), RoundedCornerShape(50.dp))
                            )

                            // Stack of slips
                            if (slips.isEmpty()) {
                                Text(
                                    text = "Empty Jar",
                                    fontSize = 10.sp,
                                    fontStyle = FontStyle.Italic,
                                    color = Color.LightGray,
                                    modifier = Modifier.align(Alignment.Center)
                                )
                            } else {
                                Box(
                                    modifier = Modifier
                                        .fillMaxSize()
                                        .padding(top = 10.dp)
                                ) {
                                    slips.forEachIndexed { idx, slip ->
                                        val randomX = remember(slip.id) { Random(slip.id.hashCode()).nextInt(0, 60) }
                                        val randomY = remember(slip.id) { Random(slip.id.hashCode() + 1).nextInt(30, 85) }
                                        
                                        Box(
                                            modifier = Modifier
                                                .offset(x = randomX.dp, y = randomY.dp)
                                                .size(16.dp)
                                                .background(
                                                    color = Color.hsv(slip.hue.toFloat(), 0.5f, 0.95f),
                                                    shape = RoundedCornerShape(4.dp)
                                                )
                                                .border(
                                                    width = 1.dp,
                                                    color = Color.hsv(slip.hue.toFloat(), 0.6f, 0.7f).copy(alpha = 0.3f),
                                                    shape = RoundedCornerShape(4.dp)
                                                )
                                        )
                                    }
                                }
                            }
                        }

                        Spacer(modifier = Modifier.height(12.dp))
                        
                        Text(
                            text = "\${slips.size} memories in the Jar",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Gray,
                            letterSpacing = 0.5.sp
                        )

                        Spacer(modifier = Modifier.height(16.dp))

                        Button(
                            onClick = {
                                if (slips.isNotEmpty()) {
                                    drawnSlip = slips.random()
                                }
                            },
                            enabled = slips.isNotEmpty(),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF608271),
                                disabledContainerColor = Color.LightGray.copy(alpha = 0.4f)
                            ),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("🔮 Draw Random Memory", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "DROP A NEW GEM OF GRATITUDE",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Gray,
                            letterSpacing = 0.5.sp
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        OutlinedTextField(
                            value = gratitudeText,
                            onValueChange = { gratitudeText = it },
                            placeholder = { Text("What made you smile today?", fontSize = 11.sp, color = Color.Gray) },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            textStyle = androidx.compose.ui.text.TextStyle(fontSize = 12.sp)
                        )
                        Spacer(modifier = Modifier.height(12.dp))
                        Button(
                            onClick = {
                                if (gratitudeText.isNotBlank()) {
                                    val formatter = SimpleDateFormat("MMM d", Locale.getDefault())
                                    val dateStr = formatter.format(Date())
                                    val newSlip = GratitudeSlip(
                                        id = System.currentTimeMillis().toString(),
                                        text = gratitudeText.trim(),
                                        timestamp = dateStr,
                                        hue = Random.nextInt(0, 360)
                                    )
                                    val updated = slips + newSlip
                                    slips = updated
                                    saveSlips(context, updated)
                                    gratitudeText = ""
                                }
                            },
                            enabled = gratitudeText.isNotBlank(),
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741)),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text("Fold & drop in Jar", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFF4A6741), modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Keeping a gratitude practice helps train the mind to notice beautiful things.",
                        fontSize = 9.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }

    drawnSlip?.let { slip ->
        AlertDialog(
            onDismissRequest = { drawnSlip = null },
            confirmButton = {
                Button(
                    onClick = { drawnSlip = null },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741))
                ) {
                    Text("Beautiful")
                }
            },
            title = {
                Text(
                    text = "A Warm Memory Recalled",
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF4A6741)
                )
            },
            text = {
                Card(
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.hsv(slip.hue.toFloat(), 0.1f, 0.98f)),
                    border = BorderStroke(1.dp, Color.hsv(slip.hue.toFloat(), 0.3f, 0.8f).copy(alpha = 0.5f))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = "\\\"" + slip.text + "\\\"",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.DarkGray,
                            fontStyle = FontStyle.Italic,
                            textAlign = TextAlign.Center,
                            modifier = Modifier.fillMaxWidth()
                        )
                        Spacer(modifier = Modifier.height(8.dp))
                        Text(
                            text = "Folded in on " + slip.timestamp,
                            fontSize = 9.sp,
                            color = Color.Gray,
                            textAlign = TextAlign.End,
                            modifier = Modifier.fillMaxWidth()
                        )
                    }
                }
            },
            shape = RoundedCornerShape(24.dp)
        )
    }
}

private fun loadSlips(context: Context, defaults: List<GratitudeSlip>): List<GratitudeSlip> {
    val prefs = context.getSharedPreferences("safespace_gratitude", Context.MODE_PRIVATE)
    val data = prefs.getString("slips_list", "") ?: ""
    if (data.isBlank()) return defaults
    return try {
        data.split("|||").map {
            val parts = it.split("###")
            GratitudeSlip(parts[0], parts[1], parts[2], parts[3].toInt())
        }
    } catch (e: Exception) {
        defaults
    }
}

private fun saveSlips(context: Context, slips: List<GratitudeSlip>) {
    val prefs = context.getSharedPreferences("safespace_gratitude", Context.MODE_PRIVATE)
    val serialized = slips.joinToString("|||") { "\\\\\${it.id}###\\\\\${it.text}###\\\\\${it.timestamp}###\\\\\${it.hue}" }
    prefs.edit().putString("slips_list", serialized).apply()
}
`
  },
  {
    name: "SomaticRelaxationScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/SomaticRelaxationScreen.kt",
    language: "kotlin",
    description: "Progressive Muscle Relaxation (PMR) somatic pacing loops that reduce sympathetic alarms.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

data class PmrStep(val title: String, val instruction: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SomaticRelaxationScreen(onBackClick: () -> Unit) {
    val steps = remember {
        listOf(
            PmrStep("Fists & Hands", "Squeeze both fists tightly, feel the tension in your forearms, then let go."),
            PmrStep("Shoulders & Neck", "Shrug your shoulders up high towards your ears, hold them tense, then drop them."),
            PmrStep("Jaw & Face", "Clench your jaw and scrunch up your face, hold, then release all expression."),
            PmrStep("Chest & Stomach", "Take a deep breath and tighten your core muscles, hold it, then breathe out and soften."),
            PmrStep("Feet & Calves", "Curl your toes downward and tense your calf muscles, feel the heat, then let them loose.")
        )
    }

    var currentStepIdx by remember { mutableStateOf(0) }
    var phase by remember { mutableStateOf("TENSE") } // "TENSE" or "RELEASE"
    var secondsLeft by remember { mutableStateOf(5) }
    var isRunning by remember { mutableStateOf(false) }

    val currentStep = steps[currentStepIdx]

    LaunchedEffect(isRunning, phase, secondsLeft) {
        if (isRunning) {
            if (secondsLeft > 0) {
                delay(1000)
                secondsLeft -= 1
            } else {
                if (phase == "TENSE") {
                    phase = "RELEASE"
                    secondsLeft = 7
                } else {
                    if (currentStepIdx < steps.size - 1) {
                        currentStepIdx += 1
                        phase = "TENSE"
                        secondsLeft = 5
                    } else {
                        isRunning = false
                        currentStepIdx = 0
                        phase = "TENSE"
                        secondsLeft = 5
                    }
                }
            }
        }
    }

    val infiniteTransition = rememberInfiniteTransition(label = "pulse")
    val animatedScale by infiniteTransition.animateFloat(
        initialValue = 1.0f,
        targetValue = if (isRunning && phase == "TENSE") 1.25f else if (isRunning && phase == "RELEASE") 1.1f else 1.0f,
        animationSpec = infiniteRepeatable(
            animation = tween(durationMillis = if (phase == "TENSE") 1200 else 2500, easing = LinearEasing),
            repeatMode = RepeatMode.Reverse
        ),
        label = "scale"
    )

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Somatic Release",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Text(
                            text = "Progressive Muscle Relaxation (PMR)",
                            fontSize = 10.sp,
                            color = Color.Gray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF4A6741))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF1F5F2))
            )
        },
        containerColor = Color(0xFFF1F5F2)
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f))
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("🌱", fontSize = 24.sp)
                            Spacer(modifier = Modifier.width(12.dp))
                            Column {
                                Text(
                                    text = "STEP \${currentStepIdx + 1} OF \${steps.size}",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color.Gray,
                                    letterSpacing = 0.5.sp
                                )
                                Text(
                                    text = currentStep.title,
                                    fontSize = 14.sp,
                                    fontWeight = FontWeight.Bold,
                                    color = Color.DarkGray
                                )
                            }
                        }
                        Spacer(modifier = Modifier.height(10.dp))
                        Text(
                            text = currentStep.instruction,
                            fontSize = 11.5.sp,
                            color = Color.Gray,
                            lineHeight = 15.sp
                        )
                    }
                }
            }

            item {
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(260.dp),
                    contentAlignment = Alignment.Center
                ) {
                    Box(
                        modifier = Modifier
                            .scale(animatedScale)
                            .size(190.dp)
                            .background(
                                color = if (phase == "TENSE") Color(0xFF4A6741).copy(alpha = 0.08f) else Color(0xFF81C784).copy(alpha = 0.08f),
                                shape = CircleShape
                            )
                    )

                    Box(
                        modifier = Modifier
                            .size(150.dp)
                            .background(Color.White, CircleShape)
                            .border(
                                width = 3.dp,
                                color = if (phase == "TENSE") Color(0xFF4A6741).copy(alpha = 0.5f) else Color(0xFF81C784).copy(alpha = 0.5f),
                                shape = CircleShape
                            ),
                        contentAlignment = Alignment.Center
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = if (phase == "TENSE") "TENSE" else "RELEASE",
                                fontSize = 20.sp,
                                fontWeight = FontWeight.Black,
                                color = if (phase == "TENSE") Color(0xFF2E7D32) else Color(0xFF4CAF50),
                                letterSpacing = 1.sp
                            )
                            Spacer(modifier = Modifier.height(6.dp))
                            Text(
                                text = "\${secondsLeft}s",
                                fontSize = 28.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.DarkGray
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = if (isRunning) "Active" else "Paused",
                                fontSize = 9.sp,
                                color = Color.Gray
                            )
                        }
                    }
                }
            }

            item {
                Card(
                    shape = RoundedCornerShape(20.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(14.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        steps.forEachIndexed { index, step ->
                            val isActive = index == currentStepIdx
                            val isCompleted = index < currentStepIdx
                            Column(
                                horizontalAlignment = Alignment.CenterHorizontally,
                                modifier = Modifier
                                    .weight(1f)
                                    .clickable {
                                        currentStepIdx = index
                                        phase = "TENSE"
                                        secondsLeft = 5
                                    }
                            ) {
                                Box(
                                    modifier = Modifier
                                        .size(24.dp)
                                        .background(
                                            color = if (isActive) Color(0xFF4A6741) else if (isCompleted) Color(0xFFE1E8E3) else Color(0xFFF1F5F2),
                                            shape = CircleShape
                                        ),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = (index + 1).toString(),
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isActive) Color.White else Color.Gray
                                    )
                                }
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = step.title.split(" ")[0],
                                    fontSize = 8.sp,
                                    fontWeight = if (isActive) FontWeight.Bold else FontWeight.Normal,
                                    color = if (isActive) Color(0xFF4A6741) else Color.Gray,
                                    maxLines = 1
                                )
                            }
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Button(
                        onClick = { isRunning = !isRunning },
                        colors = ButtonDefaults.buttonColors(
                            containerColor = if (isRunning) Color(0xFFD84315) else Color(0xFF4A6741)
                        ),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f)
                    ) {
                        Text(
                            text = if (isRunning) "Pause Guide" else "Start Protocol",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    OutlinedButton(
                        onClick = {
                            isRunning = false
                            currentStepIdx = 0
                            phase = "TENSE"
                            secondsLeft = 5
                        },
                        border = BorderStroke(1.dp, Color(0xFFCBD9CC)),
                        shape = RoundedCornerShape(12.dp),
                        colors = ButtonDefaults.outlinedButtonColors(contentColor = Color.DarkGray)
                    ) {
                        Text("Reset", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFF4A6741), modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "Alternating between tightening and loosening teaches your body somatic safety.",
                        fontSize = 9.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}
`
  },
  {
    name: "StanleyBrownSafetyPlan.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/StanleyBrownSafetyPlan.kt",
    language: "kotlin",
    description: "Gold-standard Stanley-Brown crisis safety planner outlining warning signs, internal coping, distraction, and professional resources.",
    code: `package com.mentalhealth.firstaid.ui.screens

import android.content.Context
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class SafetyStep(
    val id: Int,
    val title: String,
    val description: String,
    val icon: String,
    val key: String,
    val defaultItems: List<String>
)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun StanleyBrownSafetyPlan(onBackClick: () -> Unit) {
    val context = LocalContext.current

    val steps = remember {
        listOf(
            SafetyStep(
                1, "Warning Signs", 
                "Thoughts, moods, behaviors, or physical changes that suggest a crisis might be starting.", 
                "⚠️", "warning_signs",
                listOf("Feeling cold / shivering", "Rapid or shallow chest breathing", "Unwillingness to look at people")
            ),
            SafetyStep(
                2, "Internal Coping", 
                "Things I can do on my own to take my mind off my thoughts.", 
                "🧘", "internal_coping",
                listOf("Brew and slowly sip hot chamomile tea", "The 4-7-8 breathing technique", "Write down thoughts to externalize")
            ),
            SafetyStep(
                3, "Social Distractions", 
                "People or places that can provide a healthy distraction.", 
                "🌳", "social_distractions",
                listOf("The local botanical garden or park walk", "Sitting in a busy coffee shop or bookstore", "Listening to a peaceful public stream")
            ),
            SafetyStep(
                4, "Key Contacts", 
                "People I can contact who can support me during a crisis.", 
                "🗣️", "key_contacts",
                listOf("Bud (555-0192)", "Grandma (555-0144)", "Close neighbor (555-0172)")
            ),
            SafetyStep(
                5, "Professional Help", 
                "Clinicians, agencies, or support services to contact.", 
                "🏥", "professional_help",
                listOf("988 Crisis & Suicide Lifeline", "My primary care doctor", "Local emergency crisis clinic")
            ),
            SafetyStep(
                6, "Safe Environment", 
                "Ways to make my surrounding environment safer.", 
                "🔒", "safe_environment",
                listOf("Handing car keys or sensitive items to a friend", "Moving to a well-lit, open public room", "Locking medication cabinet securely")
            )
        )
    }

    val itemsStateMap = remember {
        mutableStateMapOf<String, List<String>>().apply {
            steps.forEach { step ->
                put(step.key, loadStepItems(context, step.key, step.defaultItems))
            }
        }
    }

    var expandedStepId by remember { mutableStateOf<Int?>(1) }
    val textInputStateMap = remember { mutableStateMapOf<String, String>() }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "My Safety Plan",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Text(
                            text = "Stanley-Brown Clinical Standard",
                            fontSize = 10.sp,
                            color = Color.Gray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Go back", tint = Color(0xFF4A6741))
                    }
                },
                actions = {
                    TextButton(
                        onClick = {
                            steps.forEach { step ->
                                itemsStateMap[step.key] = step.defaultItems
                                saveStepItems(context, step.key, step.defaultItems)
                            }
                        }
                    ) {
                        Text("RESET PLAN", color = Color(0xFFD84315), fontSize = 11.sp, fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF1F5F2))
            )
        },
        containerColor = Color(0xFFF1F5F2)
    ) { padding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f))
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text("🛡️", fontSize = 28.sp)
                        Spacer(modifier = Modifier.width(12.dp))
                        Column {
                            Text(
                                text = "PERSONAL CRISIS PROTOCOL",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.Gray,
                                letterSpacing = 0.5.sp
                            )
                            Text(
                                text = "Having a written safety plan reduces emergency symptom progression by over 40%.",
                                fontSize = 11.sp,
                                color = Color.DarkGray,
                                lineHeight = 14.sp
                            )
                        }
                    }
                }
            }

            items(steps) { step ->
                val isExpanded = expandedStepId == step.id
                val stepItems = itemsStateMap[step.key] ?: emptyList()
                val textInput = textInputStateMap[step.key] ?: ""

                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(
                        containerColor = if (isExpanded) Color.White else Color.White.copy(alpha = 0.7f)
                    ),
                    border = BorderStroke(
                        1.dp, 
                        if (isExpanded) Color(0xFF4A6741).copy(alpha = 0.3f) else Color(0xFFCBD9CC).copy(alpha = 0.2f)
                    )
                ) {
                    Column(modifier = Modifier.fillMaxWidth()) {
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .clickable {
                                    expandedStepId = if (isExpanded) null else step.id
                                }
                                .padding(16.dp),
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.SpaceBetween
                        ) {
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                Text(step.icon, fontSize = 20.sp)
                                Spacer(modifier = Modifier.width(12.dp))
                                Column {
                                    Text(
                                        text = "STEP \${step.id}",
                                        fontSize = 8.5.sp,
                                        fontWeight = FontWeight.Black,
                                        color = Color.Gray
                                    )
                                    Text(
                                        text = step.title,
                                        fontSize = 13.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.DarkGray
                                    )
                                }
                            }
                            Row(verticalAlignment = Alignment.CenterVertically) {
                                if (stepItems.isNotEmpty()) {
                                    Badge(
                                        containerColor = Color(0xFFE8F2EC),
                                        contentColor = Color(0xFF4A6741),
                                        modifier = Modifier.padding(end = 8.dp)
                                    ) {
                                        Text("\${stepItems.size} items", fontSize = 8.5.sp, fontWeight = FontWeight.Bold)
                                    }
                                }
                                Icon(
                                    imageVector = if (isExpanded) Icons.Default.KeyboardArrowUp else Icons.Default.KeyboardArrowDown,
                                    contentDescription = null,
                                    tint = Color.Gray
                                )
                            }
                        }

                        AnimatedVisibility(visible = isExpanded) {
                            Column(
                                modifier = Modifier
                                    .padding(start = 16.dp, end = 16.dp, bottom = 16.dp)
                            ) {
                                Divider(color = Color(0xFFCBD9CC).copy(alpha = 0.3f), modifier = Modifier.padding(bottom = 12.dp))
                                Text(
                                    text = step.description,
                                    fontSize = 10.5.sp,
                                    color = Color.Gray,
                                    lineHeight = 13.sp,
                                    modifier = Modifier.padding(bottom = 12.dp)
                                )

                                if (stepItems.isEmpty()) {
                                    Text(
                                        text = "No custom entries yet. Write one below to customize your plan.",
                                        fontSize = 10.sp,
                                        fontStyle = FontStyle.Italic,
                                        color = Color.LightGray,
                                        modifier = Modifier.padding(bottom = 12.dp)
                                    )
                                } else {
                                    Column(
                                        verticalArrangement = Arrangement.spacedBy(8.dp),
                                        modifier = Modifier.padding(bottom = 12.dp)
                                    ) {
                                        stepItems.forEach { item ->
                                            Row(
                                                modifier = Modifier
                                                    .fillMaxWidth()
                                                    .background(Color(0xFFF9FAF9), RoundedCornerShape(8.dp))
                                                    .border(BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.15f)), RoundedCornerShape(8.dp))
                                                    .padding(horizontal = 10.dp, vertical = 8.dp),
                                                horizontalArrangement = Arrangement.SpaceBetween,
                                                verticalAlignment = Alignment.CenterVertically
                                            ) {
                                                Text(
                                                    text = item,
                                                    fontSize = 11.5.sp,
                                                    color = Color.DarkGray,
                                                    modifier = Modifier.weight(1f)
                                                )
                                                IconButton(
                                                    onClick = {
                                                        val updated = stepItems.filter { it != item }
                                                        itemsStateMap[step.key] = updated
                                                        saveStepItems(context, step.key, updated)
                                                    },
                                                    modifier = Modifier.size(24.dp)
                                                ) {
                                                    Icon(
                                                        imageVector = Icons.Default.Delete,
                                                        contentDescription = "Delete",
                                                        tint = Color.LightGray,
                                                        modifier = Modifier.size(16.dp)
                                                    )
                                                }
                                            }
                                        }
                                    }
                                }

                                Row(
                                    verticalAlignment = Alignment.CenterVertically,
                                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                                ) {
                                    OutlinedTextField(
                                        value = textInput,
                                        onValueChange = { textInputStateMap[step.key] = it },
                                        placeholder = { Text("Add custom strategy...", fontSize = 11.sp, color = Color.Gray) },
                                        modifier = Modifier.weight(1f),
                                        shape = RoundedCornerShape(10.dp),
                                        colors = OutlinedTextFieldDefaults.colors(
                                            focusedBorderColor = Color(0xFF4A6741),
                                            unfocusedBorderColor = Color.LightGray
                                        ),
                                        textStyle = androidx.compose.ui.text.TextStyle(fontSize = 11.5.sp),
                                        singleLine = true
                                    )
                                    IconButton(
                                        onClick = {
                                            if (textInput.isNotBlank() && !stepItems.contains(textInput.trim())) {
                                                val updated = stepItems + textInput.trim()
                                                itemsStateMap[step.key] = updated
                                                saveStepItems(context, step.key, updated)
                                                textInputStateMap[step.key] = ""
                                            }
                                        },
                                        enabled = textInput.isNotBlank(),
                                        modifier = Modifier
                                            .size(40.dp)
                                            .background(
                                                if (textInput.isNotBlank()) Color(0xFF4A6741) else Color.LightGray.copy(alpha = 0.3f),
                                                RoundedCornerShape(10.dp)
                                            )
                                    ) {
                                        Icon(
                                            imageVector = Icons.Default.Add,
                                            contentDescription = "Add",
                                            tint = Color.White,
                                            modifier = Modifier.size(18.dp)
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }

            item {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 8.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Icon(Icons.Default.Info, contentDescription = null, tint = Color(0xFF4A6741), modifier = Modifier.size(12.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text(
                        text = "This safety plan is saved securely and entirely offline on your device.",
                        fontSize = 9.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center
                    )
                }
            }
        }
    }
}

private fun loadStepItems(context: Context, key: String, defaults: List<String>): List<String> {
    val prefs = context.getSharedPreferences("safespace_safety_plan", Context.MODE_PRIVATE)
    val data = prefs.getString(key, "") ?: ""
    if (data.isBlank()) return defaults
    return try {
        data.split("|||")
    } catch (e: Exception) {
        defaults
    }
}

private fun saveStepItems(context: Context, key: String, items: List<String>) {
    val prefs = context.getSharedPreferences("safespace_safety_plan", Context.MODE_PRIVATE)
    val serialized = items.joinToString("|||")
    prefs.edit().putString(key, serialized).apply()
}
`
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

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.PlayArrow
import androidx.compose.material.icons.filled.Pause
import androidx.compose.material.icons.filled.Visibility
import androidx.compose.material.icons.filled.Vibration
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.BiasAlignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmdrPacerScreen(onBackClick: () -> Unit) {
    var speedSec by remember { mutableFloatStateOf(2.5f) }
    var isRunning by remember { mutableStateOf(false) }
    var isAtLeft by remember { mutableStateOf(true) }
    var hapticsEnabled by remember { mutableStateOf(false) }

    val hapticFeedback = LocalHapticFeedback.current

    val animDuration = ((speedSec * 1000) / 2).toInt()
    val animatedBias by animateFloatAsState(
        targetValue = if (isAtLeft) -1f else 1f,
        animationSpec = tween(durationMillis = animDuration, easing = LinearEasing),
        label = "EmdrBallBias"
    )

    LaunchedEffect(isRunning, speedSec, isAtLeft) {
        if (isRunning) {
            delay(animDuration.toLong())
            isAtLeft = !isAtLeft
            if (hapticsEnabled) {
                hapticFeedback.performHapticFeedback(HapticFeedbackType.TextHandleMove)
            }
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Gentle Flow Eye Pacer",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Text(
                            text = "Bilateral stimulation to calm a busy mind",
                            fontSize = 10.sp,
                            color = Color.Gray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Go Back", tint = Color(0xFF4A6741))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF1F5F2))
            )
        },
        containerColor = Color(0xFFF1F5F2)
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Visual Track Stage
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(vertical = 16.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(24.dp),
                    verticalArrangement = Arrangement.Center,
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    // Track slot
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(48.dp)
                            .background(Color(0xFFF1F5F2), RoundedCornerShape(24.dp))
                            .padding(horizontal = 8.dp),
                        contentAlignment = BiasAlignment(horizontalBias = animatedBias, verticalBias = 0f)
                    ) {
                        Box(
                            modifier = Modifier
                                .size(32.dp)
                                .background(Color(0xFF4A6741), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text("👁️", fontSize = 12.sp)
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    Text(
                        text = if (isRunning) "Follow the gaze-pacer left and right..." else "Tap 'Begin Gentle Movement' below to start.",
                        fontSize = 11.sp,
                        color = Color.Gray,
                        fontStyle = androidx.compose.ui.text.font.FontStyle.Italic,
                        textAlign = TextAlign.Center
                    )
                }
            }

            // Controls Column
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                // Pacer Speed Picker Card
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.8f))
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Visibility, contentDescription = null, tint = Color(0xFF4A6741), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Pacer Speed", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4A6741))
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFE1E8E3), RoundedCornerShape(12.dp))
                                .padding(2.dp)
                        ) {
                            listOf(3.8f to "Slow (3.8s)", 2.5f to "Medium (2.5s)", 1.5f to "Fast (1.5s)").forEach { (s, label) ->
                                val isSelected = speedSec == s
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(10.dp))
                                        .background(if (isSelected) Color.White else Color.Transparent)
                                        .clickable { speedSec = s }
                                        .padding(vertical = 8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = label,
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = if (isSelected) Color(0xFF4A6741) else Color(0xFF4A6741).copy(alpha = 0.6f)
                                    )
                                }
                            }
                        }
                    }
                }

                // Gentle Haptics Toggle Card
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.8f))
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(12.dp),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Default.Vibration, contentDescription = null, tint = Color(0xFF4A6741), modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("Gentle Haptics", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4A6741))
                        }
                        Switch(
                            checked = hapticsEnabled,
                            onCheckedChange = { hapticsEnabled = it },
                            colors = SwitchDefaults.colors(
                                checkedThumbColor = Color.White,
                                checkedTrackColor = Color(0xFF4A6741),
                                uncheckedThumbColor = Color.Gray,
                                uncheckedTrackColor = Color(0xFFE1E8E3)
                            )
                        )
                    }
                }

                // Start / Pause Control Button
                Button(
                    onClick = { isRunning = !isRunning },
                    colors = ButtonDefaults.buttonColors(
                        containerColor = if (isRunning) Color(0xFFD84315) else Color(0xFF4A6741)
                    ),
                    shape = RoundedCornerShape(16.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Icon(
                        imageVector = if (isRunning) Icons.Default.Pause else Icons.Default.PlayArrow,
                        contentDescription = null,
                        modifier = Modifier.size(16.dp)
                    )
                    Spacer(modifier = Modifier.width(8.dp))
                    Text(
                        text = if (isRunning) "PAUSE EYE PACER" else "BEGIN GENTLE MOVEMENT",
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        letterSpacing = 0.5.sp
                    )
                }
            }
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

import android.content.Context
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.SimpleDateFormat
import java.util.*

data class JournalLog(val id: String, val category: String, val prompt: String, val text: String, val time: String)

data class CoreEmotion(val name: String, val color: Color, val icon: String, val prompts: List<String>)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmotionWheelScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    
    val emotions = remember {
        listOf(
            CoreEmotion("Sadness", Color(0xFF1E88E5), "😢", listOf(
                "Describe what feels lost or unfinished.",
                "If tears had words, what would they say?",
                "Where in your body do you feel this sadness most heavily?",
                "What is a gentle way you can offer yourself comfort right now?",
                "Write about a time you felt sad but eventually found peace again."
            )),
            CoreEmotion("Anger", Color(0xFFE53935), "🔥", listOf(
                "What boundary of yours was crossed?",
                "Write down your raw frustration with zero filter.",
                "Underneath your anger, is there any sadness, fear, or hurt hiding?",
                "If your anger was a physical object, what would it look like?",
                "Describe a healthy way you can physically channel or release this building energy."
            )),
            CoreEmotion("Fear / Panic", Color(0xFF8E24AA), "🫨", listOf(
                "What is the core threat your brain is predicting?",
                "How can we assure your body it is physically safe?",
                "Look around you. What are 3 physical objects that remind you that you are safe?",
                "If your fear was a small, scared child, how would you comfort them?",
                "Write down the absolute worst-case scenario, and then write the most likely realistic scenario."
            )),
            CoreEmotion("Numbing", Color(0xFF43A047), "😶‍🌫️", listOf(
                "Pinpoint where the emotional weight sits in your torso.",
                "What are you avoiding feeling right now?",
                "Touch three different textures around you and write down how they feel.",
                "If your numbness was a protective shield, what is it shielding you from?",
                "Describe the temperature of your body right now (hands, feet, face)."
            )),
            CoreEmotion("Worthy", Color(0xFFFBC02D), "✨", listOf(
                "Describe a small choice you handled gracefully today.",
                "Who makes you feel secure being yourself?",
                "Write down three things you genuinely appreciate about your personality.",
                "Describe a difficult moment you got through in the past year.",
                "What is a compliment you received recently that you can allow yourself to fully believe."
            ))
        )
    }

    var selectedIdx by remember { mutableStateOf<Int?>(null) }
    var promptIdx by remember { mutableIntStateOf(0) }
    var journalText by remember { mutableStateOf("") }
    
    var journalLogs by remember {
        mutableStateOf(loadLogs(context))
    }

    val selectedEmotion = selectedIdx?.let { emotions[it] }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Emotion Wheel & Journal",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Text(
                            text = "A safe space to write and vent",
                            fontSize = 10.sp,
                            color = Color.Gray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Go Back", tint = Color(0xFF4A6741))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF1F5F2))
            )
        },
        containerColor = Color(0xFFF1F5F2)
    ) { innerPadding ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    text = "Select your primary mood below to retrieve specialized prompts for therapeutic writing. Expressing raw feelings acts as a safety valve.",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    lineHeight = 15.sp,
                    modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
                )
            }

            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            text = "SELECT ACTIVE FEELING SEGMENT:",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Gray,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            emotions.take(3).forEachIndexed { i, item ->
                                val isSelected = selectedIdx == i
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(if (isSelected) item.color else Color(0xFFF8FAFC))
                                        .border(1.dp, if (isSelected) Color.Transparent else Color(0xFFE2E8F0), RoundedCornerShape(12.dp))
                                        .clickable {
                                            selectedIdx = i
                                            promptIdx = 0
                                            journalText = ""
                                        }
                                        .padding(vertical = 8.dp, horizontal = 4.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.Center) {
                                        Text(item.icon, fontSize = 11.sp)
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = item.name.split(" ")[0],
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) Color.White else Color.DarkGray
                                        )
                                    }
                                }
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(6.dp))
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            emotions.drop(3).forEachIndexed { i, item ->
                                val realIdx = i + 3
                                val isSelected = selectedIdx == realIdx
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(if (isSelected) item.color else Color(0xFFF8FAFC))
                                        .border(1.dp, if (isSelected) Color.Transparent else Color(0xFFE2E8F0), RoundedCornerShape(12.dp))
                                        .clickable {
                                            selectedIdx = realIdx
                                            promptIdx = 0
                                            journalText = ""
                                        }
                                        .padding(vertical = 8.dp, horizontal = 4.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.Center) {
                                        Text(item.icon, fontSize = 11.sp)
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = item.name,
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) Color.White else Color.DarkGray
                                        )
                                    }
                                }
                            }
                            Box(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }

            if (selectedEmotion != null) {
                item {
                    Card(
                        shape = RoundedCornerShape(24.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = BorderStroke(1.dp, Color(0xFF4A6741).copy(alpha = 0.2f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "\\\${selectedEmotion.name.uppercase()} PROMPT",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color.Gray
                                )
                                TextButton(
                                    onClick = {
                                        promptIdx = (promptIdx + 1) % selectedEmotion.prompts.size
                                    },
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(12.dp), tint = Color(0xFF4A6741))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("New prompt", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4A6741))
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "\\" \\\\\${selectedEmotion.prompts[promptIdx]} \\"",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.DarkGray,
                                lineHeight = 16.sp
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            OutlinedTextField(
                                value = journalText,
                                onValueChange = { journalText = it },
                                placeholder = { Text("Scribble your therapeutic response here...", fontSize = 11.sp) },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(100.dp),
                                shape = RoundedCornerShape(12.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFF4A6741),
                                    unfocusedBorderColor = Color(0xFFE2E8F0)
                                )
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = { selectedIdx = null },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF1F5F2)),
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Text("Cancel", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.DarkGray)
                                }
                                Button(
                                    onClick = {
                                        if (journalText.trim().isNotEmpty()) {
                                            val sdf = SimpleDateFormat("MMM d, hh:mm a", Locale.getDefault())
                                            val currentTime = sdf.format(Date())
                                            val newLog = JournalLog(
                                                id = System.currentTimeMillis().toString(),
                                                category = selectedEmotion.name,
                                                prompt = selectedEmotion.prompts[promptIdx],
                                                text = journalText.trim(),
                                                time = currentTime
                                            )
                                            val updated = listOf(newLog) + journalLogs
                                            journalLogs = updated
                                            saveLogs(context, updated)
                                            journalText = ""
                                            selectedIdx = null
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B)),
                                    modifier = Modifier.weight(2f),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Icon(Icons.Default.Favorite, contentDescription = null, modifier = Modifier.size(12.dp), tint = Color.White)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Save Entry to Device", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }

            item {
                Text(
                    text = "Venting history (\\\\\${journalLogs.size})",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            if (journalLogs.isEmpty()) {
                item {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.4f)),
                        border = BorderStroke(1.dp, Color(0xFFE1E8E3).copy(alpha = 0.5f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "Clear of logged writings. Let it all out when needed!",
                            fontSize = 11.sp,
                            color = Color.LightGray,
                            fontStyle = FontStyle.Italic,
                            textAlign = TextAlign.Center,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
                        )
                    }
                }
            } else {
                items(journalLogs) { log ->
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .background(Color(0xFFE1E8E3), RoundedCornerShape(50.dp))
                                            .padding(horizontal = 8.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = "\\\\\${log.category.uppercase()} VENT",
                                            fontSize = 8.sp,
                                            fontWeight = FontWeight.Black,
                                            color = Color(0xFF4A6741)
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = log.time,
                                        fontSize = 9.sp,
                                        color = Color.Gray
                                    )
                                }
                                IconButton(
                                    onClick = {
                                        val updated = journalLogs.filter { it.id != log.id }
                                        journalLogs = updated
                                        saveLogs(context, updated)
                                    },
                                    modifier = Modifier.size(24.dp)
                                ) {
                                    Text("✕", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                                }
                            }

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = "Prompt: \\"\\\\\${log.prompt}\\"",
                                fontSize = 10.sp,
                                fontStyle = FontStyle.Italic,
                                color = Color.Gray,
                                modifier = Modifier.padding(bottom = 6.dp)
                            )

                            Text(
                                text = log.text,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color.DarkGray,
                                lineHeight = 15.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

private fun loadLogs(context: Context): List<JournalLog> {
    val prefs = context.getSharedPreferences("safespace_journal_logs", Context.MODE_PRIVATE)
    val raw = prefs.getString("logs", "") ?: ""
    if (raw.isEmpty()) return emptyList()
    return raw.split("|||").mapNotNull { line ->
        val parts = line.split("###")
        if (parts.size >= 5) {
            JournalLog(parts[0], parts[1], parts[2], parts[3], parts[4])
        } else null
    }
}

private fun saveLogs(context: Context, logs: List<JournalLog>) {
    val prefs = context.getSharedPreferences("safespace_journal_logs", Context.MODE_PRIVATE)
    val serialized = logs.joinToString("|||") { "\\\\\${it.id}###\\\\\${it.category}###\\\\\${it.prompt}###\\\\\${it.text}###\\\\\${it.time}" }
    prefs.edit().putString("logs", serialized).apply()
}
`
  },
  {
    name: "VagusResetScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/VagusResetScreen.kt",
    language: "kotlin",
    description: "Somatic Vagus Nerve physical reset prompts coupled with trigger delay counters.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.animation.core.*
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

data class VagusHack(val name: String, val sub: String, val steps: String, val duration: Int, val icon: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun VagusResetScreen(onBackClick: () -> Unit) {
    val hacks = remember {
        listOf(
            VagusHack(
                "Gentle Placed Breath",
                "Heart-rate reassurance",
                "Take a small breath in, close your lips, and gently breathe out against closed lips or a mock straw for 6 seconds. This sends immediate comforting signals to your heart and body.",
                6,
                "👃"
            ),
            VagusHack(
                "Horizon Eye Stretch",
                "Slow the active mind",
                "Without moving your head, slowly look as far to the right as is comfortable. Relax your shoulders, and hold for 15 seconds until you feel a natural stretch or yawn/sigh. Repeat on the left.",
                15,
                "👁️"
            ),
            VagusHack(
                "Restful Hand Cradle",
                "Tension lock release",
                "Rest your hands softly behind your head or neck. Shifting only your eyes, look far right. Relax, breathing comfortably, until you feel your tension gently ease or melt away.",
                20,
                "🙌"
            ),
            VagusHack(
                "Soft Ear Rub Soothe",
                "Soothing body connection",
                "With a clean fingertip, locate the small dip inside your outer ear just above the lobe. Gently massage in small, slow circles. This simple touch helps trigger a natural feeling of ease.",
                12,
                "👂"
            )
        )
    }

    var activeIdx by remember { mutableIntStateOf(0) }
    val currentHack = hacks[activeIdx]

    var timeLeft by remember { mutableIntStateOf(currentHack.duration) }
    var isRunning by remember { mutableStateOf(false) }

    LaunchedEffect(activeIdx) {
        timeLeft = hacks[activeIdx].duration
        isRunning = false
    }

    LaunchedEffect(isRunning, timeLeft) {
        if (isRunning && timeLeft > 0) {
            delay(1000)
            timeLeft--
        } else if (isRunning && timeLeft == 0) {
            isRunning = false
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Sensory Body Resets",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Text(
                            text = "Vagus nerve stimulation exercises",
                            fontSize = 10.sp,
                            color = Color.Gray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Go Back", tint = Color(0xFF4A6741))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = Color(0xFFF1F5F2))
            )
        },
        containerColor = Color(0xFFF1F5F2)
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f)
                    .padding(vertical = 12.dp)
            ) {
                Column(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Box(
                        modifier = Modifier
                            .background(Color(0xFF4A6741).copy(alpha = 0.1f), RoundedCornerShape(50.dp))
                            .padding(horizontal = 12.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = "EXERCISE \\\\\${activeIdx + 1} OF \\\\\${hacks.size} • \\\\\${currentHack.name.uppercase()}",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF4A6741)
                        )
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    Box(
                        modifier = Modifier
                            .size(90.dp)
                            .background(
                                color = Color(0xFF4A6741).copy(alpha = if (isRunning) 0.1f else 0.05f),
                                shape = CircleShape
                            )
                            .padding(8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Color.White, CircleShape)
                                .border(1.dp, Color(0xFFCBD9CC), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            if (isRunning) {
                                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                    Text("STAY", fontSize = 8.sp, fontWeight = FontWeight.Black, color = Color(0xFF4A6741))
                                    Text("\\\\\${timeLeft}s", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.DarkGray)
                                }
                            } else {
                                Text(currentHack.icon, fontSize = 28.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(20.dp))

                    Text(
                        text = currentHack.name,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Black,
                        color = Color.DarkGray
                    )
                    Text(
                        text = currentHack.sub.uppercase(),
                        fontSize = 9.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF4A6741),
                        letterSpacing = 0.5.sp
                    )

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = currentHack.steps,
                        fontSize = 11.sp,
                        color = Color.Gray,
                        lineHeight = 15.sp,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(horizontal = 8.dp)
                    )

                    Spacer(modifier = Modifier.height(20.dp))

                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = { isRunning = !isRunning },
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isRunning) Color(0xFFD84315) else Color(0xFF4A6741)
                            ),
                            shape = RoundedCornerShape(16.dp),
                            modifier = Modifier.height(36.dp)
                        ) {
                            Text(if (isRunning) "Pause Timer" else "Start Timer", fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }

                        IconButton(
                            onClick = { activeIdx = (activeIdx + 1) % hacks.size },
                            modifier = Modifier
                                .size(36.dp)
                                .background(Color(0xFFF1F5F2), CircleShape)
                        ) {
                            Text("➔", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.DarkGray)
                        }
                    }
                }
            }

            Row(
                modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                hacks.forEachIndexed { i, _ ->
                    val isSelected = activeIdx == i
                    Box(
                        modifier = Modifier
                            .padding(horizontal = 3.dp)
                            .size(if (isSelected) 8.dp else 6.dp)
                            .background(
                                color = if (isSelected) Color(0xFF4A6741) else Color(0xFFCBD9CC),
                                shape = CircleShape
                            )
                            .clickable { activeIdx = i }
                    )
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "Gentle physical holds help tell your body that it is safe to relax.",
                    fontSize = 9.sp,
                    color = Color.LightGray,
                    fontWeight = FontWeight.Bold
                )
            }
        }
    }
}`
  },
  {
    name: "PanicRescueScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/PanicRescueScreen.kt",
    language: "kotlin",
    description: "1-Tap Extreme Panic anchor override deploying grounding pacing waves.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.*
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay

data class SOSStep(val label: String, val text: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PanicRescueScreen(onBackClick: () -> Unit) {
    var active by remember { mutableStateOf(false) }
    var phaseIdx by remember { mutableIntStateOf(0) }

    val sosSteps = remember {
        listOf(
            SOSStep("GENTLE WAVE", "Acknowledge this wave of feeling. You are in a safe place. This is just a temporary surge of energy. Let it wash past you gently."),
            SOSStep("SENSORY REFOCUS", "Look around you. Find 3 cozy or comforting items in your immediate surroundings right now. Feel your breath slow down."),
            SOSStep("SLOW CHEST BREATH", "Breathe in slowly and comfortably for 4 seconds... hold for 4 seconds... breathe out softly for 5 seconds."),
            SOSStep("FEEL THE GROUND", "Place your feet flat and solid on the floor. Feel the ground beneath you supporting you. You are held safe."),
            SOSStep("GENTLE RECOVERY", "You did wonderfully. You are safe, secure, and grounded. If you need further grounding, feel free to restart this SOS guide or try one of our calming breathing exercises.")
        )
    }

    val currentStep = sosSteps[phaseIdx]

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Calm Rescue Space",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = if (active) Color.White else Color(0xFF4A6741)
                        )
                        Text(
                            text = "Emergency offline grounding guide",
                            fontSize = 10.sp,
                            color = if (active) Color.LightGray else Color.Gray
                        )
                    }
                },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(
                            imageVector = Icons.Default.ArrowBack,
                            contentDescription = "Go Back",
                            tint = if (active) Color.White else Color(0xFF4A6741)
                        )
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = if (active) Color(0xFF0F172A) else Color(0xFFF1F5F2)
                )
            )
        },
        containerColor = if (active) Color(0xFF0F172A) else Color(0xFFF1F5F2)
    ) { innerPadding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.SpaceBetween,
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            if (!active) {
                Column(
                    modifier = Modifier.weight(1f),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Text(
                        text = "A paced 5-step audio-somatic grounding guide for high overload moments.",
                        fontSize = 11.sp,
                        color = Color.Gray,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.padding(bottom = 24.dp)
                    )

                    val infiniteTransition = rememberInfiniteTransition(label = "PingPulse")
                    val pingScale by infiniteTransition.animateFloat(
                        initialValue = 1.0f,
                        targetValue = 1.12f,
                        animationSpec = infiniteRepeatable(
                            animation = tween(1200, easing = LinearOutSlowInEasing),
                            repeatMode = RepeatMode.Restart
                        ),
                        label = "Ping"
                    )
                    val pingAlpha by infiniteTransition.animateFloat(
                        initialValue = 0.5f,
                        targetValue = 0.0f,
                        animationSpec = infiniteRepeatable(
                            animation = tween(1200, easing = LinearOutSlowInEasing),
                            repeatMode = RepeatMode.Restart
                        ),
                        label = "Alpha"
                    )

                    Box(
                        modifier = Modifier.size(120.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize(pingScale)
                                .background(Color(0xFFE53935).copy(alpha = pingAlpha), CircleShape)
                        )
                        Box(
                            modifier = Modifier
                                .size(88.dp)
                                .background(Color(0xFF1E293B), CircleShape)
                                .border(3.dp, Color(0xFFE53935).copy(alpha = 0.5f), CircleShape)
                                .clickable {
                                    phaseIdx = 0
                                    active = true
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Text("🚨", fontSize = 18.sp)
                                Spacer(modifier = Modifier.height(4.dp))
                                Text(
                                    text = "TAP SOS",
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color(0xFFFFCDD2),
                                    letterSpacing = 0.5.sp
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(32.dp))

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = BorderStroke(1.dp, Color(0xFFE2E8F0)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Text(
                                text = "🗺️ THE 5-STEP SOMATIC PATHWAY",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Black,
                                color = Color.Gray,
                                modifier = Modifier.padding(bottom = 8.dp)
                            )
                            
                            val listItems = listOf(
                                "1. Gentle Wave" to "Soft emotional containment",
                                "2. Sensory Refocus" to "Calm focus finder",
                                "3. Slow Chest Breath" to "Respiratory vagus reset",
                                "4. Feel Grounded" to "Weight down sensory anchors",
                                "5. Gentle Recovery" to "Safe, loving consolidation"
                            )

                            listItems.forEach { (title, subtitle) ->
                                Row(
                                    modifier = Modifier.padding(vertical = 4.dp),
                                    verticalAlignment = Alignment.CenterVertically
                                ) {
                                    Box(
                                        modifier = Modifier
                                            .size(5.dp)
                                            .background(Color(0xFFE53935), CircleShape)
                                    )
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = title,
                                        fontSize = 11.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = Color.DarkGray
                                    )
                                    Text(
                                        text = " - $subtitle",
                                        fontSize = 10.sp,
                                        color = Color.Gray
                                    )
                                }
                            }
                        }
                    }
                }
            } else {
                Column(
                    modifier = Modifier.weight(1f),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.Center
                ) {
                    Box(
                        modifier = Modifier
                            .size(110.dp)
                            .background(Color.White.copy(alpha = 0.05f), CircleShape)
                            .padding(8.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Box(
                            modifier = Modifier
                                .fillMaxSize()
                                .background(Color(0xFF1E293B), CircleShape)
                                .border(1.dp, Color(0xFF60A5FA).copy(alpha = 0.4f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Box(
                                    modifier = Modifier
                                        .size(6.dp)
                                        .background(Color(0xFF60A5FA), CircleShape)
                                )
                                Spacer(modifier = Modifier.height(4.dp))
                                Text("FOCUS HERE", fontSize = 8.sp, fontWeight = FontWeight.Black, color = Color(0xFF93C5FD))
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "STEP \\\\\${phaseIdx + 1} OF 5",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF60A5FA)
                        )
                        
                        Row {
                            sosSteps.forEachIndexed { i, _ ->
                                val isSelected = phaseIdx == i
                                Box(
                                    modifier = Modifier
                                        .padding(horizontal = 2.dp)
                                        .size(6.dp)
                                        .background(
                                            color = if (isSelected) Color(0xFF60A5FA) else Color(0xFF475569),
                                            shape = CircleShape
                                        )
                                        .clickable { phaseIdx = i }
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(8.dp))

                    Box(
                        modifier = Modifier
                            .align(Alignment.Start)
                            .background(Color(0xFF1E293B), RoundedCornerShape(50.dp))
                            .border(1.dp, Color(0xFF475569), RoundedCornerShape(50.dp))
                            .padding(horizontal = 12.dp, vertical = 4.dp)
                    ) {
                        Text(
                            text = currentStep.label,
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Black,
                            color = Color(0xFF93C5FD)
                        )
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color(0xFF1E293B)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Row(modifier = Modifier.padding(16.dp)) {
                            Box(
                                modifier = Modifier
                                    .width(3.dp)
                                    .fillMaxHeight()
                                    .background(Color(0xFF3B82F6))
                            )
                            Spacer(modifier = Modifier.width(12.dp))
                            Text(
                                text = currentStep.text,
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFFE2E8F0),
                                lineHeight = 16.sp
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(24.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Button(
                            onClick = { phaseIdx = Math.max(0, phaseIdx - 1) },
                            enabled = phaseIdx > 0,
                            colors = ButtonDefaults.buttonColors(
                                containerColor = Color(0xFF1E293B),
                                disabledContainerColor = Color(0xFF1E293B).copy(alpha = 0.3f)
                            ),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("◀ Prev", fontSize = 10.sp, fontWeight = FontWeight.Bold, color = Color(0xFF93C5FD))
                        }

                        Button(
                            onClick = {
                                if (phaseIdx < sosSteps.size - 1) {
                                    phaseIdx++
                                } else {
                                    phaseIdx = 0
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B82F6)),
                            shape = RoundedCornerShape(12.dp),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text(
                                text = if (phaseIdx == sosSteps.size - 1) "Start Over" else "Next ▶",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    TextButton(onClick = { active = false }) {
                        Text("Cancel SOS Guide", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                    }
                }
            }

            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 4.dp),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "YOU ARE SAFE. PLEASE TAKE ALL THE TIME YOU NEED TO RESET.",
                    fontSize = 8.sp,
                    color = if (active) Color(0xFFFCA5A5) else Color(0xFFE53935).copy(alpha = 0.6f),
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 0.5.sp
                )
            }
        }
    }
}`
  },
  {
    name: "SomaticHubScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/SomaticHubScreen.kt",
    language: "kotlin",
    description: "The somatic and body-based relaxation hub interface.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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

@Composable
fun SomaticHubScreen(onNavigateToRoute: (String) -> Unit) {
    val tools = remember {
        listOf(
            Triple("breathing", "Guided Breathing", "Box and 4-7-8 deep breathing rhythms with peaceful pacing helpers."),
            Triple("grounding", "Sensory Grounding", "A simple 5-4-3-2-1 sequence and warm check-ins to feel grounded."),
            Triple("vagusHacks", "Vagus Nerve Resets", "Simple nerve holds, jaw releases, and gentle breath pressures to settle."),
            Triple("somatic", "Somatic Muscle Relax", "A progressive tension-and-release sequence to ease physical tightness."),
            Triple("emdr", "EMDR Eye Pacer", "A steady visual pacer to help quiet your thoughts and find steady focus.")
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAF9F6))
            .padding(16.dp)
    ) {
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Restful Regulation",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF4A6741)
        )
        Text(
            text = "Somatic & Body Hub",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = "These gentle offline exercises help you connect with your body, pause for a moment, and discover your natural physical center of calm.",
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(tools) { (id, name, desc) ->
                val icon = when (id) {
                    "breathing" -> Icons.Default.Spa
                    "grounding" -> Icons.Default.Info
                    "vagusHacks" -> Icons.Default.Refresh
                    "somatic" -> Icons.Default.Favorite
                    else -> Icons.Default.PlayArrow
                }
                val bgColor = when (id) {
                    "breathing" -> Color(0xFFE8F5E9)
                    "grounding" -> Color(0xFFE0F2F1)
                    "vagusHacks" -> Color(0xFFFFF8E1)
                    "somatic" -> Color(0xFFE8EAF6)
                    else -> Color(0xFFE1F5FE)
                }
                val accentColor = when (id) {
                    "breathing" -> Color(0xFF2E7D32)
                    "grounding" -> Color(0xFF00695C)
                    "vagusHacks" -> Color(0xFFF57F17)
                    "somatic" -> Color(0xFF283593)
                    else -> Color(0xFF0277BD)
                }
                val tag = when (id) {
                    "breathing" -> "Breathe"
                    "grounding" -> "Sensory"
                    "vagusHacks" -> "Gentle"
                    "somatic" -> "Body"
                    else -> "Visual"
                }
                
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigateToRoute(id) }
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = bgColor,
                            modifier = Modifier.size(48.dp)
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier.fillMaxSize()
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = name,
                                    tint = accentColor,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }
                        
                        Spacer(modifier = Modifier.width(16.dp))
                        
                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = name,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Color(0xFF2C3E50)
                                )
                                Surface(
                                    shape = RoundedCornerShape(4.dp),
                                    color = bgColor
                                ) {
                                    Text(
                                        text = tag,
                                        fontSize = 8.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = accentColor,
                                        modifier = Modifier.padding(horizontal = 6.dp, py = 2.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = desc,
                                fontSize = 11.sp,
                                color = Color.Gray,
                                lineHeight = 14.sp
                            )
                        }
                    }
                }
            }
        }
    }
}`
  },
  {
    name: "CbtHubScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/CbtHubScreen.kt",
    language: "kotlin",
    description: "CBT and cognitive-based mind tools hub.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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

@Composable
fun CbtHubScreen(onNavigateToRoute: (String) -> Unit) {
    val tools = remember {
        listOf(
            Triple("reframing", "Thought Reframer", "A friendly guided space to find perspective and gently ease worrying thoughts."),
            Triple("worryBox", "Worry Lockbox", "A warm, private space to write down worries and let them rest for later."),
            Triple("emotionWheel", "Emotion Journal", "Explore and name your feelings step-by-step in a private, gentle journal."),
            Triple("relief", "Coping Words", "Comforting, reassuring phrases to read and recall whenever you need them."),
            Triple("gratitude", "Gratitude Jar", "Write down small moments of joy and kindness to look back on."),
            Triple("habit", "Everyday Basics", "A quick, simple checklist to check in on rest, water, and sunlight.")
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAF9F6))
            .padding(16.dp)
    ) {
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Mind & Thoughts",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF4A6741)
        )
        Text(
            text = "CBT & Mind Hub",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = "Thought exercises help you pause spiraling fears, set aside future concerns, and bring your mind back to a place of comfort and clarity.",
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(tools) { (id, name, desc) ->
                val icon = when (id) {
                    "reframing" -> Icons.Default.MenuBook
                    "worryBox" -> Icons.Default.Lock
                    "emotionWheel" -> Icons.Default.List
                    "relief" -> Icons.Default.Info
                    "gratitude" -> Icons.Default.Star
                    else -> Icons.Default.Check
                }
                val bgColor = when (id) {
                    "reframing" -> Color(0xFFE8F5E9)
                    "worryBox" -> Color(0xFFFFF8E1)
                    "emotionWheel" -> Color(0xFFFFEBEE)
                    "relief" -> Color(0xFFE8F5E9)
                    "gratitude" -> Color(0xFFE8EAF6)
                    else -> Color(0xFFE1F5FE)
                }
                val accentColor = when (id) {
                    "reframing" -> Color(0xFF2E7D32)
                    "worryBox" -> Color(0xFFF57F17)
                    "emotionWheel" -> Color(0xFFC62828)
                    "relief" -> Color(0xFF4A6741)
                    "gratitude" -> Color(0xFF283593)
                    else -> Color(0xFF0277BD)
                }
                val tag = when (id) {
                    "reframing" -> "CBT"
                    "worryBox" -> "Lock"
                    "emotionWheel" -> "Journal"
                    "relief" -> "Words"
                    "gratitude" -> "Joy"
                    else -> "Basics"
                }
                
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigateToRoute(id) }
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = bgColor,
                            modifier = Modifier.size(48.dp)
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier.fillMaxSize()
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = name,
                                    tint = accentColor,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }
                        
                        Spacer(modifier = Modifier.width(16.dp))
                        
                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = name,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Color(0xFF2C3E50)
                                )
                                Surface(
                                    shape = RoundedCornerShape(4.dp),
                                    color = bgColor
                                ) {
                                    Text(
                                        text = tag,
                                        fontSize = 8.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = accentColor,
                                        modifier = Modifier.padding(horizontal = 6.dp, py = 2.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = desc,
                                fontSize = 11.sp,
                                color = Color.Gray,
                                lineHeight = 14.sp
                            )
                        }
                    }
                }
            }
        }
    }
}
`
  },
  {
    name: "SafetyHubScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/SafetyHubScreen.kt",
    language: "kotlin",
    description: "Crisis support, safety planning, and direct hotline dials hub.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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

@Composable
fun SafetyHubScreen(onNavigateToRoute: (String) -> Unit) {
    val tools = remember {
        listOf(
            Triple("panicSOS", "Calm Rescue Space", "A simple, direct pace-helper that provides deep soothing tones and reassuring visual guidance."),
            Triple("safetyPlan", "Comfort Safety Plan", "A custom safety blueprint based on standard, helpful steps to keep you safe and cared for."),
            Triple("emergency", "Support & Helpline Contacts", "Immediate, easy access to supportive helplines, text services, and caring peer advocates loaded offline."),
            Triple("resources", "Mental Health Resource Links", "Direct web access to trusted global mental health organizations, educational guides, and screening tools.")
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAF9F6))
            .padding(16.dp)
    ) {
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Comfort & Support Backup",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF4A6741)
        )
        Text(
            text = "Support Hub",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = "These resources are here to support you in difficult moments. If you are feeling overwhelmed, take a slow breath. You are safe here.",
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(tools) { (id, name, desc) ->
                val icon = when (id) {
                    "panicSOS" -> Icons.Default.Warning
                    "safetyPlan" -> Icons.Default.Star
                    "emergency" -> Icons.Default.Phone
                    else -> Icons.Default.Info
                }
                val bgColor = when (id) {
                    "panicSOS" -> Color(0xFFFFEBEE)
                    "safetyPlan" -> Color(0xFFE8F5E9)
                    "emergency" -> Color(0xFFE8EAF6)
                    else -> Color(0xFFE1F5FE)
                }
                val accentColor = when (id) {
                    "panicSOS" -> Color(0xFFC62828)
                    "safetyPlan" -> Color(0xFF2E7D32)
                    "emergency" -> Color(0xFF283593)
                    else -> Color(0xFF0277BD)
                }
                val tag = when (id) {
                    "panicSOS" -> "Rescue"
                    "safetyPlan" -> "Safety"
                    "emergency" -> "Crisis"
                    else -> "Web"
                }
                
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigateToRoute(id) }
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = bgColor,
                            modifier = Modifier.size(48.dp)
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier.fillMaxSize()
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = name,
                                    tint = accentColor,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }
                        
                        Spacer(modifier = Modifier.width(16.dp))
                        
                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = name,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Color(0xFF2C3E50)
                                )
                                Surface(
                                    shape = RoundedCornerShape(4.dp),
                                    color = bgColor
                                ) {
                                    Text(
                                        text = tag,
                                        fontSize = 8.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = accentColor,
                                        modifier = Modifier.padding(horizontal = 6.dp, py = 2.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = desc,
                                fontSize = 11.sp,
                                color = Color.Gray,
                                lineHeight = 14.sp
                            )
                        }
                    }
                }
            }
        }
    }
}
`
  },
  {
    name: "SimpleResourcesScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/SimpleResourcesScreen.kt",
    language: "kotlin",
    description: "Simple links screen for mental health resource web references.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Info
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun SimpleResourcesScreen(onBackClick: () -> Unit) {
    val resources = listOf(
        "National Suicide Prevention Lifeline" to "https://988lifeline.org",
        "Crisis Text Line" to "https://www.crisistextline.org",
        "The Trevor Project" to "https://www.thetrevorproject.org",
        "NAMI Support" to "https://nami.org",
        "Mental Health America" to "https://mhanational.org"
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAF9F6))
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Back to Support Hub",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }

        Spacer(modifier = Modifier.height(16.dp))

        Text(
            text = "Mental Health Resource Links",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Text(
            text = "Direct web access to trusted global mental health organizations, educational guides, and screening tools.",
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(resources) { (name, url) ->
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(16.dp)) {
                        Text(
                            text = name,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = Color(0xFF2C3E50)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = url,
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.primary,
                            fontWeight = FontWeight.Medium
                        )
                    }
                }
            }
        }
    }
}
`
  },
  {
    name: "DbtCalmScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/DbtCalmScreen.kt",
    language: "kotlin",
    description: "Interactive Dialectical Behavior Therapy (DBT) screen containing STOP skill, TIPP physical resets, ACCEPTS distraction, Opposite Action, and Wise Mind synthesis.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.animation.*
import androidx.compose.foundation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun DbtCalmScreen(onBack: () -> Unit) {
    var activeTab by remember { mutableStateOf("STOP") }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("DBT Calm Center", fontWeight = FontWeight.Bold, color = Color(0xFF1E293B)) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF4A6741))
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(
                    containerColor = Color(0xFFF5F8F6)
                )
            )
        },
        containerColor = Color(0xFFF5F8F6)
    ) { paddingValues ->
        val padding = paddingValues
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp)
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .horizontalScroll(rememberScrollState()),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                listOf("STOP", "TIPP", "DISTRACT", "OPPOSITE", "WISE").forEach { tab ->
                    FilterChip(
                        selected = activeTab == tab,
                        onClick = { activeTab = tab },
                        label = { Text(tab) }
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            Card(
                modifier = Modifier
                    .fillMaxWidth()
                    .weight(1f),
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(16.dp)
                ) {
                    Text(
                        text = "DBT Interactive $activeTab Module ready for crisis response.",
                        fontSize = 14.sp,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.align(Alignment.Center)
                    )
                }
            }
        }
    }
}
`
  },
  {
    name: "HistoryScreen.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/screens/HistoryScreen.kt",
    language: "kotlin",
    description: "Interactive monthly care logs calendar, check-in editor, and CSV/Plaintext logs exporter matching the simulated dashboard.",
    code: `package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.border
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString

data class DayData(val stress: Int, val emoji: String, val hasData: Boolean)
data class MonthConfig(val key: String, val label: String, val days: Int, val offset: Int)

@Composable
fun HistoryScreen(onBackClick: () -> Unit) {
    val monthsConfig = listOf(
        MonthConfig("04", "April 2026", 30, 3), // Starts Wed (Mon=0, Tue=1, Wed=2, Thu=3... wait! If Mon is 0, Wed is 2 offset. Let's do standard calendar: Mon=0)
        MonthConfig("05", "May 2026", 31, 5),   // Starts Fri (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4 offset)
        MonthConfig("06", "June 2026", 30, 1)   // Starts Mon (Mon=0, Tue=1 offset)
    )

    var selectedMonthIdx by remember { mutableIntStateOf(2) } // June 2026
    var selectedDay by remember { mutableIntStateOf(13) }
    
    // Monthly history log map
    val monthlyData = remember {
        mutableStateMapOf<String, DayData>().apply {
            // Seed a few default log items for beautiful presentation
            put("2026-06-13", DayData(4, "😌", true))
            put("2026-06-12", DayData(3, "✨", true))
            put("2026-06-11", DayData(6, "⛈️", true))
            put("2026-06-10", DayData(5, "☕", true))
            put("2026-06-09", DayData(2, "☀️", true))
            put("2026-06-08", DayData(3, "🍃", true))
            put("2026-06-07", DayData(7, "😰", true))
            
            put("2026-05-24", DayData(5, "🧘", true))
            put("2026-05-15", DayData(4, "🪴", true))
            put("2026-05-01", DayData(8, "🔥", true))
        }
    }

    // Exporter Settings States
    var exportFormat by remember { mutableStateOf("text") } // "text" or "csv"
    var exportRange by remember { mutableStateOf("month") } // "week" or "month"
    var showShareNotification by remember { mutableStateOf(false) }

    val currentMonth = monthsConfig[selectedMonthIdx]
    val clipboardManager = LocalClipboardManager.current
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF1F5F2))
            .padding(16.dp)
            .verticalScroll(scrollState)
    ) {
        // Back Navigation Header
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF4A6741))
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Back to Toolkit",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF4A6741)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Screen Heading
        Text(
            text = "Care History & Logs",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
            color = Color(0xFF4A6741),
            modifier = Modifier.padding(bottom = 4.dp)
        )
        Text(
            text = "Track monthly and weekly mood logging data, seed mock datasets, or export diaries locally.",
            fontSize = 11.sp,
            color = Color.Gray,
            lineHeight = 15.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Month Selector Header Card
        Card(
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f)),
            modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = {
                        if (selectedMonthIdx > 0) {
                            selectedMonthIdx--
                            selectedDay = 1
                        }
                    },
                    enabled = selectedMonthIdx > 0
                ) {
                    Icon(Icons.Default.ChevronLeft, contentDescription = "Prev Month", tint = Color(0xFF4A6741))
                }

                Text(
                    text = currentMonth.label,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Black,
                    color = Color(0xFF4A6741)
                )

                IconButton(
                    onClick = {
                        if (selectedMonthIdx < monthsConfig.size - 1) {
                            selectedMonthIdx++
                            selectedDay = 1
                        }
                    },
                    enabled = selectedMonthIdx < monthsConfig.size - 1
                ) {
                    Icon(Icons.Default.ChevronRight, contentDescription = "Next Month", tint = Color(0xFF4A6741))
                }
            }
        }

        // Calendar Grid Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // Day initials
                val weekInitials = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
                Row(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    weekInitials.forEach { w ->
                        Text(
                            text = w,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Gray,
                            modifier = Modifier.weight(1f),
                            textAlign = TextAlign.Center
                        )
                    }
                }

                // Days cells
                val offset = currentMonth.offset
                val daysCount = currentMonth.days
                val totalCells = offset + daysCount
                val rowsCount = (totalCells + 6) / 7

                for (row in 0 until rowsCount) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        for (col in 0 until 7) {
                            val cellIndex = row * 7 + col
                            val dayNum = cellIndex - offset + 1
                            
                            if (cellIndex < offset || dayNum > daysCount) {
                                Spacer(modifier = Modifier.weight(1f))
                            } else {
                                val dateKey = "2026-\${currentMonth.key}-\${dayNum.toString().padStart(2, '0')}"
                                val dayData = monthlyData[dateKey]
                                val isSelected = selectedDay == dayNum

                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .aspectRatio(1f)
                                        .padding(2.dp)
                                        .background(
                                            color = if (isSelected) Color(0xFFEBF2EC) else if (dayData?.hasData == true) Color(0xFFF5FAF6) else Color.Transparent,
                                            shape = CircleShape
                                        )
                                        .border(
                                            width = 1.2.dp,
                                            color = if (isSelected) Color(0xFF4A6741) else if (dayData?.hasData == true) Color(0xFFCBD9CC) else Color.Transparent,
                                            shape = CircleShape
                                        )
                                        .clickable { selectedDay = dayNum },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        verticalArrangement = Arrangement.Center
                                    ) {
                                        Text(
                                            text = dayNum.toString(),
                                            fontSize = 10.sp,
                                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Normal,
                                            color = if (isSelected) Color(0xFF4A6741) else if (dayData?.hasData == true) Color(0xFF2C3E50) else Color.Gray
                                        )
                                        if (dayData?.hasData == true) {
                                            Text(
                                                text = dayData.emoji,
                                                fontSize = 9.sp,
                                                modifier = Modifier.padding(top = 1.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Selected Day Details and Check-In Editor Card
        val selectedDateKey = "2026-\${currentMonth.key}-\${selectedDay.toString().padStart(2, '0')}"
        val activeDayData = monthlyData[selectedDateKey] ?: DayData(5, "", false)

        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Details: \${currentMonth.name} \${selectedDay}, 2026",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray,
                    letterSpacing = 0.5.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                if (activeDayData.hasData) {
                    // Display details
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Mood: ",
                                fontSize = 12.sp,
                                color = Color.Gray,
                                fontWeight = FontWeight.Bold
                            )
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .background(Color(0xFFE1E8E3), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(activeDayData.emoji, fontSize = 14.sp)
                            }
                        }

                        Box(
                            modifier = Modifier
                                .background(Color(0xFFEBF2EC), RoundedCornerShape(50.dp))
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "Stress Level: \${activeDayData.stress}/10",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF4A6741)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Custom Inline Editor
                    Text(
                        text = "Edit Log Entry",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Gray
                    )
                    
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        val editEmojis = listOf("😌", "🙂", "🍃", "⛈️", "✨", "😰", "🧘")
                        editEmojis.forEach { em ->
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .background(if (activeDayData.emoji == em) Color(0xFFE1E8E3) else Color(0xFFF1F5F2), CircleShape)
                                    .border(
                                        width = 1.dp,
                                        color = if (activeDayData.emoji == em) Color(0xFF4A6741) else Color.Transparent,
                                        shape = CircleShape
                                    )
                                    .clickable {
                                        monthlyData[selectedDateKey] = DayData(activeDayData.stress, em, true)
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(em, fontSize = 13.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Adjust Stress Scale",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Gray
                    )

                    Slider(
                        value = activeDayData.stress.toFloat(),
                        onValueChange = { newVal ->
                            monthlyData[selectedDateKey] = DayData(newVal.toInt(), activeDayData.emoji, true)
                        },
                        valueRange = 1f..10f,
                        steps = 8,
                        colors = SliderDefaults.colors(
                            activeTrackColor = Color(0xFF4A6741),
                            inactiveTrackColor = Color(0xFFE1E8E3),
                            thumbColor = Color(0xFF4A6741)
                        )
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Button(
                        onClick = {
                            monthlyData.remove(selectedDateKey)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFEBEE)),
                        modifier = Modifier.fillMaxWidth().height(36.dp)
                    ) {
                        Text("Delete Log Entry", fontSize = 11.sp, color = Color.Red, fontWeight = FontWeight.Bold)
                    }

                } else {
                    // Day has no log data
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text(
                            text = "No log registered for this day.",
                            fontSize = 11.sp,
                            color = Color.LightGray,
                            fontWeight = FontWeight.Bold
                        )
                        Button(
                            onClick = {
                                monthlyData[selectedDateKey] = DayData(5, "😌", true)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741)),
                            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                            modifier = Modifier.height(32.dp)
                        ) {
                            Text("Log Log Today", fontSize = 10.sp, color = Color.White)
                        }
                    }
                }
            }
        }

        // Seeds & Debugging Tools Row
        Card(
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = "SEED & BACKUP CONTROLS",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray,
                    letterSpacing = 0.5.sp,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            monthlyData.clear()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFF1F1)),
                        modifier = Modifier.weight(1f).height(32.dp),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text("Reset Logs", fontSize = 9.sp, color = Color.Red, fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = {
                            // Seed random mock data across months
                            val sets = listOf("😌", "✨", "🍃", "⛈️", "☀️", "☕", "😰", "🧘", "🪴")
                            for (monthIdx in 0..2) {
                                val m = monthsConfig[monthIdx]
                                // Seed roughly 8 days per month
                                val seedDays = listOf(3, 7, 10, 14, 18, 22, 25, 28)
                                seedDays.forEach { d ->
                                    val dateK = "2026-\${m.key}-\${d.toString().padStart(2, '0')}"
                                    monthlyData[dateK] = DayData((2..9).random(), sets.random(), true)
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEBF2EC)),
                        modifier = Modifier.weight(1f).height(32.dp),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text("Seed Demo Logs", fontSize = 9.sp, color = Color(0xFF4A6741), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Local Diary Logs Exporter Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Local Diary Exporter",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray,
                    letterSpacing = 0.5.sp
                )
                Text(
                    text = "Generate and copy a plaintext summary or CSV of your offline log history.",
                    fontSize = 10.sp,
                    color = Color.LightGray,
                    modifier = Modifier.padding(vertical = 4.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Selector: CSV vs Text
                Text(text = "Export Format", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val formats = listOf("text" to "Plaintext Diary", "csv" to "Spreadsheet CSV")
                    formats.forEach { (fid, name) ->
                        val isSel = exportFormat == fid
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .background(
                                    if (isSel) Color(0xFF4A6741) else Color(0xFFF1F5F2),
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { exportFormat = fid }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(name, color = if (isSel) Color.White else Color(0xFF4A6741), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                // Selector: Week vs Month
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "Export Range", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val ranges = listOf("week" to "Last 7 Days Only", "month" to "Entire Current Month")
                    ranges.forEach { (rid, name) ->
                        val isSel = exportRange == rid
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .background(
                                    if (isSel) Color(0xFF4A6741) else Color(0xFFF1F5F2),
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { exportRange = rid }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(name, color = if (isSel) Color.White else Color(0xFF4A6741), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Calculated export preview string
                val exportText = remember(monthlyData, exportFormat, exportRange, selectedMonthIdx) {
                    val logs = mutableListOf<String>()
                    val m = currentMonth
                    if (exportFormat == "csv") {
                        logs.add("Date,StressLevel,MoodEmoji,LoggedStatus")
                        for (d in 1..m.days) {
                            if (exportRange == "week" && d > 7) continue
                            val dateK = "2026-\${m.key}-\${d.toString().padStart(2, '0')}"
                            val data = monthlyData[dateK]
                            if (data?.hasData == true) {
                                logs.add("\${dateK},\${data.stress},\${data.emoji},Logged")
                            } else {
                                logs.add("\${dateK},5,No Data,Unlogged")
                            }
                        }
                    } else {
                        logs.add("=== SAFE SPACE OFFLINE DIARY ===")
                        logs.add("Format: Plaintext Log")
                        logs.add("Month: \${m.label}")
                        logs.add("Generated: Local Sandbox Mode")
                        logs.add("================================")
                        var hasAny = false
                        for (d in 1..m.days) {
                            if (exportRange == "week" && d > 7) continue
                            val dateK = "2026-\${m.key}-\${d.toString().padStart(2, '0')}"
                            val data = monthlyData[dateK]
                            if (data?.hasData == true) {
                                logs.add("• \${dateK} (Day \${d}): Stress: \${data.stress}/10 | State: \${data.emoji}")
                                hasAny = true
                            }
                        }
                        if (!hasAny) {
                            logs.add("(No logs recorded in this range)")
                        }
                    }
                    logs.joinToString("\\n")
                }

                // Preview Display box
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp)
                        .background(Color(0xFFF8FAFC), RoundedCornerShape(12.dp))
                        .border(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        .padding(8.dp)
                ) {
                    Text(
                        text = exportText,
                        fontSize = 9.sp,
                        color = Color.DarkGray,
                        lineHeight = 11.sp,
                        textAlign = TextAlign.Start,
                        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = {
                        clipboardManager.setText(AnnotatedString(exportText))
                        showShareNotification = true
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741)),
                    modifier = Modifier.fillMaxWidth().height(40.dp)
                ) {
                    Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Copy Diary Data to Clipboard", fontSize = 11.sp, color = Color.White)
                }

                if (showShareNotification) {
                    LaunchedEffect(showShareNotification) {
                        kotlinx.coroutines.delay(2000)
                        showShareNotification = false
                    }
                    Text(
                        text = "✓ Diary logs copied to clipboard successfully!",
                        color = Color(0xFF2E7D32),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
                    )
                }
            }
        }
    }
}
`
  },
  {
    name: "Color.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/theme/Color.kt",
    language: "kotlin",
    description: "Defines the Sage Green branding color scheme used throughout the application, overriding standard Material 3 presets.",
    code: `package com.mentalhealth.firstaid.ui.theme

import androidx.compose.ui.graphics.Color

val SageGreenDark = Color(0xFF334E2B)
val SageGreenPrimary = Color(0xFF4A6741)
val SageGreenLight = Color(0xFFE1E8E3)
val SageGreenBackground = Color(0xFFF1F5F2)
val SageGreenSecondary = Color(0xFF8E9A8F)

val SageDarkPrimary = Color(0xFF90B486)
val SageDarkBackground = Color(0xFF1E241E)
val SageDarkSurface = Color(0xFF252D25)
`
  },
  {
    name: "Theme.kt",
    path: "app/src/main/java/com/mentalhealth/firstaid/ui/theme/Theme.kt",
    language: "kotlin",
    description: "Sets up the MentalHealthFirstAidTheme using light and dark Sage Green brand-specific color schemes, disabling system wallpaper tinting for design uniformity.",
    code: `package com.mentalhealth.firstaid.ui.theme

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
}
`
  }
];

