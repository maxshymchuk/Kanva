import React, {createRef, useEffect, useRef, useState} from 'react';
import classnames from 'classnames';
import styles from './field.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {Figure, FigureType} from "../../types";
import {addFigure, AppState, moveFigure} from "../../store/actionCreators";
import uniqid from 'uniqid';
import randomcolor from 'randomcolor';

const Field = () => {

    let target: HTMLElement | null = null;
    let delta = {
        x: 0, y: 0
    }

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
            target.style.left = `${e.clientX - delta.x}px`;
            target.style.top = `${e.clientY - delta.y}px`;
        }
        //     dispatch(moveFigure(figure, e.clientX - 200, e.clientY));
    }

    const handleMouseUp = () => {
        if (target) {
            target.style.left = '0';
            target.style.top = '0';
        }
        target = null;
    }

    const handleMouseDown = (e: React.MouseEvent, type: FigureType) => {

        const item = e.target as HTMLDivElement;

        if (item) {
            delta.x = e.clientX - item.offsetLeft;
            delta.y = e.clientY - item.offsetTop;
            item.style.zIndex = '99';
            // dispatch(addFigure({
            //     id: uniqid(),
            //     type: type,
            //     ref: item
            // }));
            target = item;
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