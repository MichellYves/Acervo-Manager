package com.acervomanager.ui

import android.graphics.Color
import android.graphics.drawable.ColorDrawable
import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.fragment.app.DialogFragment
import com.acervomanager.mobilekotlin.R

class AddBookBottomSheet : DialogFragment() {

    override fun onStart() {
        super.onStart()
        dialog?.window?.apply {
            setLayout(
                (resources.displayMetrics.widthPixels * 0.90).toInt(),
                ViewGroup.LayoutParams.WRAP_CONTENT
            )
            setBackgroundDrawable(ColorDrawable(Color.TRANSPARENT))
        }
    }

    override fun onCreateView(
        inflater: LayoutInflater,
        container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View? {
        val view = inflater.inflate(R.layout.fragment_add_book, container, false)

        val editTitle = view.findViewById<EditText>(R.id.edit_title)
        val editAuthor = view.findViewById<EditText>(R.id.edit_author)
        val editGenre = view.findViewById<EditText>(R.id.edit_genre)
        val btnSave = view.findViewById<Button>(R.id.btn_save_book)

        btnSave.setOnClickListener {
            val title = editTitle.text.toString().trim()
            val author = editAuthor.text.toString().trim()
            val genre = editGenre.text.toString().trim()

            if (title.isNotEmpty() && author.isNotEmpty()) {
                val result = Bundle().apply {
                    putString("title", title)
                    putString("author", author)
                    putString("genre", genre.ifEmpty { "Geral" })
                    putString("status", "Disponível")
                }
                parentFragmentManager.setFragmentResult("new_book_result", result)

                Toast.makeText(requireContext(), "Livro '$title' salvo com sucesso!", Toast.LENGTH_SHORT).show()
                dismiss()
            } else {
                Toast.makeText(requireContext(), "Preencha os campos obrigatórios", Toast.LENGTH_SHORT).show()
            }
        }

        return view
    }
}