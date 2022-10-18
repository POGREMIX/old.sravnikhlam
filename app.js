const NODE_ENV = process.argv[2];//или чз переменную среды

const express = require("express");
const app = express();
let ws = require('express-ws');
let wss = ws(app)


const bodyParser = require("body-parser");
const userRouter = require("./routes/userRouter.js");
const homeRouter = require("./routes/homeRouter.js");
const textRouter = require("./routes/textRouter.js");
const chatRouter = require("./routes/chatRouter.js");
const commentRouter = require("./routes/commentRouter.js");
const viewRouter = require("./routes/viewRouter.js");
const likeRouter = require("./routes/likeRouter.js");
const dislikeRouter = require("./routes/dislikeRouter.js");
const registrationRouter = require("./routes/registrationRouter.js");

 
app.use(express.static('images'));
app.use(express.static('css'));
app.use(express.static('files'));
app.use(express.static('scripts'));
app.use(express.static('scripts/modules'));

app.use('/favicon.ico', express.static('images/favicon.ico'));

app.set("view engine", "hbs");
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

 
app.use("/user", userRouter);
app.use("/", homeRouter);
app.use("/text", textRouter);
app.use("/chat", chatRouter);
app.use("/comment", commentRouter);
app.use("/view", viewRouter);
app.use("/like", likeRouter);
app.use("/dislike", dislikeRouter);
app.use("/registration", registrationRouter);


app.use(function (req, res, next) {
    res.status(404).send("Not Found");
});
 
//передается как колбэк в контроллере
app.use(errorHandler);

//ifconfig inet
var host = process.env.HOST || '0.0.0.0' || 'localhost';
let port = process.env.PORT || 3000;

app.listen(port, host, function(){
    console.log('Сервер ожидает подключения по адресу '+host+':'+port);
});


function errorHandler(err, req, res, next) {
    console.error(err.stack);
    res.status(500).send("oops")
    // next(err);
  }