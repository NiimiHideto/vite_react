var express = require("express");
var app = express();

// ミドルウェアでログを取る
const loggerMiddleware = function(req, res, next) {
    console.log(`[${new Date()}] ${req.method} ${req.url}`);
    next();
};
app.use(loggerMiddleware);


// apiのサンプル 別ファイルに分ける
app.use("/api/photo", require("./api/photo.js"))
app.use("/api/item", require("./api/item.js"))


// listen()メソッドを実行して8000番ポートで待ち受け
var server = app.listen(8000, function(){
    console.log("Node.js is listening to PORT:" + server.address().port);
});
