package com.meow.himmel.data.data_source

import com.meow.himmel.domain.model.Category
import com.meow.himmel.domain.model.Fiction
import com.meow.himmel.domain.model.User
import com.meow.himmel.domain.model.UserCredential
import io.realm.kotlin.RealmConfiguration

class Database {
    val database = Realm(
        io.realm.kotlin.Realm.open(
        RealmConfiguration.create(
            schema = setOf(
                Fiction::class,
                User::class,
                Category::class,
                UserCredential::class
            )
        )
    ))
}