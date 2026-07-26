package com.mentalhealth.firstaid.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

private val DarkColorScheme = darkColorScheme(
    primary = SageDarkPrimary,
    secondary = SageGreenSecondary,
    tertiary = SageGreenLight,
    background = SageDarkBackground,
    surface = SageDarkSurface,
    onPrimary = Color(0xFF1C2B19),
    onSecondary = Color.White,
    onBackground = Color(0xFFE2EBE2),
    onSurface = Color(0xFFE2EBE2)
)

private val LightColorScheme = lightColorScheme(
    primary = SageGreenPrimary,
    secondary = SageGreenSecondary,
    tertiary = SageGreenLight,
    background = SageGreenBackground,
    surface = Color.White,
    onPrimary = Color.White,
    onSecondary = Color.White,
    onBackground = Color(0xFF1C1D1C),
    onSurface = Color(0xFF1C1D1C),
    surfaceVariant = SageGreenLight,
    onSurfaceVariant = SageGreenPrimary
)

@Composable
fun MentalHealthFirstAidTheme(
    darkTheme: Boolean = false,
    dynamicColor: Boolean = false,
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    MaterialTheme(
        colorScheme = colorScheme,
        content = content
    )
}
