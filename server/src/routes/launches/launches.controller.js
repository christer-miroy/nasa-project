const {
    getAllLaunches,
    existLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch
} = require('../../models/launches.model');

const {
    getPagination
} = require('../../services/query') //pagination

async function httpGetAllLaunches(req, res) {
    //pagination
    const { skip, limit } = getPagination(req.query);
    const launches = await getAllLaunches(skip, limit)
    return res.status(200).json(launches);
}

async function httpAddNewLaunch(req, res) {
    const launch = req.body;
    //data validation
    if (!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required launch property',
        });
    }
    //valid launch date
    launch.launchDate = new Date(launch.launchDate); //convert to date object
    if (isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date'
        })
    } //isNaN(Not a Number) - will return true if the launchDate is not successfully parsed as a valid date
    await scheduleNewLaunch(launch);
    console.log(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req, res) {
    const launchId = Number(req.params.id); //convert flight number from string to number
    const existLaunch = await existLaunchWithId(launchId);

    //if launch doesn't exist
    if (!existLaunch) {
        return res.status(404).json({
            error: 'Launch not found',
        });
    }
    
    //if launch does exist
    const aborted = await abortLaunchById(launchId);
    if (!aborted) {
        return res.status(400).json({
            error: 'Launch not aboted',
        })
    }
    return res.status(200).json({
        ok: true,
    });
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
};