const express = require("express");
const router = express.Router();

let users = [];
const winners = [];

router.get("/", (req, res) => {
    res.send({status: "success", users, winners});
});

router.post("/", (req, res) => {
    users.push(String(req.body.username));
    res.send({status: "success", users, winners});
});

router.delete("/", (req, res) => {
    users = users.filter((username) => username !== String(req.body.username));
    res.send({status: "success", users});
});

router.post("/winners", (req, res) => {
    winners.push(String(req.body.username));
    res.send({status: "success", winners});
});

module.exports = router;
