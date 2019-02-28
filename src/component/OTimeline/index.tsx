import React, { Component } from 'react';
import './style';
import { IProps, IState, Point } from './interface';
import { Button } from 'antd';

export default class OTimeline extends Component<IProps, IState> {
    public readonly state: IState = {
        play: true,
        currentIndex: 0,
        pointInterval: 1,
    };
    public timer: number | void = void 0;
    public static readonly pointWidth: number = 65;
    public lineDOM: HTMLDivElement | null = null;
    public pointInterval: number = 1;

    constructor (props: IProps) {
        super(props);
        this.calcPointPosition = this.calcPointPosition.bind(this);
    }

    componentDidMount () {
        this.initState();
        window.addEventListener('resize', this.calcPointPosition);
    }

    componentWillReceiveProps (nextProps: IProps) {
        this.initState(nextProps);
    }

    componentDidUpdate () {
        this.autoPlay();
        this.calcPointPosition();
    }

    componentWillUnmount () {
        if (this.timer !== void 0) clearInterval(this.timer);
        window.removeEventListener('resize', this.calcPointPosition);
    }

    // 初始化组件状态
    initState (props: IProps = this.props) {
        let keys = Object.keys(props);
        keys = keys.filter(key => this.state.hasOwnProperty(key));
        const state = keys.reduce((obj, key) => {
            obj[key] = props[key];
            return obj;
        }, {});
        this.setState({ ...state });
    }

    // true 代表播放， false 代表暂停
    autoPlay () {
        const { play, currentIndex } = this.state;
        if (this.timer !== void 0) clearInterval(this.timer);
        if (play) {
            this.timer = setInterval(() => {
                this.handleChange('switch', currentIndex + 1);
            }, this.props.interval || 2000);
        }
    }

    calcPointPosition () {
        const { data = [] } = this.props;
        if (this.lineDOM == null) return;
        const num = data.length;
        const maxWidth = this.lineDOM.clientWidth;
        // 最大显示数量向下取整
        const maxNum = ~~(maxWidth / OTimeline.pointWidth);
        // 间隔数向上取整
        const pointInterval = ~~(num / maxNum) + 1;
        if (pointInterval !== this.state.pointInterval) this.setState({ pointInterval });
    }

    /**
     * 
     * @param sign 函数标志
     * @param value 传递的值
     * @param info 函数执行需要的其他参数
     */
    handleChange (sign: string, value?: any, info?: any) {
        const { data = [], onSwitch, onPlay } = this.props;
        const signMap = {
            play: () => {
                onPlay instanceof Function && onPlay(value);
                this.setState({ play: value });
            },
            switch: () => {
                if (value < 0) value = data.length - 1;
                if (value > data.length - 1) value = 0;
                onSwitch instanceof Function && onSwitch(value);
                this.setState({ currentIndex: value });
            },
        }
        signMap[sign] && signMap[sign]();
    }

    /**
     * 
     * @param data 
     * @param currentKey 
     */
    renderPoints (data: Point[], currentIndex: number, pointInterval: number) {
        return data.map((d, index) => (
            <div className = 'o-timeline-item' key = { d.key } >
                <div 
                    className = { `o-timeline-point ${ index === currentIndex ? 'o-timeline-point-active' : '' }` }
                    title = { d.title }
                    onClick = { () => this.handleChange('switch', index) }
                ></div>
                { index % pointInterval === 0 && <div 
                    className = 'o-timeline-title'
                    onClick = { () => this.handleChange('switch', index) }
                >{ d.title }</div> }
            </div>
        ));
    }

    render () {
        const { play, currentIndex, pointInterval } = this.state;
        const { data } = this.props;
        return (
            <div className = 'o-timeline-container' >
                <div className = 'o-timeline-wrap' >
                    <div className = 'o-timeline-btn' >
                        <Button onClick = { (e) => this.handleChange('play', !play) } type="dashed" shape="circle" icon={ play ? 'pause' : 'caret-right' } />
                    </div>
                    <div className = 'o-timeline-btn' >
                        <Button onClick = { (e) => this.handleChange('switch', currentIndex -1) } type="primary" icon="caret-left" />
                    </div>
                    <div className = 'o-timeline-box' >
                        <div className = 'o-timeline-line' ref = { (d) => this.lineDOM = d } >
                            { this.renderPoints(data, currentIndex, pointInterval) }
                        </div>
                    </div>
                    <div className = 'o-timeline-btn' >
                        <Button onClick = { (e) => this.handleChange('switch', currentIndex + 1) } type="primary" icon="caret-right" />
                    </div>
                </div>
            </div>
        )
    }
}