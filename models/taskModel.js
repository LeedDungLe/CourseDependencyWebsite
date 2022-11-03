var mysql = require('mysql2');
var con = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "280498",
    database: "courselistdata"
});
con.connect(function(err) {
    if (err) throw err;
    console.log("Connected to the database!");
});
module.exports = con;