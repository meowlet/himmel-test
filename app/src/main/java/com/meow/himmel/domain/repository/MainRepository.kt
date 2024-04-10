package com.meow.himmel.domain.repository

import com.meow.himmel.domain.model.Fiction
import kotlinx.coroutines.flow.Flow

interface MainRepository {
    fun getFictionList(): Flow<List<Fiction>>
    fun getFictionDetail(fictionId: String): Fiction
}