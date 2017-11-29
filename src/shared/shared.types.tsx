export interface ViewableField {
  description: string;
  propName: string;
  minValue: number;
  maxValue: number;
  step: number;
}

export type EventHandler = (e: React.MouseEvent<{}>, value: number) => void;

export interface ContainerProps {
  updateState: (payload: any) => { type: string; payload: any; };
}

export interface ContainerState<T> {
  model: T;
}
