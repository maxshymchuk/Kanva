import React, {useEffect, useState} from 'react';
import styles from './canvas.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {Figure, FigureType} from "../../types";
import {AppState, changeFigure, removeFigure} from "../../store/store";
import classnames from 'classnames';
import {CONSTS} from "../../consts";
import {findFigure, getActive, getMaxLayer} from "../../utils";

const Canvas = () => {

    let tempIndex = 0;
    let target: HTMLElement | null = null;
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

    const [items, setItems] = useState<JSX.Element[]>([]);

    const handleDelete = (e: KeyboardEvent) => {
        if (e.key === 'Delete') {
            const figure = getActive(figures);
            figure && dispatch(removeFigure(figure.id));
        }
    }

    useEffect(() => {
        document.addEventListener('keydown', handleDelete, false);
        setItems(figures.map((figure) => {
            const type = figure.type === FigureType.Square ? 'square' : 'circle';
            const style = {
                left: figure.position.x - CONSTS.MENU_WIDTH,
                top: figure.position.y,
                zIndex: figure.layer,
                backgroundColor: figure.color,
                border: figure.isActive ? CONSTS.ACTIVE_BORDER : 'none'
            }
            return (
                <div
                    id={figure.id}
                    key={figure.id}
                    className={classnames(styles.item, styles[type])}
                    style={style}
                    onMouseDown={(e) => handleMouseDown(e)}
                    onClick={(e) => handleClick(e)}>
                </div>
            )
        }));
        return () => document.removeEventListener('keydown',  handleDelete, false);
    }, [figures])

    const unfocusAll = () => {
        const list = [...figures];
        for (let item of list) {
            item.isActive = false;
            dispatch(changeFigure(item));
        }
    }

    const handleClick = (e: React.MouseEvent) => {
        const item = e.target as HTMLDivElement;
        const figure = findFigure(figures, item.id);
        figure.isActive = true;
        dispatch(changeFigure(figure));
    };

    const handleMouseMove = (e: MouseEvent) => {
        e.preventDefault();
        if (target) {
            const addWidth = CONSTS.MENU_WIDTH + target.offsetWidth;
            const addHeight = target.offsetHeight;
            target.style.left = `${e.clientX - delta.x - CONSTS.MENU_WIDTH}px`;
            target.style.top = `${e.clientY - delta.y}px`;
            if (e.clientX >= CONSTS.MENU_WIDTH && e.clientX <= window.innerWidth
                && e.clientY >= 0 && e.clientY <= window.innerHeight) {
                if (target.offsetLeft < 0) target.style.left = '0';
                if (target.offsetTop < 0) target.style.top = '0';
                if (target.offsetLeft > window.innerWidth - addWidth) target.style.left = `${window.innerWidth - addWidth}px`;
                if (target.offsetTop > window.innerHeight - addHeight) target.style.top = `${window.innerHeight - addHeight}px`;
            }
        }
    }

    const handleMouseUp = (e: MouseEvent) => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
        const item = e.target as HTMLDivElement;
        item.style.zIndex = `${tempIndex}`;
        const figure = findFigure(figures, item.id);
        figure.position = {
            x: item.offsetLeft + CONSTS.MENU_WIDTH,
            y: item.offsetTop
        };
        dispatch(changeFigure(figure));
        if (target && (e.clientX < CONSTS.MENU_WIDTH || e.clientX > window.innerWidth
            || e.clientY < 0 || e.clientY > window.innerHeight)) {
            dispatch(removeFigure(target.id));
        }
        target = null;
    }

    const handleMouseDown = (e: React.MouseEvent) => {
        e.stopPropagation();
        unfocusAll();
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        const item = e.target as HTMLDivElement;
        if (item) {
            const bounds = item.getBoundingClientRect();
            oldCoords.x = e.clientX;
            oldCoords.y = e.clientY;
            delta.x = oldCoords.x - bounds.x;
            delta.y = oldCoords.y - bounds.y;
            tempIndex = getMaxLayer(figures);
            const figure = findFigure(figures, item.id);
            figure.layer = tempIndex;
            figure.isActive = true;
            dispatch(changeFigure(figure));
            item.style.zIndex = `${CONSTS.UPPER_LAYER}`;
            if (!target) target = item;
        }
    }

    return (
        <section className={styles.canvas} onMouseDown={unfocusAll}>
            {items}
        </section>
    );
};

export default Canvas;