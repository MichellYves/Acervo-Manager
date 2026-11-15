package com.acervomanager.mobilekotlin.ui

import android.annotation.SuppressLint
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.acervomanager.mobilekotlin.R
import com.acervomanager.ui.Book
import com.acervomanager.ui.BookAdapter
import com.acervomanager.ui.AddBookBottomSheet // Certifique-se de importar o bottom sheet se estiver em pacotes separados

class HomeFragment : Fragment() {

    @SuppressLint("MissingInflatedId")
    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_home, container, false)

        val recyclerView = view.findViewById<RecyclerView>(R.id.recyclerview_books)
        recyclerView.layoutManager = LinearLayoutManager(requireContext())

        // Configurar o botão flutuante de adicionar livro
        val fabAddBook = view.findViewById<com.google.android.material.floatingactionbutton.FloatingActionButton>(R.id.fab_add_book)
        fabAddBook?.setOnClickListener {
            val bottomSheet = AddBookBottomSheet()
            bottomSheet.show(parentFragmentManager, "AddBookBottomSheet")
        }

        // Lista de exemplo baseada no seu acervo web
        val sampleBooks = listOf(
            Book("A Hora da Estrela", "Clarice Lispector, 1977", "Ficção", "Disponível"),
            Book("Dom Casmurro", "Machado de Assis, 1899", "Romance", "Disponível"),
            Book("Grande Sertão: Veredas", "João Guimarães Rosa, 1956", "Romance", "Reservado")
        )

        recyclerView.adapter = BookAdapter(sampleBooks)

        return view
    }
}