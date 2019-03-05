export interface IProps {
    // Point数据集合
    data: Point[],
    // 控制播放暂停
    play?: boolean,
    // 当前Point索引
    currentIndex?: number,
    // 播放的时间间隔，默认2000毫秒
    interval?: number,
    // 播放暂停的回调函数
    onPlay?: (play: boolean) => void,
    // 切换Point的回调函数
    onSwitch?: (currentIndex: number) => void,
}

export interface IState {
    play: boolean,
    currentIndex: number,
    pointInterval: number,
}

export interface Point {
    key: string,
    title: string,
    [prop: string]: any,
}