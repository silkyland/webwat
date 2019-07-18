var express = require("express");
var router = express.Router();
import Validator from "validatorjs";
import connection from "../config/database";

/* GET home page. */
router.get("/", function(req, res, next) {
  const auth = req.session.auth;
  if (!auth) {
    res.redirect("/auth/login");
  }
  res.render("admin/index");
});

// หมวดหมู่ข่าว

router.get("/category", (req, res) => {
  const sql = "SELECT * FROM categories";
  connection.query(sql, (error, result) => {
    if (error) return res.send(error.message);
    res.render("admin/category/index", { categories: result });
  });
});

router.get("/category/add", (req, res) => {
  res.render("admin/category/add");
});

router.post("/category/create", (req, res) => {
  const { name } = req.body;
  const rules = {
    name: "required|min:3"
  };
  const validation = new Validator({ name: name }, rules);
  if (validation.fails()) {
    req.flash("error", validation.errors);
    return res.redirect("/admin/news");
  }
  const sql = "INSERT INTO categories (name) VALUES (?)";
  connection.query(sql, [name], (error, result) => {
    if (error) return res.send(error.message);
    res.redirect("/admin/category");
  });
});

router.get("/category/edit/:id", (req, res) => {
  const { id } = req.params;
  const sql = "SELECT * FROM categories WHERE id = ?";
  connection.query(sql, [id], (error, response) => {
    if (error) return res.send(error.message);
    res.render("/admin/edit", { category: result });
  });
});

router.get("/category/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM categories WHERE id = ?";
  connection.query(sql, [id], (error, result) => {
    if (error) return res.send(error.message);
    req.flash("success", "ลบข้อมูลสำเร็จแล้ว");
    res.redirect("/admin/category");
  });
});

// ข่าว

router.get("/news", (req, res, next) => {
  res.render("admin/news/index");
});

router.get("/news/add", (req, res, next) => {
  const sql = "SELECT * FROM categories";
  connection.query(sql, (error, result) => {
    if (error) throw new Error(error);
    res.render("admin/news/add", { categories: result });
  });
});

router.post("/news/admin/create", (req, res) => {
  const rules = {
    name: "require|min:3"
  };
  const validation = new Validator(req.body, rules);
  if (validation.fails()) {
    req.flash("error", validation.errors);
    return res.redirect("/admin/news");
  }
  const sql = "INSERT INTO news (name) VALUES (?)";
  connection.query(sql, [req.body.name], (error, result) => {
    if (error) return res.send(error.message);
    req.flash("success", { message: "บันทึกข้อมูลสำเร็จ" });
    res.redirect("/admin/news");
  });
});

router.get("/news/edit/:id", (req, res) => {
  const sql =
    "SELECT * FROM news INNER JOIN categories ON news.category_id = categories.id WHERE news.id = ?";
  connection.query(sql, [req.params.id], (error, result) => {
    if (error) return res.send(error.message);
    res.render("admin/news/edit", { news: result });
  });
});

router.get("/news/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = "DELETE FROM news WHERE id = ?";
  connection.query(sql, (error, result) => {
    if (error) return res.send(error.message);
    if (result) {
      req.flash("success", "ลบข้อมูลสำเร็จ");
    }
    res.redirect("/news");
  });
});

module.exports = router;
