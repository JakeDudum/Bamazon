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
    viewProducts();
});

function supervisorView() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Product Sales by Department", "Create New Department", "Quit"],
            name: "selection"
        }
    ])
        .then(function (response) {
            switch (response.selection) {
                case "View Product Sales by Department":
                    viewProductSales();
                    break;
                case "Create New Department":
                    createDepartment();
                    break;
                case "Quit":
                    connection.end();
                    break;
            }
        });
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
        supervisorView();
    });
}

function viewProductSales() {
    var table = new Table({
        head: ['ID', 'Department', 'Over Head Cost', 'Product Sales', 'Total Profit']
        , colWidths: [5, 35, 20, 20, 15],
        chars: {
            'top': '═', 'top-mid': '╤', 'top-left': '╔', 'top-right': '╗'
            , 'bottom': '═', 'bottom-mid': '╧', 'bottom-left': '╚', 'bottom-right': '╝'
            , 'left': '║', 'left-mid': '╟', 'mid': '─', 'mid-mid': '┼'
            , 'right': '║', 'right-mid': '╢', 'middle': '│'
        }
    });

    var query = "SELECT departments.department_id, departments.department_name, departments.over_head_costs, IFNULL(products.product_sales, 0) AS product_sales, ";
    query += "IFNULL(products.product_sales - departments.over_head_costs, 0-departments.over_head_costs) AS total_profit ";
    query += "FROM departments LEFT JOIN products ON departments.department_name = products.department_name ";
    query += "GROUP BY department_name";
    connection.query(query, function (err, res) {
        if (err) throw err;
        for (var i = 0; i < res.length; i++) {
            table.push([res[i].department_id, res[i].department_name, res[i].over_head_costs, res[i].product_sales, res[i].total_profit]);
        }
        console.log("\n" + table.toString() + "\n");
        supervisorView();
    });
}

function createDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the department?",
            name: "department",
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
            type: "input",
            message: "What is the over head cost of this department?",
            name: "cost",
            validate: function (value) {
                if (isNaN(value) === false && value !== "") {
                    return true;
                }
                else {
                    return false;
                }
            }
        }
    ])
        .then(function (response) {
            connection.query("INSERT INTO departments SET ?",
                {
                    department_name: response.department,
                    over_head_costs: response.cost
                },
                function (err, res) {
                    if (err) throw err;
                    console.log("Created new department " + response.department + " with an over head cost of " + response.cost + "!");
                    supervisorView();
                }
            );
        });
}