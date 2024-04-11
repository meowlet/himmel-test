package com.meow.himmel.presentation.browse

import androidx.compose.foundation.layout.Column
import androidx.compose.material3.Button
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import com.meow.himmel.domain.util.Order
import com.meow.himmel.domain.util.OrderType
import com.meow.himmel.presentation.browse.component.FictionItem

@Composable
fun BrowseScreen(
    state: BrowseState,
    onEvent: (BrowseEvent) -> Unit
) {
    LaunchedEffect(key1 = true) {
        onEvent(BrowseEvent.Ordering(state.order))
    }


    Column {
        Button(onClick = {
            onEvent(BrowseEvent.Ordering(Order.Date(OrderType.Descending)))
        }) {
            Text(text = "Load fiction")
        }
        state.fictions.forEach { fiction ->
            FictionItem(fiction = fiction)
        }
    }

}