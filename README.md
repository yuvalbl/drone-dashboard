# Drone Dashboard
[Angular-Cesium](https://tgftech.github.io/angular-cesium/) Demo 

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Scenario - Drone movement track simulation

Data is of 2 types of entities: drones and pads
Each pad is a place for a drone to charging. Pad have 2 drone spots
Drones traveling around from pad to pad (randomly selected). they are either landing and charging or - moving to next pad destination

Data is changing on interval - "round"
On each round a drone is on movement - it's fuel is reduce (by 0.01)
On each round a drone landed on a pad spot - it's battery is increasing (charging)

### Demo
See [Here](https://yuvalbl.github.io/drone-dashboard/)

## Deployment to Github Pages
```
npm run build-gp
npm run deploy-gp
```
See [angular-cli-ghpages](https://alligator.io/angular/deploying-angular-app-github-pages/)
