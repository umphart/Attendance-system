const express = require('express'); 
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const app = express();
const port = 3001;

// Enable CORS
app.use(cors());

// Initialize Database
const db = new sqlite3.Database('./attendance.db');
db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS attendance (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, present BOOLEAN)");
});

app.use(express.json());
app.use(express.static('public'));

// Route to mark attendance
app.post('/markAttendance', (req, res) => {
    const { name } = req.body;
    db.run("INSERT INTO attendance (name, present) VALUES (?, ?)", [name, true], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ message: "Attendance marked successfully!" });
    });
});

// Route to get attendance
app.get('/getAttendance', (req, res) => {
    db.all("SELECT * FROM attendance WHERE present = 1", [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(rows);
    });
});

// Listen on the desired port
app.listen(port, (err) => {
    if (err && err.code === 'EADDRINUSE') {
        console.log(`Port ${port} is already in use, trying another port...`);
        // Try a different port, e.g., 3001
        app.listen(3001, () => {
            console.log(`Server is now running on http://localhost:3001`);
        });
    } else {
        console.log(`Server is running on http://localhost:${port}`);
    }
});
