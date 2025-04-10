const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

// Подключение к базе данных MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '1234',
    database: 'registration_db',
});

db.connect((err) => {
    if (err) {
        console.error('Ошибка подключения к базе данных:', err);
        return;
    }
    console.log('Подключение к базе данных успешно установлено');
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Роут для регистрации

app.post('/register', (req, res) => {
    const { username, phone, password } = req.body;

    console.log('Полученные данные:', { username, phone, password });

    if (!username || !phone || !password) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    const query = 'INSERT INTO users (username, phone, password) VALUES (?, ?, ?)';
    db.query(query, [username, phone, password], (err, result) => {
        if (err) {
            console.error('Ошибка при регистрации:', err);
            return res.status(500).json({ message: 'Ошибка при регистрации' });
        }
        res.status(200).json({
            redirectUrl: '../untitled-html (2)/index (2).html'
        });
    });
});

app.post('/login', (req, res) => {
    const { phone, password } = req.body;

    if (!phone || !password) {
        return res.status(400).json({ message: 'Все поля обязательны для заполнения' });
    }

    const query = 'SELECT * FROM users WHERE phone = ? AND password = ?';
    db.query(query, [phone, password], (err, results) => {
        if (err) {
            console.error('Ошибка при входе:', err);
            return res.status(500).json({ message: 'Ошибка при входе' });
        }

        if (results.length > 0) {
            res.status(200).json({
                redirectUrl: '../untitled-html (2)/index (2).html',
                phone: results[0].phone
            });
        } else {
            res.status(401).json({ message: 'Неверный телефон или пароль' });
        }
    });
});

// Роут для получения информации о пользователе по ID
app.get('/user/:phone', (req, res) => {
    const phone = req.params.phone;

    const query = 'SELECT phone FROM users WHERE phone = ?';
    db.query(query, [phone], (err, results) => {
        if (err) {
            console.error('Ошибка при получении пользователя:', err);
            return res.status(500).json({ message: 'Ошибка при получении пользователя' });
        }

        if (results.length > 0) {
            res.status(200).json(results[0]);
        } else {
            res.status(404).json({ message: 'Пользователь не найден' });
        }
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер запущен на http://localhost:${port}`);
});