package com.mentalhealth.firstaid.ui.screens

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
        Text("Active region: ${steps[currentStep]}", fontSize = 13.sp)

        Spacer(modifier = Modifier.height(30.dp))
        Text(phase, fontSize = 28.sp, color = MaterialTheme.colorScheme.primary)
        Text("${progressVal}s remaining", fontSize = 16.sp)

        Spacer(modifier = Modifier.height(24.dp))
        Button(onClick = { running = !running }) {
            Text(if (running) "Halts somatics" else "Engage Protocol")
        }
    }
}