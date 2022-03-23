const express = require('express');
const bodyparser = require('body-parser');
const mySql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: true}));

var connection = mySql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'datadb'
});

connection.connect((err)=>{
    if(!err){
        console.log("databse is connected")
    }
});

app.get('/sign-up',(req,res)=>{
    console.log("getting")
    res.send("getting")
});

app.post('/sign-up',(req,res)=>{
    console.log("posting")
    res.send("posting")

    const Name = req.body.name;
    let Password = req.body.password;

    const sql = "INSERT into sign (name, password) VALUES ('"+Name+"','"+Password+"')";
    connection.query(sql,(err,result)=>{
        if(err){
            throw err
        } else {
            console.log(result);
        }
    })
});

app.post('/login',(req,res)=>{
    console.log("loging")
    const Name = req.body.name;
    res.send("loging...");

    
    let sql = "SELECT * FROM sign WHERE name = '"+Name+"'";
    connection.query(sql,(err,result,feilds)=>{
        if (err){
            console.log("somthing not right")
        } else {

            if(result.length >0){
                    console.log(result[0].name)
            }else{
                console.log('nothing was in databse')
            }
        }
    })
 
});

app.post('/password',(req,res)=>{
    const Name = req.body.name;
    let Password = req.body.password;

    let sql = "SELECT password FROM sign WHERE name = '"+Name+"'";
    connection.query(sql,(err,result,feilds)=>{
        if (err){
            throw err
        } else {
            if(result.length >0){
                if(result[0].password=== Password){
                    res.send("matched")
                    console.log('matched')
                }else{
                    res.send("not matched")
                    console.log('not matched')
                }
            }
        }
    })

});


app.listen(3000,(req,res)=>{
    console.log("app is listing at 3000.")
});