var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "password",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("Connection successful!");
    managerView();
});

function managerView() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],
            name: "selection"
        }
    ])
        .then(function (response) {
            switch (response.selection) {
                case "View Products for Sale":
                    viewProducts();
                    break;
                case "View Low Inventory":
                    viewLowInventory();
                    break;
                case "Add to Inventory":
                    addInventory();
                    break;
                case "Add New Product":
                    addProduct();
                    break;
                case "Quit":
                    connection.end();
                    break;
            }
        })
}

function viewProducts() {
    var table = new Table({
        head: ['ID', 'Product', 'Department', 'Price', 'Stock']
        , colWidths: [5, 65, 25, 10, 10],
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        }
    });

    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log("\n" + table.toString() + "\n");
        managerView();
    });
}

function viewLowInventory() {
    var table = new Table({
        head: ['ID', 'Product', 'Department', 'Price', 'Stock']
        , colWidths: [5, 65, 25, 10, 10],
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        }
    });

    connection.query("SELECT * FROM products WHERE stock_quantity <= 5", function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].item_id, res[i].product_name, res[i].department_name, res[i].price, res[i].stock_quantity]);
        }
        console.log("\n" + table.toString() + "\n");
        managerView();
    });
}

function addInventory() {
    var itemsArr = [];

    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            itemsArr.push(res[i].product_name);
        }

        inquirer.prompt([
            {
                type: "list",
                message: "Which product do you want to add to?",
                choices: itemsArr,
                name: "item"
            },
            {
                type: "input",
                message: "How much do you want to add?",
                name: "add",
                validate: function (value) {
                    if (isNaN(value) === false && value !== "") {
                        return true;
                    }
                    return false;
                }
            }
        ])
            .then(function (response) {
                console.log()
                connection.query("UPDATE products SET stock_quantity=? WHERE product_name=?",
                    [(parseInt(response.add) + res[itemsArr.indexOf(response.item)].stock_quantity), response.item], function (err, res) {
                        if (err) throw err;

                        console.log("Added " + response.add + " " + response.item + "!");
                        managerView();
                    });
            });
    });
}

function addProduct() {
    var departments = [];

    connection.query("SELECT department_name FROM departments", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            departments.push(res[i].department_name)
        }

        inquirer.prompt([
            {
                type: "input",
                message: "What is the name of the item?",
                name: "item",
                validate: function (value) {
                    if (value !== "") {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
            {
                type: "list",
                message: "What departmet does it belong to?",
                choices: departments,
                name: "department"
            },
            {
                type: "input",
                message: "What is the cost of the item?",
                name: "cost",
                validate: function (value) {
                    if (isNaN(value) === false && value !== "") {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
            {
                type: "input",
                message: "How many do we have?",
                name: "stock",
                validate: function (value) {
                    if (isNaN(value) === false && value !== "") {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
            },
        ])
            .then(function (response) {
                connection.query("INSERT INTO products SET ?",
                    {
                        product_name: response.item,
                        department_name: response.department,
                        price: response.cost,
                        stock_quantity: response.stock,
                        product_sales: 0
                    },
                    function (err, res) {
                        if (err) throw err;
                        console.log("Added " + response.item + " to " + response.department + "!");
                        managerView();
                    }
                );
            });
    });
}