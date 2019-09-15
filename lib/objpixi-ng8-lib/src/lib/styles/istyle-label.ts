import {IStyleRect} from './istyle-rect';
import * as PIXI from 'pixi.js';
import {IStyleRectRound} from './istyle-rect-round';

export interface IStyleLabel {
    textStyle: PIXI.TextStyle;
    styleRect?: IStyleRect;
    styleRectRound?: IStyleRectRound;
    offsets?: ILabelOffsets;
}

export interface ILabelOffsets {
    left: number;
    top: number;
    right: number;
    bottom: number;
    width: number;
}
