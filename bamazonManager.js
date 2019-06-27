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
    console.log("connected as id " + connection.threadId);
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
        , colWidths: [5, 65, 25, 8, 10],
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
        , colWidths: [5, 65, 25, 8, 10],
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