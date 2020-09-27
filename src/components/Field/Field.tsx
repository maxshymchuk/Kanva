import React, {useEffect, useState} from 'react';
import classnames from 'classnames';
import styles from './field.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {Figure, FigureType} from "../../types";
import {addFigure, AppState, moveFigure} from "../../store/actionCreators";
import uniqid from 'uniqid';
import randomcolor from 'randomcolor';

const Field = () => {

    let target: HTMLElement | null = null;

    const dispatch = useDispatch();

    const figures: Figure[] = useSelector(
        (state: AppState) => state.figures
    );

    useEffect(() => {
        window.addEventListener('mousemove', (e) => {
            handleMouseMove(e)
        }, true);
        window.addEventListener('mouseup', handleMouseUp, true);
    }, [])

    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        if (target) {
            target.style.left = `${e.clientX}px`;
            target.style.top = `${e.clientY}px`;
        }
        //     dispatch(moveFigure(figure, e.clientX - 200, e.clientY));
    }

    const handleMouseUp = () => {
        target = null;
    }

    const handleMouseDown = (e: React.MouseEvent, type: FigureType) => {
        const item = e.target as HTMLElement;
        item.style.zIndex = '99';
        item.style.backgroundColor = `${randomcolor()}`;
        item.id = uniqid();

        // dispatch(addFigure(newFigure));
        target = item;
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