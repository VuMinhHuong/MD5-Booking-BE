const mysql = require("mysql2");
let pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "hotel_booking",
  password: "phong@3856734",
});
module.exports = pool.promise();
