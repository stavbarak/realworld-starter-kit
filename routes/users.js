const express = require('express');
const router = express.Router();
const { createClient } = require('redis');


const client = createClient({
    url: process.env['REDIS_URL']
});

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
    
    // TODO perform validation
    const { username, email, password } = req.body.user;

    try {
        await connectRedis();
        await client.hSet(username, 
            'username', username, 
            'email', email, 
            'password', password);
        res.status(201).json({
            message: 'User created successfully'
        });
    } catch (err) {
        res.status(500).json({
            message: 'Internal server error'
        });
    }
    
})

router.get('/', (req, res, next) => {

});

module.exports = router;