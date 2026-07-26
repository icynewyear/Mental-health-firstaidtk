package com.mentalhealth.firstaid.ui.screens

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
}