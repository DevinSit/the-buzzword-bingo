const express = require("express");
const router = express.Router();

let users = [];
const winners = [];

router.get("/", (req, res) => {
    res.send({status: "success", users});
});

router.post("/", (req, res) => {
    users.push(String(req.body.username));
    res.send({status: "success", users});
});

router.delete("/", (req, res) => {
    users = users.filter((username) => username !== String(req.body.username));
    res.send({status: "success", users});
});

router.get("/winners", (req, res) => {
    res.send({status: "success", winners});
});

router.post("/winners", (req, res) => {
    users.push(String(req.body.username));
    res.send({status: "success", winners});
});

module.exports = router;
