
const {Client} = require('pg');
const express = require('express');
const session = require('express-session')
const path = require('path');
const bcrypt = require('bcrypt');
const app = express();
//////////////////////////////////
/// 
require('dotenv').config();
////////////

const client = new Client({
    connectionString: process.env.DATABASE_URL,
    database: process.env.DATABASE,
    ssl:{
        rejectUnauthorized: false,
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`listening on PORT ${PORT}`)
})

app.use(express.static(path.join(__dirname,'build')));
app.set('trust proxy', 1)
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: true,
    coockie: {secure: true}
}))

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname,'build','index.html'));
})

app.all('/*')


app.all('/*', function(req,res,next) { 
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Methods','GET,PUT,POST,DELETE');
    res.setHeader('Access-Control-Allow-Headers','*');
    res.setHeader('Access-Control-Allow-Credentials', true)
    next(); 
});

app.use(express.json());
app.use(express.urlencoded({extended:true}))

client.connect((err)=>{
    if(err) throw err;
    console.log("User has entered")
})



client.query('CREATE TABLE IF NOT EXISTS users ( userName VARCHAR(45) PRIMARY KEY, passWord VARCHAR(255), UNIQUE(passWord))', (err, res) => {
    if (err) throw err;
    console.log('success')
    
})

client.query('CREATE TABLE IF NOT EXISTS userwishlist (id SERIAL PRIMARY KEY, picture BYTEA, title VARCHAR(255), steamappID INT, normalPrice FLOAT, salePrice FLOAT, savings FLOAT, refuser VARCHAR(255))', (err, res) => {
    if (err) throw err;
    console.log('success')
    
})

app.get('/remove',(req,res)=>{
    client.query(`DROP TABLE users`,(err)=>{
        if(err) return res.send({message: err})
    })
})
app.get('/removeWish',(req,res)=>{
    client.query(`DROP TABLE userwishlist`,(err)=>{
        if(err) return res.send({message: err})
    })
})

app.get('/checkUser', (req, res) => {
    //query to retrieve password using the username given
    client.query("SELECT (passWord) FROM users WHERE userName=($1)", [req.query.username], (err, result) => {
        //given incorrect username with send an error message
        if (err) return res.send({ message: "Error: Username or Password are incorrect" })
        if (result.rowCount < 1) return res.send({ message: 'Error: Username or Password are incorrect' })
        //using bcrypt, the given password will be compared to the hashed password saved in the database
        bcrypt.compare(req.query.password, result.rows[0]['password'], (err, result) => {
            if(err) return console.log(err)
            // console.log(result)
            if(result){
                //initialize a session for logged in user
                req.session.userName = req.query.username;
                client.query(`SELECT * FROM users WHERE userName=($1)`, [req.query.username], (err, result) => {
                    if (err) return console.log(err);
                    return res.send(result);
                })
            }
            else{
                //given password not the same as in database send error message
                return res.send({message: 'Error: Username or Password are incorrect'})
            }
        })
    })
})

app.post('/enterUser',(req,res)=>{
    //using given password use bcrypt with given saltrounds to hash the password
    bcrypt.hash(req.body.passWord,10,(err,hash)=>{
        if(err) return console.log(err)
            //create user with a crypted password 
            client.query(`INSERT INTO users (userName,passWord) VALUES ($1,$2);`,[req.body.username,hash],(err,result)=>{
                if(err){
                    // console.log(err.message)
                    return res.send({message: err.message});
                } 
                    // console.log("\x1b[42m",`User: ${req.body.username} has created an account`,result,'\x1b[0m');
                    return res.send({done: 'made'})
            })
        })
})

app.post('/insertWishlist',(req,res,next)=>{
    //check if a user is logged in
    if(req.session.userName){
        //query to check the number of games are in the user wishlist
        client.query(`SELECT COUNT(*) FROM userwishlist WHERE refUser=($1)`,[req.session.userName],(err,result0)=>{
            if(err) return console.log(err)
            //limit user wishlist to only 12
            if(result0.rows[0]['count'] < 12){
                //query to check if user already has selected game entered in their wishlist
                client.query(`SELECT COUNT(*) FROM userwishlist WHERE refUser=($1) AND steamappID=($2)`,[req.session.userName,req.body.appId],(err,result1)=>{
                    if(err) return console.log(err)
                    //allow user to save selected game if not already in user's wishlist
                    if(result1.rows[0]['count'] < 1){ 
                        //query to save selected game in the logged in user wishlist
                        client.query(`INSERT INTO userwishlist (picture,title,steamappID,normalPrice,salePrice,savings,refUser) VALUES ($1,$2,$3,$4,$5,$6,$7)`,[req.body.picture,req.body.gameName,req.body.appId,req.body.regularPrice,req.body.discountedPrice,req.body.percentage,req.session.userName,],(err,result2)=>{
                            if(err) return console.log(err)
                        })
                    }
                })
            }
        })
    }else{
        //don't allow any request to be made if no user is logged in
        return res.send({message: 'No User Logged In'})
    }
})

app.get('/userWishlist',(req,res)=>{
    //check if a user is logged in
    if(req.session.userName){
        //query to retrieve user's wishlist
        client.query(`SELECT COUNT(*) FROM userwishlist WHERE refUser=($1)`,[req.session.userName],(err,result)=>{
            if(err) return res.send(err)
            //if user's wishlist is empty notify user that no games were entered into their wishlist
            if(result.rows[0]['count'] === 0) return res.send({message: 'Zero wishlist'})
            //user has 1 or more games in their wishlist, send saved games to front end
            client.query(`SELECT * FROM userwishlist WHERE refUser=($1)`,[req.session.userName],(err,result)=>{
                if(err) return res.send(err)
                // console.log(result.rows)
                return res.send(result.rows)
            })
            
        })
    }else{
        //no request made if no user are logged in
        return res.send({userName: 'NO USER'})
    }
})

app.delete('/removeWishlist', (req,res)=>{
    //check if a user is logged in
    if(req.session.userName){
        //query to delete game from user wishlist using its steam id 
        client.query(`DELETE FROM userwishlist WHERE refUser=($1) AND steamappID=($2)`,[req.session.userName,req.query.steamAppID],(err,result)=>{
            if(err) return console.log(err)
            return res.send({message: 'Game Deleted'})
        })
    }else{
        //no request made if no user are logged in
        console.log('No User')
    }
})

app.get('/logout',(req,res)=>{
    //destroy current user session 
    req.session.destroy((err,res)=>{
        if(err) return console.log(err)
    })
    //send false for user logged out
    res.send({bool : false})
})

app.get('/sessionUser',(req,res)=>{
    //check if a user is logged in
    if(req.session.userName){
        // console.log(req.session.userName); //delete this line
        //keep this logged in user session activated
        res.send({userName: req.session.userName})
    }else{
        // console.log(req.session.userName);
        res.send({message: 'no user'})
    }
})
