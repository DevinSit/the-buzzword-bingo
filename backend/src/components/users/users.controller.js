/* Controller that manages the state of which users are connected and which users
 * have successfully won a round of bingo.
 *
 * Note that this is currently designed to run inside GCP Cloud Run.
 * That is, having the users and winners lists in memory is a deliberate design decision.
 *
 * This way, when a user connects to the frontend, they'll likely get a clean slate of users
 * and winners because Cloud Run will have terminated any previous instances of the backend
 * (because this isn't meant to be a high traffic app).
 *
 * As such, we don't need to deal with expiring caches or anything;
 * Cloud Run's architecture does this for us.
 *
 * And this whole clearing of users/winners is fine, since this is
 * just a demo app that isn't meant to be long living.
 */

const express = require("express");
const router = express.Router();

let users = [];
const winners = [];

// Get the current state of users and winners.
router.get("/", (req, res) => {
    res.send({status: "success", users, winners});
});

// Add a user to the list of connected users.
// Return the users and winners state for ease of use on the frontend.
router.post("/", (req, res) => {
    users.push(String(req.body.username));
    res.send({status: "success", users, winners});
});

// Remove a user from the list of connected users.
router.delete("/", (req, res) => {
    users = users.filter((username) => username !== String(req.body.username));
    res.send({status: "success", users});
});

// Add a user to the list of winners.
router.post("/winners", (req, res) => {
    winners.push(String(req.body.username));
    res.send({status: "success", winners});
});

module.exports = router;
