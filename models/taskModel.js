var mysql = require('mysql2');
var pool = mysql.createPool({
    host: "sinno.soict.ai",
    user: "subjects_bdc",
    password: "lequangdung",
    database: "subjects_bdc",
    multipleStatements: true,
    connectionLimit: 20,
    // host: "127.0.0.1",
    // user: "root",
    // password: "280498",
    // database: "courselistdata"
});
// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected to the database!");
// });
// module.exports = con;

function getConnection(callback) {
    pool.getConnection(function(err, connection) {
        if (err) {
            console.error('error connecting: ' + err.stack);
            return;
        }
        callback(err, connection);
    })
}

module.exports = { getConnection };