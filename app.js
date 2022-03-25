const express = require('express');
const bodyparser = require('body-parser');
const mySql = require('mysql');
const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cookieParser());
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

    bcrypt.hash(Password,8, function(err,hash){
        
        if(err){
            throw err
        } else {

            Password = hash;
            
            const sql = "INSERT into sign (name, password) VALUES ('"+Name+"','"+Password+"')";
            connection.query(sql,(err,result)=>{
                if(err){
                    throw err
                } else {
                    console.log(result);
                    // res.redirect('/password')
                }
            })
        }
    });
 
});

app.post('/login',(req,res)=>{
    console.log("loging")
    const Name = req.body.name;


    
    let sql = "SELECT * FROM sign WHERE name = '"+Name+"'";
    connection.query(sql,(err,result,feilds)=>{
        if (err){
            console.log("somthing not right")
        } else {

            if(result.length >0){
                    console.log(result[0].name)
                    res.redirect("/password")
                    ////go o enter password nf
            }else{
                console.log('nothing was in databse')
                res.redirect("/sign-up")
                //go to sign in
            }
        }
    })
 
});

app.post('/password',(req,res)=>{
    const Name = req.body.name;
    let Password = req.body.password;

    let sql = "SELECT * FROM sign WHERE name = '"+Name+"'";
    connection.query(sql,(err,foundUser,feilds)=>{
        if (err){
            throw err
        } else {
            console.log(foundUser[0].password)
            console.log(Password)
            bcrypt.compare(Password, foundUser[0].password, function(err, passwordMatched) {
                if( err){
                    throw err
                } else if(passwordMatched){
                    console.log(Password)
                    console.log(passwordMatched)
                    console.log(foundUser[0].password)
                    console.log("--------------------------------------------------")
                    
                    
                    jwt.sign({user: foundUser[0].name},'secret',(err,token)=>{
                        if(err){
                            throw err
                        } else {
                            console.log(token)
                            res.cookie('coo = '+token+'')
                            res.send(token)

                            sql = "UPDATE sign set JWToken = '"+token+"' where name = '"+foundUser[0].name+"' "
                            connection.query(sql,(err,Updated,feilds)=>{
                                if(err){
                                    throw err
                                } else {
                                    console.log("updated!!")
                                }
                            })
                        }
                        
                    })
                } else {
                    console.log('no match')
                }
                 
             })  
        }
    })
});

app.post('/',(req,res)=>{
    
    const cookieToken = req.header.CT

    jwt.verify(cookieToken,'secret',(err,decode)=>{
        if(err){err}
        else {console.log("This is the way!")}
    })
})

app.listen(3000,(req,res)=>{
    console.log("app is listing at 3000.")
});