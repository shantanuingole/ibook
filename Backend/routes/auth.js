const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "shantanu@1" ;
//create user
router.post('/createuser' ,
    [
        body('name').isLength({min : 3}),
        body('email').isEmail(),
        body('password').isLength({min : 5})
    ] ,
    async(req,res)=>{
     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {

    
   let user =  await User.findOne({email : req.body.email}) ;
   if(user){
    return res.status(400).json({error : "sorry email already exist !"})
   }

   const salt = await bcrypt.genSalt(10) ;
   const secPass = await bcrypt.hash(req.body.password , salt) ;

     user = await User.create({
      name: req.body.name,
      password: secPass,
       email: req.body.email,
    });

    const data = {
    user : {
      id  : user.id
    }
  }

  const authtoken = jwt.sign(data , JWT_SECRET);

res.json(authtoken) ;

}
catch(error)
{
  console.error(error.message) ;
  res.status(500).send("internal error") ;
}
})

//authentication login 

router.post('/login' ,
    [
        
        body('email' , 'enter the valis email').isEmail(),
        body('password' ,'password cannot be blank').exists(),
    ] ,
    async(req,res)=>{

     const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
const {email , password} = req.body ;

try {

  let user =  await User.findOne({email});
  if(!user)
  {
    return res.status(400).json({error : "enter correct cerendetials"}) ;
  }

  const passwordCompare = await bcrypt.compare(password,user.password) ;

  if(!passwordCompare)
  {
     return res.status(400).json({error : "enter correct password cerendetials"}) ;
  }

  const data = {
    user : {
      id  : user.id
    }
  }

  const authtoken = jwt.sign(data , JWT_SECRET);

res.json({authtoken}) ;


}

catch(error)
{
   console.error(error.message) ;
  res.status(500).send("internal error") ;

}


  })
//getting user details 


router.post('/getuser' ,fetchuser,
    
    async(req,res)=>{
try {
  userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)


  
} catch (error) {

  console.error(error.message) ;
  res.status(500).send("internal error") ;

  
}
    })


module.exports = router