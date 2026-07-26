package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.border
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.window.Dialog

data class EmojiSet(val id: String, val name: String, val emojis: List<String>)
data class DayTrend(val day: String, val stress: Int, val emoji: String)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun DashboardScreen(
    onNavigateToRoute: (String) -> Unit
) {
    // 1. Emoji Selection States
    val predefinedSets = listOf(
        EmojiSet("faces", "Faces 😊", listOf("😌", "🙂", "😟", "😰")),
        EmojiSet("nature", "Nature 🍃", listOf("🍃", "🌊", "⛈️", "🌿")),
        EmojiSet("weather", "Weather ☀️", listOf("☀️", "⛅", "🌧️", "⚡")),
        EmojiSet("vibes", "Vibes ✨", listOf("✨", "☕", "💭", "🔥")),
        EmojiSet("animals", "Animals 🐾", listOf("🐾", "🕊️", "🐈", "🐕"))
    )

    var activeSetId by remember { mutableStateOf("faces") }
    var loggedMood by remember { mutableStateOf<String?>(null) }
    var keyboardCustomEmoji by remember { mutableStateOf<String?>(null) }
    
    var showSelectorDialog by remember { mutableStateOf(false) }
    var showKeyboardCustomDialog by remember { mutableStateOf(false) }
    
    var customEmojiSet by remember { mutableStateOf(listOf("🧘", "🪴", "🍵", "🕯️")) }
    var activeCustomSlotIndex by remember { mutableIntStateOf(0) }
    var newCustomInput by remember { mutableStateOf("") }
    var phoneKeyboardInput by remember { mutableStateOf("") }

    // 2. Stress Slider States
    var stressLevel by remember { mutableFloatStateOf(5f) }

    val activeSet = predefinedSets.find { it.id == activeSetId } ?: EmojiSet("custom", "My Set ⚙️", customEmojiSet)

    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF1F5F2))
            .verticalScroll(scrollState)
            .padding(16.dp)
    ) {
        // Greeting and Tags
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp, bottom = 16.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Box(
                    modifier = Modifier
                        .background(Color(0xFFE1E8E3), RoundedCornerShape(50.dp))
                        .padding(horizontal = 10.dp, vertical = 2.dp)
                ) {
                    Text(
                        text = "OFFLINE FIRST",
                        fontSize = 8.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color(0xFF4A6741),
                        letterSpacing = 0.5.sp
                    )
                }
                Spacer(modifier = Modifier.height(6.dp))
                Text(
                    text = "Mental Health Toolkit",
                    style = MaterialTheme.typography.titleLarge.copy(fontWeight = FontWeight.Black),
                    color = Color(0xFF4A6741),
                    fontSize = 20.sp
                )
                Text(
                    text = "Take a moment. You are safe, validated, and supported.",
                    fontSize = 11.sp,
                    color = Color.Gray,
                    lineHeight = 14.sp
                )
            }
        }

        // Mood Check-In Widget
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f)),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // Header of mood card
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .background(Color(0xFFE1E8E3), RoundedCornerShape(6.dp)),
                            contentAlignment = Alignment.Center
                        ) {
                            Icon(
                                imageVector = Icons.Default.SentimentSatisfied,
                                contentDescription = null,
                                tint = Color(0xFF4A6741),
                                modifier = Modifier.size(14.dp)
                            )
                        }
                        Spacer(modifier = Modifier.width(6.dp))
                        Column {
                            Text(
                                text = "Daily Feel",
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.Gray,
                                letterSpacing = 0.5.sp
                            )
                            Box(
                                modifier = Modifier
                                    .background(Color(0xFFE1E8E3).copy(alpha = 0.6f), RoundedCornerShape(50.dp))
                                    .padding(horizontal = 6.dp, vertical = 1.dp)
                            ) {
                                Text(
                                    text = if (activeSet.id == "custom") "My Set ⚙️" else activeSet.name,
                                    fontSize = 8.sp,
                                    fontWeight = FontWeight.Black,
                                    color = Color(0xFF4A6741)
                                )
                            }
                        }
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Button(
                            onClick = { showSelectorDialog = true },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741).copy(alpha = 0.1f)),
                            contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                            modifier = Modifier.height(24.dp)
                        ) {
                            Text("⚙️ Options", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color(0xFF4A6741))
                        }
                        if (loggedMood != null) {
                            Button(
                                onClick = {
                                    loggedMood = null
                                    keyboardCustomEmoji = null
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFEBEE)),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                                modifier = Modifier.height(24.dp)
                            ) {
                                Text("Clear ✕", fontSize = 8.sp, fontWeight = FontWeight.Bold, color = Color.Red)
                            }
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Logged status text
                if (loggedMood != null) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        modifier = Modifier.padding(bottom = 8.dp)
                    ) {
                        Text("Logged Today:", fontSize = 11.sp, color = Color.Gray, fontWeight = FontWeight.Bold)
                        Box(
                            modifier = Modifier
                                .size(24.dp)
                                .background(Color(0xFFE1E8E3), CircleShape)
                                .border(1.dp, Color(0xFF4A6741).copy(alpha = 0.2f), CircleShape),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(loggedMood!!, fontSize = 12.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                } else {
                    Text(
                        text = "Tap a physical focus symbol below to log your state today",
                        fontSize = 11.sp,
                        color = Color.LightGray,
                        fontWeight = FontWeight.SemiBold
                    )
                }

                Spacer(modifier = Modifier.height(8.dp))

                // 5-Slot Option Grid (4 pack + 1 custom)
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(6.dp)
                ) {
                    // First 4 emojis
                    activeSet.emojis.take(4).forEach { emoji ->
                        val isSelected = loggedMood == emoji
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .height(40.dp)
                                .background(
                                    if (isSelected) Color(0xFFEBF2EC) else Color.White,
                                    RoundedCornerShape(12.dp)
                                )
                                .border(
                                    1.dp,
                                    if (isSelected) Color(0xFF4A6741) else Color(0xFFCBD9CC).copy(alpha = 0.25f),
                                    RoundedCornerShape(12.dp)
                                )
                                .clickable {
                                    loggedMood = emoji
                                    keyboardCustomEmoji = null
                                },
                            contentAlignment = Alignment.Center
                        ) {
                            Text(emoji, fontSize = 20.sp)
                        }
                    }

                    // 5th custom PICK keyboard option
                    val hasKbEmoji = keyboardCustomEmoji != null
                    val isKbSelected = loggedMood != null && loggedMood == keyboardCustomEmoji
                    Box(
                        modifier = Modifier
                            .weight(1f)
                            .height(40.dp)
                            .background(
                                if (isKbSelected) Color(0xFFEBF2EC) else if (hasKbEmoji) Color(0xFFFFFDF5) else Color(0xFFF8FAFC),
                                RoundedCornerShape(12.dp)
                            )
                            .border(
                                width = 1.dp,
                                color = if (isKbSelected) Color(0xFF4A6741) else if (hasKbEmoji) Color(0xFFFFD54F) else Color(0xFFE2E8F0),
                                shape = RoundedCornerShape(12.dp)
                            )
                            .clickable {
                                phoneKeyboardInput = keyboardCustomEmoji ?: ""
                                showKeyboardCustomDialog = true
                            },
                        contentAlignment = Alignment.Center
                    ) {
                        if (hasKbEmoji) {
                            Text(keyboardCustomEmoji!!, fontSize = 20.sp)
                        } else {
                            Text("PICK", fontSize = 9.sp, fontWeight = FontWeight.Black, color = Color.Gray)
                        }
                    }
                }
            }
        }

        // Stress Level Meter
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "Stress Level",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Gray,
                        letterSpacing = 0.5.sp
                    )
                    Box(
                        modifier = Modifier
                            .background(Color(0xFFE1E8E3), RoundedCornerShape(50.dp))
                            .padding(horizontal = 8.dp, vertical = 2.dp)
                    ) {
                        Text(
                            text = "Level ${stressLevel.toInt()}/10",
                            fontSize = 9.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                    }
                }

                Slider(
                    value = stressLevel,
                    onValueChange = { stressLevel = it },
                    valueRange = 1f..10f,
                    steps = 8,
                    colors = SliderDefaults.colors(
                        activeTrackColor = Color(0xFF4A6741),
                        inactiveTrackColor = Color(0xFFE1E8E3),
                        thumbColor = Color(0xFF4A6741)
                    ),
                    modifier = Modifier.padding(vertical = 4.dp)
                )

                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    Text("Peaceful (1)", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                    Text("Moderate (5)", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                    Text("Crisis (10)", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                }
            }
        }

        // 7-Day Trend and Chart Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier
                .fillMaxWidth()
                .padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Text(
                        text = "7-Day Stress & Mood Trend",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Gray,
                        letterSpacing = 0.5.sp
                    )
                    Button(
                        onClick = { onNavigateToRoute("history") },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFE1E8E3)),
                        contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp),
                        modifier = Modifier.height(24.dp)
                    ) {
                        Text("History ➔", fontSize = 8.sp, fontWeight = FontWeight.Black, color = Color(0xFF4A6741))
                    }
                }
                Text(
                    text = "Track your stress level on a 1-10 scale and logged mood triggers.",
                    fontSize = 10.sp,
                    color = Color.Gray,
                    modifier = Modifier.padding(vertical = 4.dp)
                )

                Spacer(modifier = Modifier.height(8.dp))

                // Custom Compose Bar Chart
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(110.dp)
                        .padding(horizontal = 4.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.Bottom
                ) {
                    val days = listOf(
                        DayTrend("Mon", 3, "🍃"),
                        DayTrend("Tue", 4, "😌"),
                        DayTrend("Wed", 6, "⛈️"),
                        DayTrend("Thu", 2, "☀️"),
                        DayTrend("Fri", 5, "☕"),
                        DayTrend("Sat", 3, "✨"),
                        DayTrend("Sun", stressLevel.toInt(), loggedMood ?: "🧘")
                    )

                    days.forEach { trend ->
                        Column(
                            horizontalAlignment = Alignment.CenterHorizontally,
                            modifier = Modifier.weight(1f)
                        ) {
                            // Bar represent stress (multiplied by 7 for nice height pixels)
                            Box(
                                modifier = Modifier
                                    .width(16.dp)
                                    .height((trend.stress * 7).dp)
                                    .background(
                                        color = when {
                                            trend.stress >= 8 -> Color(0xFFC62828)
                                            trend.stress >= 5 -> Color(0xFFF57C00)
                                            else -> Color(0xFF2E7D32)
                                        },
                                        shape = RoundedCornerShape(topStart = 4.dp, topEnd = 4.dp)
                                    )
                            )
                            Spacer(modifier = Modifier.height(4.dp))
                            Text(trend.emoji, fontSize = 11.sp)
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = trend.day,
                                fontSize = 8.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.Gray
                            )
                        }
                    }
                }
            }
        }

        // Action Aids Grid Menu
        Text(
            text = "Core Relief Modules",
            style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 12.dp)
        )

        LazyVerticalGrid(
            columns = GridCells.Fixed(2),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalArrangement = Arrangement.spacedBy(12.dp),
            modifier = Modifier.height(260.dp)
        ) {
            item {
                AidMenuGridItem(
                    title = "Guided Breath",
                    desc = "Paced Box & 4-7-8 cycles",
                    icon = Icons.Default.Spa,
                    backgroundColor = Color(0xFFE8F5E9),
                    accentColor = Color(0xFF2E7D32),
                    onClick = { onNavigateToRoute("breathing") }
                )
            }
            item {
                AidMenuGridItem(
                    title = "5-4-3-2-1 Ground",
                    desc = "Clarity sensory check-in",
                    icon = Icons.Default.Fingerprint,
                    backgroundColor = Color(0xFFE8EAF6),
                    accentColor = Color(0xFF3F51B5),
                    onClick = { onNavigateToRoute("grounding") }
                )
            }
            item {
                AidMenuGridItem(
                    title = "Coping Vault",
                    desc = "Steady statements & support",
                    icon = Icons.Default.AutoStories,
                    backgroundColor = Color(0xFFFFF3E0),
                    accentColor = Color(0xFFE65100),
                    onClick = { onNavigateToRoute("relief") }
                )
            }
            item {
                AidMenuGridItem(
                    title = "Crisis & Hotlines",
                    desc = "Immediate dialing channels",
                    icon = Icons.Default.Phone,
                    backgroundColor = Color(0xFFFFEBEE),
                    accentColor = Color(0xFFC62828),
                    onClick = { onNavigateToRoute("emergency") }
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Safety Status footer label
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(vertical = 12.dp)
                .background(Color(0xFFE2EAF4).copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                .padding(12.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.Center
            ) {
                Icon(
                    imageVector = Icons.Default.Lock,
                    contentDescription = null,
                    tint = Color(0xFF333333),
                    modifier = Modifier.size(12.dp)
                )
                Spacer(modifier = Modifier.width(6.dp))
                Text(
                    text = "Offline-First Guard Activated. All logs reside locally.",
                    fontSize = 10.sp,
                    color = Color(0xFF333333),
                    fontWeight = FontWeight.Medium
                )
            }
        }
    }

    // ==========================================
    // 3. Modals and Dialog Popups
    // ==========================================

    // Configure Emoji Set Dialog
    if (showSelectorDialog) {
        Dialog(onDismissRequest = { showSelectorDialog = false }) {
            Card(
                shape = RoundedCornerShape(28.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.fillMaxWidth().padding(16.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Column {
                        Text(
                            text = "SET SYMBOLS OPTIONS",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            color = Color.Gray,
                            letterSpacing = 0.8.sp
                        )
                        Text(
                            text = "Choose active symbol set",
                            fontSize = 10.sp,
                            color = Color.LightGray
                        )
                    }

                    Divider(color = Color(0xFFCBD9CC).copy(alpha = 0.25f))

                    // 2x3 Grid of presets
                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            val items1 = listOf("faces" to "Faces 😊", "nature" to "Nature 🍃", "weather" to "Weather ☀️")
                            items1.forEach { (id, name) ->
                                val isSel = activeSetId == id
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .background(
                                            if (isSel) Color(0xFF4A6741) else Color(0xFFF1F5F2),
                                            RoundedCornerShape(8.dp)
                                        )
                                        .clickable { activeSetId = id }
                                        .padding(vertical = 8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = name,
                                        color = if (isSel) Color.White else Color(0xFF4A6741),
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                            val items2 = listOf("vibes" to "Vibes ✨", "animals" to "Animals 🐾", "custom" to "My Set ⚙️")
                            items2.forEach { (id, name) ->
                                val isSel = activeSetId == id
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .background(
                                            if (isSel) Color(0xFF4A6741) else Color(0xFFF1F5F2),
                                            RoundedCornerShape(8.dp)
                                        )
                                        .clickable { activeSetId = id }
                                        .padding(vertical = 8.dp),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(
                                        text = name,
                                        color = if (isSel) Color.White else Color(0xFF4A6741),
                                        fontSize = 10.sp,
                                        fontWeight = FontWeight.Bold
                                    )
                                }
                            }
                        }
                    }

                    // Custom pack options (if "custom" active)
                    if (activeSetId == "custom") {
                        Divider(color = Color(0xFFCBD9CC).copy(alpha = 0.25f))
                        Text(
                            text = "CUSTOMIZE MY SET (4 SLOTS)",
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Gray
                        )
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            customEmojiSet.forEachIndexed { idx, emoji ->
                                val isSlotSel = activeCustomSlotIndex == idx
                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .aspectRatio(1f)
                                        .background(Color(0xFFF1F5F2), RoundedCornerShape(10.dp))
                                        .border(
                                            width = 1.5.dp,
                                            color = if (isSlotSel) Color(0xFF4A6741) else Color.Transparent,
                                            shape = RoundedCornerShape(10.dp)
                                        )
                                        .clickable { activeCustomSlotIndex = idx },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Text(emoji, fontSize = 20.sp)
                                }
                            }
                        }

                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(8.dp),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            OutlinedTextField(
                                value = newCustomInput,
                                onValueChange = { newCustomInput = it.take(2) },
                                placeholder = { Text("Emoji", fontSize = 11.sp) },
                                modifier = Modifier.weight(1f).height(46.dp),
                                textStyle = androidx.compose.ui.text.TextStyle(fontSize = 12.sp)
                            )
                            Button(
                                onClick = {
                                    if (newCustomInput.trim().isNotEmpty()) {
                                        val mutable = customEmojiSet.toMutableList()
                                        mutable[activeCustomSlotIndex] = newCustomInput.trim()
                                        customEmojiSet = mutable
                                        newCustomInput = ""
                                    }
                                },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741)),
                                modifier = Modifier.height(46.dp)
                            ) {
                                Text("Assign", fontSize = 11.sp, color = Color.White)
                            }
                        }
                    }

                    Divider(color = Color(0xFFCBD9CC).copy(alpha = 0.25f))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End
                    ) {
                        TextButton(onClick = { showSelectorDialog = false }) {
                            Text("Done", color = Color(0xFF4A6741), fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }
    }

    // Customize PICK keyboard Dialog
    if (showKeyboardCustomDialog) {
        Dialog(onDismissRequest = { showKeyboardCustomDialog = false }) {
            Card(
                shape = RoundedCornerShape(24.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                modifier = Modifier.fillMaxWidth().padding(24.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = "Keyboard Custom Feel",
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF4A6741)
                        )
                        Spacer(modifier = Modifier.height(4.dp))
                        Text(
                            text = "Type or paste any emoji from your keyboard to represent your state.",
                            fontSize = 9.sp,
                            color = Color.Gray,
                            textAlign = TextAlign.Center,
                            lineHeight = 12.sp
                        )
                    }

                    OutlinedTextField(
                        value = phoneKeyboardInput,
                        onValueChange = { phoneKeyboardInput = it.take(2) },
                        placeholder = { Text("❓", fontSize = 24.sp) },
                        modifier = Modifier.width(80.dp),
                        textStyle = androidx.compose.ui.text.TextStyle(fontSize = 24.sp, textAlign = TextAlign.Center),
                        singleLine = true
                    )

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        TextButton(
                            onClick = {
                                showKeyboardCustomDialog = false
                                phoneKeyboardInput = ""
                            },
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Cancel", color = Color.Gray)
                        }
                        Button(
                            onClick = {
                                val text = phoneKeyboardInput.trim()
                                if (text.isNotEmpty()) {
                                    loggedMood = text
                                    keyboardCustomEmoji = text
                                    showKeyboardCustomDialog = false
                                    phoneKeyboardInput = ""
                                }
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741)),
                            modifier = Modifier.weight(1f)
                        ) {
                            Text("Apply", color = Color.White)
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun AidMenuGridItem(
    title: String,
    desc: String,
    icon: ImageVector,
    backgroundColor: Color,
    accentColor: Color,
    onClick: () -> Unit
) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = backgroundColor),
        modifier = Modifier
            .fillMaxWidth()
            .height(115.dp)
            .clickable { onClick() }
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(12.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Icon(
                imageVector = icon,
                contentDescription = title,
                tint = accentColor,
                modifier = Modifier.size(26.dp)
            )
            
            Column {
                Text(
                    text = title,
                    fontWeight = FontWeight.Bold,
                    fontSize = 13.sp,
                    color = Color(0xFF2C3E50)
                )
                Text(
                    text = desc,
                    fontSize = 9.sp,
                    color = Color.Gray,
                    maxLines = 2,
                    lineHeight = 11.sp
                )
            }
        }
    }
}