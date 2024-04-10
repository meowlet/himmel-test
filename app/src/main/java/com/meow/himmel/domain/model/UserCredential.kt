package com.meow.himmel.domain.model

import io.realm.kotlin.types.EmbeddedRealmObject

class UserCredential : EmbeddedRealmObject {
    var token: String = ""
    var email: String = ""
    var passwordHash: String = ""
}