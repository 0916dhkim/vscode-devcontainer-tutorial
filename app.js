/**
 * Simple TODO REST server.
 */
const express = require("express");
const pgp = require("pg-promise")();
const app = express();
const PORT = process.env.PORT || 3000;
const connection = {
    host: "db",
    database: process.env.POSTGRES_DB,
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD
};
const db = pgp(connection);

// Middlewares.
app.use(express.urlencoded({ extended: false }));

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

// CREATE
app.post("/todo", async (req, res) => {
    const { task } = req.body;
    db.one("INSERT INTO todo(task, finished) VALUES($1, $2) RETURNING id", [task, false])
        .then(data => res.send(data))
        .catch(e => {
            res.status(500);
            res.send({
                error: `Database error: ${e}`
            });
        });
});

// READ
app.get("/todo", async (req, res, next) => {
    db.any("SELECT * FROM todo")
        .then(data => res.send(data))
        .catch(e => {
            res.status(500);
            res.send({
                error: `Database error: ${e}`
            });
        });
});

// UPDATE
app.post("/todo/finished", async (req, res) => {
    const { id, finished } = req.body;
    db.none("UPDATE todo SET finished = $1 WHERE id = $2", [finished, id])
        .then(() => res.send({ status: "OK" }))
        .catch(e => {
            res.status(500);
            res.send({
                error: `Database error: ${e}`
            });
        });
});

// DELETE
app.delete("/todo", async (req, res) => {
    const { id } = req.body;
    db.none("DELETE FROM todo WHERE id = $1", [id])
        .then(() => res.send({ status: "OK" }))
        .catch(e => {
            res.status(500);
            res.send({
                error: `Database error: ${e}`
            });
        });
});

// Error handlers.
app.use((req, res, next) => {
    res.status(404);
    res.send("Not Found");
});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}.`);
});
