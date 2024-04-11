package com.meow.himmel.presentation.browse.component

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.KeyboardArrowDown
import androidx.compose.material.icons.filled.KeyboardArrowUp
import androidx.compose.material3.Icon
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import com.meow.himmel.domain.util.OrderType

@Composable
fun OrderingOption(
    text: String,
    selected: Boolean,
    orderType: OrderType,
    onSelect: (OrderType) -> Unit
) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier.clickable { onSelect(orderType) }
    ) {
        if (selected) {
            when (orderType) {
                OrderType.Descending -> Icon(
                    Icons.Default.KeyboardArrowDown,
                    contentDescription = "Descending",
                    modifier = Modifier.clickable { onSelect(OrderType.Ascending) })

                OrderType.Ascending -> Icon(
                    Icons.Default.KeyboardArrowUp,
                    contentDescription = "Ascending",
                    modifier = Modifier.clickable { onSelect(OrderType.Descending) })
            }
        }
        Text(text = text)
    }
}

@Preview(showSystemUi = true)
@Composable
private fun CheckBoxItemPreview() {
    OrderingOption(
        text = "Title",
        selected = true,
        orderType = OrderType.Ascending,
        onSelect = {}
    )
}