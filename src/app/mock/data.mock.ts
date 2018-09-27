/*
	Drone movement track simulation
	Data is of 2 types of entities: drones and pads
	Each pad is a place for a drone to refuel. Pad have 2 drone spots
	Drones traveling around from pad to pad. they are either landing and refueling or - moving to next pad destination

	Data is changing on interval - "round"
	On each round a drone is on movement - it's fuel is reduce (by 0.01)
	On each round a drone landed on a pad spot - it's fuel is increasing (refueling)
 */
// number of drones
export const roundInterval = 500;

// drone step per round (in coordinates)
const DRONE_DEFAULT_STEP = 0.0001;
let droneStep;
// number of drones
let numOfDrones;
// number of pads
let numOfPads;

// geo-limits
export const area = {
  latHigh: 36.723194994175024,
  latLow: 36.270568176301566,
  longHigh: -119.7780526060547,
  longLow: -120.38131790314623
};

export let entities;

export function initData(drones = 100, pads = 100, speed = 1) {
  // reset entities (window is for dev only)
  window['entities'] = entities = {
    mapById: {},
    pads: [],
    availablePads: [],
    drones: [],
  };

  numOfDrones = drones;
  numOfPads = pads;
  droneStep = DRONE_DEFAULT_STEP * speed;
  initDrones();
  initPads();
  entities.availablePads.sort(() => (Math.random() > .5) ? 1 : -1);
}

function uniqueID() {
  let id = Math.random().toString(15).substring(2);
  while (entities.mapById[id]) {
    id = Math.random().toString(15).substring(2);
  }
  return id;
}


function initDrones() {
  const latGap = Math.abs(area.latHigh - area.latLow);
  const longGap = Math.abs(area.longHigh - area.longLow);

  for (let i = 0; i < numOfDrones; i++) {
    const drone = {
      id: `dr-${uniqueID()}`,
      type: 'drone',
      location: {
        lat: area.latLow + latGap * Math.random(),
        long: area.longLow + longGap * Math.random(),
      },
      destination: {
        padId: null,
        lat: null,
        long: null
      },
      comStatus: Math.random() * 100,
      battery: 100,
      isLanded: true
    };
    entities.mapById[drone.id] = drone;
    entities.drones.push(drone);
  }
}

function initPads() {
  const latGap = Math.abs(area.latHigh - area.latLow);
  const longGap = Math.abs(area.longHigh - area.longLow);
  const padsPerLatLine = Math.floor(Math.sqrt(numOfPads - numOfPads / 10));
  const padsPerLongLine = Math.floor(numOfPads / padsPerLatLine);
  // const padsPerLatLine = 7;

  for (let i = 0; i < numOfPads; i++) {
    const pad = {
      id: `pd-${uniqueID()}`,
      type: 'pad',
      location: {
        lat: area.latLow + latGap * Math.floor(i / padsPerLatLine) / padsPerLongLine,
        long: area.longLow + longGap * (i % padsPerLatLine / padsPerLatLine),
      },
      comStatus: Math.random() * 100,
      availableSpot: 2,
    };
    entities.mapById[pad.id] = pad;
    entities.pads.push(pad);
    entities.availablePads.push(pad);
  }
}

export function playRound() {
  // const startTime = Date.now();
  playPads();
  playDrones();
  // console.log(`CALCULATING ROUNDS IN MS. : ${Date.now() - startTime}`)
  return entities;
}

function playPads() {
  let pad;
  for (let i = 0; i < numOfPads; i++) {
    pad = entities.pads[i];
    pad.comStatus = Math.random() * 100;
  }
}

function playDrones() {
  let drone;
  for (let i = 0; i < numOfDrones; i++) {
    drone = entities.drones[i];
    drone.comStatus = Math.random() * 100;

    if (drone.isLanded) {
      if (drone.battery === 100) {
        // finish recharging - pick next available pad and leave
        if (entities.availablePads.length > 0) {
          const currentPad = entities.mapById[drone.destination.padId];


          const goToPad = entities.availablePads[entities.availablePads.length - 1];
          drone.destination.padId = goToPad.id;
          drone.destination.lat = goToPad.location.lat;
          drone.destination.long = goToPad.location.long;
          drone.isLanded = false;

          // reduce availableSpot on destination
          goToPad.availableSpot--;
          if (goToPad.availableSpot === 0) {
            entities.availablePads.pop();
          }
          if (currentPad) {
            // add availableSpot on current pad
            currentPad.availableSpot++;
            entities.availablePads.push(currentPad);
          }
        }

      } else {
        // keep recharging
        drone.battery = (drone.battery + 0.2 < 100) ? drone.battery + 0.2 : 100;
      }
    } else {
      const destinationPad = entities.mapById[drone.destination.padId];
      const desLat = destinationPad.location.lat;
      const desLong = destinationPad.location.long;
      const lengthToPad = Math.abs(drone.location.lat - drone.destination.lat) +
        Math.abs(drone.location.long - drone.destination.long);
      // on movement
      if (lengthToPad < (droneStep)) {
        // destination pad reached
        drone.location.lat = desLat;
        drone.location.long = desLong;
        drone.isLanded = true;
      } else {
        // still on the way
        const latStep = droneStep * Math.random();
        const longStep = droneStep - latStep;
        drone.location.lat = (drone.location.lat < desLat) ? drone.location.lat + latStep : drone.location.lat - latStep;
        drone.location.long = (drone.location.long < desLong) ? drone.location.long + longStep : drone.location.long - longStep;
      }
      drone.battery = drone.battery - 0.1; // reduce battery (due to round movement)
    }
  }
}
