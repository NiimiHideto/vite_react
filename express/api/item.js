// ルーティングモジュールを呼び出し
var router = require("express").Router();

// DB
const { createConnection } = require('./database');

// sleep
const { setTimeout } = require('timers/promises');

// routerに関わらず、アクセス日時を出力するミドルウェア
router.use((req, res, next) => {
    console.log((new Date()).toISOString());
    next();
});

const asyncWrapper = fn => {
    return (req, res, next) => {
        return fn(req, res, next).catch(next);
    }
};

// DBから取得
router.get("/list", asyncWrapper(async (req, res, next) => {

    const connection = await createConnection();
    const [rows] = await connection.query("SELECT * FROM items");
    await connection.end();

    res.json(rows);
}));

module.exports = router;
