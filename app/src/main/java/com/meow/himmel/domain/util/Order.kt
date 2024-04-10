package com.meow.himmel.domain.util

sealed class Order(val orderType: OrderType) {
    class Title(orderType: OrderType): Order(orderType)
    class Date(orderType: OrderType): Order(orderType)

    fun copy(orderType: OrderType): Order {
        return when(this) {
            is Title -> Title(orderType)
            is Date -> Date(orderType)
        }
    }
}