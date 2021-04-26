import PoweredUP from 'node-poweredup'
const poweredUP = new PoweredUP();

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

  const SPEED_X = 50;
  const SPEED_Y = 99;

  const RIGHT = -1;
  const LEFT = 1;
  const UP = -1;
  const DOWN = 1;

  const SPACE = 2;
  const FONT_WIDTH = 10;
  const FONT_HEIGHT = 20;

  /**
   * 460 = 46 mm  ==> FONT_WIDTH = 1 mm
   * FONT_HEIGHT = 8 mm  ==> 2,5 = 1 mm
   */

  /**
   * move mm in X direction (speed determines direction)
   */
  const moveX = async (distance: number, direction: -1 | 1) => {
    x += distance * direction * -1;
    // if (distance <= MAX_X_DISTANCE) {
    await motorX.rotateByDegrees(distance * FONT_WIDTH, SPEED_X * direction);
    console.log(`moving X: distance ${distance} in ${direction > 0 ? 'left'
        : 'right'} direction`);
    // }
    if (distance < 0) {
      throw new Error("cannot move to negative x position");
    }
    console.log({x, y});
  }

  const moveY = async (distance: number, direction: -1 | 1) => {
    y += distance * direction;
    if (y >= 0) {
      await motorY.rotateByDegrees(distance * 3, SPEED_Y * direction);
      console.log(
          `moving Y: distance ${distance} ${direction > 0 ? 'down' : 'up'}`);
    }
    console.log({x, y});
  }

  const turnX = async () => await motorX.rotateByDegrees(360, -10);
  const turnY = async () => await motorY.rotateByDegrees(360, 10);

  const turnMeasured = async (axis:string, degrees:number, speed:number) => {
    const hrStart = process.hrtime();
    if (axis === 'X') await motorX.rotateByDegrees(degrees, speed);
    if (axis === 'Y') await motorY.rotateByDegrees(degrees, speed);
    const hrEnd = process.hrtime(hrStart);
    console.info('Execution time (hr): %ds %dms', hrEnd[0], hrEnd[1] / 1000000)

    //x: 2s 833ms 2833ms 37.5mm speed 10
    //y: 1s 619ms 1619ms 90.5mm speed 10
  }

  let penUp = true;
  const pen = async () => {
    await motorPen.rotateByDegrees(180, FONT_WIDTH);
    penUp = !penUp;
    console.log(`moving pen ${penUp ? 'up' : 'down'}`);
  }

  async function square() {
    await moveX(20, RIGHT);
    await moveY(20, DOWN);
    await moveX(20, LEFT);
    await moveY(20, UP);
  }

  console.log("Connected");
  // await pen()
  await turnMeasured('X', 360, -10);
  await turnMeasured('Y', 360, 10);
  // await turnY();
  // await pen();
});

poweredUP.scan(); // Start scanning for Hubs
console.log("Scanning for Hubs...");



