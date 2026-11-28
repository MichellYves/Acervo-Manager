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
import com.acervomanager.ui.AdminBookAdapter
import com.acervomanager.ui.BooksStore

class AdminFragment : Fragment() {

    private lateinit var summaryText: TextView
    private lateinit var adapter: AdminBookAdapter

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_admin, container, false)

        summaryText = view.findViewById(R.id.text_admin_summary)
        val recyclerView = view.findViewById<RecyclerView>(R.id.recyclerview_admin_books)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())

        adapter = AdminBookAdapter(BooksStore.books.toList()) { targetBook, isAvailable ->
            val index = BooksStore.books.indexOfFirst {
                it.title == targetBook.title && it.author == targetBook.author
            }
            if (index != -1) {
                val newStatus = if (isAvailable) "Disponível" else "Reservado"
                BooksStore.books[index] = BooksStore.books[index].copy(status = newStatus)
                refreshList()
            }
        }
        recyclerView.adapter = adapter

        refreshList()
        return view
    }

    override fun onResume() {
        super.onResume()
        refreshList()
    }

    private fun refreshList() {
        val availableCount = BooksStore.books.count { it.status.equals("Disponível", ignoreCase = true) }
        val reservedCount = BooksStore.books.size - availableCount
        summaryText.text = "$availableCount disponíveis • $reservedCount reservados"
        adapter.updateBooks(BooksStore.books.toList())
    }
}