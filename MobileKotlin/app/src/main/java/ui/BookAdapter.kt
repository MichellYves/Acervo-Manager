package com.acervomanager.ui

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.ImageButton
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.acervomanager.mobilekotlin.R

class BookAdapter(
    private var books: List<Book>,
    private val onFavoriteClick: (Book) -> Unit = {},
    private val onDeleteClick: (Book) -> Unit = {}
) : RecyclerView.Adapter<BookAdapter.BookViewHolder>() {

    class BookViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView = view.findViewById(R.id.text_book_title)
        val author: TextView = view.findViewById(R.id.text_book_author)
        val genre: TextView = view.findViewById(R.id.text_book_genre)
        val buttonFavorite: ImageButton = view.findViewById(R.id.button_favorite)
        val buttonDelete: ImageButton = view.findViewById(R.id.button_delete)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): BookViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_book, parent, false)
        return BookViewHolder(view)
    }

    override fun onBindViewHolder(holder: BookViewHolder, position: Int) {
        val book = books[position]
        holder.title.text = book.title
        holder.author.text = book.author
        holder.genre.text = book.genre

        holder.buttonFavorite.setImageResource(
            if (book.isFavorite) R.drawable.ic_favorite else R.drawable.ic_favorite_empty
        )

        holder.buttonFavorite.setOnClickListener {
            onFavoriteClick(book)
        }

        holder.buttonDelete.setOnClickListener {
            onDeleteClick(book)
        }
    }

    override fun getItemCount(): Int = books.size

    fun updateBooks(newBooks: List<Book>) {
        books = newBooks
        notifyDataSetChanged()
    }
}