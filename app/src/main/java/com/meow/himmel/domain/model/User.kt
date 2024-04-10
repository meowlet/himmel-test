package com.meow.himmel.domain.model

import io.realm.kotlin.types.RealmObject
import io.realm.kotlin.types.annotations.PrimaryKey
import org.mongodb.kbson.ObjectId

class User: RealmObject {
    @PrimaryKey
    var id: ObjectId = ObjectId()
    var userName: String = ""
    var displayName: String = ""
    var credential: UserCredential = UserCredential()
}