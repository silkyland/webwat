var express = require("express");
var router = express.Router();
import connection from "../config/database";

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express" });
});

router.get('/show', (req,res) => {
  res.render("show");
})

router.get("/news/:id", (req, res, news) => {
  const { id } = req.params;
  const sql = `SELECT 
                news.id, news.title,
                news.thumbnail, news.detail,
                news.created_at, news.updated_at,
                categories.id AS category_id
                categories.name AS category_name
                users.id AS users_id,
                user.name AS user_name
              FROM news 
              INNER JOIN categories ON news.category_id = categories.id
              INNER JOIN users ON news.user_id = users.user_id
              WHERE news.id = ?`;
  connection.query(sql, [id], (error, result) => {
    if (error) return res.send(error.message);
    res.json(result);
  });
});

module.exports = router;
