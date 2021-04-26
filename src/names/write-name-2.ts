import {Direction, move, moveX, moveY, pen, penUp, run} from "./hub";

const FONT_WIDTH = 8;
const FONT_HEIGHT = 19;
const SPACE = FONT_WIDTH / 4;


async function square(size:number) {
  await move(size, Direction.RIGHT);
  await move(size, Direction.DOWN);
  await move(size, Direction.LEFT);
  await move(size, Direction.UP);
}

function heart(): Instruction[] {
  const heart =
      "      ###     ###       \n" +
      "   ######## ########    \n" +
      "  ###################   \n" +
      "   #################    \n" +
      "     #############      \n" +
      "       #########        \n" +
      "         #####          \n" +
      "           #            \n";

  const lines = heart.split("\n")
  const instructions: Instruction[] = [];
  lines.forEach(line => {
    console.log(line);
    for (let i = 0; i < line.length; i++) {
      if (line.length - 1 === i) {
        instructions.push(new NewLineInstruction(line.length));
      }
      const lastChar = instructions[instructions.length - 1]?.character
      if ((!lastChar && i === 0) || line[i] !== lastChar) {
        const instruction = createInstruction(line[i] as InstructionTypeChar, line.length);
        instructions.push(instruction);
      }
      if (line[i] === lastChar) {
        instructions[instructions.length - 1].incrementLength();
      }
    }
  });
  console.log(instructions)
  return instructions;
}

type InstructionTypeChar = " " | "#" | "\n";

abstract class Instruction {
  length: number = 1;
  lineLength: number = 0;
  character: InstructionTypeChar;

  protected constructor(char: InstructionTypeChar, lineLength: number) {
    this.character = char;
    this.lineLength = lineLength
  }

  incrementLength(): void {
    this.length++
  }

  abstract run(): Promise<void>;
}

class BlankInstruction extends Instruction {
  constructor(lineLength: number) {
    super(" ", lineLength);
  }

  async run(): Promise<void> {
    if (!penUp) await pen();
    await moveX(this.length, Direction.RIGHT);
  }
}

class LineInstruction extends Instruction {
  constructor(lineLength: number) {
    super("#", lineLength);
  }

  async run(): Promise<void> {
    if (penUp) await pen();
    await moveX(this.length, Direction.RIGHT);
  }
}

class NewLineInstruction extends Instruction {
  constructor(lineLength: number) {
    super("\n", lineLength);
  }

  async run(): Promise<void> {
    if (!penUp) await pen();
    await moveY(3, Direction.DOWN);
    await moveX(this.lineLength, Direction.LEFT);
  }
}

const createInstruction = (char: InstructionTypeChar, lineLength: number) => {
  console.log(char);
  switch (char) {
    case " ":
      return new BlankInstruction(lineLength);
    case "#":
      return new LineInstruction(lineLength);
    default:
      return new NewLineInstruction(lineLength);
  }
}

console.log("Connected");

// let dir = 1;
async function drawO() {
  await pen();
  await move(FONT_WIDTH, Direction.RIGHT);
  await move(FONT_HEIGHT, Direction.DOWN);
  await move(FONT_WIDTH, Direction.LEFT);
  await move(FONT_HEIGHT, Direction.UP);
  await pen();
  await move(FONT_WIDTH + SPACE, Direction.RIGHT);
}

async function drawT() {
  await pen();
  await move(FONT_WIDTH, Direction.RIGHT);
  await pen();
  await move(FONT_WIDTH / 2, Direction.LEFT);
  await pen();
  await move(FONT_HEIGHT, Direction.DOWN);
  await pen();
  await move(FONT_WIDTH / 2 + SPACE, Direction.RIGHT);
  await move(FONT_HEIGHT, Direction.UP);
}

async function drawI() {
  await pen();
  await move(FONT_HEIGHT, Direction.DOWN)
  await pen();
  await move(FONT_HEIGHT, Direction.UP);
  await move(SPACE, Direction.RIGHT);
}

async function drawS() {
  await move(FONT_WIDTH, Direction.RIGHT);
  await pen();
  await move(FONT_WIDTH, Direction.LEFT);
  await move(FONT_HEIGHT / 2, Direction.DOWN);
  await move(FONT_WIDTH, Direction.RIGHT);
  await move(FONT_HEIGHT / 2, Direction.DOWN);
  await move(FONT_WIDTH, Direction.LEFT);
  await pen();
}

async function drawN() {
  await move(FONT_HEIGHT, Direction.DOWN)
  await pen();
  await move(FONT_HEIGHT, Direction.UP)
  await move(FONT_WIDTH / 3, Direction.RIGHT)
  await move(FONT_HEIGHT, Direction.DOWN)
  await move(FONT_WIDTH * 2 / 3, Direction.RIGHT)
  await move(FONT_HEIGHT, Direction.UP)
  await pen()
  await move(SPACE, Direction.RIGHT);
}

async function drawA() {
  await move(FONT_HEIGHT, Direction.DOWN)
  await pen()
  await move(FONT_HEIGHT, Direction.UP)
  await move(FONT_WIDTH, Direction.RIGHT)
  await move(FONT_HEIGHT, Direction.DOWN)
  await pen()
  await move(FONT_HEIGHT / 2, Direction.UP)
  await move(FONT_WIDTH, Direction.LEFT)
  await pen()
  await move(FONT_WIDTH, Direction.RIGHT)
  await pen();
  await move(FONT_HEIGHT / 2, Direction.UP)
  await move(SPACE, Direction.RIGHT)
}

async function drawU() {
  await pen()
  await move(FONT_HEIGHT, Direction.DOWN)
  await move(FONT_WIDTH, Direction.RIGHT)
  await move(FONT_HEIGHT, Direction.UP)
  await pen()
}

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

run(async () => {

  // await writeOtis();
  // await move(position.x, Direction.LEFT)
  // await move(SPACE * 2, Direction.DOWN)

  // const instructions = heart();
  // for (const instruction of instructions) {
  //
  //   await instruction.run()
  // }
  // await writeNanou()
  await pen()
  await square(2)
  await pen()
  await move(2, Direction.RIGHT)
  await pen()
  await square(2)
  await pen()
  process.exit();
});






