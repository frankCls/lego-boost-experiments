import PoweredUP, {MoveHub, TachoMotor} from 'node-poweredup'

const poweredUP = new PoweredUP();

const LED = "HUB_LED";
const MOTOR_A = "A";
const MOTOR_B = "B";
const EXTERNAL_MOTOR = "D";
const COLOR_DISTANCE_SENSOR = "C";
const TILT_SENSOR = "TILT_SENSOR";

const UP = "up";
const DOWN = "down";
const MAX_X_DISTANCE = 500; // 46 mm

type InjectFunction = () => void;

export let motorX: TachoMotor;
export let motorY: TachoMotor;
export let motorPen: TachoMotor;
// export let x = 0; //keep track of x positione
// export let y = 0; //keep track of y position

export const calibration = {
  x: 360 / 37.5,
  y: 360 / 90.5
}

export const speed = {
  x: 50,
  y: 50
}

const xBoundary = 50
export const boundaries = {
  x: xBoundary,
  y: xBoundary * 1.414
}

export enum Direction {
  RIGHT,
  LEFT,
  UP,
  DOWN
}

const createInternalDirection = (direction: Direction): InternalDirection => {
  switch (direction) {
    case Direction.RIGHT:
      return {axis: 'x', value: 'right'};
    case Direction.LEFT:
      return {axis: 'x', value: 'left'};
    case Direction.UP:
      return {axis: 'y', value: 'up'};
    case Direction.DOWN:
      return {axis: 'y', value: 'down'};
  }
}

export type InternalDirection =
    { axis: 'x', value: 'right' } |
    { axis: 'x', value: 'left' } |
    { axis: 'y', value: 'up' } |
    { axis: 'y', value: 'down' };

enum MotorDirection {
  clockwise = 1,
  counterClockwise = -1
}

export const position = {
  x: 0,
  y: 0
}

export enum Orientation {
  LANDSCAPE,
  PORTRAIT
}

let orientation: Orientation = Orientation.PORTRAIT

export const checkPosition = () => {
  // if (position.x > boundaries.x) throw new Error(`${position.x} is greater than max x (${boundaries.x})`);
  // if (position.x < 0) throw new Error(`${position.x} is smaller than min x (0)`);
  // if (position.y > boundaries.y) throw new Error(`${position.y} is greater than max y (${boundaries.y})`);
  // if (position.y < 0) throw new Error(`${position.y} is smaller than mix y (0)`);
}

export let penUp = true;
export const pen = async () => {
  await motorPen.rotateByDegrees(180, 50);
  penUp = !penUp;
  console.log(`moving pen ${penUp ? 'up' : 'down'}`);
}

function logPosition() {
  const {x, y} = position;
  console.log(`actual position: x: ${x}, y: ${y}`);
}

export const moveX = async (inputDistance: number, extdirection: Direction) => {
  const direction = createInternalDirection(extdirection);
  let motorDirection = motorMapping()[direction.value];
  const distance = inputDistance * calibration.x
  position.x += inputDistance * motorDirection * -1; //right -> motor reverse direction
  checkPosition();
  await motorX.rotateByDegrees(distance, speed.x * motorDirection);
  console.log(`moving X: distance ${inputDistance} in ${direction.value} direction`);
  logPosition();
}

export const moveY = async (inputDistance: number, extdirection: Direction) => {
  const direction = createInternalDirection(extdirection);
  let motorDirection = motorMapping()[direction.value];
  const distance = inputDistance * calibration.y
  position.y += inputDistance * motorDirection;
  checkPosition()
  await motorY.rotateByDegrees(distance, speed.y * motorDirection);
  console.log(`moving Y: distance ${inputDistance} ${direction.value}`);
  logPosition();
}


const motorMapping = () => {
  if (orientation === Orientation.PORTRAIT) {
    return {
      right: -1,
      left: 1,
      up: -1,
      down: 1
    }
  } else {
    return {
      right: 1,
      left: -1,
      up: -1,
      down: 1
    }
  }
}

export const move = async (inputDistance: number, extdirection: Direction) => {
  const direction = createInternalDirection(extdirection);
  let distance;
  let motorDirection = motorMapping()[direction.value];
  distance = inputDistance * calibration[direction.axis];
  position[direction.axis] += distance * motorDirection * (direction.axis === 'x' ? -1 : 1);
  if ((orientation === Orientation.PORTRAIT && direction.axis === 'x')
      || orientation === Orientation.LANDSCAPE && direction.axis === 'y') {
    await motorX.rotateByDegrees(distance, speed.x * motorDirection);
  } else {
    await motorY.rotateByDegrees(distance, speed.y * motorDirection);
  }
  console.log(`moving X: distance ${distance} ${direction.value}`);
  logPosition();
}

export const run = (injectFunction: InjectFunction) => {
  poweredUP.on("discover", async (hub: MoveHub) => { // Wait to discover a Hub
    console.log(`Discovered ${hub.name}!`);
    await hub.connect(); // Connect to the Hub
    console.log(`battery level: ${hub.batteryLevel}%`);
    motorX = <TachoMotor>await hub.waitForDeviceAtPort(EXTERNAL_MOTOR);
    motorPen = <TachoMotor>await hub.waitForDeviceAtPort(MOTOR_A); // Make sure a motor is plugged into port A
    motorY = <TachoMotor>await hub.waitForDeviceAtPort(MOTOR_B); // Make sure a motor is plugged into port B
    const led = await hub.waitForDeviceAtPort(LED);
    // const colorDistanceSensor = await hub.waitForDeviceAtPort(COLOR_DISTANCE_SENSOR);
    // const tiltSensor = await hub.waitForDeviceAtPort(TILT_SENSOR)

    injectFunction();


  });


  poweredUP.scan(); // Start scanning for Hubs
  console.log("Scanning for Hubs...");
}