package com.mentalhealth.firstaid.ui.screens

import androidx.compose.foundation.BorderStroke
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.border
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material.icons.filled.Share
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.compose.ui.platform.LocalClipboardManager
import androidx.compose.ui.text.AnnotatedString

data class DayData(val stress: Int, val emoji: String, val hasData: Boolean)
data class MonthConfig(val key: String, val label: String, val days: Int, val offset: Int)

@Composable
fun HistoryScreen(onBackClick: () -> Unit) {
    val monthsConfig = listOf(
        MonthConfig("04", "April 2026", 30, 3), // Starts Wed (Mon=0, Tue=1, Wed=2, Thu=3... wait! If Mon is 0, Wed is 2 offset. Let's do standard calendar: Mon=0)
        MonthConfig("05", "May 2026", 31, 5),   // Starts Fri (Mon=0, Tue=1, Wed=2, Thu=3, Fri=4 offset)
        MonthConfig("06", "June 2026", 30, 1)   // Starts Mon (Mon=0, Tue=1 offset)
    )

    var selectedMonthIdx by remember { mutableIntStateOf(2) } // June 2026
    var selectedDay by remember { mutableIntStateOf(13) }
    
    // Monthly history log map
    val monthlyData = remember {
        mutableStateMapOf<String, DayData>().apply {
            // Seed a few default log items for beautiful presentation
            put("2026-06-13", DayData(4, "😌", true))
            put("2026-06-12", DayData(3, "✨", true))
            put("2026-06-11", DayData(6, "⛈️", true))
            put("2026-06-10", DayData(5, "☕", true))
            put("2026-06-09", DayData(2, "☀️", true))
            put("2026-06-08", DayData(3, "🍃", true))
            put("2026-06-07", DayData(7, "😰", true))
            
            put("2026-05-24", DayData(5, "🧘", true))
            put("2026-05-15", DayData(4, "🪴", true))
            put("2026-05-01", DayData(8, "🔥", true))
        }
    }

    // Exporter Settings States
    var exportFormat by remember { mutableStateOf("text") } // "text" or "csv"
    var exportRange by remember { mutableStateOf("month") } // "week" or "month"
    var showShareNotification by remember { mutableStateOf(false) }

    val currentMonth = monthsConfig[selectedMonthIdx]
    val clipboardManager = LocalClipboardManager.current
    val scrollState = rememberScrollState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF1F5F2))
            .padding(16.dp)
            .verticalScroll(scrollState)
    ) {
        // Back Navigation Header
        Row(
            modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            IconButton(onClick = onBackClick) {
                Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color(0xFF4A6741))
            }
            Spacer(modifier = Modifier.width(8.dp))
            Text(
                text = "Back to Toolkit",
                fontSize = 14.sp,
                fontWeight = FontWeight.Bold,
                color = Color(0xFF4A6741)
            )
        }

        Spacer(modifier = Modifier.height(12.dp))

        // Screen Heading
        Text(
            text = "Care History & Logs",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Black),
            color = Color(0xFF4A6741),
            modifier = Modifier.padding(bottom = 4.dp)
        )
        Text(
            text = "Track monthly and weekly mood logging data, seed mock datasets, or export diaries locally.",
            fontSize = 11.sp,
            color = Color.Gray,
            lineHeight = 15.sp,
            modifier = Modifier.padding(bottom = 16.dp)
        )

        // Month Selector Header Card
        Card(
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            border = BorderStroke(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.35f)),
            modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth().padding(12.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = {
                        if (selectedMonthIdx > 0) {
                            selectedMonthIdx--
                            selectedDay = 1
                        }
                    },
                    enabled = selectedMonthIdx > 0
                ) {
                    Icon(Icons.Default.ChevronLeft, contentDescription = "Prev Month", tint = Color(0xFF4A6741))
                }

                Text(
                    text = currentMonth.label,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Black,
                    color = Color(0xFF4A6741)
                )

                IconButton(
                    onClick = {
                        if (selectedMonthIdx < monthsConfig.size - 1) {
                            selectedMonthIdx++
                            selectedDay = 1
                        }
                    },
                    enabled = selectedMonthIdx < monthsConfig.size - 1
                ) {
                    Icon(Icons.Default.ChevronRight, contentDescription = "Next Month", tint = Color(0xFF4A6741))
                }
            }
        }

        // Calendar Grid Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // Day initials
                val weekInitials = listOf("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun")
                Row(
                    modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween
                ) {
                    weekInitials.forEach { w ->
                        Text(
                            text = w,
                            fontSize = 10.sp,
                            fontWeight = FontWeight.Bold,
                            color = Color.Gray,
                            modifier = Modifier.weight(1f),
                            textAlign = TextAlign.Center
                        )
                    }
                }

                // Days cells
                val offset = currentMonth.offset
                val daysCount = currentMonth.days
                val totalCells = offset + daysCount
                val rowsCount = (totalCells + 6) / 7

                for (row in 0 until rowsCount) {
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 4.dp),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        for (col in 0 until 7) {
                            val cellIndex = row * 7 + col
                            val dayNum = cellIndex - offset + 1
                            
                            if (cellIndex < offset || dayNum > daysCount) {
                                Spacer(modifier = Modifier.weight(1f))
                            } else {
                                val dateKey = "2026-${currentMonth.key}-${dayNum.toString().padStart(2, '0')}"
                                val dayData = monthlyData[dateKey]
                                val isSelected = selectedDay == dayNum

                                Box(
                                    modifier = Modifier
                                        .weight(1f)
                                        .aspectRatio(1f)
                                        .padding(2.dp)
                                        .background(
                                            color = if (isSelected) Color(0xFFEBF2EC) else if (dayData?.hasData == true) Color(0xFFF5FAF6) else Color.Transparent,
                                            shape = CircleShape
                                        )
                                        .border(
                                            width = 1.2.dp,
                                            color = if (isSelected) Color(0xFF4A6741) else if (dayData?.hasData == true) Color(0xFFCBD9CC) else Color.Transparent,
                                            shape = CircleShape
                                        )
                                        .clickable { selectedDay = dayNum },
                                    contentAlignment = Alignment.Center
                                ) {
                                    Column(
                                        horizontalAlignment = Alignment.CenterHorizontally,
                                        verticalArrangement = Arrangement.Center
                                    ) {
                                        Text(
                                            text = dayNum.toString(),
                                            fontSize = 10.sp,
                                            fontWeight = if (isSelected) FontWeight.Black else FontWeight.Normal,
                                            color = if (isSelected) Color(0xFF4A6741) else if (dayData?.hasData == true) Color(0xFF2C3E50) else Color.Gray
                                        )
                                        if (dayData?.hasData == true) {
                                            Text(
                                                text = dayData.emoji,
                                                fontSize = 9.sp,
                                                modifier = Modifier.padding(top = 1.dp)
                                            )
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // Selected Day Details and Check-In Editor Card
        val selectedDateKey = "2026-${currentMonth.key}-${selectedDay.toString().padStart(2, '0')}"
        val activeDayData = monthlyData[selectedDateKey] ?: DayData(5, "", false)

        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Details: ${currentMonth.name} ${selectedDay}, 2026",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray,
                    letterSpacing = 0.5.sp
                )

                Spacer(modifier = Modifier.height(12.dp))

                if (activeDayData.hasData) {
                    // Display details
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text(
                                text = "Mood: ",
                                fontSize = 12.sp,
                                color = Color.Gray,
                                fontWeight = FontWeight.Bold
                            )
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .background(Color(0xFFE1E8E3), CircleShape),
                                contentAlignment = Alignment.Center
                            ) {
                                Text(activeDayData.emoji, fontSize = 14.sp)
                            }
                        }

                        Box(
                            modifier = Modifier
                                .background(Color(0xFFEBF2EC), RoundedCornerShape(50.dp))
                                .padding(horizontal = 8.dp, vertical = 2.dp)
                        ) {
                            Text(
                                text = "Stress Level: ${activeDayData.stress}/10",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color(0xFF4A6741)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(16.dp))

                    // Custom Inline Editor
                    Text(
                        text = "Edit Log Entry",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Gray
                    )
                    
                    Row(
                        modifier = Modifier.fillMaxWidth().padding(top = 8.dp),
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        val editEmojis = listOf("😌", "🙂", "🍃", "⛈️", "✨", "😰", "🧘")
                        editEmojis.forEach { em ->
                            Box(
                                modifier = Modifier
                                    .size(28.dp)
                                    .background(if (activeDayData.emoji == em) Color(0xFFE1E8E3) else Color(0xFFF1F5F2), CircleShape)
                                    .border(
                                        width = 1.dp,
                                        color = if (activeDayData.emoji == em) Color(0xFF4A6741) else Color.Transparent,
                                        shape = CircleShape
                                    )
                                    .clickable {
                                        monthlyData[selectedDateKey] = DayData(activeDayData.stress, em, true)
                                    },
                                contentAlignment = Alignment.Center
                            ) {
                                Text(em, fontSize = 13.sp)
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    Text(
                        text = "Adjust Stress Scale",
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        color = Color.Gray
                    )

                    Slider(
                        value = activeDayData.stress.toFloat(),
                        onValueChange = { newVal ->
                            monthlyData[selectedDateKey] = DayData(newVal.toInt(), activeDayData.emoji, true)
                        },
                        valueRange = 1f..10f,
                        steps = 8,
                        colors = SliderDefaults.colors(
                            activeTrackColor = Color(0xFF4A6741),
                            inactiveTrackColor = Color(0xFFE1E8E3),
                            thumbColor = Color(0xFF4A6741)
                        )
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Button(
                        onClick = {
                            monthlyData.remove(selectedDateKey)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFEBEE)),
                        modifier = Modifier.fillMaxWidth().height(36.dp)
                    ) {
                        Text("Delete Log Entry", fontSize = 11.sp, color = Color.Red, fontWeight = FontWeight.Bold)
                    }

                } else {
                    // Day has no log data
                    Column(
                        modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
                        horizontalAlignment = Alignment.CenterHorizontally,
                        verticalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        Text(
                            text = "No log registered for this day.",
                            fontSize = 11.sp,
                            color = Color.LightGray,
                            fontWeight = FontWeight.Bold
                        )
                        Button(
                            onClick = {
                                monthlyData[selectedDateKey] = DayData(5, "😌", true)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741)),
                            contentPadding = PaddingValues(horizontal = 16.dp, vertical = 6.dp),
                            modifier = Modifier.height(32.dp)
                        ) {
                            Text("Log Log Today", fontSize = 10.sp, color = Color.White)
                        }
                    }
                }
            }
        }

        // Seeds & Debugging Tools Row
        Card(
            shape = RoundedCornerShape(18.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth().padding(bottom = 16.dp)
        ) {
            Column(modifier = Modifier.padding(12.dp)) {
                Text(
                    text = "SEED & BACKUP CONTROLS",
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray,
                    letterSpacing = 0.5.sp,
                    modifier = Modifier.padding(bottom = 8.dp)
                )
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    Button(
                        onClick = {
                            monthlyData.clear()
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFFF1F1)),
                        modifier = Modifier.weight(1f).height(32.dp),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text("Reset Logs", fontSize = 9.sp, color = Color.Red, fontWeight = FontWeight.Bold)
                    }

                    Button(
                        onClick = {
                            // Seed random mock data across months
                            val sets = listOf("😌", "✨", "🍃", "⛈️", "☀️", "☕", "😰", "🧘", "🪴")
                            for (monthIdx in 0..2) {
                                val m = monthsConfig[monthIdx]
                                // Seed roughly 8 days per month
                                val seedDays = listOf(3, 7, 10, 14, 18, 22, 25, 28)
                                seedDays.forEach { d ->
                                    val dateK = "2026-${m.key}-${d.toString().padStart(2, '0')}"
                                    monthlyData[dateK] = DayData((2..9).random(), sets.random(), true)
                                }
                            }
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEBF2EC)),
                        modifier = Modifier.weight(1f).height(32.dp),
                        contentPadding = PaddingValues(0.dp)
                    ) {
                        Text("Seed Demo Logs", fontSize = 9.sp, color = Color(0xFF4A6741), fontWeight = FontWeight.Bold)
                    }
                }
            }
        }

        // Local Diary Logs Exporter Card
        Card(
            shape = RoundedCornerShape(24.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                Text(
                    text = "Local Diary Exporter",
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    color = Color.Gray,
                    letterSpacing = 0.5.sp
                )
                Text(
                    text = "Generate and copy a plaintext summary or CSV of your offline log history.",
                    fontSize = 10.sp,
                    color = Color.LightGray,
                    modifier = Modifier.padding(vertical = 4.dp)
                )

                Spacer(modifier = Modifier.height(10.dp))

                // Selector: CSV vs Text
                Text(text = "Export Format", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val formats = listOf("text" to "Plaintext Diary", "csv" to "Spreadsheet CSV")
                    formats.forEach { (fid, name) ->
                        val isSel = exportFormat == fid
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .background(
                                    if (isSel) Color(0xFF4A6741) else Color(0xFFF1F5F2),
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { exportFormat = fid }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(name, color = if (isSel) Color.White else Color(0xFF4A6741), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                // Selector: Week vs Month
                Spacer(modifier = Modifier.height(8.dp))
                Text(text = "Export Range", fontSize = 9.sp, fontWeight = FontWeight.Bold, color = Color.Gray)
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 6.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    val ranges = listOf("week" to "Last 7 Days Only", "month" to "Entire Current Month")
                    ranges.forEach { (rid, name) ->
                        val isSel = exportRange == rid
                        Box(
                            modifier = Modifier
                                .weight(1f)
                                .background(
                                    if (isSel) Color(0xFF4A6741) else Color(0xFFF1F5F2),
                                    RoundedCornerShape(8.dp)
                                )
                                .clickable { exportRange = rid }
                                .padding(vertical = 8.dp),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(name, color = if (isSel) Color.White else Color(0xFF4A6741), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }

                Spacer(modifier = Modifier.height(12.dp))

                // Calculated export preview string
                val exportText = remember(monthlyData, exportFormat, exportRange, selectedMonthIdx) {
                    val logs = mutableListOf<String>()
                    val m = currentMonth
                    if (exportFormat == "csv") {
                        logs.add("Date,StressLevel,MoodEmoji,LoggedStatus")
                        for (d in 1..m.days) {
                            if (exportRange == "week" && d > 7) continue
                            val dateK = "2026-${m.key}-${d.toString().padStart(2, '0')}"
                            val data = monthlyData[dateK]
                            if (data?.hasData == true) {
                                logs.add("${dateK},${data.stress},${data.emoji},Logged")
                            } else {
                                logs.add("${dateK},5,No Data,Unlogged")
                            }
                        }
                    } else {
                        logs.add("=== SAFE SPACE OFFLINE DIARY ===")
                        logs.add("Format: Plaintext Log")
                        logs.add("Month: ${m.label}")
                        logs.add("Generated: Local Sandbox Mode")
                        logs.add("================================")
                        var hasAny = false
                        for (d in 1..m.days) {
                            if (exportRange == "week" && d > 7) continue
                            val dateK = "2026-${m.key}-${d.toString().padStart(2, '0')}"
                            val data = monthlyData[dateK]
                            if (data?.hasData == true) {
                                logs.add("• ${dateK} (Day ${d}): Stress: ${data.stress}/10 | State: ${data.emoji}")
                                hasAny = true
                            }
                        }
                        if (!hasAny) {
                            logs.add("(No logs recorded in this range)")
                        }
                    }
                    logs.joinToString("\n")
                }

                // Preview Display box
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(120.dp)
                        .background(Color(0xFFF8FAFC), RoundedCornerShape(12.dp))
                        .border(1.dp, Color(0xFFCBD9CC).copy(alpha = 0.5f), RoundedCornerShape(12.dp))
                        .padding(8.dp)
                ) {
                    Text(
                        text = exportText,
                        fontSize = 9.sp,
                        color = Color.DarkGray,
                        lineHeight = 11.sp,
                        textAlign = TextAlign.Start,
                        modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState())
                    )
                }

                Spacer(modifier = Modifier.height(12.dp))

                Button(
                    onClick = {
                        clipboardManager.setText(AnnotatedString(exportText))
                        showShareNotification = true
                    },
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF4A6741)),
                    modifier = Modifier.fillMaxWidth().height(40.dp)
                ) {
                    Icon(Icons.Default.Share, contentDescription = null, modifier = Modifier.size(14.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Copy Diary Data to Clipboard", fontSize = 11.sp, color = Color.White)
                }

                if (showShareNotification) {
                    LaunchedEffect(showShareNotification) {
                        kotlinx.coroutines.delay(2000)
                        showShareNotification = false
                    }
                    Text(
                        text = "✓ Diary logs copied to clipboard successfully!",
                        color = Color(0xFF2E7D32),
                        fontSize = 10.sp,
                        fontWeight = FontWeight.Bold,
                        textAlign = TextAlign.Center,
                        modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
                    )
                }
            }
        }
    }
}
