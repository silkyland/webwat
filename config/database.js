import mysql from "mysql";

const connection = mysql.createConnection({
  multipleStatements: true,
  host: "mariadb",
  user: "root",
  password: "1234",
  database: "webwat"
});
export default connection;
