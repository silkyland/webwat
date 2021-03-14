import mysql from "mysql";

const connection = mysql.createConnection({
  multipleStatements: true,
  host: "localhost",
  user: "root",
  password: "1234",
  database: "webwat"
});
export default connection;
