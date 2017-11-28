import { ThingType } from './components/app/app.types';

export function generateId(dataType: ThingType) {
  return `urn:${dataType}:${Date.now()}`;
}

export function simpleCopy(obj: {}): {} {
  return JSON.parse(JSON.stringify(obj));
}

export function round(num: number, places: number = 2): number {
  let denominator = 1;
  for (let i = 0; i < places; i++) {
    denominator = denominator * 10;
  }
  return Math.ceil(num * denominator) / denominator;
}
