import {
  CREATE_COLOR,
  FIND_COLOR,
  DELETE_COLOR,
  CREATE_TASK,
  CREATE_COMPONENT,
  FIND_COMPONENT,
  DELETE_COMPONENT
} from './constant';

export const createColor = data => ({
  type: CREATE_COLOR,
  data
});

export const findColor = () => ({
  type: FIND_COLOR
});

export const deleteColor = id => ({
  type: DELETE_COLOR,
  id
});

export const createTask = data => ({
  type: CREATE_TASK,
  data
});

export const createComponent = data => ({
  type: CREATE_COMPONENT,
  data
});

export const findComponent = () => ({
  type: FIND_COMPONENT
});

export const deleteComponent = id => ({
  type: DELETE_COMPONENT,
  id
});
