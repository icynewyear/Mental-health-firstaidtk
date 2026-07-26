package com.mentalhealth.firstaid.ui.screens

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
                            text = "STEP \\${phaseIdx + 1} OF 5",
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
}