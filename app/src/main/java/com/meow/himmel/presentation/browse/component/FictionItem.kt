package com.meow.himmel.presentation.browse.component

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import com.meow.himmel.domain.model.Fiction

@Composable
fun FictionItem(
    fiction: Fiction
) {
    Box(modifier = Modifier.fillMaxWidth()) {
        Column {
            Text(text = fiction.title)
            Text(text = fiction.dateAdded.toString())
            fiction.categories.forEach {
                Text(text = it.name)
            }
        }
    }
}