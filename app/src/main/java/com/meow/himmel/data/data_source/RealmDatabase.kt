package com.meow.himmel.data.data_source

import com.meow.himmel.domain.model.Category
import com.meow.himmel.domain.model.Fiction
import com.meow.himmel.domain.model.User
import io.realm.kotlin.Realm
import io.realm.kotlin.ext.query
import io.realm.kotlin.ext.realmListOf
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.flowOf
import org.mongodb.kbson.ObjectId

class RealmDatabase(
    private val realm: Realm
) {
    fun getFictions(): Flow<List<Fiction>> {
        return flowOf(realm.query<Fiction>().find().toList())
    }

    fun getFiction(fictionId: ObjectId): Fiction {
        return realm.query<Fiction>("id == $0", fictionId).find().first()
    }


    fun writeSampleData() {
        realm.writeBlocking {
            fictionSampleList.forEach {
                copyToRealm(it)
            }
        }
    }
}


val fictionSampleList = listOf(
    Fiction().apply {
        id = ObjectId()
        title = "The Great Gatsby"
        author = User().apply {
            id = ObjectId()
            displayName = "F. Scott Fitzgerald"
        }
        categories = realmListOf(Category().apply { name = "Classic" })
        dateAdded = 1614556800000
    },
    //more sample data
    Fiction().apply {
        id = ObjectId()
        title = "The Catcher in the Rye"
        author = User().apply {
            id = ObjectId()
            displayName = "J.D. Salinger"
        }
        categories = realmListOf(Category().apply { name = "Classic" })
        dateAdded = 1614556800000
    },
    Fiction().apply {
        id = ObjectId()
        title = "To Kill a Mockingbird"
        author = User().apply {
            id = ObjectId()
            displayName = "Harper Lee"
        }
        categories = realmListOf(Category().apply { name = "Classic" })
        dateAdded = 1614556800000
    },
    Fiction().apply {
        id = ObjectId()
        title = "1984"
        author = User().apply {
            id = ObjectId()
            displayName = "George Orwell"
        }
        categories = realmListOf(Category().apply { name = "Classic" })
        dateAdded = 1614556800000
    },
    Fiction().apply {
        id = ObjectId()
        title = "Pride and Prejudice"
        author = User().apply {
            id = ObjectId()
            displayName = "Jane Austen"
        }
        categories = realmListOf(Category().apply { name = "Classic" })
        dateAdded = 1614556800000
    },

    )