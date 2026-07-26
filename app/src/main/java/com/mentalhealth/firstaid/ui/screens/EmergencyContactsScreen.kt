package com.mentalhealth.firstaid.ui.screens

import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Call
import androidx.compose.material.icons.filled.Edit
import androidx.compose.material.icons.filled.Save
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun EmergencyContactsScreen(onBackClick: () -> Unit = {}) {
    val context = LocalContext.current
    val sharedPrefs = remember { context.getSharedPreferences("emergency_prefs", Context.MODE_PRIVATE) }

    var customName by remember { mutableStateOf(sharedPrefs.getString("contact_name", "") ?: "") }
    var customPhone by remember { mutableStateOf(sharedPrefs.getString("contact_phone", "") ?: "") }
    var isEditing by remember { mutableStateOf(customName.isEmpty() && customPhone.isEmpty()) }

    fun dialNumber(number: String) {
        if (number.isNotBlank()) {
            val intent = Intent(Intent.ACTION_DIAL).apply {
                data = Uri.parse("tel:$number")
            }
            context.startActivity(intent)
        }
    }

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
                text = "Back to Support Hub",
                fontSize = 14.sp,
                color = Color.Gray
            )
        }

        // Title Screen Help Banner
        Text(
            text = "Emergency & Help Kit",
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            color = Color(0xFFC62828),
            modifier = Modifier.padding(top = 8.dp)
        )
        Text(
            text = "Immediate, confidential support channels available 24/7.",
            style = MaterialTheme.typography.bodyMedium,
            color = Color.Gray,
            modifier = Modifier.padding(bottom = 24.dp)
        )

        // National Hotlines Card Section
        Text(
            text = "Official Support Networks",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                // Hotline 1: 988
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("988 Suicide & Crisis Lifeline", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Call or text 988 for free, confidential support.", fontSize = 12.sp, color = Color.Gray)
                    }
                    Button(
                        onClick = { dialNumber("988") },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFC62828)),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.Call, contentDescription = "Dial 988")
                        Spacer(modifier = Modifier.width(4.dp))
                        Text("Call", fontSize = 12.sp)
                    }
                }

                Divider(modifier = Modifier.padding(vertical = 8.dp))

                // Hotline 2: Crisis Text Line
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("Crisis Text Line (HOME to 741741)", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("SMS text HOME to 741741 to connect with counselors.", fontSize = 12.sp, color = Color.Gray)
                    }
                    Button(
                        onClick = {
                            val intent = Intent(Intent.ACTION_VIEW).apply {
                                data = Uri.parse("sms:741741?body=HOME")
                            }
                            context.startActivity(intent)
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF555555)),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Text("Text", fontSize = 12.sp)
                    }
                }

                Divider(modifier = Modifier.padding(vertical = 8.dp))

                // Hotline 3: The Trevor Project
                Row(
                    modifier = Modifier.fillMaxWidth().padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text("The Trevor Project", fontWeight = FontWeight.Bold, fontSize = 15.sp)
                        Text("Crisis support/suicide prevention for LGBTQ+ youth.", fontSize = 12.sp, color = Color.Gray)
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                        Button(
                            onClick = { dialNumber("18664887386") },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3F51B5)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("Call", fontSize = 12.sp)
                        }
                        Button(
                            onClick = {
                                val intent = Intent(Intent.ACTION_VIEW).apply {
                                    data = Uri.parse("sms:678678?body=START")
                                }
                                context.startActivity(intent)
                            },
                            colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF757575)),
                            shape = RoundedCornerShape(8.dp)
                        ) {
                            Text("SMS", fontSize = 12.sp)
                        }
                    }
                }
            }
        }

        // Personal Emergency Contact Section (Saved locally in SharedPreferences)
        Text(
            text = "Personal Safety Contact",
            fontWeight = FontWeight.Bold,
            fontSize = 16.sp,
            color = Color(0xFF2C3E50),
            modifier = Modifier.padding(bottom = 8.dp)
        )

        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            modifier = Modifier.fillMaxWidth(),
            elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
        ) {
            Column(modifier = Modifier.padding(16.dp)) {
                if (isEditing) {
                    Text("Securely save a local contact name and phone number:", fontSize = 13.sp, color = Color.Gray, modifier = Modifier.padding(bottom = 12.dp))
                    
                    OutlinedTextField(
                        value = customName,
                        onValueChange = { customName = it },
                        label = { Text("Contact Name") },
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)
                    )

                    OutlinedTextField(
                        value = customPhone,
                        onValueChange = { customPhone = it },
                        label = { Text("Phone Number") },
                        shape = RoundedCornerShape(8.dp),
                        modifier = Modifier.fillMaxWidth().padding(bottom = 12.dp)
                    )

                    Button(
                        onClick = {
                            sharedPrefs.edit()
                                .putString("contact_name", customName.trim())
                                .putString("contact_phone", customPhone.trim())
                                .apply()
                            isEditing = false
                        },
                        enabled = customName.isNotBlank() && customPhone.isNotBlank(),
                        modifier = Modifier.fillMaxWidth(),
                        colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                        shape = RoundedCornerShape(8.dp)
                    ) {
                        Icon(Icons.Default.Save, contentDescription = "Save Contact")
                        Spacer(modifier = Modifier.width(6.dp))
                        Text("Save Offline Key Contact")
                    }
                } else {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Column {
                            Text(customName, fontWeight = FontWeight.Bold, fontSize = 18.sp, color = Color(0xFF2C3E50))
                            Text(customPhone, fontSize = 14.sp, color = Color.Gray)
                        }

                        Row {
                            IconButton(onClick = { isEditing = true }) {
                                Icon(Icons.Default.Edit, contentDescription = "Edit Contact", tint = Color.Gray)
                            }
                            Spacer(modifier = Modifier.width(4.dp))
                            Button(
                                onClick = { dialNumber(customPhone) },
                                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF2E7D32)),
                                shape = RoundedCornerShape(8.dp)
                            ) {
                                Icon(Icons.Default.Call, contentDescription = "Call Contact")
                                Spacer(modifier = Modifier.width(4.dp))
                                Text("Call")
                            }
                        }
                    }
                }
            }
        }
    }
}