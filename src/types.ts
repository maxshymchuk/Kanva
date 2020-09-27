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
    color: string
}

export enum ActionTypes {
    ADD_FIGURE,
    REMOVE_FIGURE,
    CHANGE_FIGURE
}

export type FigureState = {
    figures: Figure[]
}

export type FigureAction = {
    type: ActionTypes
    figure: Figure
}

export type DispatchType = (args: FigureAction) => FigureAction