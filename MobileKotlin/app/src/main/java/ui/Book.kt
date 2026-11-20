
package com.acervomanager.ui
data class Book(
    val title: String,
    val author: String,
    val genre: String,
    val status: String,
    var isFavorite: Boolean = false

)