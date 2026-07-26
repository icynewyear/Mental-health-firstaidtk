package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class ReframedThought(val id: String, val negative: String, val distortion: String, val rational: String)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ThoughtReframerScreen(onBackClick: () -> Unit) {
    var negative by remember { mutableStateOf("") }
    var selectedDistortion by remember { mutableStateOf("Catastrophizing") }
    var rational by remember { mutableStateOf("") }
    var reframes by remember { mutableStateOf(listOf<ReframedThought>()) }
    var expanded by remember { mutableStateOf(false) }

    val distortions = listOf("Catastrophizing", "All-or-Nothing", "Mind Reading", "Emotional Reasoning", "Overgeneralization")

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("CBT Thought Reframer", fontSize = 16.sp, fontWeight = FontWeight.Bold) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                }
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            Text("Automatic Negative thought", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            OutlinedTextField(
                value = negative,
                onValueChange = { negative = it },
                placeholder = { Text("What enters your mind automatically?", fontSize = 13.sp) },
                modifier = Modifier.fillMaxWidth()
            )

            Text("Cognitive Distortion", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            Box(modifier = Modifier.fillMaxWidth()) {
                Button(onClick = { expanded = true }, modifier = Modifier.fillMaxWidth()) {
                    Text(selectedDistortion)
                }
                DropdownMenu(expanded = expanded, onDismissRequest = { expanded = false }) {
                    distorions.forEach { dist ->
                        DropdownMenuItem(
                            text = { Text(dist) },
                            onClick = { selectedDistortion = dist; expanded = false }
                        )
                    }
                }
            }

            Text("Rational Balanced perspective", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            OutlinedTextField(
                value = rational,
                onValueChange = { rational = it },
                placeholder = { Text("Challenge the negative with facts...", fontSize = 13.sp) },
                modifier = Modifier.fillMaxWidth()
            )

            Button(
                onClick = {
                    if (negative.isNotBlank() && rational.isNotBlank()) {
                        reframes = listOf(ReframedThought(System.currentTimeMillis().toString(), negative, selectedDistortion, rational)) + reframes
                        negative = ""
                        rational = ""
                    }
                },
                modifier = Modifier.fillMaxWidth()
            ) {
                Text("Store Reframe")
            }

            Text("Historical Rebound Ledger", fontSize = 12.sp, fontWeight = FontWeight.Bold)
            LazyColumn(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                items(reframes) { item ->
                    Card(modifier = Modifier.fillMaxWidth()) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(item.distortion, fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.primary, fontSize = 11.sp)
                            Text(text = "Automatic Negative: ${item.negative}", fontSize = 12.sp, color = Color.Gray)
                            Text(text = "Balanced Strategy: ${item.rational}", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF333333))
                        }
                    }
                }
            }
        }
    }
}