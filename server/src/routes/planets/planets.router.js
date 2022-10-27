const express = require('express');
const {
    httpGetAllPlanets,
} = require('./planets.controller'); //call specific function in planets.controller file
const planetsRouter = express.Router();

/*define all routes*/
planetsRouter.get('/', httpGetAllPlanets);

module.exports = planetsRouter;