import {ActionTypes, Figure} from "../types";
import {combineReducers, createStore, Store} from "redux";

export type AppState = {
    figures: Figure[];
};

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

type Actions =
    | ReturnType<typeof addFigure>
    | ReturnType<typeof removeFigure>
    | ReturnType<typeof changeFigure>;

function fReducer(
    state: Figure[] = [],
    action: Actions
) {
    switch (action.type) {
        case ActionTypes.ADD_FIGURE:
            return state.concat(action.payload);
        case ActionTypes.REMOVE_FIGURE:
            return state.filter(
                (figure) => figure.id !== action.payload
            );
        case ActionTypes.CHANGE_FIGURE: {
            const newState = [...state];
            newState.forEach((element, index) => {
                if (element.id === action.payload.id) {
                    state[index] = action.payload;
                }
            });
            return newState;
        }
    }
    return state;
}

const rootReducer = combineReducers<AppState>({
    figures: fReducer
});

export function configureStore(): Store<AppState> {
    const store = createStore(
        rootReducer,
        undefined
    );
    return store;
}