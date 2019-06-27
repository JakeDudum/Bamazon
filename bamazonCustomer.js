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
    printStore();
});

function shop() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the item you would like to purchase?",
            name: "id",
            validate: function (value) {
                if (isNaN(value) === false && value !== "") {
                    return true;
                }
                return false;
            }
        },
        {
            type: "input",
            message: "How many would you like to buy?",
            name: "quantity",
            validate: function (value) {
                if (isNaN(value) === false && value !== "") {
                    return true;
                }
                return false;
            }
        }
    ])
        .then(function (response) {
            connection.query("SELECT * FROM products WHERE item_id=?", [response.id], function (err, res) {
                if (err) throw err;
                if (res[0].stock_quantity > 0) {
                    if (response.quantity < res[0].stock_quantity) {
                        connection.query("UPDATE products SET stock_quantity=? WHERE item_id=?",
                            [(res[0].stock_quantity - response.quantity), response.id], function (err, res) {
                                if (err) throw err;
                            });
                        console.log("Successfully purchased " + response.quantity + " " + res[0].product_name + "!");
                        console.log("Your total was $" + ((Math.round(res[0].price * 100) * response.quantity))/100 + "!");
                        printStore();
                    }
                    else {
                        console.log("Insufficient quantity!");
                        printStore();
                    }
                }
                else {
                    console.log("Sorry we're currently sold out of that item!");
                    printStore();
                }
            });
        });
}

function printStore() {
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
        shop();
    })
}