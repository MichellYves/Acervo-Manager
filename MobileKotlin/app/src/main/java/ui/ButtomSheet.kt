package com.acervomanager.ui

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import com.acervomanager.mobilekotlin.R
import com.google.android.material.bottomsheet.BottomSheetDialogFragment

class AddBookBottomSheet : BottomSheetDialogFragment() {

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_add_book, container, false)

        val editTitle = view.findViewById<EditText>(R.id.edit_title)
        val editAuthor = view.findViewById<EditText>(R.id.edit_author)
        val editGenre = view.findViewById<EditText>(R.id.edit_genre)
        val btnSave = view.findViewById<Button>(R.id.btn_save_book)

        btnSave.setOnClickListener {
            val title = editTitle.text.toString()
            val author = editAuthor.text.toString()
            val genre = editGenre.text.toString()

            if (title.isNotEmpty() && author.isNotEmpty()) {
                Toast.makeText(requireContext(), "Livro '$title' salvo com sucesso!", Toast.LENGTH_SHORT).show()
                dismiss() // Fecha o modal
            } else {
                Toast.makeText(requireContext(), "Preencha os campos obrigatórios", Toast.LENGTH_SHORT).show()
            }
        }

        return view
    }
}