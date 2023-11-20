import { createSlice } from '@reduxjs/toolkit';
import { loadState } from '@/utils/state';
import { ActionTypes } from '@/utils/actions';

const POSITION = {
    x: 370,
    y: 100,
    z: 100,
    roll: 0,
    pitch: 60,
    yaw: 15,
};

export const Steps = {
    HOME_ARM: 'HOME_ARM',
    MOVE_JOINT_3: 'MOVE_JOINT_3',
    ADD_MOVE_TO_ACTION_LIST: 'ADD_MOVE_TO_ACTION_LIST',
    MOVE_JOINT_1: 'MOVE_JOINT_1',
    ADD_MOVE_TO_ACTION_LIST_2: 'ADD_MOVE_TO_ACTION_LIST_2',
    RUN_ACTION_LIST: 'RUN_ACTION_LIST',
    ADD_SLEEP_TO_ACTION_LIST: 'ADD_SLEEP_TO_ACTION_LIST',
    SET_SLEEP_DURATION_TO_1: 'SET_SLEEP_DURATION_TO_1',
    RUN_ACTION_LIST_2: 'RUN_ACTION_LIST_2',
    MOVE_TOOL_IN_CONTROL_PANEL: 'MOVE_TOOL_IN_CONTROL_PANEL',
    ADD_TOOL_MOVE_TO_ACTION_LIST: 'ADD_TOOL_MOVE_TO_ACTION_LIST',
    RUN_ACTION_LIST_3: 'RUN_ACTION_LIST_3',
    GO_TO_POSITION: 'GO_TO_POSITION',
    ADD_MOVE_TO_ACTION_LIST_3: 'ADD_MOVE_TO_ACTION_LIST_3',
    RUN_ACTION_LIST_4: 'RUN_ACTION_LIST_4',
    ADD_ACTION_SET_TO_ACTION_LIST: 'ADD_ACTION_SET_TO_ACTION_LIST',
    MOVE_ALL_TO_ACTION_SET: 'MOVE_ALL_TO_ACTION_SET',
    RUN_ACTION_LIST_5: 'RUN_ACTION_LIST_5',
    RENAME_ACTION_SET: 'RENAME_ACTION_SET',
    DUPLICATE_ACTION_SET: 'DUPLICATE_ACTION_SET',
};

export const evaluateStepMap = {
    [Steps.HOME_ARM]: state => {
        // The state passed holds all the store state
        const armPose = state.armPose;
        if (armPose === null) {
            return false;
        }
        return armPose.isHomed;
    },
    [Steps.MOVE_JOINT_3]: state => {
        const armPose = state.armPose;
        const angles = armPose.currentAngles;
        if (angles && angles[2] != 0) {
            return true;
        }
        return false;
    },

    [Steps.ADD_MOVE_TO_ACTION_LIST]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        for (let action of actionList.actions) {
            if (action.type === ActionTypes.MOVE) {
                return true;
            }
            return false;
        }
    },
    [Steps.MOVE_JOINT_1]: state => {
        const armPose = state.armPose;
        const angles = armPose.currentAngles;
        if (angles && angles[0] != 0) {
            return true;
        }
        return false;
    },
    [Steps.ADD_MOVE_TO_ACTION_LIST_2]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        let num_moves = 0;
        for (let action of actionList.actions) {
            if (action.type === ActionTypes.MOVE) {
                num_moves++;
            }
        }
        return num_moves >= 2;
    },
    [Steps.RUN_ACTION_LIST]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        if (!actionList.actions || actionList.actions.length === 0) {
            return false;
        }
        const firstAction = actionList.byId[actionList.actions[0].id];
        const lastRun = firstAction.lastRun;
        if (lastRun && Date.now() - lastRun > 10000) {
            return true;
        }
        return false;
    },
    [Steps.ADD_SLEEP_TO_ACTION_LIST]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        for (let action of actionList.actions) {
            if (action.type == ActionTypes.SLEEP) {
                return true;
            }
        }
        return false;
    },
    [Steps.SET_SLEEP_DURATION_TO_1]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        for (let action of actionList.actions) {
            action = actionList.byId[action.id];
            if (action.type === ActionTypes.SLEEP && action.value.duration === 1) {
                return true;
            }
        }
        return false;
    },
    [Steps.RUN_ACTION_LIST_2]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        const firstAction = actionList.byId[actionList.actions[0].id];
        const lastRun = firstAction.lastRun;
        if (lastRun && Date.now() - lastRun > 10000) {
            return true;
        }
        return false;
    },
    [Steps.MOVE_TOOL_IN_CONTROL_PANEL]: state => {
        // The state passed holds all the store state
        const armPose = state.armPose;
        const toolValue = armPose.toolValue;
        if (toolValue && toolValue[0] != 0) {
            return true;
        }
        return false;
    },
    [Steps.ADD_TOOL_MOVE_TO_ACTION_LIST]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        for (let action of actionList.actions) {
            if (action.type === ActionTypes.TOOL) {
                return true;
            }
        }
        return false;
    },
    [Steps.RUN_ACTION_LIST_3]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        const firstAction = actionList.byId[actionList.actions[0].id];
        const lastRun = firstAction.lastRun;
        if (lastRun && Date.now() - lastRun > 10000) {
            return true;
        }
        return false;
    },
    [Steps.GO_TO_POSITION]: state => {
        // The state passed holds all the store state
        const armPose = state.armPose;
        const tolerance = 5;
        for (let key in POSITION) {
            let distance = Math.abs(armPose[key] - POSITION[key]);
            if (distance > tolerance) {
                return false;
            }
        }
        return true;
    },
    [Steps.ADD_MOVE_TO_ACTION_LIST_3]: state => {
        const actionList = state.actionList;
        let num_moves = 0;
        for (let action of actionList.actions) {
            if (action.type === ActionTypes.MOVE) {
                num_moves++;
            }
        }
        return num_moves >= 3;
    },
    [Steps.RUN_ACTION_LIST_4]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        const firstAction = actionList.byId[actionList.actions[0].id];
        const lastRun = firstAction.lastRun;
        if (lastRun && Date.now() - lastRun > 10000) {
            return true;
        }
        return false;
    },
    [Steps.ADD_ACTION_SET_TO_ACTION_LIST]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        for (let action of actionList.actions) {
            if (action.type === ActionTypes.ACTIONSET) {
                return true;
            }
        }
        return false;
    },
    [Steps.MOVE_ALL_TO_ACTION_SET]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        const actionSet = actionList.byId[actionList.actions[0].id];
        if (actionSet.value.length >= 3) {
            return true;
        }
        return false;
    },
    [Steps.RUN_ACTION_LIST_5]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        const firstAction = actionList.byId[actionList.actions[0].id];
        const lastRun = firstAction.lastRun;
        if (lastRun && Date.now() - lastRun > 10000) {
            return true;
        }
        return false;
    },
    [Steps.RENAME_ACTION_SET]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        const actionSet = actionList.byId[actionList.actions[0].id];
        if (actionSet.name) {
            return true;
        }
    },

    [Steps.DUPLICATE_ACTION_SET]: state => {
        // The state passed holds all the store state
        const actionList = state.actionList;
        let num_action_sets = 0;
        for (let action of actionList.actions) {
            if (action.type === ActionTypes.ACTIONSET) {
                num_action_sets++;
            }
        }
        return num_action_sets >= 2;
    },
};

