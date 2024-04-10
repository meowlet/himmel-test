package com.meow.himmel.domain.util

sealed class Filter(val filterType: FilterType) {
    class Status(filterType: FilterType) : Filter(filterType)
    class Category(filterType: FilterType) : Filter(filterType)
    class AgeRestriction(filterType: FilterType) : Filter(filterType)

    fun copy(filterType: FilterType): Filter {
        return when (this) {
            is Status -> Status(filterType)
            is Category -> Category(filterType)
            is AgeRestriction -> AgeRestriction(filterType)
        }
    }
}