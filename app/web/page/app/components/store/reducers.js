import { COLOR_DATA, COMPONENT_DATA, TASK_DATA, CATCHER_DATA, CSS_DATA, TEAM_DATA, USER_INFO } from './constant';

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
    if (action.type === CATCHER_DATA) {
        newState.catcherData = action.data;
    }
    if (action.type === CSS_DATA) {
        newState.cssData = action.data;
    }
    if (action.type === TEAM_DATA) {
        newState.teamData = action.data;
    }
    if (action.type === USER_INFO) {
        newState.userInfo = action.data;
    }
    return newState;
}