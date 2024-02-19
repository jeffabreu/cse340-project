-- SQL code to create the "review" table
CREATE TABLE review (
    review_id SERIAL PRIMARY KEY,
    review_text TEXT NOT NULL,
    review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    inv_id INTEGER NOT NULL,
    account_id INTEGER NOT NULL,
    FOREIGN KEY (inv_id) REFERENCES inventory(inv_id),
    FOREIGN KEY (account_id) REFERENCES account(account_id)
);