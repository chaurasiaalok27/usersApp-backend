const express = require("express");
const mongoose = require('mongoose');
const cors = require('cors');


const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

const db = mongoose.createConnection('mongodb://127.0.0.1:27017/usersDb', { useNewUrlParser: true, useUnifiedTopology: true });

//Schema
const userSchema = new mongoose.Schema({
    userName: String,
    ability: String,
    task: String,
})

//Models
const userModel = db.model('user',userSchema);

//APIs

const isNullORUndefined = (val) => val === null || val === undefined;

//get all users
app.get('/users', async (req, res) => {
    const allUsers = await userModel.find();
    res.send(allUsers);
});

//add new user
app.post('/user',async (req, res) => {
    const user = req.body;
   
    const newUser = new userModel(user);
    await newUser.save();
    res.status(201).send(newUser);
});

//edit task
app.put('/user/:userid',async (req, res) => {
    const { task } = req.body;
    const userid = req.params.userid;

    try {
        const user = await userModel.findById({ _id: userid});
        if (isNullORUndefined(user)) {
             res.sendStatus(404);
        }
        else {
            user.task = task;
            await user.save();
            res.send(user);
        }
    } catch (e) {
        res.sendStatus(404);
    }
});

//delete an user
app.delete('/user/:userid',async (req, res) => {
    const userid = req.params.userid;

    try {
        await userModel.deleteOne({ _id: userid });
        res.sendStatus(200);

    } catch (e) {
        res.sendStatus(404);
    }
});

app.listen(9999);