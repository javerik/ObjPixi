export interface ITextStyle {
    textSize: number;
    fontFamily?: string;
    fontColor?: string;
    textAlignment?: TextAlignment
}

export enum TextAlignment {
    Left = "left",
    Right = "right",
    Center = "center",
    Top = "top",
    Bottom = "bottom"
}
