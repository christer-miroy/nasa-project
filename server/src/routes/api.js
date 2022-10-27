/* Versioning Node APIs */
const express = require('express');

const planetsRouter = require('./planets/planets.router'); //import planets.router.js
const launchesRouter = require('./launches/launches.router'); //import planets.router.js

const api = express.Router();

api.use('/planets', planetsRouter);
api.use('/launches', launchesRouter);

module.exports = api;