const initialState = {
    steps: [
        {
            name: 'Home the arm',
            id: Steps.HOME_ARM,
            description: 'Press the Home Arm Button',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Move Joint 3',
            id: Steps.MOVE_JOINT_3,
            description: 'Go to the control panel and move joint 3',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Add Move to action list',
            id: Steps.ADD_MOVE_TO_ACTION_LIST,
            description: 'Press or drag the Green Move Button in the Toolbar',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Move Joint 1',
            id: Steps.MOVE_JOINT_1,
            description: 'Go to the control panel and move joint 1',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Add Another Move to Action List',
            id: Steps.ADD_MOVE_TO_ACTION_LIST_2,
            description: 'Press or drag the green move button in the toolbar',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Run Action List',
            id: Steps.RUN_ACTION_LIST,
            description: 'Press the Play Button',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Add Sleep to Action List',
            id: Steps.ADD_SLEEP_TO_ACTION_LIST,
            description: 'Press or drag the blue sleep button in the toolbar',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Set Sleep Duration to 1',
            id: Steps.SET_SLEEP_DURATION_TO_1,
            description: 'Set the duration of the sleep action to 1',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Run the Action List Again',
            id: Steps.RUN_ACTION_LIST_2,
            description: 'Press the Play Button',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Move Tool in Control Panel',
            id: Steps.MOVE_TOOL_IN_CONTROL_PANEL,
            description: 'Move the tool using the control panel',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Add Tool Move to Action List',
            id: Steps.ADD_TOOL_MOVE_TO_ACTION_LIST,
            description:
                'Add a tool move to the action list (press or drag the orange tool button in the toolbar)',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Run the Action List Again',
            id: Steps.RUN_ACTION_LIST_3,
            description: 'Press the Play Button',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Go to Position',
            id: Steps.GO_TO_POSITION,
            description:
                'Move to a specific position using axis controls (x: 370, y: 100, z: 100, roll: 0, pitch: 60, yaw: 15))',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Add Another Move to Action List',
            id: Steps.ADD_MOVE_TO_ACTION_LIST_3,
            description: 'Press or drag the Green Move Button in the Toolbar',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Run Action List',
            id: Steps.RUN_ACTION_LIST_4,
            description: 'Run again hte action list',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Add Action Set to Action List',
            id: Steps.ADD_ACTION_SET_TO_ACTION_LIST,
            description: 'Add an action set to the action list',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Move All to Action Set',
            id: Steps.MOVE_ALL_TO_ACTION_SET,
            description: 'Move all actions to the action set (drag them!)',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Run Action List',
            id: Steps.RUN_ACTION_LIST_5,
            description: 'Run the action list again',
            completion: {
                done: false,
                timestamp: null,
            },
        },
        {
            name: 'Duplicate Action Set',
            id: Steps.DUPLICATE_ACTION_SET,
            description: 'Create a duplicate of the action set',
            completion: {
                done: false,
                timestamp: null,
            },
        },
    ],
};

const loadedState = loadState()?.activity;

if (loadedState && loadedState.steps) {
    loadedState.steps.forEach((step, index) => {
        initialState.steps[index].completion = step.completion;
    });
}
const ActivitySlice = createSlice({
    name: 'activity',
    initialState,
    reducers: {
        setDone: (state, action) => {
            const { stepId } = action.payload;
            const step = state.steps.find(step => step.id === stepId);
            step.completion.done = true;
            step.completion.timestamp = Date.now();
        },
        clearActivity: state => {
            for (let step of state.steps) {
                step.completion.done = false;
                step.completion.timestamp = null;
            }
        },
    },
});

export const currentStepSelector = state =>
    state.activity.steps?.find(step => !step.completion.done);

export const activityActions = ActivitySlice.actions;
export default ActivitySlice.reducer;