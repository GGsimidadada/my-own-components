import React from "react";
import './style';
// 引入 ECharts 主模块
import ReactEcharts from 'echarts-for-react';
import echarts from 'echarts';

class OChart extends React.Component {
    constructor (props, context) {
        super(props, context);
        this.defaultOptions = {
            title: {
                show: false
            },
            legend: {
                show: true,
            },
            grid: {
                left: "5%",
                right: "5%",
                top: 40,
                bottom: 30
            },
            xAxis: {
                show: true,
            },
            yAxis: {
                show: true,
                name: "值",
                axisLabel: {
                    formatter: "{value}"
                }
            },
            dataZoom: {
                type: "inside"
            },
            tooltip: {
                show: true,
                trigger: "axis",
                axisPointer: {
                    type: "cross"
                },
                confine: true,
                transitionDuration: 0,
            },
            series: {
                type: "line",
            }
        };

    }

    componentDidMount() {
        
    }

    componentWillReceiveProps(nextProps, nextStates) {
        
    }

    // 设置图形配置
    setChartOption(options = {}) {
        let type = 'default';
        if (options.hasOwnProperty('baseOption')) {
            type = 'timeline';
        }
        return this._setOption(options, type) || {};
    }

    _setOption (options, type) {
        const defaultOptions = this.defaultOptions;
        const funcMap = {
            'timeline': () => {
                const newOptions = {
                    baseOption: {
                        grid: {
                            left: "5%",
                            right: "5%",
                            top: 40,
                            bottom: 100,
                        },
                        timeline: {
                            axisType: 'category',
                            // realtime: false,
                            // loop: false,
                            autoPlay: true,
                            // currentIndex: 2,
                            playInterval: 3000,
                            bottom: 20,
                            label: { interval: 0 },
                        }
                    },
                    options: [ ...options.options ],
                };
                Object.keys(options.baseOption).forEach(key => {
                    if (options.baseOption[key] instanceof Array) {
                        newOptions.baseOption[key] = options.baseOption[key].map(item => Object.assign({}, defaultOptions[key], item));
                    } else {
                        newOptions.baseOption[key] = Object.assign({}, defaultOptions[key], newOptions.baseOption[key], options.baseOption[key]);
                    }
                });
                Object.keys(defaultOptions).forEach(key => {
                    if (!newOptions.baseOption.hasOwnProperty(key)) newOptions.baseOption[key] = Object.assign({}, defaultOptions[key], newOptions.baseOption[key]);
                });
                return newOptions;
            },
            'default': () => {
                const newOptions = {};
                Object.keys(options).forEach(key => {
                    if (options[key] instanceof Array) {
                        newOptions[key] = options[key].map(item => Object.assign({}, defaultOptions[key], item));
                    } else {
                        newOptions[key] = Object.assign({}, defaultOptions[key], options[key]);
                    }
                });
        
                Object.keys(defaultOptions).forEach(key => {
                    if (!newOptions.hasOwnProperty(key)) newOptions[key] = Object.assign({}, defaultOptions[key]);
                });
                return newOptions;
            },
        };
        return funcMap[type] && funcMap[type]();
    }
    
    render () {
        const { className, style, options, ...others } = this.props;
        return (
            <div className = 'o-chart-box' >
                <ReactEcharts
                    option = { this.setChartOption(options) }
                    className = { [ 'o-chart', className ].join(' ') }
                    style = {{ width: '100%', height: '100%', ...style }}
                    { ...others }
                />
            </div>
        );
    }
} 

export default OChart;