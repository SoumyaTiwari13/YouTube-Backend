import jwt from 'jsonwebtoken';
import  User  from '../models/User.js';

export function auth (req, res, next) {
   if (
        req.headers &&
        req.headers.authorization &&
        req.headers.authorization.split(' ')[0] === "JWT"
    ) {
        jwt.verify(req.headers.authorization.split(' ')[1] , 'SECRETKEY', 
        function (err, auth) {
            if(err){
                return res.status(403).json({message: "TOKEN IS INVALID"})
            }
            console.log(auth, "auth");
            User.findById(auth.id)
            .then((user)=>{
                req.user = user;
                next();
            })
        })
    }
    else {
        return res.status(404).json({ message: "TOKEN DOES NOT EXIST" })
    }
};
