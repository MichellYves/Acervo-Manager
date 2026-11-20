package com.acervomanager.mobilekotlin.ui

import android.graphics.Color
import android.os.Bundle
import android.text.Editable
import android.text.TextWatcher
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.EditText
import android.widget.TextView
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.acervomanager.mobilekotlin.R
import com.acervomanager.ui.AddBookBottomSheet
import com.acervomanager.ui.Book
import com.acervomanager.ui.BookAdapter
import com.acervomanager.ui.BooksStore
import com.google.android.material.floatingactionbutton.FloatingActionButton

class HomeFragment : Fragment() {

    private var currentSearchQuery: String = ""
    private var currentFilter: String = "ALL"

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)

        val recyclerView = view.findViewById<RecyclerView>(R.id.recyclerview_books)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())

        val editSearch = view.findViewById<EditText>(R.id.edit_search)
        val filterAll = view.findViewById<TextView>(R.id.filter_all)
        val filterAvailable = view.findViewById<TextView>(R.id.filter_available)
        val filterReserved = view.findViewById<TextView>(R.id.filter_reserved)

        lateinit var adapter: BookAdapter

        fun updateFilterButtons() {
            val activeBg = Color.parseColor("#2563EB")
            val inactiveBg = Color.parseColor("#1E222B")
            val activeText = Color.parseColor("#FFFFFF")
            val inactiveText = Color.parseColor("#94A3B8")

            fun styleButton(btn: TextView, isActive: Boolean) {
                btn.setBackgroundColor(if (isActive) activeBg else inactiveBg)
                btn.setTextColor(if (isActive) activeText else inactiveText)
            }

            styleButton(filterAll, currentFilter == "ALL")
            styleButton(filterAvailable, currentFilter == "DISPONÍVEL")
            styleButton(filterReserved, currentFilter == "RESERVADO")
        }

        fun applyFilters() {
            val query = currentSearchQuery.trim().lowercase()

            val filtered = BooksStore.books.filter { book ->
                val matchesSearch = query.isEmpty() ||
                        book.title.lowercase().contains(query) ||
                        book.author.lowercase().contains(query) ||
                        book.genre.lowercase().contains(query)

                val matchesStatus = when (currentFilter) {
                    "DISPONÍVEL" -> book.status.equals("Disponível", ignoreCase = true)
                    "RESERVADO" -> book.status.equals("Reservado", ignoreCase = true)
                    else -> true
                }

                matchesSearch && matchesStatus
            }

            updateFilterButtons()
            adapter.updateBooks(filtered)
        }

        adapter = BookAdapter(
            books = BooksStore.books.toList(),
            onFavoriteClick = { clickedBook ->
                val index = BooksStore.books.indexOf(clickedBook)
                if (index != -1) {
                    BooksStore.books[index] = clickedBook.copy(isFavorite = !clickedBook.isFavorite)
                    applyFilters()
                }
            },
            onDeleteClick = { bookToDelete ->
                BooksStore.books.remove(bookToDelete)
                applyFilters()
            }
        )
        recyclerView.adapter = adapter

        editSearch.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) = Unit
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) {
                currentSearchQuery = s?.toString().orEmpty()
                applyFilters()
            }
            override fun afterTextChanged(s: Editable?) = Unit
        })

        filterAll.setOnClickListener {
            currentFilter = "ALL"
            applyFilters()
        }

        filterAvailable.setOnClickListener {
            currentFilter = "DISPONÍVEL"
            applyFilters()
        }

        filterReserved.setOnClickListener {
            currentFilter = "RESERVADO"
            applyFilters()
        }

        val fabAddBook = view.findViewById<FloatingActionButton>(R.id.fab_add_book)
        fabAddBook?.setOnClickListener {
            val dialog = AddBookBottomSheet()
            dialog.show(parentFragmentManager, "AddBookDialog")
        }

        parentFragmentManager.setFragmentResultListener("new_book_result", viewLifecycleOwner) { _, bundle ->
            val title = bundle.getString("title").orEmpty()
            val author = bundle.getString("author").orEmpty()
            val genre = bundle.getString("genre").orEmpty()
            val status = bundle.getString("status") ?: "Disponível"

            if (title.isNotBlank() && author.isNotBlank()) {
                BooksStore.books.add(0, Book(title, author, genre, status))
                applyFilters()
            }
        }

        applyFilters()
        return view
    }

    override fun onResume() {
        super.onResume()
        view?.findViewById<RecyclerView>(R.id.recyclerview_books)?.adapter?.let {
            val query = currentSearchQuery.trim().lowercase()
            val filtered = BooksStore.books.filter { book ->
                val matchesSearch = query.isEmpty() ||
                        book.title.lowercase().contains(query) ||
                        book.author.lowercase().contains(query) ||
                        book.genre.lowercase().contains(query)
                val matchesStatus = when (currentFilter) {
                    "DISPONÍVEL" -> book.status.equals("Disponível", ignoreCase = true)
                    "RESERVADO" -> book.status.equals("Reservado", ignoreCase = true)
                    else -> true
                }
                matchesSearch && matchesStatus
            }
            (it as? BookAdapter)?.updateBooks(filtered)
        }
    }
}