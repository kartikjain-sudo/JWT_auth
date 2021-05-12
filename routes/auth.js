const router = require('express').Router()
const User = require('../model/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation')

router.post('/register', async (req, res) => {
    // res.send("<h1>Welcome</h1>");

    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if email already exist
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) return res.status(400).send('Email already exist');

    //Password Hashing
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });
    try {
        const savedUser = await user.save();
        res.send(/*savedUser*/ {user: user._id});
    } catch(err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {

    const {error} = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //check if email already exist
    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send('Email does not exist');

    //checking Password
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.status(400).send('Wrong Password');

    //CREATE and design token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET)
    res.header('auth-token', token).send(token);
    // res.send('Success');
});

// router.get('/', (req, res) => {
//     res.send("<h1>Welcome</h1>")
// })

module.exports = router;