var express = require("express");
var router = express.Router();
import bcrypt from "bcrypt";
import fs from "fs";
import multer from "multer";
import Validator from "validatorjs";
import connection from "../config/database";
import Resize from "../helpers/Resize";
const path = require("path");

const SALT_ROUND = 10;

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("admin/index");
});

// หน้า

// แบนเนอร์

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
  connection.query(sql, [id], (error, result) => {
    if (error) return res.send(error.message);
    res.render("admin/category/edit", { category: result[0] });
  });
});

router.post("/category/update/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const sql = `UPDATE categories SET name = ? WHERE id = ?`;
  connection.query(sql, [name, id], (error, result) => {
    if (error) res.send(error.message);
    req.flash("success", "บันทึกสำเร็จ");
    res.redirect("/admin/category");
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
  const sql = `SELECT news.id,
               news.title,
               news.thumbnail,
               news.created_at,
               news.updated_at,
               categories.id AS category_id,
               categories.name AS category_name,
               users.id AS user_id,
               users.name AS user_name 
               FROM news 
               INNER JOIN users ON news.user_id = users.id
               INNER JOIN categories ON news.category_id = categories.id
               ORDER BY users.id DESC`;
  connection.query(sql, (error, result) => {
    if (error) res.send(error.message);
    res.render("admin/news/index", { news: result });
  });
});

router.get("/news/add", (req, res, next) => {
  const sql = "SELECT * FROM categories";
  connection.query(sql, (error, result) => {
    if (error) throw new Error(error);
    res.render("admin/news/add", { categories: result });
  });
});

router.post(
  "/news/create",
  multer({ dest: "public/uploads/news/" }).fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "files", maxCount: 1 }
  ]),
  async (req, res) => {
    const rules = {
      title: "required|min:3",
      category_id: "required",
      detail: "required|min:10"
    };
    const validation = new Validator(req.body, rules);
    if (validation.fails()) {
      req.flash("error", validation.errors);
      return res.redirect("/admin/news");
    }
    let filename = "/img/150x150.png";
    if (req.files[0]) {
      const imagePath = "public/uploads/news/";
      const fileUpload = new Resize(imagePath, {
        width: 720,
        height: 480
      });
      filename = `/uploads/news/${await fileUpload.save(
        req.files[0].path
      )}${path.extname(files[0].originalname)}`;
      await fs.unlinkSync(req.files.path);
    }

    const sql =
      "INSERT INTO news (user_id, category_id, thumbnail, title, detail) VALUES (?, ?, ?, ?, ?)";
    const { category_id, title, detail } = req.body;
    connection.query(
      sql,
      [res.locals.auth.user.id, category_id, filename, title, detail],
      (error, result) => {
        if (error) return res.send(error.message);
        req.flash("success", { message: "บันทึกข้อมูลสำเร็จ" });
        res.redirect("/admin/news");
      }
    );
  }
);

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

router.post(
  "/user/create",
  multer({ dest: "public/uploads/avatar/" }).single("avatar"),
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
      //await fs.unlinkSync(req.file.path);
      req.flash("errors", validation.errors.all());
      return res.redirect("/admin/user/add");
    }

    let filename = "/img/150x150.png";

    if (req.file) {
      const imagePath = "public/uploads/avatar/";
      const fileUpload = new Resize(imagePath, {
        width: 150,
        height: 150
      });
      filename = `/uploads/avatar/${await fileUpload.save(
        req.file.path
      )}${path.extname(file.originalname)}`;
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

router.get("/user/edit/:id", (req, res) => {
  const { id } = req.params;
  const sql = `SELECT users.id, avatar, users.name, users.username, users.email, 
                roles.id as role_id, roles.name as role_name FROM users INNER JOIN 
                roles ON users.role_id = roles.id WHERE users.id = ?;
              SELECT * FROM roles`;
  connection.query(sql, [id], (error, result) => {
    if (error) return res.send(error.message);
    res.render("admin/user/edit", { user: result[0][0], roles: result[1] });
  });
});

router.post(
  "/user/update/:id",
  multer({ dest: "public/uploads/avatar/" }).single("avatar"),
  async (req, res, next) => {
    const { id } = req.params;
    const { username, role_id, name, email, password } = req.body;
    let rules = {
      username: "required|min:3",
      name: "required|min:3",
      email: "required|min:3|email"
    };
    if (password) {
      rules = {
        ...rules,
        password: "required|min:3|confirmed",
        password_confirmation: "required|min:3"
      };
    }
    const validation = new Validator(req.body, rules);
    if (validation.fails()) {
      req.flash("errors", validation.errors.all());
      return res.redirect("/admin/user/edit/" + id);
    }

    const userSQL = "SELECT * FROM users WHERE id = ?";

    let filename = "/img/150x150.png";

    connection.query(userSQL, [id], async (error, result) => {
      if (error) return res.send(error.message);
      filename = result[0].avatar;
      if (req.file) {
        const imagePath = "public/uploads/avatar/";
        const fileUpload = new Resize(imagePath, {
          width: 150,
          height: 150
        });
        filename = `/uploads/avatar/${await fileUpload.save(
          req.file.path
        )}${path.extname(file.originalname)}`;
        await fs.unlinkSync(req.file.path);
      }
      const sql = password
        ? `UPDATE users SET username = ?, role_id = ?, name = ?, email = ?, password = ?, avatar = ? WHERE id = ?`
        : `UPDATE users SET username = ?, role_id = ?, name = ?, email = ?, avatar = ? WHERE id = ?`;

      connection.query(
        sql,
        password
          ? [
              username,
              role_id,
              name,
              email,
              bcrypt.hashSync(password, SALT_ROUND),
              filename,
              id
            ]
          : [username, role_id, name, email, filename, id],
        (error, result) => {
          if (error) return res.send(error);
          req.flash("success", "บันทึกข้อมูลสำเร็จ");
          res.redirect("/admin/user");
        }
      );
    });
  }
);

router.get("/user/delete/:id", (req, res) => {
  const { id } = req.params;
  const sql = `DELETE FROM users WHERE id = ?`;
  connection.query(sql, [id], (error, result) => {
    if (error) return res.send(error);
    req.flash("ลบข้อมูลสำเร็จ");
    res.redirect("/admin/user");
  });
});

module.exports = router;
