package com.acervomanager.mobilekotlin.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.acervomanager.mobilekotlin.R
import com.acervomanager.ui.BookAdapter
import com.acervomanager.ui.BooksStore

class FavoriteFragment : Fragment() {

    private lateinit var recyclerView: RecyclerView
    private lateinit var emptyText: TextView
    private lateinit var adapter: BookAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_favorite, container, false)

        recyclerView = view.findViewById(R.id.recyclerview_favorites)
        emptyText = view.findViewById(R.id.text_empty_favorites)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())

        adapter = BookAdapter(
            books = emptyList(),
            onFavoriteClick = { clickedBook ->
                val index = BooksStore.books.indexOf(clickedBook)
                if (index != -1) {
                    BooksStore.books[index] = clickedBook.copy(isFavorite = !clickedBook.isFavorite)
                    refreshFavorites()
                }
            },
            onDeleteClick = { bookToDelete ->
                BooksStore.books.remove(bookToDelete)
                refreshFavorites()
            }
        )
        recyclerView.adapter = adapter

        refreshFavorites()
        return view
    }

    override fun onResume() {
        super.onResume()
        refreshFavorites()
    }

    private fun refreshFavorites() {
        val favoriteBooks = BooksStore.books.filter { it.isFavorite }
        adapter.updateBooks(favoriteBooks)
        emptyText.visibility = if (favoriteBooks.isEmpty()) View.VISIBLE else View.GONE
    }
}