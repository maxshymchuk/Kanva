import React, {useRef} from 'react';
import classnames from 'classnames';
import styles from './field.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {Figure, FigureType} from "../../types";
import {addFigure, AppState, removeFigure} from "../../store/store";
import uniqid from 'uniqid';
import {CONSTS} from "../../consts";
import randomcolor from 'randomcolor';
import {getMaxLayer} from "../../utils";
import FileSaver from "file-saver";
import deleteImg from '../../assets/delete.svg';
import importImg from '../../assets/import.svg';
import exportImg from '../../assets/export.svg';

const Field = () => {
    const fileInput = useRef<HTMLInputElement>(null);
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
            if (e.clientX > CONSTS.MENU_WIDTH + delta.x && e.clientX < window.innerWidth - delta.x
                && e.clientY > delta.y && e.clientY < window.innerHeight - delta.y) {
                dispatch(addFigure({
                    id: uniqid(),
                    type: type,
                    position: {
                        x: e.clientX - delta.x,
                        y: e.clientY - delta.y
                    },
                    layer: getMaxLayer(figures),
                    color: randomcolor(),
                    isActive: false
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

    const clearAll = () => {
        const list = [...figures];
        for (let item of list) {
            dispatch(removeFigure(item.id));
        }
    }

    const handleClear = () => {
        const result = window.confirm('Are you sure?');
        result && clearAll();
    }

    const handleExport = () => {
        const json = JSON.stringify(figures);
        const blob = new Blob([json], {type: "text/plain;charset=utf-8"});
        FileSaver.saveAs(blob, 'kanva.json');
    }

    const handleImport = () => {
        if (fileInput.current) {
            const files = fileInput.current.files;
            if (files) {
                const reader = new FileReader();
                reader.addEventListener('load', (event) => {
                    const result = event.target?.result as string;
                    const figures = JSON.parse(result) as Figure[];
                    clearAll();
                    for (let figure of figures) {
                        dispatch(addFigure(figure));
                    }
                });
                reader.readAsText(files[0]);
            }
        }
    }

    return (
        <section className={styles.field}>
            <ul>
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
            <ul className={styles.controls}>
                <input className={styles.import_input} id="import_input" type="file" ref={fileInput} onChange={handleImport}/>
                <li className={styles.clear_button} onClick={handleClear} title="Delete all elements"></li>
                <li className={styles.export_button} onClick={handleExport} title="Export file"></li>
                <li title="Import file">
                    <label className={styles.import_label} htmlFor="import_input"></label>
                </li>
            </ul>
        </section>
    );
};

export default Field;