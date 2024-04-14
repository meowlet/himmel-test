package com.meow.himmel

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import com.meow.himmel.data.data_source.RealmDatabase
import com.meow.himmel.presentation.browse.BrowseScreen
import com.meow.himmel.presentation.browse.BrowseViewModel
import com.meow.himmel.ui.theme.AppTheme
import dagger.hilt.android.AndroidEntryPoint
import javax.inject.Inject

@AndroidEntryPoint
class MainActivity : ComponentActivity() {
    private val browseViewModel: BrowseViewModel by viewModels()

    @Inject lateinit var realmDB: RealmDatabase

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        realmDB.writeSampleData()

        setContent {
            AppTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = MaterialTheme.colorScheme.background
                ) {
                     BrowseScreen(
                         state = browseViewModel.state.value,
                         onEvent = browseViewModel::onEvent
                     )
                }
            }
        }
    }
}

