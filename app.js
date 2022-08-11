const express = require('express');
const app = express();
const usersRouter = require('./routes/users');

// TODO serve static files
// TODO load config from file
// TOdo validate config

app.use(express.json());

app.use('/api/users', usersRouter);
app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
})