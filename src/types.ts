import {addFigure, changeFigure, removeFigure} from "./store/store";

export type AppState = {
    figures: Figure[];
};

export type Actions =
    | ReturnType<typeof addFigure>
    | ReturnType<typeof removeFigure>
    | ReturnType<typeof changeFigure>;

export enum FigureType {
    Square,
    Circle
}

export type Figure = {
    id: string,
    type: FigureType;
    layer: number;
    position: {
        x: number,
        y: number
    },
    color: string,
    isActive: boolean
}

export enum ActionTypes {
    ADD_FIGURE,
    REMOVE_FIGURE,
    CHANGE_FIGURE
}

export type FigureAction = {
    type: ActionTypes
    figure: Figure
}