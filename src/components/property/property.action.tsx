import { COPY_PROPERTY, PropertyState } from './property.types';

export const propertyActions = {
  copy: (payload: PropertyState) => {
    return { type: COPY_PROPERTY, payload }
  }
};
