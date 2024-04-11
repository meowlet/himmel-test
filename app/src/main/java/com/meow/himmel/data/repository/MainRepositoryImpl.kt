package com.meow.himmel.data.repository

import com.meow.himmel.data.data_source.RealmDatabase
import com.meow.himmel.domain.model.Fiction
import com.meow.himmel.domain.repository.MainRepository
import kotlinx.coroutines.flow.Flow
import org.mongodb.kbson.ObjectId

class MainRepositoryImpl(
    private val database: RealmDatabase
) : MainRepository {
    override fun getFictionList(): Flow<List<Fiction>> {
        return database.getFictions()
    }

    override suspend fun getFictionDetail(fictionId: ObjectId): Fiction {
        return database.getFiction(fictionId)
    }
}