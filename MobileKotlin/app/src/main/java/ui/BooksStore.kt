package com.acervomanager.ui

object BooksStore {
    val books = mutableListOf(
        Book(
            title = "Clean Code",
            author = "Robert C. Martin",
            genre = "Engenharia de Software",
            status = "Disponível",
            isFavorite = true
        ),
        Book(
            title = "Entendendo Algoritmos",
            author = "Aditya Y. Bhargava",
            genre = "Computação",
            status = "Disponível",
            isFavorite = true
        ),
        Book(
            title = "Arquitetura Limpa",
            author = "Robert C. Martin",
            genre = "Arquitetura de Sistemas",
            status = "Reservado",
            isFavorite = false
        ),
        Book(
            title = "Domain-Driven Design",
            author = "Eric Evans",
            genre = "Arquitetura de Sistemas",
            status = "Disponível",
            isFavorite = false
        ),
        Book(
            title = "Kotlin em Ação",
            author = "Dmitry Jemerov e Svetlana Isakova",
            genre = "Desenvolvimento Mobile",
            status = "Reservado",
            isFavorite = true
        ),
        Book(
            title = "Padrões de Projetos",
            author = "Erich Gamma et al.",
            genre = "Engenharia de Software",
            status = "Disponível",
            isFavorite = false
        ),
        Book(
            title = "O Programador Pragmático",
            author = "Andrew Hunt e David Thomas",
            genre = "Desenvolvimento de Software",
            status = "Disponível",
            isFavorite = true
        ),
        Book(
            title = "Redes de Computadores",
            author = "Andrew S. Tanenbaum",
            genre = "Redes",
            status = "Reservado",
            isFavorite = false
        ),
        Book(
            title = "Sistemas de Banco de Dados",
            author = "Abraham Silberschatz",
            genre = "Banco de Dados",
            status = "Disponível",
            isFavorite = false
        ),
        Book(
            title = "Estruturas de Dados e Algoritmos em Java",
            author = "Robert Lafore",
            genre = "Estruturas de Dados",
            status = "Reservado",
            isFavorite = false
        ),
        Book(
            title = "Código Limpo: Guia Prático para o Agile Software Craftsmanship",
            author = "Robert C. Martin",
            genre = "Boas Práticas",
            status = "Disponível",
            isFavorite = false
        ),
        Book(
            title = "A Revolução dos Bichos",
            author = "George Orwell",
            genre = "Ficção",
            status = "Disponível",
            isFavorite = true
        ),
        Book(
            title = "1984",
            author = "George Orwell",
            genre = "Distopia",
            status = "Reservado",
            isFavorite = false
        ),
        Book(
            title = "Capitães da Areia",
            author = "Jorge Amado",
            genre = "Literatura Brasileira",
            status = "Disponível",
            isFavorite = false
        ),
        // --- Mangás ---
        Book(
            title = "One Piece Vol. 1",
            author = "Eiichiro Oda",
            genre = "Mangá • Shonen",
            status = "Disponível",
            isFavorite = true
        ),
        Book(
            title = "Berserk Vol. 1",
            author = "Kentaro Miura",
            genre = "Mangá • Dark Fantasy",
            status = "Reservado",
            isFavorite = true
        ),
        Book(
            title = "Vagabond Vol. 1",
            author = "Takehiko Inoue",
            genre = "Mangá • Seinen",
            status = "Disponível",
            isFavorite = false
        ),
        Book(
            title = "Naruto Vol. 1",
            author = "Masashi Kishimoto",
            genre = "Mangá • Shonen",
            status = "Disponível",
            isFavorite = false
        ),
        Book(
            title = "Death Note Vol. 1",
            author = "Tsugumi Ohba e Takeshi Obata",
            genre = "Mangá • Suspense",
            status = "Reservado",
            isFavorite = false
        ),
        Book(
            title = "Fullmetal Alchemist Vol. 1",
            author = "Hiromu Arakawa",
            genre = "Mangá • Aventura",
            status = "Disponível",
            isFavorite = true
        ),
        Book(
            title = "Jujutsu Kaisen Vol. 1",
            author = "Gege Akutami",
            genre = "Mangá • Shonen",
            status = "Disponível",
            isFavorite = false
        ),
        Book(
            title = "Chainsaw Man Vol. 1",
            author = "Tatsuki Fujimoto",
            genre = "Mangá • Ação",
            status = "Reservado",
            isFavorite = false
        ),
        // --- Livros Religiosos ---
        Book(
            title = "Bíblia Sagrada",
            author = "Vários Autores",
            genre = "Religioso • Escrituras",
            status = "Disponível",
            isFavorite = true
        ),
        Book(
            title = "Cristianismo Puro e Simples",
            author = "C. S. Lewis",
            genre = "Religioso • Teologia",
            status = "Disponível",
            isFavorite = true
        ),
        Book(
            title = "Confissões",
            author = "Santo Agostinho",
            genre = "Religioso • Filosofia Cristã",
            status = "Reservado",
            isFavorite = false
        ),
        Book(
            title = "O Peregrino",
            author = "John Bunyan",
            genre = "Religioso • Ficção Cristã",
            status = "Disponível",
            isFavorite = false
        ),
        Book(
            title = "Cartas de um Diabo a seu Aprendiz",
            author = "C. S. Lewis",
            genre = "Religioso • Apologética",
            status = "Reservado",
            isFavorite = true
        ),
        Book(
            title = "O Evangelho Segundo o Espiritismo",
            author = "Allan Kardec",
            genre = "Religioso • Espiritismo",
            status = "Disponível",
            isFavorite = false
        ),
        Book(
            title = "Imitação de Cristo",
            author = "Tomás de Kempis",
            genre = "Religioso • Espiritualidade",
            status = "Disponível",
            isFavorite = false
        ),
        Book(
            title = "Em Busca de Sentido",
            author = "Viktor E. Frankl",
            genre = "Religioso • Espiritualidade e Psicologia",
            status = "Disponível",
            isFavorite = false
        )
    )
}