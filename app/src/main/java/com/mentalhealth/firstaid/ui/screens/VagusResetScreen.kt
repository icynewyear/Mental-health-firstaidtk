package com.mentalhealth.firstaid.ui.screens

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
                            text = "EXERCISE \\${activeIdx + 1} OF \\${hacks.size} • \\${currentHack.name.uppercase()}",
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
                                    Text("\\${timeLeft}s", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = Color.DarkGray)
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
}