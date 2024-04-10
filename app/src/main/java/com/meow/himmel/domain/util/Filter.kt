package com.meow.himmel.domain.util

import com.meow.himmel.domain.model.Category

sealed class Filter(val filterType: FilterType) {
    class All(filterType: FilterType) : Filter(filterType)
    class Completed(filterType: FilterType) : Filter(filterType)
    class OnGoing(filterType: FilterType) : Filter(filterType)
    class Genre(filterType: FilterType, val category: Category) : Filter(filterType)
    class R18(filterType: FilterType) : Filter(filterType)

    fun copy(filterType: FilterType, category: Category): Filter {
        return when (this) {
            is All -> All(filterType)
            is Completed -> Completed(filterType)
            is OnGoing -> OnGoing(filterType)
            is Genre -> Genre(filterType, category)
            is R18 -> R18(filterType)
        }
    }
}