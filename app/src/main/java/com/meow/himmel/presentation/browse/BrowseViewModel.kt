package com.meow.himmel.presentation.browse

import androidx.compose.runtime.State
import androidx.compose.runtime.mutableStateOf
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.meow.himmel.domain.use_case.MainUseCases
import com.meow.himmel.domain.util.Order
import com.meow.himmel.domain.util.OrderType
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.onEach
import kotlinx.coroutines.launch
import javax.inject.Inject

@HiltViewModel
class BrowseViewModel @Inject constructor(
    private val useCases: MainUseCases
) : ViewModel() {

    private val _state = mutableStateOf(BrowseState())
    val state: State<BrowseState> = _state

    fun onEvent(event: BrowseEvent) {
        when (event) {
            is BrowseEvent.Ordering -> {
                if (state.value.order != event.order) {
                    getFictions(event.order)
                }
            }
            is BrowseEvent.ToggleBottomSheet -> _state.value = state.value.copy(isBottomSheetVisible = !state.value.isBottomSheetVisible)
        }
    }
    private fun getFictions(
        order: Order = Order.Date(OrderType.Descending)
    ) = viewModelScope.launch {
        useCases.getFictions(order = order).onEach { fictions ->
            _state.value = state.value.copy(fictions = fictions, order = order)
        }
    }
}