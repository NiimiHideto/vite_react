// ルーティングモジュールを呼び出し
var router = require("express").Router();

// sleep
const { setTimeout } = require('timers/promises');

// DB
const { mysql } = require('mysql2/promise');


// routerに関わらず、アクセス日時を出力するミドルウェア
router.use((req, res, next) => {
    console.log((new Date()).toISOString());
    next();
});

// サンプルデータ
var photoList = [
    {
        id: "001",
        name: "photo001.jpg",
        type: "jpg",
        dataUrl: "http://localhost:3000/data/photo001.jpg"
    },
    {
        id: "002",
        name: "photo002.jpg",
        type: "jpg",
        dataUrl: "http://localhost:3000/data/photo002.jpg"
    }
]


const asyncWrapper = fn => {
    return (req, res, next) => {
        return fn(req, res, next).catch(next);
    }
};

// 写真リストを取得するAPI 固定データのダミー URIは相対
// router.get("/list", function(req, res, next){
router.get("/list", asyncWrapper(async (req, res, next) => {
        // 強制エラー
        // throw new Error('test error')

        await setTimeout(1000);


        res.json(photoList);
}));

module.exports = router;
