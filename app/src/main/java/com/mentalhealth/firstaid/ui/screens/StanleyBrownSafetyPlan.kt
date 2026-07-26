package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun StanleyBrownSafetyPlan(onBackClick: () -> Unit) {
    var warningSigns by remember { mutableStateOf(listOf("Feeling cold", "Short shallow breathes")) }
    var copingActions by remember { mutableStateOf(listOf("Warm dark chamomile tea", "Slow down counting breaths")) }
    var contactKeyPeople by remember { mutableStateOf(listOf("Bud (555-4929)", "Hotline 988")) }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Gold-Standard Clinical Plan", fontSize = 18.sp)
        Spacer(modifier = Modifier.height(12.dp))

        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text("1. Warning Signs:", fontSize = 12.sp)
                Text(warningSigns.joinToString(", "), fontSize = 13.sp)
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text("2. Internal Coping Tools:", fontSize = 12.sp)
                Text(copingActions.joinToString(", "), fontSize = 13.sp)
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Card(modifier = Modifier.fillMaxWidth()) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text("3. Crisis Supporters:", fontSize = 12.sp)
                Text(contactKeyPeople.joinToString(", "), fontSize = 13.sp)
            }
        }
    }
}