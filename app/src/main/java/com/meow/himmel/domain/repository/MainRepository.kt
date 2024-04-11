package com.meow.himmel.domain.repository

import com.meow.himmel.domain.model.Fiction
import kotlinx.coroutines.flow.Flow
import org.mongodb.kbson.ObjectId

interface MainRepository {
    fun getFictionList(): Flow<List<Fiction>>
    suspend fun getFictionDetail(fictionId: ObjectId): Fiction
}