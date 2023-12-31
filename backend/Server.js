const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('./models/userSchema')

const SECRET_KEY = 'secretkey'


// Connect to Express App
const app = express()



// Connect to MongoDB
const dbURI = 'mongodb+srv://ahmeddheesham:Ah12345@brngit.ba0zymo.mongodb.net/Brngit?retryWrites=true&w=majority'
mongoose
.connect(dbURI, {
    useNewUrlParser: true,
    useunifiedTopology: true
})
.then( () => {
    app.listen(3001, () => {
        console.log("Server is connected to port 3001 and connected to mongoDB")
    })
})

.catch( (error) => {
    console.log("Unable to connect to Server and/or MongoDB")
})




// Middleware
app.use(bodyParser.json())
app.use(cors())




// Routes

// User Registration
// Post Register

app.post('/register', async (req,res) => {
    try {
        const { email, username, password } = req.body
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = new User({ email, username, password: hashedPassword})
        await newUser.save()
        res.status(201).json({ message: 'User created Successfully'})
    } catch(error) {
        res.status(500).json({ message: 'Error Signning up'})
    }

})


// Get Registered Users
app.get('/register', async (req,res) => {
    try {
        const users = await User.find()
        res.status(201).json(users)
    } catch(error) {
        res.status(500).json({ message: 'Unable to get Users'})
    }
})



// Get login
app.post('/login', async (req,res) => {
    try {
        const { username, password } = req.body
        const user = await User.findOne({username})
        if(!user) {
            return res.status(401).json({ error: 'Invalid credemtials'})
        }
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if(!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid credemtials'})
        }
        const token = jwt.sign({ userId: user._id}, SECRET_KEY, { expiresIn: '1hr'})
        res.json({ message: 'Login Successful'})
    } catch(error) {
        res.status(500).json({ message: 'Error logging in'})
    }

})








