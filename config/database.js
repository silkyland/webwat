import mysql from "mysql";

const connection = mysql.createConnection({
  multipleStatements: true,
  host: "178.128.208.60",
  user: "root",
  password: "O4504Umq8y5hzcR2",
  database: "webwat"
});
export default connection;
