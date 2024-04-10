package com.meow.himmel.data.data_source

import com.meow.himmel.domain.model.Category
import com.meow.himmel.domain.model.Fiction
import com.meow.himmel.domain.model.User
import com.meow.himmel.domain.model.UserCredential
import io.realm.kotlin.Realm
import io.realm.kotlin.RealmConfiguration

class Database {
    fun instantiateDatabase(): RealmDatabase {
        return RealmDatabase(
            Realm.open(
                RealmConfiguration.create(
                    schema = setOf(
                        Fiction::class,
                        User::class,
                        Category::class,
                        UserCredential::class
                    )
                )
            )
        )
    }
}