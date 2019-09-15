import * as PIXI from 'pixi.js';
import {DummyLabel} from '../interaction/info/dummy-label';
import {ILabel} from '../interface/info/ilabel';
import {Mover} from '../interaction/moving/mover';
import {IStyleLabel} from '../styles/istyle-label';
import {IStyleFill} from '../styles/istyle-fill';

export class DefaultLabel extends DummyLabel implements ILabel {

    protected text = 'N/A';
    protected readonly container: PIXI.Container;
    protected readonly gContainer: PIXI.Container;
    protected readonly interActionContainer: PIXI.Container;
    protected readonly mover: Mover;
    protected textObj: PIXI.Text;
    protected readonly widthOffset = 10;
    protected initialized = false;
    protected OriginPoint: PIXI.Point;

    constructor(style?: IStyleLabel, offsets?: PIXI.Point) {
        super();
        this.container = new PIXI.Container();
        this.gContainer = new PIXI.Container();
        this.interActionContainer = new PIXI.Container();
        this.mover = new Mover([-20,-10]);
        if (offsets !== undefined) {
            this.Offsets = offsets;
        }
        if (style !== undefined) {
            this.Style = style;
        } else {
            this.setDefaultStyle();
        }
    }

    // region Graphic
    private createRect(): PIXI.DisplayObject {
        const g = new PIXI.Graphics();
        let fStyle: IStyleFill;
        if (this.Style.styleRectRound !== undefined) {
            fStyle = this.Style.styleRectRound.rectStyle.fillStyle;
        } else {
            fStyle = this.Style.styleRect.fillStyle;
        }
        if (fStyle.useLine) {
            g.lineStyle(fStyle.lineWidth, fStyle.lineColor, fStyle.lineAlpha);
        }
        if (fStyle.useFill) {
            g.beginFill(fStyle.fillColor, fStyle.fillAlpha);
        } else {
            g.beginFill(0x546e7a, 0.01);
        }
        if (this.Style.styleRectRound !== undefined) {
            g.drawRoundedRect(0, 0, this.textObj.width + this.widthOffset, this.textObj.height,
                this.Style.styleRectRound.cornerRadius);
        } else if (this.Style.styleRect !== undefined) {
            g.drawRect(0, 0, this.textObj.width + this.widthOffset, this.textObj.height);
        }
        g.endFill();
        return g;
    }

    private createText(): PIXI.Text {
        const tmpText = new PIXI.Text(this.text, this.Style.textStyle);
        tmpText.anchor.set(0.5, 0.5);
        tmpText.x = (tmpText.width + this.Style.offsets.width) / 2;
        tmpText.y = tmpText.height / 2;
        return tmpText
    }

    // endregion

    // region events
    private registerEvents() {
        if (this.initialized) {
            return;
        }
        this.initialized = true;
        this.mover.OnRequestRender.subscribe(value => {
            this.OnRequestRender.next();
        });
        this.mover.OnMoved.subscribe(value => {
            this.Offsets.x += value.x;
            this.Offsets.y += value.y;
            this.setPosition();
            this.OnRequestRender.next();
        });
        this.mover.OnMoveEnd.subscribe(value => {
            this.interActionContainer.visible = false;
            this.OnRequestRender.next();
        });
        this.registerContainerEvents(this.container);
    }

    private registerContainerEvents(container: PIXI.DisplayObject) {
        container.interactive = true;
        container.buttonMode = true;
        container.on('click', event1 => {
            this.interActionContainer.visible = !this.interActionContainer.visible;
            this.OnRequestRender.next();
        });
        container.on('tap', event1 => {
            this.interActionContainer.visible = !this.interActionContainer.visible;
            this.OnRequestRender.next();
        });
    }

    // endregion

    // region Init

    private setDefaultStyle() {

        const textStyle = new PIXI.TextStyle({
            fontFamily: "Helvetica",
            fontWeight: "bold"
        });

        this.Style = {
            styleRect: {
                fillStyle: {
                    fillAlpha: 0.6,
                    fillColor: 0x64b5f6,
                    useFill: true,
                    useLine: false
                }
            },
            textStyle: textStyle,
            offsets: {
                width: 10,
                bottom: 0,
                left: 0,
                right: 0,
                top: 0
            }
        };
    }

    private reInit() {
        this.container.removeChildren();
        this.gContainer.removeChildren();
        this.textObj = this.createText();
        if (this.Style.styleRect !== undefined || this.Style.styleRectRound !== undefined) {
            const g = this.createRect();
            this.gContainer.addChild(g);
        }
        this.gContainer.addChild(this.textObj);
        this.container.addChild(this.gContainer);
        this.container.addChild(this.interActionContainer);
    }

    private setPosition() {
        if (this.Offsets === undefined || this.Offsets === null) {
            this.Offsets = new PIXI.Point(0, 0);
        }
        const x = this.OriginPoint.x + this.Offsets.x;
        const y = this.OriginPoint.y + this.Offsets.y;
        this.gContainer.x = x;
        this.gContainer.y = y;
    }

    // endregion

    // region ILabel
    EnableControls(state: boolean): void {
    }

    SetOffsets(point: PIXI.Point): void {
        super.SetOffsets(point);
        this.reInit();
    }

    Init(name?: string): void {
        if (name !== undefined) {
            this.text = name;
        }
        this.reInit();
        this.interActionContainer.removeChildren();
        this.mover.Generate(this.container.getBounds());
        this.mover.SetVisibility(true);
        this.interActionContainer.addChild(this.mover.GetObject());
        this.interActionContainer.visible = false;
        this.registerEvents();
        this.OnInitialized.next(this.container);
    }

    ClearSelection() {
        this.interActionContainer.visible = false;
        this.OnRequestRender.next();
    }

    SetText(text: string) {
        this.text = text;
        this.reInit();
        this.mover.recenter(this.gContainer.getBounds());
        this.OnRequestRender.next();
    }

    SetVisible(state: boolean): void {
        this.container.visible = state;
    }

    SetOriginPosition(point: PIXI.Point) {
        this.OriginPoint = point;
        this.setPosition();
        this.mover.recenter(this.gContainer.getBounds());
    }


    SetStyle(style: IStyleLabel) {
        super.SetStyle(style);
        this.reInit();
    }

// endregion
}
