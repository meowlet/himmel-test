package com.meow.himmel.di

import com.meow.himmel.data.data_source.Database
import com.meow.himmel.data.data_source.RealmDatabase
import com.meow.himmel.data.repository.MainRepositoryImpl
import com.meow.himmel.domain.repository.MainRepository
import com.meow.himmel.domain.use_case.GetFictions
import com.meow.himmel.domain.use_case.MainUseCases
import dagger.Module
import dagger.Provides
import dagger.hilt.InstallIn
import dagger.hilt.components.SingletonComponent
import javax.inject.Singleton

@Module
@InstallIn(SingletonComponent::class)
object AppModule {
    @Provides
    @Singleton
    fun provideDatabase(): RealmDatabase {
        return Database().instantiateDatabase()
    }

    @Provides
    @Singleton
    fun provideMainRepository(
        database: RealmDatabase
    ): MainRepository {
        return MainRepositoryImpl(database)
    }

    @Provides
    @Singleton
    fun provideMainUseCases(
        mainRepository: MainRepository
    ): MainUseCases {
        return MainUseCases(
            getFictions = GetFictions(mainRepository)
        )
    }
}