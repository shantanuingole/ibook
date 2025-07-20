const express = require('express');
const { body, validationResult } = require('express-validator');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');


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
    })
res.json(user) ;

}
catch(error)
{
  console.error(error.message) ;
  res.status(500).send("internal error") ;
}
})

module.exports = router