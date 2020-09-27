import React, {useEffect, useState} from 'react';
import styles from './canvas.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {Figure, FigureType} from "../../types";
import {AppState, changeFigure, removeFigure} from "../../store/actionCreators";
import classnames from 'classnames';
import {CONSTS} from "../../consts";
import {findFigure, getMaxLayer} from "../../utils";

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

    // const [elements, setElements] = useState<HTMLDivElement[]>([]);

    const [currentItem, setCurrentItem] = useState<HTMLDivElement | undefined>();
    const [items, setItems] = useState<JSX.Element[]>([]);

    useEffect(() => {
        setItems(figures.map((figure) => {
            const type = figure.type === FigureType.Square ? 'square' : 'circle';
            const style = {
                left: figure.position.x - CONSTS.MENU_WIDTH,
                top: figure.position.y,
                zIndex: figure.layer,
                backgroundColor: figure.color
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

    }, [figures])

    useEffect(() => {
        console.log('effe')
        if (currentItem) currentItem.style.border = CONSTS.ACTIVE_BORDER;
    }, [currentItem])

    const handleClick = (e: React.MouseEvent) => {
        const item = e.target as HTMLDivElement;
    };

    const unfocusAll = () => {
        setCurrentItem(undefined);
    }

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
        if (target && (e.clientX < CONSTS.MENU_WIDTH || e.clientX > window.innerWidth
            || e.clientY < 0 || e.clientY > window.innerHeight)) {
            dispatch(removeFigure(target.id));
        }
        target = null;
    }

    const handleMouseDown = (e: React.MouseEvent) => {
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