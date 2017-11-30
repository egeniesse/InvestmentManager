import { ThingType } from '../components/app/app.types';
import { ChartDataSets } from 'chart.js';
import { ViewableField } from './shared.types';

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

export function makeViewableField(
  propName: string,
  description: string,
  method: string,
  minValue: number,
  maxValue: number,
  step: number
): ViewableField {
  return { propName, description, method, minValue, maxValue, step };
}

export function getChartDataSet(label: string, data: Array<number>, color: tinycolorInstance): ChartDataSets {
  return {
    label: label,
    fill: false,
    lineTension: 0.1,
    backgroundColor: color.setAlpha(0.5).getOriginalInput(),
    borderColor: color.getOriginalInput(),
    borderCapStyle: 'butt',
    borderDash: [],
    borderDashOffset: 0.0,
    borderJoinStyle: 'miter',
    pointBorderColor: color.getOriginalInput(),
    pointBackgroundColor: '#fff',
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: color.getOriginalInput(),
    pointHoverBorderColor: color.setAlpha(0.5).getOriginalInput(),
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: data
  };
}
