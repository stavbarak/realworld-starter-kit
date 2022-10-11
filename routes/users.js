const express = require('express');
const router = express.Router();
const { createClient } = require('redis');
const jwt = require('jsonwebtoken');


const client = createClient({
    url: process.env['REDIS_URL']
});

const JWT_SECRET = process.env['JWT_SECRET'];

client.on('error', (err) => {
    console.log('Error ' + err);
});

let connected = false;

const connectRedis = async () => {
if(connected) return;
connected = true;
return await client.connect();
}

// {
    //     "user":{
    //       "username": "Jacob",
    //       "email": "jake@jake.jake",
    //       "password": "jakejake"
    //     }
    //   }
router.post('/', async (req, res, next) => {
    
    // TODO perform validation on the object
    if(typeof req.body.user !== 'object') {
        return res.status(400).json({
            message: 'Bad request'
        });
    }

    const { username, email, password } = req.body.user;
    console.log(username, email, password);
    try {
        await connectRedis();
        await client.hSet(email, {username, email, password});

        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (err) {
        console.error('ERROR', err);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
    
})

router.post('/login', async (req, res, next) => {
    const { email, password: providedPassword } = req.body.user;

    try {
        await connectRedis();
        const {username, password} = await client.hGetAll(email);
        console.log(password, providedPassword);
        if(providedPassword !== password) {
            return res.status(401).json({
                message: 'Invalid credentials'
            });
        };
        const token = jwt.sign({username, email}, JWT_SECRET);
        res.status(200).json({
            email,
            username,
            token
        });

    } catch (err) {
        console.error('ERROR', err);
        res.status(500).json({
            message: 'Internal server error'
        });
    }
});

router.get('/user', (req, res, next) => {
    const token = req.get('authorization').split(' ')[1];
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
        if(err) {
            return res.status(401).json({
                message: 'Not authenticated'
            });
        }
        const {email} = decoded;
        await connectRedis(); // TODO extract redis logic to a data plugin
        const userData = await client.hGetAll(email);
        res.status(200).json(userData);
    });
});

module.exports = router;