// Draft ECharts option (not mounted on index.html).
// Runnable page: examples/plantar-pressure.html
// Series JSON: examples/data/plantar-pressure.json
// https://gallery.echartsjs.com/editor.html?c=xHyucjzxWZ
// 折线+饼图
// 足部压力数据图
option = {
    backgroundColor: "#96e8eb",
    color: ['#a60bde', '#ff733f', '#a60bde'],

    title: [{
        text: '足部压力数据图(单位: Pa)',
        left: '1%',
        top: '6%',
        textStyle: {
            color: '#5d59d4'
        }
    }, {
        text: '统计数据来源',
        left: '83%',
        top: '6%',
        textAlign: 'center',
        textStyle: {
            color: '#5d59d4'
        }
    }],
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        x: 300,
        top: '7%',
        textStyle: {
            color: '#5d59d4',
        },
        data: ['正常人群', '糖尿病足人群', '潍V']
    },
    grid: {
        left: '1%',
        right: '35%',
        top: '16%',
        bottom: '6%',
        containLabel: true
    },
    toolbox: {
        "show": false,
        feature: {
            saveAsImage: {}
        }
    },
    xAxis: {
        type: 'category',
        "axisLine": {
            lineStyle: {
                color: '#fff'
            }
        },
        "axisTick": {
            "show": false
        },
        axisLabel: {
            textStyle: {
                color: '#c196eb',
            }
        },
        boundaryGap: false,
        data: ['位点一', '位点二', '位点三', '位点四', '位点五', '位点六', '位点七']
    },
    yAxis: {
        "axisLine": {
            lineStyle: {
                color: '#fff'
            }
        },
        splitLine: {
            show: true,
            lineStyle: {
                color: '#fff'
            }
        },
        "axisTick": {
            "show": false
        },
        axisLabel: {
            textStyle: {
                color: '#c996eb'
            }
        },
        type: 'value'
    },
    series: [{
        name: '正常人群',
        smooth: true,
        type: 'line',
        symbolSize: 8,
      	symbol: 'circle',
        data: [90, 50, 39, 50, 120, 82, 80]
    },{
        name: '糖尿病足人群',
        smooth: true,
        type: 'line',
        symbolSize: 8,
      	symbol: 'circle',
        data: [290, 200,20, 132, 15, 200, 90]
    }, 
    {
        type: 'pie',
        center: ['83%', '33%'],
        radius: ['25%', '30%'],
        label: {
            normal: {
                position: 'center'
            }
        },
        data: [{
            value: 335,
            name: '用户来源分析',
            itemStyle: {
                normal: {
                    color: '#a60bde'
                }
            },
            label: {
                normal: {
                    formatter: '{d} %',
                    textStyle: {
                        color: '#a60bde',
                        fontSize: 20

                    }
                }
            }
        }, {
            value: 180,
            name: '占位',
            tooltip: {
                show: false
            },
            itemStyle: {
                normal: {
                    color: '#87CEFA'
                }
            },
            label: {
                normal: {
                    textStyle: {
                        color: '#a60bde',
                    },
                    formatter: '\正常人群'
                }
            }
        }]
    },


   ]
}