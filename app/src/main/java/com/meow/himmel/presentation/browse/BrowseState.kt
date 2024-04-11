package com.meow.himmel.presentation.browse

import com.meow.himmel.domain.model.Fiction
import com.meow.himmel.domain.util.Order
import com.meow.himmel.domain.util.OrderType

data class BrowseState(
    val fictions: List<Fiction> = emptyList(),
    val order: Order = Order.Date(OrderType.Descending),
    val isBottomSheetVisible: Boolean = false
)