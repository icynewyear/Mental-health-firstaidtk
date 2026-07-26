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
fun SafetyHubScreen(onNavigateToRoute: (String) -> Unit) {
    val tools = remember {
        listOf(
            Triple("panicSOS", "Calm Rescue Space", "A simple, direct pace-helper that provides deep soothing tones and reassuring visual guidance."),
            Triple("safetyPlan", "Comfort Safety Plan", "A custom safety blueprint based on standard, helpful steps to keep you safe and cared for."),
            Triple("emergency", "Support & Helpline Contacts", "Immediate, easy access to supportive helplines, text services, and caring peer advocates loaded offline."),
            Triple("resources", "Mental Health Resource Links", "Direct web access to trusted global mental health organizations, educational guides, and screening tools.")
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
            text = "Comfort & Support Backup",
            fontSize = 11.sp,
            fontWeight = FontWeight.Bold,
            color = Color(0xFF4A6741)
        )
        Text(
            text = "Support Hub",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )
        Text(
            text = "These resources are here to support you in difficult moments. If you are feeling overwhelmed, take a slow breath. You are safe here.",
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
                    "panicSOS" -> Icons.Default.Warning
                    "safetyPlan" -> Icons.Default.Star
                    "emergency" -> Icons.Default.Phone
                    else -> Icons.Default.Info
                }
                val bgColor = when (id) {
                    "panicSOS" -> Color(0xFFFFEBEE)
                    "safetyPlan" -> Color(0xFFE8F5E9)
                    "emergency" -> Color(0xFFE8EAF6)
                    else -> Color(0xFFE1F5FE)
                }
                val accentColor = when (id) {
                    "panicSOS" -> Color(0xFFC62828)
                    "safetyPlan" -> Color(0xFF2E7D32)
                    "emergency" -> Color(0xFF283593)
                    else -> Color(0xFF0277BD)
                }
                val tag = when (id) {
                    "panicSOS" -> "Rescue"
                    "safetyPlan" -> "Safety"
                    "emergency" -> "Crisis"
                    else -> "Web"
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
