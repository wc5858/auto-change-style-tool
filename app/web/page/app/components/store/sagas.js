import { put, takeEvery, call, all } from 'redux-saga/effects';
import {
  DELETE_COLOR,
  CREATE_COLOR,
  FIND_COLOR,
  COLOR_DATA,
  CREATE_TASK,
  FIND_TASK,
  TASK_DATA,
  CREATE_COMPONENT,
  FIND_COMPONENT,
  DELETE_COMPONENT,
  COMPONENT_DATA,
  GET_NANO_CSS,
  CSS_DATA,
  CREATE_TEAM
} from './constant';
import axios from 'axios';
import Cookies from 'js-cookie';
import { message } from 'antd';

axios.defaults.headers['x-csrf-token'] = Cookies.get('csrfToken');

const createColorAsync = function*(action) {
  const response = yield call(axios, {
    method: 'post',
    url: '/api/v1/color/create',
    data: action.data
  });
  if (response.data && response.data.success) {
    message.success('操作成功！');
  } else {
    message.error('操作失败');
  }
};

const findColorAsync = function*(showMessage = true) {
  const response = yield call(axios, {
    method: 'post',
    url: '/api/v1/color/find'
  });
  if (response.data && response.data.success) {
    showMessage && message.success('操作成功！');
    yield put({
      type: COLOR_DATA,
      data: response.data.data
    });
  } else {
    message.error('获取数据失败');
  }
};

const deleteColorAsync = function*(action) {
  const response = yield call(axios, {
    method: 'post',
    url: '/api/v1/color/delete',
    data: {
      id: action.id
    }
  });
  if (response.data && response.data.success) {
    message.success('操作成功！');
    yield call(findColorAsync, false);
  } else {
    message.error('获取数据失败');
  }
};

const createTaskAsync = function*(action) {
  const response = yield call(axios, {
    method: 'post',
    url: '/api/v1/task/create',
    data: action.data
  });
  if (response.data && response.data.success) {
    message.success('操作成功！');
  } else {
    message.error('操作失败');
  }
};

const findTaskAsync = function*(showMessage = true) {
  const response = yield call(axios, {
    method: 'post',
    url: '/api/v1/task/find'
  });
  if (response.data && response.data.success) {
    showMessage && message.success('操作成功！');
    yield put({
      type: TASK_DATA,
      data: response.data.data
    });
  } else {
    message.error('获取数据失败');
  }
};

const createComponentAsync = function*(action) {
  const response = yield call(axios, {
    method: 'post',
    url: '/api/v1/component/create',
    data: action.data
  });
  if (response.data && response.data.success) {
    message.success('操作成功！');
  } else {
    message.error('操作失败');
  }
};

const findComponentAsync = function*(showMessage = true) {
  const response = yield call(axios, {
    method: 'post',
    url: '/api/v1/component/find'
  });
  if (response.data && response.data.success) {
    showMessage && message.success('操作成功！');
    yield put({
      type: COMPONENT_DATA,
      data: response.data.data
    });
  } else {
    message.error('获取数据失败');
  }
};

const deleteComponentAsync = function*(action) {
  const response = yield call(axios, {
    method: 'post',
    url: '/api/v1/component/delete',
    data: {
      id: action.id
    }
  });
  if (response.data && response.data.success) {
    message.success('操作成功！');
    yield call(findComponentAsync, false);
  } else {
    message.error('获取数据失败');
  }
};

const getNanoCssAsync = function*(action) {
  const response = yield call(axios, {
    method: 'post',
    url: '/api/v1/task/getNanoCss',
    data: {
      rawCss: action.rawCss
    }
  });
  yield put({
    type: CSS_DATA,
    data: response.data.data
  });
};

const createTeamAsync = function*(action) {
  const response = yield call(axios, {
    method: 'post',
    url: '/api/v1/team/create',
    data: action.data
  });
  if (response.data && response.data.success) {
    message.success('操作成功！');
  } else {
    message.error('操作失败');
  }
};

const watcher = function*() {
  yield takeEvery(CREATE_COLOR, createColorAsync);
  yield takeEvery(FIND_COLOR, findColorAsync);
  yield takeEvery(DELETE_COLOR, deleteColorAsync);

  yield takeEvery(CREATE_TASK, createTaskAsync);
  yield takeEvery(FIND_TASK, findTaskAsync);
  yield takeEvery(GET_NANO_CSS, getNanoCssAsync);

  yield takeEvery(CREATE_COMPONENT, createComponentAsync);
  yield takeEvery(FIND_COMPONENT, findComponentAsync);
  yield takeEvery(DELETE_COMPONENT, deleteComponentAsync);

  yield takeEvery(CREATE_TEAM, createTeamAsync);
};

// notice how we now only export the rootSaga
// single entry point to start all Sagas at once
export default function* rootSaga() {
  yield all([watcher()]);
}
