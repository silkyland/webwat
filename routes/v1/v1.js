import express from "express";
import connection from "../../config/database";
const router = express.Router();

router.get("/", (req, res) => {
  res.render("api/v1");
});

router.get("/banners", (req, res, next) => {
  try {
    let query = `SELECT * FROM banners`;
    connection.query(query, (err, result) => {
      if (err) return res.status(500).json(err);
      return res.json(result);
    });
  } catch (error) {
    return res.status(403).json(error);
  }
});

router.get("/categories", (req, res, next) => {
  try {
    let query = `SELECT * FROM categories`;
    connection.query(query, (err, result) => {
      if (err) return res.status(500).json(err);
      return res.json(result);
    });
  } catch (error) {
    return res.status(403).json(error);
  }
});

router.get("/news", (req, res, next) => {
  const { limit, offset } = req.body || { limit: 20, offset: 0 };
  let query = `
  SELECT news.id, news.title, news.detail, news.thumbnail, 
  news.created_at, news.updated_at, users.id user_id,
  users.name fullname, users.username, users.avatar, 
  users.email, categories.id category_id, categories.name category_name FROM news 
  INNER JOIN users ON news.user_id = users.id
  INNER JOIN categories ON news.category_id = categories.id
  `;

  connection.query(query, [limit, offset], (err, result) => {
    if (err) return res.status(500).json(err);
    const data = result.map((r) => ({
      id: r.id,
      title: r.title,
      detail: r.detail,
      thumbnail: r.thumbnail,
      created_at: r.created_at,
      updated_at: r.updated_at,
      user: {
        id: r.user_id,
        name: r.fullname,
        username: r.username,
        avatar: r.avatar,
        email: r.email,
      },
      category: {
        id: r.category_id,
        name: r.category_name,
      },
    }));
    return res.json(data);
  });
});

router.get("/newsByCategory/:id", (req, res, next) => {
  const { id } = req.params;
  let query = `
  SELECT news.id, news.title, news.detail, news.thumbnail, 
  news.created_at, news.updated_at, users.id user_id,
  users.name fullname, users.username, users.avatar, 
  users.email, categories.id category_id, categories.name category_name FROM news 
  INNER JOIN users ON news.user_id = users.id
  INNER JOIN categories ON news.category_id = categories.id
  WHERE news.category_id = ?
  `;

  connection.query(query, [id], (err, result) => {
    if (err) return res.status(500).json(err);
    const data = result.map((r) => ({
      id: r.id,
      title: r.title,
      detail: r.detail,
      thumbnail: r.thumbnail,
      created_at: r.created_at,
      updated_at: r.updated_at,
      user: {
        id: r.user_id,
        name: r.fullname,
        username: r.username,
        avatar: r.avatar,
        email: r.email,
      },
      category: {
        id: r.category_id,
        name: r.category_name,
      },
    }));
    return res.json(data);
  });
});

router.get("/news/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    let query = `
  SELECT news.id, news.title, news.detail, news.thumbnail, 
  news.created_at, news.updated_at, users.id user_id,
  users.name fullname, users.username, users.avatar, 
  users.email, categories.id category_id, categories.name category_name FROM news 
  INNER JOIN users ON news.user_id = users.id
  INNER JOIN categories ON news.category_id = categories.id
  WHERE news.id = ?
  `;

    connection.query(query, [id], (err, result) => {
      if (err) return next(err);
      if (result.length < 1) {
        return res.json({});
      }
      return res.json({
        id: result[0].id,
        title: result[0].title,
        detail: result[0].detail,
        thumbnail: result[0].thumbnail,
        created_at: result[0].created_at,
        updated_at: result[0].updated_at,
        user: {
          id: result[0].user_id,
          name: result[0].fullname,
          username: result[0].username,
          avatar: result[0].avatar,
          email: result[0].email,
        },
        category: {
          id: result[0].category_id,
          name: result[0].category_name,
        },
      });
    });
  } catch (error) {
    return res.status(403).json(error);
  }
});

router.get("/pages", (req, res, next) => {
  const { limit, offset } = req.body || { limit: 20, offset: 0 };
  let query = `
  SELECT pages.id, pages.title, pages.detail, pages.thumbnail, 
  pages.created_at, pages.updated_at, users.id user_id,
  users.name fullname, users.username, users.avatar, 
  users.email FROM pages 
  INNER JOIN users ON pages.user_id = users.id
  `;

  connection.query(query, [limit, offset], (err, result) => {
    if (err) return res.status(500).json(err);
    const data = result.map((r) => ({
      id: r.id,
      title: r.title,
      detail: r.detail,
      thumbnail: r.thumbnail,
      created_at: r.created_at,
      updated_at: r.updated_at,
      user: {
        id: r.user_id,
        name: r.fullname,
        username: r.username,
        avatar: r.avatar,
        email: r.email,
      },
    }));
    return res.json(data);
  });
});

router.get("/pages/:id", (req, res, next) => {
  try {
    const { id } = req.params;
    let query = `
  SELECT pages.id, pages.title, pages.detail, pages.thumbnail, 
  pages.created_at, pages.updated_at, users.id user_id,
  users.name fullname, users.username, users.avatar, 
  users.email FROM pages 
  INNER JOIN users ON pages.user_id = users.id
  WHERE pages.id = ?
  `;

    connection.query(query, [id], (err, result) => {
      if (err) return next(err);
      if (result.length < 1) {
        return res.json({});
      }
      return res.json({
        id: result[0].id,
        title: result[0].title,
        detail: result[0].detail,
        thumbnail: result[0].thumbnail,
        created_at: result[0].created_at,
        updated_at: result[0].updated_at,
        user: {
          id: result[0].user_id,
          name: result[0].fullname,
          username: result[0].username,
          avatar: result[0].avatar,
          email: result[0].email,
        },
      });
    });
  } catch (error) {
    return res.status(403).json(error);
  }
});

const v1Router = router;

export default v1Router;
