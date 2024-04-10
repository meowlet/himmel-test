package com.meow.himmel.domain.util

sealed class FilterType {
    data object Include: FilterType()
    data object Exclude: FilterType()
}
