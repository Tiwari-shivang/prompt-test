import React from "react";
import {
    BarChart,
    Tooltip,
    Bar,
    XAxis,
    Legend,
    YAxis,
    ResponsiveContainer,
    Surface,
    Symbols
} from "recharts";
import _ from "lodash";
import './stackedChart.scss'

class SampleChart extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            disabled: [],
            chartColors: {
                "Human Resource": "#6672FB",
                "Project Manager": "#F8B849",
                "developer": "#ccc",
                "Quality Engineer": "#ff808b"
            },
        };
    }

    handleClick = dataKey => {
        if (_.includes(this.state.disabled, dataKey)) {
            this.setState({
                disabled: this.state.disabled.filter(obj => obj !== dataKey)
            });
        } else {
            this.setState({ disabled: this.state.disabled.concat(dataKey) });
        }
    };

    renderCusomizedLegend = ({ payload }) => {
        return (
            <div className="customized-legend">
                {payload.map((entry, index) => {
                    const { dataKey, color } = entry;
                    const active = _.includes(this.state.disabled, dataKey);
                    const style = {
                        marginRight: 10,
                        color: active ? "#AAA" : "#000"
                    };

                    return (
                        <span
                            className="legend-item"
                            key={`${index}`}
                            onClick={() => this.handleClick(dataKey)}
                            style={style}
                        >
                            <Surface
                                width={10}
                                height={10}
                                viewBox={{x: 0, y: 0, width: 10, height: 10}}
                            >
                                <Symbols cx={5} cy={5} type="circle" size={50} fill={color} />
                                {active && (
                                    <Symbols
                    cx={5}
                    cy={5}
                    type="circle"
                    size={25}
                    fill={"#FFF"}
                  />
                                )}
                            </Surface>
                            <span>{dataKey}</span>
                        </span>
                    );
                })}
            </div>
        );
    };

    render() {
        const empData = []
        this.props && this.props.data && this.props.data.map((item, i) => {
                return empData.push({...item, "month":item.date.split("-")[0]})
            })
        return (
            <div>
                <ResponsiveContainer height={150}>
                    <BarChart layout="horizontal" data={empData}>
                        {_.toPairs(this.state.chartColors)
                            .filter(pair => !_.includes(this.state.disabled, pair[0]))
                            .map(pair => (
                                <Bar
                                    stackId="a"
                                    key={pair[0]}
                                    dataKey={pair[0]}
                                    fill={pair[1]}
                                    barSize={6}
                                />
                            ))}
                        <YAxis
              type="number"
            />
                        <XAxis
                            domain={[0, 23]}
                            dataKey="month"
                            interval="preserveStartEnd"
                            padding={{ top: 20, bottom: 20 }}
                            tickCount={10}
                        />
                        <Tooltip cursor={{fill: 'transparent'}}/>
                        <Legend
                            verticalAlign="bottom"
                            height={26}
                            align="left"
                            payload={_.toPairs(this.state.chartColors).map(pair => ({
                                dataKey: pair[0],
                                color: pair[1]
                            }))}
                            content={this.renderCusomizedLegend}
                        />
                        <Tooltip />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        );
    }
}

export default SampleChart;
