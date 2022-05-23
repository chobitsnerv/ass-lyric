declare const _default: import("vue").DefineComponent<{
    currentTime: {
        type: NumberConstructor;
        required: true;
    };
    isPasued: {
        type: BooleanConstructor;
        required: true;
    };
    lyric: {
        type: StringConstructor;
        required: true;
    };
    lyricActiveClass: {
        type: StringConstructor;
        default: string;
    };
    lyricCenterClass: {
        type: StringConstructor;
        default: string;
    };
    karaokeBasicColor: {
        type: StringConstructor;
        default: string;
    };
    karaokeChangedColor: {
        type: StringConstructor;
        default: string;
    };
    lyricScrollTime: {
        type: NumberConstructor;
        default: number;
    };
    dragendWaitTime: {
        type: NumberConstructor;
        default: number;
    };
    lyricMargin: {
        type: StringConstructor;
        default: string;
    };
    lyricLineheight: {
        type: StringConstructor;
        default: string;
    };
    triangleColor: {
        type: StringConstructor;
        default: string;
    };
    triangleWidth: {
        type: StringConstructor;
        default: string;
    };
    centerLineColor: {
        type: StringConstructor;
        default: string;
    };
    centerTimeColor: {
        type: StringConstructor;
        default: string;
    };
    karaokeAutoMode: {
        type: BooleanConstructor;
        default: boolean;
    };
}, () => void, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "change-current-time"[], "change-current-time", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    currentTime: {
        type: NumberConstructor;
        required: true;
    };
    isPasued: {
        type: BooleanConstructor;
        required: true;
    };
    lyric: {
        type: StringConstructor;
        required: true;
    };
    lyricActiveClass: {
        type: StringConstructor;
        default: string;
    };
    lyricCenterClass: {
        type: StringConstructor;
        default: string;
    };
    karaokeBasicColor: {
        type: StringConstructor;
        default: string;
    };
    karaokeChangedColor: {
        type: StringConstructor;
        default: string;
    };
    lyricScrollTime: {
        type: NumberConstructor;
        default: number;
    };
    dragendWaitTime: {
        type: NumberConstructor;
        default: number;
    };
    lyricMargin: {
        type: StringConstructor;
        default: string;
    };
    lyricLineheight: {
        type: StringConstructor;
        default: string;
    };
    triangleColor: {
        type: StringConstructor;
        default: string;
    };
    triangleWidth: {
        type: StringConstructor;
        default: string;
    };
    centerLineColor: {
        type: StringConstructor;
        default: string;
    };
    centerTimeColor: {
        type: StringConstructor;
        default: string;
    };
    karaokeAutoMode: {
        type: BooleanConstructor;
        default: boolean;
    };
}>> & {
    "onChange-current-time"?: ((...args: any[]) => any) | undefined;
}, {
    lyricActiveClass: string;
    lyricCenterClass: string;
    karaokeBasicColor: string;
    karaokeChangedColor: string;
    lyricScrollTime: number;
    dragendWaitTime: number;
    lyricMargin: string;
    lyricLineheight: string;
    triangleColor: string;
    triangleWidth: string;
    centerLineColor: string;
    centerTimeColor: string;
    karaokeAutoMode: boolean;
}>;
export default _default;
