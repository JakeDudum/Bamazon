DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100) NOT NULL,
    price FLOAT NOT NULL,
    stock_quantity INT NOT NULL,
    product_sales FLOAT NOT NULL,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    over_head_costs FLOAT NOT NULL,
    PRIMARY KEY (department_id)
);

INSERT INTO products(product_name, department_name, price, stock_quantity, product_sales)
VALUES ("Tom Clancy's Rainbow Six Siege", "Video Games", 19.99, 300, 0),
    ("Escape From Tarkov", "Video Games", 44.99, 150, 0),
    ("Pepperoni Pizza", "Food and Drink", 9.99, 100, 0),
    ("2L Coca-Cola", "Food and Drink", 1.99, 500, 0),
    ("Avengers: Endgame", "Movies", 20, 500, 0),
    ("The Room", "Movies", 5, 9000, 0),
    ("NVIDIA GeForce GTX 1080 Ti", "Computer Parts", 999.99, 50, 0),
    ("Intel Core 17-5930K CPU @ 3.50GHz", "Computer Parts", 649.99, 50, 0),
    ("Body Towel", "Bed, Bath, and BEYOND", 9.99, 1000, 0),
    ("Kirkland Signature Bath Tissue, 2-Ply, 425 sheets, 30 rolls", "Bed, Bath, and BEYOND", 19.99, 200, 0);
