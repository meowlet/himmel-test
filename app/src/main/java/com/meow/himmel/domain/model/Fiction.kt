package com.meow.himmel.domain.model

import io.realm.kotlin.ext.realmListOf
import io.realm.kotlin.types.RealmList
import io.realm.kotlin.types.RealmObject
import io.realm.kotlin.types.annotations.PrimaryKey
import org.mongodb.kbson.ObjectId

class Fiction() : RealmObject {
    @PrimaryKey
    var id: ObjectId = ObjectId()
    var title: String = ""
    var author: User = User()
    var coverPath: String = ""
    var dateAdded: Long = System.currentTimeMillis()
    // 0: ongoing, 1: completed, 2: dropped, 3: hiatus
    var status: Int = 0
    var categories: RealmList<Category> = realmListOf()
}