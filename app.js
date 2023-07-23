const express = require('express')
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const app = express()

const connectDB = require('./db/connect')
const people = require('./routers/people')
const newUser = require('./routers/newUser')

app.set("view engine", "ejs");

app.use(express.static('./public'))

app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(express.static(__dirname));
app.use(cookieParser());

const port = 5000
const oneDay = 1000 * 60 * 60 * 24;
    
app.use(sessions({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));

app.use('/newUser', newUser)
app.use('/people', people )

const start = async () =>{
    try{
        await connectDB()
        app.listen(port, ()=>{
            console.log("Server is listening on port 5000...")
        })
    }catch (error){
        console.log(error)
    }
}

start()