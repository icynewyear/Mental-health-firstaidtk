package com.mentalhealth.firstaid.ui.screens

import android.content.Context
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Refresh
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import java.text.SimpleDateFormat
import java.util.*

data class JournalLog(val id: String, val category: String, val prompt: String, val text: String, val time: String)

data class CoreEmotion(val name: String, val color: Color, val icon: String, val prompts: List<String>)

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun EmotionWheelScreen(onBackClick: () -> Unit) {
    val context = LocalContext.current
    
    val emotions = remember {
        listOf(
            CoreEmotion("Sadness", Color(0xFF1E88E5), "😢", listOf(
                "Describe what feels lost or unfinished.",
                "If tears had words, what would they say?",
                "Where in your body do you feel this sadness most heavily?",
                "What is a gentle way you can offer yourself comfort right now?",
                "Write about a time you felt sad but eventually found peace again."
            )),
            CoreEmotion("Anger", Color(0xFFE53935), "🔥", listOf(
                "What boundary of yours was crossed?",
                "Write down your raw frustration with zero filter.",
                "Underneath your anger, is there any sadness, fear, or hurt hiding?",
                "If your anger was a physical object, what would it look like?",
                "Describe a healthy way you can physically channel or release this building energy."
            )),
            CoreEmotion("Fear / Panic", Color(0xFF8E24AA), "🫨", listOf(
                "What is the core threat your brain is predicting?",
                "How can we assure your body it is physically safe?",
                "Look around you. What are 3 physical objects that remind you that you are safe?",
                "If your fear was a small, scared child, how would you comfort them?",
                "Write down the absolute worst-case scenario, and then write the most likely realistic scenario."
            )),
            CoreEmotion("Numbing", Color(0xFF43A047), "😶‍🌫️", listOf(
                "Pinpoint where the emotional weight sits in your torso.",
                "What are you avoiding feeling right now?",
                "Touch three different textures around you and write down how they feel.",
                "If your numbness was a protective shield, what is it shielding you from?",
                "Describe the temperature of your body right now (hands, feet, face)."
            )),
            CoreEmotion("Worthy", Color(0xFFFBC02D), "✨", listOf(
                "Describe a small choice you handled gracefully today.",
                "Who makes you feel secure being yourself?",
                "Write down three things you genuinely appreciate about your personality.",
                "Describe a difficult moment you got through in the past year.",
                "What is a compliment you received recently that you can allow yourself to fully believe."
            ))
        )
    }

    var selectedIdx by remember { mutableStateOf<Int?>(null) }
    var promptIdx by remember { mutableIntStateOf(0) }
    var journalText by remember { mutableStateOf("") }
    
    var journalLogs by remember {
        mutableStateOf(loadLogs(context))
    }

    val selectedEmotion = selectedIdx?.let { emotions[it] }

    Scaffold(
        topBar = {
            TopAppBar(
                title = {
                    Column {
                        Text(
                            text = "Emotion Wheel & Journal",
                            fontSize = 16.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Text(
                            text = "A safe space to write and vent",
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
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .padding(innerPadding)
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp)
        ) {
            item {
                Text(
                    text = "Select your primary mood below to retrieve specialized prompts for therapeutic writing. Expressing raw feelings acts as a safety valve.",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    lineHeight = 15.sp,
                    modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
                )
            }

            item {
                Card(
                    shape = RoundedCornerShape(24.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f)),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            text = "SELECT ACTIVE FEELING SEGMENT:",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Gray,
                            modifier = Modifier.padding(bottom = 8.dp)
                        )
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            emotions.take(3).forEachIndexed { i, item ->
                                val isSelected = selectedIdx == i
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(if (isSelected) item.color else Color(0xFFF8FAFC))
                                        .border(1.dp, if (isSelected) Color.Transparent else Color(0xFFE2E8F0), RoundedCornerShape(12.dp))
                                        .clickable {
                                            selectedIdx = i
                                            promptIdx = 0
                                            journalText = ""
                                        }
                                        .padding(vertical = 8.dp, horizontal = 4.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.Center) {
                                        Text(item.icon, fontSize = 11.sp)
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = item.name.split(" ")[0],
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) Color.White else Color.DarkGray
                                        )
                                    }
                                }
                            }
                        }
                        
                        Spacer(modifier = Modifier.height(6.dp))
                        
                        Row(
                            modifier = Modifier.fillMaxWidth(),
                            horizontalArrangement = Arrangement.spacedBy(4.dp)
                        ) {
                            emotions.drop(3).forEachIndexed { i, item ->
                                val realIdx = i + 3
                                val isSelected = selectedIdx == realIdx
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .clip(RoundedCornerShape(12.dp))
                                        .background(if (isSelected) item.color else Color(0xFFF8FAFC))
                                        .border(1.dp, if (isSelected) Color.Transparent else Color(0xFFE2E8F0), RoundedCornerShape(12.dp))
                                        .clickable {
                                            selectedIdx = realIdx
                                            promptIdx = 0
                                            journalText = ""
                                        }
                                        .padding(vertical = 8.dp, horizontal = 4.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.Center) {
                                        Text(item.icon, fontSize = 11.sp)
                                        Spacer(modifier = Modifier.width(4.dp))
                                        Text(
                                            text = item.name,
                                            fontSize = 9.sp,
                                            fontWeight = FontWeight.Bold,
                                            color = if (isSelected) Color.White else Color.DarkGray
                                        )
                                    }
                                }
                            }
                            Box(modifier = Modifier.weight(1f))
                        }
                    }
                }
            }

            if (selectedEmotion != null) {
                item {
                    Card(
                        shape = RoundedCornerShape(24.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = BorderStroke(1.dp, Color(0xFF4A6741).copy(alpha = 0.2f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = "\${selectedEmotion.name.uppercase()} PROMPT",
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color.Gray
                                )
                                TextButton(
                                    onClick = {
                                        promptIdx = (promptIdx + 1) % selectedEmotion.prompts.size
                                    },
                                    contentPadding = PaddingValues(0.dp)
                                ) {
                                    Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.size(12.dp), tint = Color(0xFF4A6741))
                                    Spacer(modifier = Modifier.width(4.dp))
                                    Text("New prompt", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4A6741))
                                }
                            }

                            Spacer(modifier = Modifier.height(8.dp))

                            Text(
                                text = "\" \\${selectedEmotion.prompts[promptIdx]} \"",
                                fontSize = 12.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.DarkGray,
                                lineHeight = 16.sp
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            OutlinedTextField(
                                value = journalText,
                                onValueChange = { journalText = it },
                                placeholder = { Text("Scribble your therapeutic response here...", fontSize = 11.sp) },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(100.dp),
                                shape = RoundedCornerShape(12.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    focusedBorderColor = Color(0xFF4A6741),
                                    unfocusedBorderColor = Color(0xFFE2E8F0)
                                )
                            )

                            Spacer(modifier = Modifier.height(12.dp))

                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.spacedBy(8.dp)
                            ) {
                                Button(
                                    onClick = { selectedIdx = null },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF1F5F2)),
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Text("Cancel", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.DarkGray)
                                }
                                Button(
                                    onClick = {
                                        if (journalText.trim().isNotEmpty()) {
                                            val sdf = SimpleDateFormat("MMM d, hh:mm a", Locale.getDefault())
                                            val currentTime = sdf.format(Date())
                                            val newLog = JournalLog(
                                                id = System.currentTimeMillis().toString(),
                                                category = selectedEmotion.name,
                                                prompt = selectedEmotion.prompts[promptIdx],
                                                text = journalText.trim(),
                                                time = currentTime
                                            )
                                            val updated = listOf(newLog) + journalLogs
                                            journalLogs = updated
                                            saveLogs(context, updated)
                                            journalText = ""
                                            selectedIdx = null
                                        }
                                    },
                                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF1E293B)),
                                    modifier = Modifier.weight(2f),
                                    shape = RoundedCornerShape(12.dp)
                                ) {
                                    Icon(Icons.Default.Favorite, contentDescription = null, modifier = Modifier.size(12.dp), tint = Color.White)
                                    Spacer(modifier = Modifier.width(6.dp))
                                    Text("Save Entry to Device", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            }

            item {
                Text(
                    text = "Venting history (\\${journalLogs.size})",
                    fontSize = 10.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray,
                    modifier = Modifier.padding(top = 8.dp)
                )
            }

            if (journalLogs.isEmpty()) {
                item {
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.4f)),
                        border = BorderStroke(1.dp, Color(0xFFE1E8E3).copy(alpha = 0.5f)),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "Clear of logged writings. Let it all out when needed!",
                            fontSize = 11.sp,
                            color = Color.LightGray,
                            fontStyle = FontStyle.Italic,
                            textAlign = TextAlign.Center,
                            modifier = Modifier
                                .fillMaxWidth()
                                .padding(16.dp)
                        )
                    }
                }
            } else {
                items(journalLogs) { log ->
                    Card(
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Row(verticalAlignment = Alignment.CenterVertically) {
                                    Box(
                                        modifier = Modifier
                                            .background(Color(0xFFE1E8E3), RoundedCornerShape(50.dp))
                                            .padding(horizontal = 8.dp, vertical = 2.dp)
                                    ) {
                                        Text(
                                            text = "\\${log.category.uppercase()} VENT",
                                            fontSize = 8.sp,
                                            fontWeight = FontWeight.Black,
                                            color = Color(0xFF4A6741)
                                        )
                                    }
                                    Spacer(modifier = Modifier.width(8.dp))
                                    Text(
                                        text = log.time,
                                        fontSize = 9.sp,
                                        color = Color.Gray
                                    )
                                }
                                IconButton(
                                    onClick = {
                                        val updated = journalLogs.filter { it.id != log.id }
                                        journalLogs = updated
                                        saveLogs(context, updated)
                                    },
                                    modifier = Modifier.size(24.dp)
                                ) {
                                    Text("✕", fontSize = 11.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                                }
                            }

                            Spacer(modifier = Modifier.height(4.dp))

                            Text(
                                text = "Prompt: \"\\${log.prompt}\"",
                                fontSize = 10.sp,
                                fontStyle = FontStyle.Italic,
                                color = Color.Gray,
                                modifier = Modifier.padding(bottom = 6.dp)
                            )

                            Text(
                                text = log.text,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color.DarkGray,
                                lineHeight = 15.sp
                            )
                        }
                    }
                }
            }
        }
    }
}

private fun loadLogs(context: Context): List<JournalLog> {
    val prefs = context.getSharedPreferences("safespace_journal_logs", Context.MODE_PRIVATE)
    val raw = prefs.getString("logs", "") ?: ""
    if (raw.isEmpty()) return emptyList()
    return raw.split("|||").mapNotNull { line ->
        val parts = line.split("###")
        if (parts.size >= 5) {
            JournalLog(parts[0], parts[1], parts[2], parts[3], parts[4])
        } else null
    }
}

private fun saveLogs(context: Context, logs: List<JournalLog>) {
    val prefs = context.getSharedPreferences("safespace_journal_logs", Context.MODE_PRIVATE)
    val serialized = logs.joinToString("|||") { "\\${it.id}###\\${it.category}###\\${it.prompt}###\\${it.text}###\\${it.time}" }
    prefs.edit().putString("logs", serialized).apply()
}
