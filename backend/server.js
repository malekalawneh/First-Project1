const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const cors = require('cors'); 
app.use(cors()); 

app.use(express.json());

const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

app.get("/", (req, res) => {
    res.send("Server is working!");
});

app.get("/api/expenses", async (req, res) => {
    try {
        const query = `
            SELECT id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') as date 
            FROM expenses 
            ORDER BY id ASC
        `;
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.get("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        const query = `
            SELECT id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') as date 
            FROM expenses 
            WHERE id = $1
        `;
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/api/expenses", async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        if (!title || amount === undefined || !category || !date) {
            return res.status(400).json({ error: "All fields are required (title, amount, category, date)" });
        }

        if (typeof title !== 'string' || title.trim() === '' || !isNaN(title)) {
            return res.status(400).json({ error: "Title must be a non-numeric text string" });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({ error: "Amount must be a number greater than 0" });
        }

        const validCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
        if (!validCategories.includes(category)) {
            return res.status(400).json({ error: "Invalid category. Must be one of: Food, Transport, Bills, Entertainment, Other" });
        }

        const query = `
            INSERT INTO expenses (title, amount, category, date)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') as date
        `;
        const result = await pool.query(query, [title, amount, category, date]);


        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(400).json({ error: "Invalid data" });
    }
});

app.put("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;
    const { title, amount, category, date } = req.body;

    if (isNaN(id) || parseInt(id) <= 0) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    if (!title || amount === undefined || !category || !date) {
        return res.status(400).json({ error: "All fields are required (title, amount, category, date)" });
    }

    if (typeof title !== 'string' || title.trim() === '' || !isNaN(title)) {
        return res.status(400).json({ error: "Title must be a non-numeric text string" });
    }

    if (typeof amount !== 'number' || amount <= 0) {
        return res.status(400).json({ error: "Amount must be a number greater than 0" });
    }

    const validCategories = ['Food', 'Transport', 'Bills', 'Entertainment', 'Other'];
    if (!validCategories.includes(category)) {
        return res.status(400).json({ error: "Invalid category. Must be one of: Food, Transport, Bills, Entertainment, Other" });
    }

    try {
        const query = `
            UPDATE expenses
            SET title = $1, amount = $2, category = $3, date = $4
            WHERE id = $5
            RETURNING id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') as date
        `;
        const result = await pool.query(query, [title, amount, category, date, id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.post("/api/expenses", async (req, res) => {
    try {
        const { title, amount, category, date } = req.body;

        if (!title || !amount || !category || !date) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const query = `
            INSERT INTO expenses (title, amount, category, date)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, amount::float8, category, to_char(date, 'YYYY-MM-DD') as date
        `;

        const result = await pool.query(query, [title, amount, category, date]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error("PostgreSQL Connection Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});
app.delete("/api/expenses/:id", async (req, res) => {
    const { id } = req.params;

    if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid ID format" });
    }

    try {
        const query = "DELETE FROM expenses WHERE id = $1 RETURNING id";
        const result = await pool.query(query, [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.status(200).json({ message: "Expense deleted successfully", id: result.rows[0].id });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Database error" });
    }
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});