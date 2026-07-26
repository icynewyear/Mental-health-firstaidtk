package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.filled.FavoriteBorder
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

data class CopingStatement(
    val id: String,
    val text: String,
    val category: String,
    val isSaved: Boolean
)

@Composable
fun CopingReliefScreen(onBackClick: () -> Unit = {}) {
    var statements by remember {
        mutableStateOf(
            listOf(
                CopingStatement("1", "This feeling is intense, but I know it is temporary.", "Panic", true),
                CopingStatement("2", "Slow, deep breathing signals physical safety to my body.", "Anxiety", true),
                CopingStatement("3", "I can survive these physical sensations, they will pass.", "Panic", false),
                CopingStatement("4", "I am exactly where I need to be, focused on the now.", "Grounding", false),
                CopingStatement("5", "I release judgment of my thoughts. I am secure.", "Stress", false)
            )
        )
    }

    var selectedCategory by remember { mutableStateOf("All") }
    var textInput by remember { mutableStateOf("") }

    val categories = listOf("All", "Panic", "Anxiety", "Grounding", "Stress")
    val filtered = if (selectedCategory == "All") statements else statements.filter { it.category == selectedCategory }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFAF9F6))
            .padding(16.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth(),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back")
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Back to Mind Hub",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }

        // Core header
        Text(
            "Coping Statements",
            fontWeight = FontWeight.Bold,
            fontSize = 22.sp,
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(top = 8.dp)
        )
        Text(
            "Grounding statements to ease nervous spikes.",
            fontSize = 12.sp,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 12.dp)
        )

        // Category Pills row
        ScrollableTabRow(
            selectedTabIndex = categories.indexOf(selectedCategory).coerceAtLeast(0),
            edgePadding = 0.dp,
            divider = {},
            indicator = {},
            containerColor = Color.Transparent,
            modifier = Modifier.padding(bottom = 12.dp)
        ) {
            categories.forEach { cat ->
                val isSelected = selectedCategory == cat
                Tab(
                    selected = isSelected,
                    onClick = { selectedCategory = cat },
                    modifier = Modifier.padding(4.dp)
                ) {
                    SuggestionChip(
                        onClick = { selectedCategory = cat },
                        label = { Text(cat, fontSize = 11.sp) },
                        colors = SuggestionChipDefaults.suggestionChipColors(
                            containerColor = if (isSelected) MaterialTheme.colorScheme.primaryContainer else Color.White
                        )
                    )
                }
            }
        }

        // Lazy column statements
        LazyColumn(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            items(filtered) { statement ->
                Card(
                    shape = RoundedCornerShape(12.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Text(
                            text = ""${statement.text}"",
                            fontSize = 13.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF333333)
                        )
                        Row(
                            modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                            horizontalArrangement = Arrangement.SpaceBetween,
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            AssistChip(
                                onClick = {},
                                label = { Text(statement.category, fontSize = 10.sp) }
                            )
                            IconButton(onClick = {
                                statements = statements.map {
                                    if (it.id == statement.id) it.copy(isSaved = !it.isSaved) else it
                                }
                            }) {
                                Icon(
                                    imageVector = if (statement.isSaved) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                                    contentDescription = "Save",
                                    tint = if (statement.isSaved) Color.Red else Color.LightGray
                                )
                            }
                        }
                    }
                }
            }
        }
    }
}