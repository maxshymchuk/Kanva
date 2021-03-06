import {Actions, ActionTypes, AppState, Figure} from "../types";
import {combineReducers, createStore, Store} from "redux";

export function addFigure(figure: Figure) {
    return {
        type: ActionTypes.ADD_FIGURE,
        payload: figure,
    } as const;
}

export function removeFigure(id: string) {
    return {
        type: ActionTypes.REMOVE_FIGURE,
        payload: id,
    } as const;
}

export function changeFigure(figure: Figure) {
    return {
        type: ActionTypes.CHANGE_FIGURE,
        payload: figure,
    } as const;
}

function reducer(
    state: Figure[] = [],
    action: Actions
) {
    const storage = localStorage.getItem('figures');
    let result = storage ? JSON.parse(storage) as Figure[] : [];
    switch (action.type) {
        case ActionTypes.ADD_FIGURE:
            result = state.concat(action.payload);
            break;
        case ActionTypes.REMOVE_FIGURE:
            result = state.filter(
                (figure) => figure.id !== action.payload
            );
            break;
        case ActionTypes.CHANGE_FIGURE: {
            const newState = [...state];
            newState.forEach((element, index) => {
                if (element.id === action.payload.id) {
                    state[index] = action.payload;
                }
            });
            result = newState;
            break;
        }
    }
    localStorage.setItem('figures', JSON.stringify(result));
    return result;
}

const rootReducer = combineReducers<AppState>({
    figures: reducer
});

export function configureStore(): Store<AppState> {
    const store = createStore(
        rootReducer, undefined
    );
    return store;
}