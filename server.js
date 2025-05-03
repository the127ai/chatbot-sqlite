
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

const dbPath = path.join(__dirname, 'chatbot.db');
const db = new sqlite3.Database(dbPath);

// Inisialisasi tabel
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS qna (id INTEGER PRIMARY KEY AUTOINCREMENT, question TEXT, answer TEXT)");
});

// Ambil semua data
app.get('/api/data', (req, res) => {
  db.all("SELECT question, answer FROM qna", [], (err, rows) => {
    if (err) return res.status(500).send("Database read error");
    res.json(rows);
  });
});

// Simpan data baru
app.post('/api/data', (req, res) => {
  const { question, answer } = req.body;
  if (!question || !answer) return res.status(400).send("Invalid input");

  db.run("INSERT INTO qna (question, answer) VALUES (?, ?)", [question, answer], function(err) {
    if (err) return res.status(500).send("Database insert error");
    res.send("Q&A added successfully");
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
