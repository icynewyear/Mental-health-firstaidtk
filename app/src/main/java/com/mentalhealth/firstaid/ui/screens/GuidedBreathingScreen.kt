package com.mentalhealth.firstaid.ui.screens

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
                            text = "${countUpSec}s",
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
}