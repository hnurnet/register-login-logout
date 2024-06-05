import express, { response } from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
import jwt, { decode } from "jsonwebtoken";
import db from "./database/db.js";
const salt = 10;


const app = express();
app.use(cors({
    origin:"http://localhost:3000",
    methods:["GET","POST"],
    credentials: true
}))
app.use(express.json());
app.use(cookieParser());

const verifyUser = (req,res,next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json({message: "You are not authenticated!"})
    }
    else{
        jwt.verify(token, "jwt-secret-key",(err,decoded) =>{
            if(err){
                return res.json({message: "Authentication Error."})
            }
            else{
                req.name = decoded.name;
                next()
            }
        })
    }
}

app.get("/", verifyUser,(req,res) => {
    return res.json({status: "Success", name:req.name});
})


app.post("/register", (req,res) => {
    const sql = "INSERT INTO login (`name`,`email`,`password`) VALUES (?)";
    bcrypt.hash(req.body.password, salt, 
    (err,hash) => {if(err) return res.json({Error: "Error for hashing password!"});
    const values = [req.body.name,req.body.email,hash]
    db.query(sql,[values], (err,result) => {
        if(err) return res.json({Error: "Inserting Data Error"})
            return res.json({status: "Success"})
    })
    });
})

app.post("/login", (req,res) => {
    const sql = "SELECT * FROM login WHERE email = ?";
    db.query(sql,[req.body.email], (err,data) => {
        if(err) return res.json({Error: "Login error in the server!"});
        if(data.length > 0){
            bcrypt.compare(req.body.password, data[0].password, 
                (err,response) => {
                    if(err) return res.json({Error: "Password Compare Error!"});
                    if(response){
                        const name = data[0].name;
                        const token = jwt.sign({name}, "jwt-secret-key", {expiresIn: "1d"});
                        res.cookie("token", token);
                        return res.json({status: "Success"})
                    }
                    else {
                        return res.json({Error: "Password Not Matched!"})
                    }
            })

        }
        else {
            return res.json({Error: "No Email Existed!"})

        }
    })
})

app.get("/logout", (req,res) => {
    res.clearCookie("token");
    return res.json({status: "Success"});

})





app.listen(8800, () => console.log("server Connected on post 8800!"))