package com.meow.himmel.data.data_source

import com.meow.himmel.domain.model.Fiction
import io.realm.kotlin.Realm
import io.realm.kotlin.ext.query
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf
import org.mongodb.kbson.ObjectId

class RealmDatabase(
    private val realm: Realm
) {
    fun getFictions(): Flow<List<Fiction>> {
        return flowOf(realm.query<Fiction>().find())
    }

    fun getFiction(fictionId: ObjectId): Fiction {
        return realm.query<Fiction>("id == $0", fictionId).find().first()
    }
}