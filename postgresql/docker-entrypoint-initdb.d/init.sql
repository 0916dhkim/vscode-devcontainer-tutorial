CREATE TABLE todo (
    id SERIAL PRIMARY KEY,
    task TEXT NOT NULL,
    finished BOOLEAN NOT NULL
);
