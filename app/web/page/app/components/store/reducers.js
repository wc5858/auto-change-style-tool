import { COLOR_DATA, COMPONENT_DATA, TASK_DATA, CSS_DATA } from './constant';

export default function update(state, action) {
  const newState = Object.assign({}, state);
  if (action.type === COLOR_DATA) {
    newState.colorData = action.data;
  }
  if (action.type === COMPONENT_DATA) {
    newState.componentData = action.data;
  }
  if (action.type === TASK_DATA) {
    newState.taskData = action.data;
  }
  if (action.type === CSS_DATA) {
    newState.cssData = action.data;
  }
  return newState;
}
