import mysql from "mysql";

const connection = mysql.createConnection({
  multipleStatements: true,
  host: "localhost",
  user: "root",
  password: "",
  database: "webwat"
});
export default connection;
