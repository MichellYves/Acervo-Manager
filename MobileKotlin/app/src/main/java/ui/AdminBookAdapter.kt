package com.acervomanager.ui

import android.graphics.Color
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.appcompat.widget.SwitchCompat
import androidx.recyclerview.widget.RecyclerView
import com.acervomanager.mobilekotlin.R

class AdminBookAdapter(
    private var books: List<Book>,
    private val onStatusChanged: (Book, Boolean) -> Unit
) : RecyclerView.Adapter<AdminBookAdapter.AdminViewHolder>() {

    class AdminViewHolder(view: View) : RecyclerView.ViewHolder(view) {
        val title: TextView = view.findViewById(R.id.text_admin_book_title)
        val author: TextView = view.findViewById(R.id.text_admin_book_author)
        val statusBadge: TextView = view.findViewById(R.id.text_admin_book_status)
        val switchStatus: SwitchCompat = view.findViewById(R.id.switch_book_status)
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): AdminViewHolder {
        val view = LayoutInflater.from(parent.context)
            .inflate(R.layout.item_admin_book, parent, false)
        return AdminViewHolder(view)
    }

    override fun onBindViewHolder(holder: AdminViewHolder, position: Int) {
        val book = books[position]
        val isAvailable = book.status.equals("Disponível", ignoreCase = true)

        holder.title.text = book.title
        holder.author.text = "${book.author} • ${book.genre}"

        if (isAvailable) {
            holder.statusBadge.text = "Disponível"
            holder.statusBadge.setTextColor(Color.parseColor("#34D399"))
            holder.statusBadge.setBackgroundColor(Color.parseColor("#064E3B"))
        } else {
            holder.statusBadge.text = "Reservado"
            holder.statusBadge.setTextColor(Color.parseColor("#FBBF24"))
            holder.statusBadge.setBackgroundColor(Color.parseColor("#451A03"))
        }

        // remove listener antigo antes de setar isChecked para evitar loop ao reciclar views
        holder.switchStatus.setOnCheckedChangeListener(null)
        holder.switchStatus.isChecked = isAvailable

        holder.switchStatus.setOnCheckedChangeListener { _, checked ->
            onStatusChanged(book, checked)
        }
    }

    override fun getItemCount(): Int = books.size

    fun updateBooks(newBooks: List<Book>) {
        books = newBooks
        notifyDataSetChanged()
    }
}