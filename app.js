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

app.get("/", (req, res) => {
    res.send("Hello, World!");
});

app.get("/todo", async (req, res, next) => {
    db.any("SELECT * FROM todo")
        .then(data => res.send(data))
        .catch(() => {
            res.status(500);
            res.send({
                error: "Database error."
            });
        });
});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}.`);
});
