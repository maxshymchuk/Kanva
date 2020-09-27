import React from 'react';
import classnames from 'classnames';
import styles from './field.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {Figure, FigureType} from "../../types";
import {addFigure, AppState} from "../../store/actionCreators";
import uniqid from 'uniqid';
import {CONSTS} from "../../consts";
import randomcolor from 'randomcolor';
import {getMaxLayer} from "../../utils";

const Field = () => {
    let target: HTMLElement | null = null;
    let type: FigureType = FigureType.Square;
    let oldCoords = {
        x: 0, y: 0
    }
    let delta = {
        x: 0, y: 0
    }

    const dispatch = useDispatch();

    const figures: Figure[] = useSelector(
        (state: AppState) => state.figures
    );

    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        if (target) {
            target.style.left = `${e.clientX - oldCoords.x}px`;
            target.style.top = `${e.clientY - oldCoords.y}px`;
        }
    }

    const handleMouseUp = (e: MouseEvent) => {
        if (target) {
            if (e.clientX > CONSTS.MENU_WIDTH && e.clientX < window.innerWidth
                && e.clientY > 0 && e.clientY < window.innerHeight) {
                dispatch(addFigure({
                    id: uniqid(),
                    type: type,
                    position: {
                        x: e.clientX - delta.x,
                        y: e.clientY - delta.y
                    },
                    layer: getMaxLayer(figures),
                    color: randomcolor()
                }));
            }
            target.style.zIndex = `${CONSTS.DEFAULT_LAYER}`;
            target.style.left = '0';
            target.style.top = '0';
        }
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        target = null;
    }

    const handleMouseDown = (e: React.MouseEvent, figureType: FigureType) => {
        window.addEventListener('mousemove', (e) => handleMouseMove(e));
        window.addEventListener('mouseup', (e) => handleMouseUp(e));
        type = figureType;
        const item = e.target as HTMLDivElement;
        if (item) {
            const bounds = item.getBoundingClientRect();
            oldCoords.x = e.clientX;
            oldCoords.y = e.clientY;
            delta.x = oldCoords.x - bounds.x;
            delta.y = oldCoords.y - bounds.y;
            item.style.zIndex = `${CONSTS.UPPER_LAYER}`;
            if (!target) target = item;
        }
    }

    return (
        <section className={styles.field}>
            <ul className={styles.list}>
                <li className={styles.cell}>
                    <div className={classnames(styles.item, styles.square, styles.hidden)}></div>
                    <div
                        onMouseDown={(e) => handleMouseDown(e, FigureType.Square)}
                        className={classnames(styles.item, styles.square)}></div>
                </li>
                <li className={styles.cell}>
                    <div className={classnames(styles.item, styles.circle, styles.hidden)}></div>
                    <div
                        onMouseDown={(e) => handleMouseDown(e, FigureType.Circle)}
                        className={classnames(styles.item, styles.circle)}></div>
                </li>
            </ul>
        </section>
    );
};

export default Field;