const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'dev.db');
const db = new sqlite3.Database(dbPath);

db.serialize(() => {
    db.all("SELECT name FROM sqlite_master WHERE type='table'", [], (err, tables) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log('Tables:', tables);

        // Also check columns for 'users' or 'User'
        tables.forEach(t => {
            if (t.name.toLowerCase() === 'user' || t.name.toLowerCase() === 'users') {
                db.all(`PRAGMA table_info(${t.name})`, [], (err, cols) => {
                    console.log(`Columns for ${t.name}:`, cols.map(c => c.name));
                });
            }
        });
    });
});
