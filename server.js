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
        const resposta = {
            rua: produto.rua,
            rack: produto.rack,
            coluna: produto.coluna,
            posicao: produto.posicao,
            descricao: produto.descricao,
            imagem: produto.imagem // Supondo que você tenha uma coluna 'imagem'
        };
        console.log('Resposta:', resposta); // Para verificar a resposta
        res.json(resposta);
    } else {
        res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }
});

// Endpoint para atualizar produto
app.post('/atualizar-produto', (req, res) => {
    const { codigo, rua, rack, coluna, posicao, descricao } = req.body;

    // Ler o arquivo Excel
    const workbook = xlsx.readFile('posicaoEstoque.xls');
    const sheetName = 'Planilha1';
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Encontrar o índice do produto
    const index = data.findIndex(item => item.codigo.toString() === codigo);

    if (index === -1) {
        return res.status(404).json({ mensagem: 'Produto não encontrado.' });
    }

    // Atualizar o produto
    data[index] = {
        ...data[index],
        rua,
        rack,
        coluna,
        posicao,
        descricao,
    };

    // Salvar as alterações de volta no arquivo Excel
    const newWorksheet = xlsx.utils.json_to_sheet(data);
    workbook.Sheets[sheetName] = newWorksheet;
    xlsx.writeFile(workbook, 'posicaoEstoque.xls');

    res.json({ mensagem: 'Produto atualizado com sucesso.' });
});

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Rota de administração
app.get('/adm', (req, res) => {
    res.sendFile(path.join(__dirname, 'adm.html'));
});

// Rota de CRUD
app.get('/crud', (req, res) => {
    res.sendFile(path.join(__dirname, 'crud.html'));
});

app.use('/acervo', express.static(path.join(__dirname, 'acervo')));

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
