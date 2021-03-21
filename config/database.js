import mysql from "mysql";

const connection = mysql.createConnection({
  multipleStatements: true,
  host: "host.docker.internal",
  user: "root",
  password: "O4504Umq8y5hzcR2",
  database: "webwat"
});
export default connection;
