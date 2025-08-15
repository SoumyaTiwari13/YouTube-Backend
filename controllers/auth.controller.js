import jwt from 'jsonwebtoken';
import  User from '../models/User.js';
import bcrypt from 'bcrypt';


export async function register(req, res) {
  try {
    const { username, email, password, avatar } = req.body;
    const data = await User.findOne({ email });
    if (data) {
      return res.status(409).json({ "Message": "User Already exists" })
    }
    else {
      const user = await User.create({
        userId: `user_${Date.now()}`,
        username,
        email,
        avatar,
        password: bcrypt.hashSync(password, 10)
      });
      return res.status(201).json({ "Message": "User Created successfully" })
    }
  }
  catch (err) {
    return res.status(500).json({ "message": "Server error", err })
  }
}


export async function login(req,res){
    try{
        let {email,password} = req.body;
        let data = await User.findOne({email});
        if(!data){
            return res.status(404).json({"Message":"User doesnot exist"})
        }else{
            let validPassword = bcrypt.compareSync(password, data.password);
            if(!validPassword){
                return res.status(403).json({"Message":"Invalid Password"})
            }
            // jwt token create
            const token = jwt.sign({id: data._id}, 'SECRETKEY', {expiresIn: '1hr'});

            res.status(200).json({
                user:{
                    email: data.email,
                    fullName: data.fullName
                },
                accesstoken: token
            })
        }
    }
    catch(err){
        return res.status(500).json({"message":"Server error" , err})
    }
  }



export async function me(req, res){
  const user = await User.findById(req.user.id).select('-password');
  res.json({ user });
};
