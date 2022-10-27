const axios = require('axios');

const launchesDatabase = require('./launches.mongo'); //imports Launch model from launges.mongo file
const planets = require('./planets.mongo'); //ensure the target planet exists in planets database

const DEFAULT_FLIGHT_NUMBER = 100;

const SPACEX_API_URL = 'https://api.spacexdata.com/v4/launches/query';

async function populateLaunches() {
    console.log('Downloading Launch Data...');
    const response = await axios.post(SPACEX_API_URL, {
        query: {},
        options: {
            pagination: false, //turn off pagination
            populate: [
                {
                    path: 'rocket',
                    select: {
                        name: 1
                    }
                },
                {
                    path:'payloads',
                    select: {
                        'customers': 1
                    }
                }
            ]
        }
    });
    //data validation
    if (response.status !== 200) {
        console.log('Problem downloading launch data');
        throw new Error('Launch data download failed!');
    }

    const launchDocs = response.data.docs;
    for(const launchDoc of launchDocs) {
        const payloads = launchDoc['payloads'];
        const customers = payloads.flatMap((payload) => {
            return payload['customers'];
        });

        //convert launchDoc into launch object that can be saved in the database
        const launch = {
            flightNumber: launchDoc['flight_number'],
            mission: launchDoc['name'],
            rocket: launchDoc['rocket']['name'],
            launchDate: launchDoc['date_local'],
            upcoming: launchDoc['upcoming'],
            success: launchDoc['success'],
            customers
        };
        console.log(`${launch.flightNumber}, ${launch.mission}`);
        
        await saveLaunch(launch);
    }
}

async function loadLaunchData() {
    const firstLaunch = await findLaunch({
        flightNumber: 1,
        rocket: 'Falcon 1',
        mission: 'FalconSat'
    });
    if (firstLaunch) {
        console.log('Launch data already loaded!');
    } else {
        await populateLaunches();
    }
}

//minimize API load
async function findLaunch(filter) {
    return await launchesDatabase.findOne(filter);
}

//search for the existing launch id
async function existLaunchWithId(launchId) {
    return await findLaunch({
        flightNumber: launchId,
    });
}

//auto increment flight number
async function getLatestFlightNumber() {
    const latestLaunch = await launchesDatabase
        .findOne()
        .sort('-flightNumber'); //-flightNumber: sort in descending order ; flightNumber: sort in ascending order (default)
    if (!latestLaunch) {
        return DEFAULT_FLIGHT_NUMBER;
    }
    return latestLaunch.flightNumber;
}

//get all launches
async function getAllLaunches(skip, limit) {
    return await launchesDatabase
    .find({
        //find all documents in launches collection
    }, {
        /* projection: hide _id and __v */
        '_id': 0,
        '__v': 0
    })
    .sort({
        // sort in assorting order
        flightNumber: 1
    })
    //pagination
    .skip(skip) //how many documents were skipped
    .limit(limit); //show max 50 items per page
}

async function saveLaunch(launch) {   
    await launchesDatabase.findOneAndUpdate({
        /* if launch is existing in database */
        flightNumber: launch.flightNumber,
    }, launch, {
        upsert: true 
    });
}

//set launches in launches map
async function scheduleNewLaunch(launch) {
    const planet = await planets.findOne({
        keplerName: launch.target,
    });

    if (!planet) {
        throw new Error('No matching planet found!');
    }
    const newFlightNumber = await getLatestFlightNumber() + 1;

    const newLaunch = Object.assign(launch, {
        success: true,
        upcoming: true,
        customers: ['Zero to Mastery', 'NASA'],
        flightNumber: newFlightNumber
    });

    await saveLaunch(newLaunch)
}

//abort launch function
async function abortLaunchById(launchId) {
   const aborted = await launchesDatabase.updateOne({
    flightNumber: launchId,
   }, {
    upcoming: false,
    success: false,
   });

   return aborted.modifiedCount === 1;
}

module.exports = {
    loadLaunchData,
    existLaunchWithId,
    getAllLaunches,
    scheduleNewLaunch,
    abortLaunchById,
};