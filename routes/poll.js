const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");
const Vote = require("../models/voto")


const Pusher = require("pusher");
var pusher = new Pusher({
    appId: '1014370',
    key: 'af7bbbb7eb67604b0148',
    secret: '7f5c7888ffcd0ea639cf',
    cluster: 'eu',
    encrypted: true
});


router.get("/", (req, res) => {
    Vote.find().then(votes => {
        res.json({success: true, votes: votes});
    });

});


router.post("/", (req, res) => {
    // save to DB
    const newVote = {
        os: req.body.os,
        points: 1
    };

    new Vote(newVote).save().then(vote => {
        pusher.trigger('os-poll', 'os-vote', {
            points: parseInt(vote.points),
            os: vote.os
        });

        return res.json({ sucess: true, message: "Thank you for voting!" });
    });

});



module.exports = router;
