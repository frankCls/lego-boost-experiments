import {Direction, motorX, motorY, move, paperFeed, run} from "./hub";

const turnY = (360 / 5) / 1.4;
const turnX = 360 / 1.4;


async function square(size) {
  await move(size, Direction.RIGHT)
  await move(size, Direction.DOWN)
  await move(size, Direction.LEFT)
  await move(size, Direction.UP)
}

run(async () => {

  console.log('started program')
  await paperFeed();
  await motorY.rotateByDegrees(360/2.6, -20) //26mm
  await motorX.rotateByDegrees(360/1.2, 20) //12 mm


  // await paperFeed();
  // await move(50, Direction.UP)
  // for (let i = 0; i < 4; i++) {
  //   await square(11);
  //   await move(12,Direction.RIGHT);
  // }
  // motorXY.setPower()


});
