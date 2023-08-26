const express = require('express')
const router = express.Router()
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const JWT_SECRET = 'Harshisagood$boy'
const fetchuser = require('../middleware/fetchuser')

router.post('/createuser',[
    body('email','Enter a Valid Email').isEmail(),
    body('name','Enter a Valid Name').isLength({ min:3 }),
    body('password','Enter a Valid Password').isLength({ min:5 })
],async (req,res)=>{
    let success = false;
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({success, errors: errors.array()})
}
try{
let user = await User.findOne({email: req.body.email});
if(user){
    return res.status(400).json({success, error: 'Sorry a user with this email already exists.'})
}
const salt = await bcrypt.genSalt(10)
const secPass = await  bcrypt.hash(req.body.password, salt)
user = await User.create({
    name: req.body.name,
    password: secPass,
    email: req.body.email,
// }).then(user => res.json(user))
// .catch(err => {console.log(err)
// res.json({error: 'Sorry a user with this email already exists.'})})

})

const data = {
 user: {
    id:user.id
 }
}
console.log(user)
// const jwtData = jwt.sign(data, JWT_SECRET)
// console.log(jwtData)
const authtoken = jwt.sign(data, JWT_SECRET)
// console.log(jwtData)
// res.json(user)
success = true;
res.status(200).json({ success, authtoken, user });

} catch (error){
    console.error(error.message)
    res.status(500).send("Internal Server Error")
} 
})
router.post('/login',[
    body('email','Enter a Valid Email').isEmail(),
   
    body('password','Password cannot be blank.').exists()
],async (req,res)=>{
    let success = false
const errors = validationResult(req);
if(!errors.isEmpty()){
    return res.status(400).json({success, errors: errors.array()})
}

const {email,password} = req.body;
// const {email, password} = req.body;
try{
    
 let user = await User.findOne({email});
//  let email = user.email
//  console.log(email)
 if(!user){
    success = false;
    return res.status(400).json({success, error: 'Please login with right credentials.'})
}
const passwordCompare = await bcrypt.compare(password, user.password);
// console.log(password)
// console.log(user.password)
if(!passwordCompare){
    success = false;
    return res.status(400).json({success, error: 'Please login with right credentials.'})
}
const data = {
    user: {
       id:user.id
    }
   }
   console.log(user)
//    console.log(data)
   const authtoken = jwt.sign(data, JWT_SECRET)
   success = true;
   res.status(200).json({ success, authtoken, user });

}catch (error){
    console.error(error.message)
    res.status(500).send("Internal Server Error")
} 

})

router.post('/getuser', fetchuser, async(req,res) =>{

    // const {id} = req.body;
 try{
    
//  userid = id;
 userid = req.user.id;
 console.log(userid)
 const user2 = await User.findById(userid).select("-password")
 res.send(user2)
 }catch(error){
 console.error(error.message);
 res.status(500).send("Internal Server Error")
 }
}
    
)


module.exports = router