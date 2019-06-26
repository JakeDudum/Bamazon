DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    stock_quantity INT NOT NULL,
    PRIMARY KEY (item_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity)
VALUES ("Tom Clancy's Rainbow Six Siege", "Video Games", 19.99, 300),
    ("Escape From Tarkov", "Video Games", 44.99, 150),
    ("Pepperoni Pizza", "Food and Drink", 9.99, 100),
    ("2L Coca-Cola", "Food and Drink", 1.99, 500),
    ("Avengers: Endgame", "Movies", 20, 500),
    ("The Room", "Movies", 5, 9000),
    ("NVIDIA GeForce GTX 1080 Ti", "Computer Parts", 999.99, 50),
    ("Intel Core 17-5930K CPU @ 3.50GHz", "Computer Parts", 649.99, 50),
    ("Body Towel", "Bed, Bath, and BEYOND", 9.99, 1000),
    ("Kirkland Signature Bath Tissue, 2-Ply, 425 sheets, 30 rolls", "Bed, Bath, and BEYOND", 19.99, 200);
