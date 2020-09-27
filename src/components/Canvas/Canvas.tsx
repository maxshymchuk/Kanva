import React from 'react';
import styles from './canvas.module.scss';
import {useDispatch, useSelector} from "react-redux";
import {Figure, FigureType} from "../../types";
import {AppState} from "../../store/actionCreators";
import classnames from 'classnames';

const Canvas = () => {

    // const dispatch = useDispatch();

    const figures: Figure[] = useSelector(
        (state: AppState) => state.figures
    );

    return (
        <section className={styles.canvas}>
            {figures.map((figure) => {
                const type = figure.type === FigureType.Square ? 'square' : 'circle';
                const style = {
                    backgroundColor: figure.ref.style.backgroundColor,
                    zIndex: +figure.ref.style.zIndex,
                    left: figure.ref.offsetLeft,
                    top: figure.ref.offsetTop
                }
                return (
                    <div key={figure.id} className={classnames(styles.item, styles[type])} style={style}></div>
                )
            })}
        </section>
    );
};

export default Canvas;