import { promises } from 'fs';
import { EOL } from 'os';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const path = resolve(dirname(fileURLToPath(import.meta.url)), 'food.data');
const calorieData = await readFoodData(path);
console.log(
  Object.values(calorieData)
    .sort((a, b) => (a > b ? -1 : 1))
    .slice(0, 3)
    .reduce((sum, cur) => sum + cur,0)
);

type ElfId = number;
type Calories = number;
type ElfCalorinesData = Record<ElfId, Calories>;

async function readFoodData(path): Promise<ElfCalorinesData> {
  const rawData = await promises.readFile(path, { encoding: 'utf-8' });
  const lines = rawData.split(EOL);
  const data: ElfCalorinesData = {};
  let count = 0;
  let elfId = 0;
  lines.forEach(line => {
    if (line) {
      count = count + Number(line);
    } else {
      data[elfId] = count;
      elfId++;
      count = 0;
    }
  });
  return data;
}
