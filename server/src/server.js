const http = require('http');

require('dotenv').config(); //call dotenv

const app = require('./app');

const { mongoConnect } = require('./services/mongo');
const { loadPlanetsData } = require('./models/planets.model');
const { loadLaunchData } = require('./models/launches.model')

const PORT = process.env.PORT || 8000; //default backend server port: 8000 (unless stated by PORT)

const server = http.createServer(app);

async function startServer() {
    //connect to Mongoose
    await mongoConnect();
    await loadPlanetsData();
    /* populate database with historical data fetched from SpaceX APi */
    await loadLaunchData();

    server.listen(PORT, () => {
        console.log(`Listening on port ${PORT}...`);
    });
}

startServer();