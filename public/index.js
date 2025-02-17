const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();
const port = 3000;

const db = new sqlite3.Database('./attendance.db');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, present BOOLEAN)");
});

app.use(express.json());
app.use(express.static('public'));

app.post('/markAttendance', (req, res) => {
    const { name } = req.body;
    db.run("INSERT INTO attendance (name, present) VALUES (?, ?)", [name, true], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Attendance marked successfully!" });
    });
});

app.get('/getAttendance', (req, res) => {
    db.all("SELECT * FROM attendance WHERE present = 1", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
