import mysql from "mysql";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "root",
  database: "webwat"
});
export default connection;
