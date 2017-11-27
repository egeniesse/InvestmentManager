import { ThingType } from './components/app/app.types';

export function generateId(dataType: ThingType) {
  return `urn:${dataType}:${Date.now()}`;
}

export function simpleCopy(obj: {}): {} {
  return JSON.parse(JSON.stringify(obj));
}
