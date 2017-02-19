var inquirer = require('inquirer');
var mysql = require("mysql");

//var app = express();

// Specify the port.
// var port = 3033;

// MySQL DB Connection Information (remember to change this with our specific credentials)
var connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Mastermind315",
  database: "bamazon_db",
  port: 3306
});

connection.connect(function(err){
	if(err){
		console.log("Error connecting");
	}else{
		selectTable();
 	}

	function selectTable(table){
		connection.query('SELECT * from products', function (error, results, fields) {
		  if (error) throw error;
		  // stuff from database
		  console.log(results);
		  buyProd();
		});
	}

	function buyProd(){
		inquirer.prompt([
		    {
		    	type: "input",
		    	name: "id",
		    	message: "Enter ID number of product to purchase.?"
		    }, 
		   	{
		    	type: "input",
		    	name: "quantity",
		    	message: "Enter the number of products to purchase.?"
		    }, 
		    ]).then(function(data){
		              
	            var prod = data.id;
	            console.log(prod);
	            var amount = data.quantity;
	            

	            connection.query('SELECT * from products WHERE id = ?', [prod], function (error, results, fields) {
				  var quantity = results[0].stock_quantity;
				  var price = results[0].price;
				  var prod_id = results[0].id;

				  if (error) throw error;
				  // stuff from database
				  console.log(results);
				  console.log(quantity);

				  if(amount < results[0].stock_quantity){
				  	console.log('You CAN buy');

				  	// here you would caculate new quantity
				  	quantity = quantity - amount;
				  	console.log(quantity);
				  	var total = price * amount;
				  	console.log("Your total is: $" + total);

				  	//sql.query("UPDATE products SET stock_quantity=" + math + " WHERE id=" + bought.ID);
				  	// update product with new quantity
				  	//connection.query("UPDATE products SET stock_quantity=" + quantity + "WHERE id=" + prod);
				  	
				  	connection.query('UPDATE products SET stock_quantity = ? WHERE id = ?', [quantity, prod], function(error){
				  		if(error) throw error;
				  		console.log("There are " + quantity + " left");
				  	});

				  	// insert sale into sales database
				  	//procuct_id, quantity, timestamp
				  	connection.query('INSERT INTO sales(product_id, quantity_purchased) VALUES(?,?)', [prod_id, amount], function(error){
                          if(error) throw error;
                          console.log("Have a great day!");
                      });

				  } else {
				  	console.log('Not enough stock');
				  }
				  // buyProd(results);
				  
				});

	            
			});
	}


});
