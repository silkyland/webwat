var express = require("express");
var router = express.Router();
import Validator from "validatorjs";
import connection from "../config/database";
import multer from "multer";
const path = require("path");
import fs from "fs";
import Resize from "../helpers/Resize";
import bcrypt from "bcrypt";

const SALT_ROUND = 10;

/* GET home page. */
router.get("/", function(req, res, next) {
  const auth = req.session.auth;
  if (!auth) {
    return res.redirect("/auth/login");
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

router.get("/user", (req, res, next) => {
  const sql = `SELECT users.id, users.avatar, users.name, roles.name AS role_name, users.email,
     users.username FROM users INNER JOIN roles ON users.role_id = roles.id`;
  connection.query(sql, (error, result) => {
    if (error) return res.send(error.message);
    res.render("admin/user/index", { users: result });
  });
});

router.get("/user/add", (req, res, next) => {
  const sql = `SELECT * FROM roles`;
  connection.query(sql, (error, result) => {
    if (error) return res.send(error.message);
    res.render("admin/user/add", { roles: result });
  });
});

// config for upload
var storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "public/uploads/avatar/");
  },
  filename: function(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const uploadAvatar = multer({ storage: storage });
router.post(
  "/user/create",
  uploadAvatar.single("avatar"),
  async (req, res, next) => {
    const { username, role_id, name, email, password } = req.body;
    const rules = {
      username: "required|min:3",
      name: "required|min:3",
      email: "required|min:3|email",
      password: "required|min:3|confirmed",
      password_confirmation: "required"
    };

    const validation = new Validator(req.body, rules);
    if (validation.fails()) {
      await fs.unlinkSync(req.file.path);
      req.flash("errors", validation.errors.all());
      return res.redirect("/admin/user/add");
    }

    let filename = "/img/150x150.png";

    if (req.file) {
      const imagePath = "public/uploads/avatar/";
      const fileUpload = new Resize(imagePath);
      filename = "/uploads/avatar/" + (await fileUpload.save(req.file.path));
      await fs.unlinkSync(req.file.path);
    }
    const sql =
      "INSERT INTO users (username, role_id, name, email, password, avatar) VALUES (?, ?, ?, ?, ?, ?)";
    const encryptPassword = await bcrypt.hashSync(password, SALT_ROUND);
    connection.query(
      sql,
      [username, role_id, name, email, encryptPassword, filename],
      (error, result) => {
        if (error) return res.send(error);
        req.flash("success", "บันทึกข้อมูลสำเร็จ");
        res.redirect("/admin/user");
      }
    );
  }
);

module.exports = router;
