const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');

// Ler o arquivo Excel
const workbook = xlsx.readFile('PosicaoEstoque.xls'); // Certifique-se de que o caminho está correto
const sheet_name = workbook.SheetNames[0];
const worksheet = xlsx.utils.sheet_to_json(workbook.Sheets[sheet_name]);

// Rota para buscar todos os produtos
router.get('/', (req, res) => {
    res.json(worksheet);
});

// Rota para buscar um produto específico pelo código
router.post('/buscar-produto', (req, res) => {
    const codigo = req.body.codigo;
    const produto = worksheet.find(item => item.Código === codigo);

    if (produto) {
        res.json(produto);
    } else {
        res.status(404).json({ message: "Produto não encontrado" });
    }
});

module.exports = router;
