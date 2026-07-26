package com.mentalhealth.firstaid.ui.screens

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
        Text("${savedGratitudes.size} memories folded in", fontSize = 12.sp)

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
                text = { Text(""${text}"") }
            )
        }
    }
}