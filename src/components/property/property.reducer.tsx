import {PropertiesById, PropertyState, COPY_PROPERTY, PropertyRequest} from './property.types';
import { simpleCopy } from '../../utils';

export function propertiesById(state: PropertiesById = {}, action: PropertyRequest): PropertiesById {
  switch (action.type) {
    case COPY_PROPERTY: return copy(state, action.payload);
    default: return state;
  }
}

function copy(state: PropertiesById, payload: PropertyState): PropertiesById {
  const copyState = simpleCopy(state);
  copyState[payload.id] = Object.assign(copyState[payload.id] || {}, payload);
  console.log('state', copyState[payload.id] === state[payload.id])
  return copyState;
}
