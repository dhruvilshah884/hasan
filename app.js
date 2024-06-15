const express = require('express')
const app = express();
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const User = require('./models/user');
const cors = require('cors');
app.use(cors())

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
mongoose.connect(process.env.mongo_url).then(()=>{
    console.log('database connected')
})
app.get('/',(req,res)=>{
    res.status(201).json({message:"hello hasan"})

})
app.post('/signup',async(req,res)=>{
    let {name,email,password} = req.body;
    const token = jwt.sign({email},'sjkvdbaskjdvakjs',{expiresIn:'1h'})
    const user = await new User({name,email,password,token})
    await user.save();
    res.status(201).json(user)
})
app.post('/login', async (req, res) => {
    let { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user not found" });
        }
        if (user.password !== password) {
            return res.status(400).json({ message: "password is incorrect" });
        }
     
        return  res.status(201).json({message:"user login successfully",user})
    
    } catch (error) {
       return res.status(500).json({ message: error.message });
    }
});
app.listen(8000,()=>{
    console.log('connected')
})