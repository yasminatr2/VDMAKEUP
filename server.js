const express = require('express');
const path = require('path');
const xlsx = require('xlsx');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Endpoint para buscar produto
app.post('/buscar-produto', (req, res) => {
    const { codigo } = req.body;

    // Ler o arquivo Excel
    const workbook = xlsx.readFile('posicaoEstoque.xls');
    const sheetName = 'Planilha1';
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Encontrar o produto
    const produto = data.find(item => item.codigo.toString() === codigo);

    if (produto) {
        const nomeImagem = produto.imagem; // Assumindo que você tem uma coluna 'imagem'
        const resposta = {
            estacao: produto.estacao,
            rack: produto.rack,
            coluna: produto.coluna,
            posicao: produto.posicao,
            descricao: produto.descricao,
            imagem: nomeImagem
        };
        console.log('Resposta:', resposta); // Adicione esta linha para ver a resposta
        res.json(resposta);
    } else {
        res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use('/acervo', express.static(path.join(__dirname, 'acervo')));

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
