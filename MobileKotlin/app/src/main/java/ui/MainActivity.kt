package com.acervomanager.mobilekotlin.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.navigation.fragment.NavHostFragment
import androidx.navigation.ui.setupWithNavController
import com.acervomanager.mobilekotlin.R
import com.google.android.material.bottomnavigation.BottomNavigationView

class MainActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        val navHostFragment = supportFragmentManager
            .findFragmentById(R.id.nav_host_fragment_activity_main) as? NavHostFragment
        val navController = navHostFragment?.navController

        val bottomNav = findViewById<BottomNavigationView?>(R.id.nav_view)

        if (navController != null && bottomNav != null) {
            bottomNav.setupWithNavController(navController)
        }
    }
}