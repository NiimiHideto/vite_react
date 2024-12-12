
const express = require('express');
const app = express();
const { createConnection } = require('./database');
const { setTimeout } = require('timers/promises');

// application/jsonを受け取る場合
app.use(express.json());


// // routerに関わらず、アクセス日時を出力するミドルウェア
// app.use((req, res, next) => {
//     console.log((new Date()).toISOString());
//     next();
// });

const asyncWrapper = fn => {
    return (req, res, next) => {
        return fn(req, res, next).catch(next);
    }
};

// 一覧取得
app.get("/list", asyncWrapper(async (req, res, next) => {
    const connection = await createConnection();
    const [rows] = await connection.query("SELECT * FROM items");
    await connection.end(); // 要る？

    res.json(rows);
}));

// ID指定で取得
app.get("/:id", asyncWrapper(async (req, res, next) => {
    // 入力値のチェック
    let id = req.params.id;
    if(id === undefined) {
        res.send("ERROR: not found id.\n");
        return;
    }

    const connection = await createConnection();
    const [rows] = await connection.query("SELECT * FROM items WHERE id=?", [id]);
    if(rows.length < 1) {
        res.send("ERROR: not found id. [" + id + "]\n");
        await connection.end(); // 居る？
        return;
    }
    await connection.end(); // 居る？

    res.json(rows);
}));

// データ追加
app.post("/", asyncWrapper(async (req, res, next) => {
    // 入力値のチェック
    let name = req.body.name;
    if(name === undefined) {
        res.send("ERROR: not found name.\n");
        return;
    }
    let price = req.body.price;
    if(price === undefined) {
        res.send("ERROR: not found price.\n");
        return;
    }

    // 既存データの確認  なんとなく同名でチェック。DB側にユニークキーとか付けていないけど
    const connection = await createConnection();
    const [rows] = await connection.query("SELECT * FROM items WHERE name=?", [name]);
    if(rows.length > 0) {
        res.send("ERROR: already registered. [" + name + "]\n");
        await connection.end(); // 居る？
        return;
    }

    await connection.query(
        'INSERT INTO items (name, price) VALUES (?, ?)',
        [name, price],
        (error, results) => {
            res.send("ERROR: insert error.\n");
        }
    );
    await connection.end(); // 居る？

    console.log("insert name=" + name + " price=" + price);
    res.send("OK\n");
}));


// データ更新
app.put("/", asyncWrapper(async (req, res, next) => {
    // 入力値のチェック
    let id = req.body.id;
    if(id === undefined) {
        res.send("ERROR: not found id.\n");
        return;
    }
    let name = req.body.name;
    if(name === undefined) {
        res.send("ERROR: not found name.\n");
        return;
    }
    let price = req.body.price;
    if(price === undefined) {
        res.send("ERROR: not found price.\n");
        return;
    }

    // test
    
    console.log("update id=" + id + " name=" + name + " price=" + price);
    res.send("OK\n");
}));


module.exports = app;
