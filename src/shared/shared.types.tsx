export interface ViewableField {
  description: string;
  propName: string;
  method: string;
  minValue: number;
  maxValue: number;
  step: number;
}

export type EventHandler = (e: React.MouseEvent<{}>, value: number) => void;
