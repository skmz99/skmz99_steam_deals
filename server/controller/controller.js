// const bcrypt = require('bcrypt');
// const saltRounds = process.env.SALTROUNDS;
// const path = require('path')
// // require ('dotenv').config({path: path.resolve(__dirname,'../.env')});

// // var mysql = require('mysql2');
// // const con = mysql.createConnection({
// //     host: process.env.HOST,
// //     user: process.env.USER,
// //     database: process.env.DATABASE,
// //     password: process.env.PASSWORD,
// //     port: process.env.PORT,           
// // })


// const checkUser = (req,res,next)=>{
//     req.session.userName = req.body.username
//     req.session.save((err)=>{
//         if(err) console.log(err)
//     })
// }

// const enterUser = (req,res,next)=>{ 
//     con.connect((err)=>{    
//         if(err) throw err;
//         con.query(process.env.CREATETABLE,(err)=>{
//             if(err) throw err;
//         })
//         bcrypt.hash(req.body.passWord,parseInt(saltRounds),(err,hash)=>{
//             if(err) return console.log(err)
//             con.query(`INSERT INTO users (userName,passWord) VALUES (?,?);`,[req.body.username,hash],(err,result)=>{
//                 if(err) return res.send({message: err.message});
//                 return console.log("\x1b[42m",`User: ${req.body.username} has created an account`,result,'\x1b[0m');
//             })
//         })
//     })
// }

// const insertWishlist = (req,res,next)=>{
//     if(req.session.userName){
//         console.log(req.session)
//     }else{
//         console.log(req.sessionID)
//     }
// }


// module.exports = {enterUser, checkUser, insertWishlist}; 