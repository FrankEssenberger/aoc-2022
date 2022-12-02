import { promises } from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';
import { EOL } from 'os';

type PlayerChoice = 'rock' | 'paper' | 'scissors';
type MyRoundResult = 'win' | 'lose' | 'draw';

const column1Map: Record<string, PlayerChoice> = {
  A: 'rock',
  B: 'paper',
  C: 'scissors'
};
const column2Map: Record<string, MyRoundResult> = {
  X: 'lose',
  Y: 'draw',
  Z: 'win'
};

const pointSymbolMap: Record<PlayerChoice, number> = {
  rock: 1,
  paper: 2,
  scissors: 3
};

const pointsResultMap: Record<MyRoundResult, number> = {
  draw: 3,
  lose: 0,
  win: 6
};

const myChoiceMap: Record<PlayerChoice, Record<MyRoundResult, PlayerChoice>> = {
  rock: {
    draw: 'rock',
    win: 'paper',
    lose: 'scissors'
  },
  paper: {
    draw: 'paper',
    win: 'scissors',
    lose: 'rock'
  },
  scissors: {
    draw: 'scissors',
    win: 'rock',
    lose: 'paper'
  }
};

interface SingleRound {
  opponentChoice: PlayerChoice;
  myRoundResult: MyRoundResult;
}

async function readStrategyData(path): Promise<SingleRound[]> {
  const rawData = await promises.readFile(path, { encoding: 'utf-8' });
  const lines = rawData.split(EOL);
  return lines.map(line => {
    const [column1, column2] = line.split(' ');
    return {
      myRoundResult: column2Map[column2],
      opponentChoice: column1Map[column1]
    };
  });
}

function evaluateStrategy(strategy: SingleRound[]): number {
  return strategy.reduce((score, { myRoundResult, opponentChoice }) => {
    const myChoice = myChoiceMap[opponentChoice][myRoundResult];
    return score + pointsResultMap[myRoundResult] + pointSymbolMap[myChoice];
  }, 0);
}

const path = resolve(dirname(fileURLToPath(import.meta.url)), 'strategy.data');
const data = await readStrategyData(path);
console.log(evaluateStrategy(data));
