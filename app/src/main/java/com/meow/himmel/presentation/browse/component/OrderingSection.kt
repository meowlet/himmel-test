package com.meow.himmel.presentation.browse.component

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import com.meow.himmel.domain.util.Order
import com.meow.himmel.domain.util.OrderType

@Composable
fun OrderingSection(
    order: Order = Order.Date(OrderType.Descending),
    onOrder: (Order) -> Unit
) {
    Column {
        // Sort by title
        OrderingOption(
            text = "Title",
            orderType = order.orderType,
            selected = order is Order.Title
        ) { oderType ->
            when (oderType) {
                OrderType.Ascending -> onOrder(Order.Title(OrderType.Ascending))
                OrderType.Descending -> onOrder(Order.Title(OrderType.Descending))
            }
        }
        // Sort by date
        OrderingOption(
            text = "Date",
            orderType = order.orderType,
            selected = order is Order.Date
        ) { oderType ->
            when (oderType) {
                OrderType.Ascending -> onOrder(Order.Date(OrderType.Ascending))
                OrderType.Descending -> onOrder(Order.Date(OrderType.Descending))
            }
        }
    }
}