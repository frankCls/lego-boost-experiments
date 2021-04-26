import PoweredUP, {Consts} from 'node-poweredup'

const poweredUP = new PoweredUP();
const BrakingStyle = Consts.BrakingStyle;

const LED = "HUB_LED";
const MOTOR_A = "A";
const MOTOR_B = "B";
const EXTERNAL_MOTOR = "D";
const COLOR_DISTANCE_SENSOR = "C";
const TILT_SENSOR = "TILT_SENSOR";

const UP = "up";
const DOWN = "down";
const MAX_X_DISTANCE = 460; // 46 mm

poweredUP.on("discover", async (hub) => { // Wait to discover a Hub
  console.log(`Discovered ${hub.name}!`);
  await hub.connect(); // Connect to the Hub
  console.log(`battery level: ${hub.batteryLevel}%`);
  const motorX = await hub.waitForDeviceAtPort(EXTERNAL_MOTOR);
  const motorPen = await hub.waitForDeviceAtPort(MOTOR_A); // Make sure a motor is plugged into port A
  const motorY = await hub.waitForDeviceAtPort(MOTOR_B); // Make sure a motor is plugged into port B

  let x = 0; //keep track of x position
  let y = 0; //keep track of y position
  const position = {
    x: 0,
    y: 0
  }

  //combined speed and time for 1 cm move in both directions (x, y)

  const SPEED_X = 65;
  const SPEED_Y = 30;

  // const Calibrated = {
  //   speed: {
  //     x: 65,
  //     y: 30
  //   },
  //   time: 250 * 2 / 30
  // }

  const DISTANCE_MULTIPLIER_X = 10;
  const DISTANCE_MULTIPLIER_Y = 4.5;

  const RIGHT = -1;
  const LEFT = 1;
  const UP = -1;
  const DOWN = 1;

  let penUp = true;
  const pen = async () => {
    await motorPen.rotateByDegrees(180, 100);
    penUp = !penUp;
    console.log(`moving pen ${penUp ? 'up' : 'down'}`);
  }

  const calculateSpeed = (axis:string, distance:number, time:number) => {
    if (axis === 'X') {
      return (distance * time * 37.5) / 2833;
    }
    if (axis === 'Y') {
      // return (distance  * 90.5) / (1619 * time);
      return (time / distance) / (90.5 / 1619);
    }
  }
  /**
   * X calculations
   * dist: 37.5 mm in 2833 ms by speed 10   *
   * speed 1 => dist 3.75 mm in 283.3 ms
   * distance 1 mm in 2833/37.5 ms by speed 10
   * distance 37.5/2833 mm in 1 ms by speed 10
   *
   * Y calculations
   * dist: 90.5 mm in 1619 ms by speed 10
   * speed 1 => dist: 9.05 mm in 161.9 ms
   * dist 1 mm in 1619/90.5 ms by speed 10
   * dist 90.5/1619 mm in 1 ms by speed 10
   */

  const calculateTime = (axis: string, distance: number, speed: number) => {
    if (axis === 'X') {
      return (2833 / 37.5) * (distance / speed);
    }
    if (axis === 'Y') {
      return (1619 / 90.5) * (distance / speed);
    }
  }

  const calculateDistance = (axis: string, time: number, speed: number) => {
    if (axis === 'X') {
      return 2833 / 37.5 * speed * time;
    }
    if (axis === 'Y') {
      return 1619 / 90.5 * speed * time;
    }
  }

  //x:  2833ms 37.5mm speed 10 => 1mm in 2833/37.5
  //y:  1619ms 90.5mm speed 10 => 1mm in 1619/90.5
  const moveTo = async (x: number, y: number) => {
    const distX = Math.abs(x - position.x);
    const distY = Math.abs(y - position.y);
    const dirX = position.x <= x ? RIGHT : LEFT;
    const dirY = position.y <= y ? DOWN : UP;
    const distance = Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2));

    let speedX = 55, speedY = 0;
    let time;
    time = calculateTime('X', distX, speedX);
    // speedY = calculateSpeed('Y', distY, time);
    speedY = speedX / 2;

    console.log("distX:", distX, "distY:", distY);
    console.log("dirX:", dirX, "dirY:", dirY);
    console.log("distance:", distance);
    console.log("speed:", speedX, speedY);
    console.log(time);
    motorX.setBrakingStyle(BrakingStyle.BRAKE);
    motorY.setBrakingStyle(BrakingStyle.BRAKE);
    motorY.setPower(speedY * dirY);
    motorX.setPower(speedX * dirX);
    await hub.sleep(time);
    motorX.brake();
    motorY.brake();
    // await pen();
    position.x = x;
    position.y = y;
    console.log(position);
  }


  console.log("Connected");

// await moveXY();
  // await square();
  // await moveXY2();
  // await squareTimed(7)
  // await pen()
  await moveTo(200, 0);
  await pen()
  await moveTo(400, 200);
  await moveTo(200, 400);
  await moveTo(0, 200);
  await moveTo(200, 0);
  // await moveCombined(4);
  await pen();
  process.exit();

});

poweredUP.scan(); // Start scanning for Hubs
console.log("Scanning for Hubs...");



