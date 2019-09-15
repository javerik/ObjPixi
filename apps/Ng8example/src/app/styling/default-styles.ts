import {IStyleFill, IStyleLabel} from 'objpixi-ng8-lib';
import * as PIXI from 'pixi.js';


export class DefaultStyles {

  public static FillStyle: IStyleFill = {
    lineColor: 0xd81b60,
    useFill: false,
    useLine: true,
    fillAlpha: 0,
    fillColor: 0,
    lineAlpha: 0,
    lineWidth: 5
  };

  public static TextStyle = new PIXI.TextStyle({
    fontFamily: 'Helvetica',
    fontWeight: 'bold',
    fontSize: 26
  });

  public static LabelStyle: IStyleLabel = {
    styleRect: {
      fillStyle: {
        fillAlpha: 0.6,
        fillColor: 0x64b5f6,
        lineColor: 0x53a4e5,
        useFill: true,
        useLine: false
      }
    },
    styleRectRound: {
      rectStyle:
        {
          fillStyle: {
            fillAlpha: 0.6,
            fillColor: 0x64b5f6,
            useFill: true,
            useLine: false
          }
        },
      cornerRadius: 5
    },
    textStyle: DefaultStyles.TextStyle,
    offsets: {
      width: 10,
      bottom: 0,
      left: 0,
      right: 0,
      top: 0
    }
  };

}
