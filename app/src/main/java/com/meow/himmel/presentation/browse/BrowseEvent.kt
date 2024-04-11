package com.meow.himmel.presentation.browse

import com.meow.himmel.domain.util.Order

sealed class BrowseEvent {
    data class Ordering(val order: Order) : BrowseEvent()
    data object ToggleBottomSheet : BrowseEvent()
}