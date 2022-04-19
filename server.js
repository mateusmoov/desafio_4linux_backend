const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const User = require('./models/User')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

// Credentials
const dbUser = process.env.DB_USER
const dbPassword = process.env.DB_PASS

// Mongoose Connect
mongoose
    .connect(`mongodb+srv://${dbUser}:${dbPassword}@cluster0.og2bq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`)
    .then(() => {
        console.log('Connected to Mongoose...')
    })
    .catch((err) => console.log(err))

//Login user
app.post('/api/login', async (req, res) => {
    const { name, password } = req.body

    const user = await User.findOne({ name })

    if (!user) {
        return res.status(422).json({ message: "Usuário não encontrado" });
    }

    const checkPassword = await bcrypt.compare(password, user.password)

    if (!checkPassword) {
        return res.status(422).json({ message: "Senha incorreta" });
    }

    try {
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET)
        res.header('auth-token', token).json({ token })
    } catch (err) {
        console.log(err)
    }
})
app.listen(3000, () => console.log('Server running on port 3000'))
