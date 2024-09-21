const express = require('express');

const controller = require('./controller');

const router = express.Router();
const routerPath = "/game/dice"

router.get(`/play`, controller.diceGame);


module.exports = {
    router,
    routerPath
}
