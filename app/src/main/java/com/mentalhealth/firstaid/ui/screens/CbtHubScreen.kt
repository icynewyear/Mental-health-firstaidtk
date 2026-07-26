package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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

@Composable
fun CbtHubScreen(onNavigateToRoute: (String) -> Unit) {
    val tools = remember {
        listOf(
            Triple("reframing", "Thought Reframer", "A friendly guided space to find perspective and gently ease worrying thoughts."),
            Triple("worryBox", "Worry Lockbox", "A warm, private space to write down worries and let them rest for later."),
            Triple("emotionWheel", "Emotion Journal", "Explore and name your feelings step-by-step in a private, gentle journal."),
            Triple("relief", "Coping Words", "Comforting, reassuring phrases to read and recall whenever you need them."),
            Triple("gratitude", "Gratitude Jar", "Write down small moments of joy and kindness to look back on."),
            Triple("habit", "Everyday Basics", "A quick, simple checklist to check in on rest, water, and sunlight.")
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAF9F6))
            .padding(16.dp)
    ) {
        Spacer(modifier = Modifier.height(16.dp))
        Text(
            text = "Mind & Thoughts",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF4A6741)
        )
        Text(
            text = "CBT & Mind Hub",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = "Thought exercises help you pause spiraling fears, set aside future concerns, and bring your mind back to a place of comfort and clarity.",
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        LazyColumn(
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.weight(1f)
        ) {
            items(tools) { (id, name, desc) ->
                val icon = when (id) {
                    "reframing" -> Icons.Default.MenuBook
                    "worryBox" -> Icons.Default.Lock
                    "emotionWheel" -> Icons.Default.List
                    "relief" -> Icons.Default.Info
                    "gratitude" -> Icons.Default.Star
                    else -> Icons.Default.Check
                }
                val bgColor = when (id) {
                    "reframing" -> Color(0xFFE8F5E9)
                    "worryBox" -> Color(0xFFFFF8E1)
                    "emotionWheel" -> Color(0xFFFFEBEE)
                    "relief" -> Color(0xFFE8F5E9)
                    "gratitude" -> Color(0xFFE8EAF6)
                    else -> Color(0xFFE1F5FE)
                }
                val accentColor = when (id) {
                    "reframing" -> Color(0xFF2E7D32)
                    "worryBox" -> Color(0xFFF57F17)
                    "emotionWheel" -> Color(0xFFC62828)
                    "relief" -> Color(0xFF4A6741)
                    "gratitude" -> Color(0xFF283593)
                    else -> Color(0xFF0277BD)
                }
                val tag = when (id) {
                    "reframing" -> "CBT"
                    "worryBox" -> "Lock"
                    "emotionWheel" -> "Journal"
                    "relief" -> "Words"
                    "gratitude" -> "Joy"
                    else -> "Basics"
                }
                
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .clickable { onNavigateToRoute(id) }
                ) {
                    Row(
                        modifier = Modifier.padding(16.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = bgColor,
                            modifier = Modifier.size(48.dp)
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier.fillMaxSize()
                            ) {
                                Icon(
                                    imageVector = icon,
                                    contentDescription = name,
                                    tint = accentColor,
                                    modifier = Modifier.size(24.dp)
                                )
                            }
                        }
                        
                        Spacer(modifier = Modifier.width(16.dp))
                        
                        Column(modifier = Modifier.weight(1f)) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Text(
                                    text = name,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 14.sp,
                                    color = Color(0xFF2C3E50)
                                )
                                Surface(
                                    shape = RoundedCornerShape(4.dp),
                                    color = bgColor
                                ) {
                                    Text(
                                        text = tag,
                                        fontSize = 8.sp,
                                        fontWeight = FontWeight.Bold,
                                        color = accentColor,
                                        modifier = Modifier.padding(horizontal = 6.dp, py = 2.dp)
                                    )
                                }
                            }
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(
                                text = desc,
                                fontSize = 11.sp,
                                color = Color.Gray,
                                lineHeight = 14.sp
                            )
                        }
                    }
                }
            }
        }
    }
}
