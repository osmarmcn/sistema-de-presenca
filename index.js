const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'escola'
});

db.connect((err) => {
    if (err) {
        console.error(`Erro ao conectar ao banco de dados: ${err.stack}`);
        return;
    }
    console.log('Conexão com o banco de dados bem-sucedida!');
});

app.post('/login', (req, res) => {
    const { cargo, email, senha } = req.body;
    console.log(`Recebido pedido de login com cargo: ${cargo}, email: ${email}`);

    if (!cargo || !email || !senha) {
        return res.status(400).json({ success: false, message: 'Dados incompletos' });
    }

    let tabela;
    if (cargo === 'professor') {
        tabela = 'professor';
    } else if (cargo === 'monitor') {
        tabela = 'monitor';
    } else if (cargo === 'academico') {
        tabela = 'academico';
    } else {
        return res.status(400).json({ success: false, message: 'Cargo inválido' });
    }

    const query = `SELECT * FROM ${tabela} WHERE email = ? AND senha = ?`;
    db.query(query, [email, senha], (err, results) => {
        if (err) {
            console.error(`Erro ao executar a consulta: ${err.stack}`);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }

        if (results.length > 0) {
            const usuario = results[0];
            res.json({ success: true, usuario });
        } else {
            res.status(401).json({ success: false, message: 'Acesso inválido' });
        }
    });
});


app.get('/turma1', (req, res) => {
    const query = 'SELECT * FROM turma1';
    db.query(query, (err, results) => {
        if (err) {
            console.error(`Erro ao buscar dados da turma1: ${err.stack}`);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }
        res.json(results);
    });
});

app.get('/turma2', (req, res) => {
    const query = 'SELECT * FROM turma2';
    db.query(query, (err, results) => {
        if (err) {
            console.error(`Erro ao buscar dados da turma2: ${err.stack}`);
            return res.status(500).json({ success: false, message: 'Erro no servidor' });
        }
        res.json(results);
    });
});

// marcar presença
app.post('/:turma/marcar-presenca/:id', (req, res) => {
    const turma = req.params.turma;
    const alunoId = req.params.id;

    db.query(`UPDATE ${turma} SET presença = IFNULL(presença, 0) + 1 WHERE id = ?`, [alunoId], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar presença:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar presença' });
        }
        res.json({ success: true });
    });
});

//  marcar falta
app.post('/:turma/marcar-falta/:id', (req, res) => {
    const turma = req.params.turma;
    const alunoId = req.params.id;

    db.query(`UPDATE ${turma} SET faltas = IFNULL(faltas, 0) + 1 WHERE id = ?`, [alunoId], (err, results) => {
        if (err) {
            console.error('Erro ao atualizar falta:', err);
            return res.status(500).json({ success: false, message: 'Erro ao atualizar falta' });
        }
        res.json({ success: true });
    });
});

app.listen(8080, () => {
    console.log('Servidor funcionando na porta 8080');
});
