import * as React from 'react';
import { ContainerState, EventHandler, ViewableField } from './shared.types';

export interface UiComponent<T, M> {
  state: ContainerState<M>;
  boundHandlers: {[prop: string]: EventHandler};
  model: M;
  viewableFields: Array<ViewableField>;
  submitState(): void;
  handleChange(partialState: Partial<T>): void;
  handleSlide(property: string, e: React.MouseEvent<{}>, value: number): void;
}

