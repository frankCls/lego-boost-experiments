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
  const led = await hub.waitForDeviceAtPort(LED);
  // const colorDistanceSensor = await hub.waitForDeviceAtPort(COLOR_DISTANCE_SENSOR);
  // const tiltSensor = await hub.waitForDeviceAtPort(TILT_SENSOR);

  let x = 0; //keep track of x position
  let y = 0; //keep track of y position

  const SPEED_X = 50;
  const SPEED_Y = 50;

  const RIGHT = -1;
  const LEFT = 1;
  const UP = -1;
  const DOWN = 1;

  let FONT_WIDTH = 8;
  let FONT_HEIGHT = 19;
  const SPACE = FONT_WIDTH/4;

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

  // let dir = 1;
  async function drawO() {
    await pen();
    await moveX(FONT_WIDTH, RIGHT);
    await moveY(FONT_HEIGHT, DOWN);
    await moveX(FONT_WIDTH, LEFT);
    await moveY(FONT_HEIGHT, UP);
    await pen();
    await moveX(FONT_WIDTH + SPACE, RIGHT);
  }

  async function drawT() {
    await pen();
    await moveX(FONT_WIDTH, RIGHT);
    await pen();
    await moveX(FONT_WIDTH/2, LEFT);
    await pen();
    await moveY(FONT_HEIGHT, DOWN);
    await pen();
    await moveX(FONT_WIDTH/2 + SPACE, RIGHT);
    await moveY(FONT_HEIGHT, UP);
  }

  async function drawI() {
    await pen();
    await moveY(FONT_HEIGHT, DOWN)
    await pen();
    await moveY(FONT_HEIGHT, UP);
    await moveX(SPACE, RIGHT);
  }

  async function drawS() {
    await moveX(FONT_WIDTH, RIGHT);
    await pen();
    await moveX(FONT_WIDTH, LEFT);
    await moveY(FONT_HEIGHT/2, DOWN);
    await moveX(FONT_WIDTH, RIGHT);
    await moveY(FONT_HEIGHT/2, DOWN);
    await moveX(FONT_WIDTH, LEFT);
    await pen();
  }
  async function drawN() {
    await moveY(FONT_HEIGHT, DOWN)
    await pen();
    await moveY(FONT_HEIGHT, UP)
    await moveX(FONT_WIDTH/3, RIGHT)
    await moveY(FONT_HEIGHT, DOWN)
    await moveX(FONT_WIDTH * 2/3, RIGHT)
    await moveY(FONT_HEIGHT, UP)
    await pen()
    await moveX(SPACE, RIGHT);
  }

  async function drawA() {
    await moveY(FONT_HEIGHT, DOWN)
    await pen()
    await moveY(FONT_HEIGHT, UP)
    await moveX(FONT_WIDTH, RIGHT)
    await moveY(FONT_HEIGHT, DOWN)
    await pen()
    await moveY(FONT_HEIGHT/2, UP)
    await moveX(FONT_WIDTH, LEFT)
    await pen()
    await moveX(FONT_WIDTH, RIGHT)
    await pen();
    await moveY(FONT_HEIGHT/2, UP)
    await moveX(SPACE, RIGHT)
  }

  async function drawU() {
    await pen()
    await moveY(FONT_HEIGHT, DOWN)
    await moveX(FONT_WIDTH, RIGHT)
    await moveY(FONT_HEIGHT, UP)
    await pen()
  }

// while (true) { // Repeat indefinitely
  console.log({x, y});

  async function writeOtis() {
    await drawO();
    await drawT();
    await drawI();
    await drawS();
  }

  async function writeNanou() {
    await drawN()
    await drawA()
    await drawN()
    await drawO()
    await drawU()
  }

  await writeOtis();
  await moveX(x, LEFT)
  await moveY(SPACE * 2, DOWN)
  FONT_WIDTH = 7
  FONT_HEIGHT = 18
  await writeNanou()
  process.exit();

});

poweredUP.scan(); // Start scanning for Hubs
console.log("Scanning for Hubs...");



