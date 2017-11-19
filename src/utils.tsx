import { ThingType } from './components/app/app.types';

export function generateId(dataType: ThingType) {
  return `urn:${dataType}:${Math.ceil(Math.random()*1000000)}`;
}

export function simpleCopy(obj: any): any {
  return JSON.parse(JSON.stringify(obj));
}
