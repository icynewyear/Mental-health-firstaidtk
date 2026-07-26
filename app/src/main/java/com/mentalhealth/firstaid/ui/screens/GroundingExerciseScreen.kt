package com.mentalhealth.firstaid.ui.screens

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
                        text = "STEP ${activeStep.stepNo} of 5",
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
                                "Remaining Item ${enteredItems.size + index + 1}",
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
}