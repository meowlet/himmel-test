package com.meow.himmel.domain.use_case

import com.meow.himmel.domain.model.Fiction
import com.meow.himmel.domain.repository.MainRepository
import com.meow.himmel.domain.util.Filter
import com.meow.himmel.domain.util.FilterType
import com.meow.himmel.domain.util.Order
import com.meow.himmel.domain.util.OrderType
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.map

class GetFictions(
    private val repository: MainRepository
) {
    operator fun invoke(
        filters: List<Filter> = listOf(Filter.All(FilterType.Include)),
        order: Order = Order.Title(OrderType.Ascending)
    ): Flow<List<Fiction>> {
        return repository.getFictionList().map { fictionList ->
            var filteredList = fictionList
            filters.forEach { filter ->
                filteredList = filteredList.filter { fiction ->
                    when (filter) {
                        is Filter.All -> true
                        is Filter.Completed -> {
                            when (filter.filterType) {
                                FilterType.Include -> fiction.status == 1
                                FilterType.Exclude -> fiction.status != 1
                            }
                        }

                        is Filter.OnGoing -> {
                            when (filter.filterType) {
                                FilterType.Include -> fiction.status == 0
                                FilterType.Exclude -> fiction.status != 0
                            }
                        }

                        is Filter.Genre -> {
                            when (filter.filterType) {
                                FilterType.Include -> fiction.categories.map { it.id == filter.category.id }
                                    .contains(true)

                                FilterType.Exclude -> !fiction.categories.map { it.id == filter.category.id }
                                    .contains(true)
                            }
                        }

                        is Filter.R18 -> {
                            when (filter.filterType) {
                                FilterType.Include -> fiction.categories.map { it.ageRestriction }
                                    .contains(true)

                                FilterType.Exclude -> !fiction.categories.map { it.ageRestriction }
                                    .contains(true)
                            }
                        }
                    }
                }
            }

            when (order) {
                is Order.Title -> {
                    when (order.orderType) {
                        OrderType.Ascending -> filteredList.sortedBy { it.title }
                        OrderType.Descending -> filteredList.sortedByDescending { it.title }
                    }
                }

                is Order.Date -> {
                    when (order.orderType) {
                        OrderType.Ascending -> filteredList.sortedBy { it.dateAdded }
                        OrderType.Descending -> filteredList.sortedByDescending { it.dateAdded }
                    }
                }
            }
        }
    }
}