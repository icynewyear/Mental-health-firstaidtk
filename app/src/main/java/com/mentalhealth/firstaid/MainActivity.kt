package com.mentalhealth.firstaid

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
}