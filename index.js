const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize Database
const db = new sqlite3.Database('./attendance.db', (err) => {
    if (err) {
        console.error("Error opening database:", err.message);
    } else {
        db.run("CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, present BOOLEAN)", (err) => {
            if (err) console.error("Error creating table:", err.message);
        });
    }
});

// Mark attendance
app.post('/markAttendance', (req, res) => {
    const { name } = req.body;
    db.run("INSERT INTO attendance (name, present) VALUES (?, ?)", [name, 1], function (err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Attendance marked successfully!" });
    });
});

// Get attendance
app.get('/getAttendance', (req, res) => {
    db.all("SELECT * FROM attendance WHERE present = 1", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
