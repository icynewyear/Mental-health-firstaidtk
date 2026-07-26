package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class HabitItem(val id: String, val name: String, val category: String, val completed: Boolean, val icon: String)

@Composable
fun NeuroVitalsScreen(onBackClick: () -> Unit) {
    var habits by remember { mutableStateOf(listOf(
        HabitItem("1", "Circadian Sunlight (15m in AM)", "Light", false, "☀️"),
        HabitItem("2", "Biological Hydration (2+ liters)", "Hydrate", false, "💧"),
        HabitItem("3", "Endorphin Gym Walk (15m)", "Movement", false, "🚶"),
        HabitItem("4", "No screens 30 mins before sleep", "Circadian", false, "📴"),
        HabitItem("5", "Nourish high fiber microbiome meal", "Gut", false, "🥗")
    )) }

    val completedCount = habits.count { it.completed }

    Column(modifier = Modifier.fillMaxSize().padding(16.dp)) {
        Text("Neuro-Basics Compliance", fontSize = 18.sp, fontWeight = FontWeight.Bold)
        Spacer(modifier = Modifier.height(8.dp))
        LinearProgressIndicator(
            progress = { completedCount.toFloat() / habits.size },
            modifier = Modifier.fillMaxWidth().height(8.dp)
        )
        Text("$completedCount of ${habits.size} elements secured", fontSize = 11.sp)

        Spacer(modifier = Modifier.height(16.dp))
        LazyColumn(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            items(habits) { habit ->
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Checkbox(
                        checked = habit.completed,
                        onCheckedChange = { isChecked ->
                            habits = habits.map { if (it.id == habit.id) it.copy(completed = isChecked) else it }
                        }
                    )
                    Text("${habit.icon} ${habit.name}", modifier = Modifier.weight(1f))
                    Badge { Text(habit.category) }
                }
            }
        }
    }
}