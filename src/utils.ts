import {Figure} from "./types";

export const getMaxLayer = (figures: Figure[]) => {
    const layer = figures.map(figure => figure.layer).sort((a, b) => b - a)[0] + 1
    return layer ? layer : 0;
}

export const findFigure = (figures: Figure[], id: string) => {
    return figures.filter(figure => figure.id === id)[0];
}

export const getActive = (figures: Figure[]) => {
    return figures.filter(figure => figure.isActive === true)[0];
}