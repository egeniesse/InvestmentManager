import { PropertiesById, PropertyState, COPY_PROPERTY, PropertyRequest } from './property.types';
import { simpleCopy } from '../../shared/shared.method';

export function propertiesById(state: PropertiesById = {}, action: PropertyRequest): PropertiesById {
  switch (action.type) {
    case COPY_PROPERTY: return copy(state, action.payload);
    default: return state;
  }
}

function copy(state: PropertiesById, payload: PropertyState): PropertiesById {
  const copyState = simpleCopy(state);
  copyState[payload.id] = Object.assign(copyState[payload.id] || {}, payload);
  return copyState;
}
