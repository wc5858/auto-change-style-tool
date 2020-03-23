import {
  CREATE_COLOR,
  FIND_COLOR,
  DELETE_COLOR,
  CREATE_TASK,
  FIND_TASK,
  CREATE_COMPONENT,
  FIND_COMPONENT,
  DELETE_COMPONENT,
  CREATE_CATCHER,
  FIND_CATCHER,
  DELETE_CATCHER,
  GET_NANO_CSS,
  CREATE_TEAM,
  FIND_TEAM,
  INVITE,
  DECLINE,
  JOIN,
  LOGOUT,
  GET_USER_INFO
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

export const findTask = () => ({
  type: FIND_TASK
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

export const createCatcher = data => ({
  type: CREATE_CATCHER,
  data
});

export const findCatcher = () => ({
  type: FIND_CATCHER
});

export const deleteCatcher = id => ({
  type: DELETE_CATCHER,
  id
});

export const getNanoCss = rawCss => ({
  type: GET_NANO_CSS,
  rawCss
});

export const createTeam = data => ({
  type: CREATE_TEAM,
  data
});

export const findTeam = () => ({
  type: FIND_TEAM
});

export const invite = data => ({
  type: INVITE,
  data
});

export const decline = data => ({
  type: DECLINE,
  data
});

export const join = data => ({
  type: JOIN,
  data
});

export const logout = () => ({
  type: LOGOUT
});

export const updateUserInfo = () => ({
  type: GET_USER_INFO
});
