const fs = require("fs");
const path = require('path');
const { parse } = require("csv-parse"); //converting CSV text input into arrays or objects. It implements NodeJs stream API

const planets = require('./planets.mongo'); //import planets.mongo.js

//filter planets that are habitable
function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

/*
const promise = new Promise((resolve, reject) => {
    resolve(42)
});
promise.then((result) => {

});
const result = await promise;
console.log(result);
*/

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '..','..','data','kepler_data.csv')) //calls and reads the file
      .pipe(
        parse({
          comment: "#", //treat lines starting with hashtag symbol as comments
          columns: true, //return each row in the csv file as a javascript object with key value pairs.
        })
      ) //connect a readable stream source (file) to a writable stream destination (parse function). parse function is the destination.
      .on("data", async (data) => {
        if (isHabitablePlanet(data)) {
          savePlanet(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const countPlanetsFound = (await getAllPlanets()).length;
        console.log(`${countPlanetsFound} planets found!`);
        resolve();
      });
  });
}

async function getAllPlanets() {
  return await planets.find({}, {
    //projection
    //hide id and version key in postman/mongodb
    '_id': 0,
    '__v': 0,
  });
}

async function savePlanet(planet) {
  try {
    //Upsert Operation = Insert + Update
    //save to mongodb
    await planets.updateOne({
      /* Update if object exists */
        keplerName: planet.kepler_name, //must match data from kepler_data.csv file
      }, {
        /* insert if the object does not exist*/
        keplerName: planet.kepler_name,
      }, {
        upsert: true
        //enable upsert operation
    });
  } catch(err) {
    console.error(`Could not save planet ${err}`);
  }
}

module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
