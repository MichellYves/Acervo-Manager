const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota de teste inicial para o carrinho / API
app.get('/api/status', (req, res) => {
    res.json({ mensagem: 'Backend em Node.js do Acervo-Manager a funcionar com sucesso!' });
});

// Iniciar o servidor
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});