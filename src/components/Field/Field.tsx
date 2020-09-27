import React, {useRef} from 'react';
import classnames from 'classnames';
import styles from './field.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {Figure, FigureType} from "../../types";
import {addFigure, AppState, removeFigure} from "../../store/actionCreators";
import uniqid from 'uniqid';
import {CONSTS} from "../../consts";
import randomcolor from 'randomcolor';
import {getMaxLayer} from "../../utils";
import FileSaver from "file-saver";

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
                <li className={styles.clear_button} onClick={handleClear}>
                    <svg id="clear_img" enableBackground="new 0 0 413.348 413.348" width="20" height="20" viewBox="0 0 413.348 413.348" xmlns="http://www.w3.org/2000/svg">
                        <path d="m413.348 24.354-24.354-24.354-182.32 182.32-182.32-182.32-24.354 24.354 182.32 182.32-182.32 182.32 24.354 24.354 182.32-182.32 182.32 182.32 24.354-24.354-182.32-182.32z"/>
                    </svg>
                </li>
                <li className={styles.export_button} onClick={handleExport}>
                    <svg version="1.1" id="export_img" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512">
                        <path d="M435.2,153.6H320v25.6h102.4v307.2H89.6V179.2H192v-25.6H76.8c-7.1,0-12.8,5.7-12.8,12.8v332.8c0,7.1,5.7,12.8,12.8,12.8
                            h358.4c7.1,0,12.8-5.7,12.8-12.8V166.4C448,159.3,442.3,153.6,435.2,153.6z"/>
                        <path d="M170.1,96.9c4.9,5.1,13.1,5.1,18.1,0.2l55.1-53.9v275.1c0,7.1,5.7,12.8,12.8,12.8c7.1,0,12.8-5.7,12.8-12.8V43.2
                            l55.1,53.9c5,4.9,13.2,4.8,18.1-0.2c4.9-5.1,4.9-13.2-0.2-18.1L264.9,3.7c-5-4.9-13.2-4.9-18.1,0.2l-76.6,74.9
                            C165.2,83.7,165.1,91.8,170.1,96.9z"/>
                    </svg>
                </li>
                <input className={styles.import_input} id="import_input" type="file" ref={fileInput} onChange={handleImport}/>
                <li className={styles.import_button}>
                    <label className={styles.import_label} htmlFor="import_input">
                        <svg version="1.1" id="import_img" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 512 512">
                            <path d="M435.2,153.6H320v25.6h102.4v307.2H89.6V179.2H192v-25.6H76.8c-7.066,0-12.8,5.734-12.8,12.8v332.8
                            c0,7.066,5.734,12.8,12.8,12.8h358.4c7.066,0,12.8-5.734,12.8-12.8V166.4C448,159.334,442.266,153.6,435.2,153.6z"/>
                            <path d="M341.956,234.249c-4.941-5.052-13.056-5.146-18.099-0.205L268.8,287.898V12.8C268.8,5.734,263.066,0,256,0
                            c-7.066,0-12.8,5.734-12.791,12.8v275.089l-55.057-53.854c-5.043-4.941-13.158-4.847-18.099,0.205
                            c-4.941,5.06-4.855,13.158,0.205,18.099l76.8,75.128c5.043,4.949,13.158,4.855,18.099-0.188l76.595-74.931
                            C346.803,247.407,346.897,239.309,341.956,234.249z"/>
                        </svg>
                    </label>
                </li>
            </ul>
        </section>
    );
};

export default Field;