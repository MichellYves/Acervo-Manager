package com.acervomanager.myapplication.entity

data class BookEntity (
    val id: Int,
    val title: String,
    val author: String,
    var favorite: Boolean,
    val genre: String,
)