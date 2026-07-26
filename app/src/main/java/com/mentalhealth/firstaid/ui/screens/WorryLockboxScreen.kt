package com.mentalhealth.firstaid.ui.screens

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
}