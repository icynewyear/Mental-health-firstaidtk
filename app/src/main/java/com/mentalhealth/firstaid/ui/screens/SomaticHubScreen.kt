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
fun SomaticHubScreen(onNavigateToRoute: (String) -> Unit) {
    val tools = remember {
        listOf(
            Triple("breathing", "Guided Breathing", "Box and 4-7-8 deep breathing rhythms with peaceful pacing helpers."),
            Triple("grounding", "Sensory Grounding", "A simple 5-4-3-2-1 sequence and warm check-ins to feel grounded."),
            Triple("vagusHacks", "Vagus Nerve Resets", "Simple nerve holds, jaw releases, and gentle breath pressures to settle."),
            Triple("somatic", "Somatic Muscle Relax", "A progressive tension-and-release sequence to ease physical tightness."),
            Triple("emdr", "EMDR Eye Pacer", "A steady visual pacer to help quiet your thoughts and find steady focus.")
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
            text = "Restful Regulation",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF4A6741)
        )
        Text(
            text = "Somatic & Body Hub",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = "These gentle offline exercises help you connect with your body, pause for a moment, and discover your natural physical center of calm.",
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
                    "breathing" -> Icons.Default.Spa
                    "grounding" -> Icons.Default.Info
                    "vagusHacks" -> Icons.Default.Refresh
                    "somatic" -> Icons.Default.Favorite
                    else -> Icons.Default.PlayArrow
                }
                val bgColor = when (id) {
                    "breathing" -> Color(0xFFE8F5E9)
                    "grounding" -> Color(0xFFE0F2F1)
                    "vagusHacks" -> Color(0xFFFFF8E1)
                    "somatic" -> Color(0xFFE8EAF6)
                    else -> Color(0xFFE1F5FE)
                }
                val accentColor = when (id) {
                    "breathing" -> Color(0xFF2E7D32)
                    "grounding" -> Color(0xFF00695C)
                    "vagusHacks" -> Color(0xFFF57F17)
                    "somatic" -> Color(0xFF283593)
                    else -> Color(0xFF0277BD)
                }
                val tag = when (id) {
                    "breathing" -> "Breathe"
                    "grounding" -> "Sensory"
                    "vagusHacks" -> "Gentle"
                    "somatic" -> "Body"
                    else -> "Visual"
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