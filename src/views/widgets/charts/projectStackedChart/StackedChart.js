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
                completed: "#6672FB",
                InProgress: "#F8B849",
                // Maintenance: "#ccc"
            },
            // chartData: [
            //   {
            //     hour: 0,
            //     Deployed: 0,
            //     InProgress: 0,
            //     Maintenance: 0
            //   },
            //   {
            //     hour: 1,
            //   },
            //   {
            //     hour: 10,
            //   },
            //   {
            //     hour: 11,
            //     Deployed: 1208,
            //     InProgress: 1944.5,
            //     Maintenance: 1652
            //   },
            //   {
            //     hour: 12,
            //     Deployed: 4796,
            //     InProgress: 6652,
            //     Maintenance: 7552.5
            //   },
            //   {
            //     hour: 13,
            //     Deployed: 3874.5,
            //     InProgress: 195.5,
            //     Maintenance: 1981.5
            //   },
            //   {
            //     hour: 14,
            //     Deployed: 3782,
            //     InProgress: 1070,
            //     Maintenance: 79
            //   },
            //   {
            //     hour: 15,
            //     Deployed: 2202.5,
            //     InProgress: 3830.5,
            //     Maintenance: 53
            //   },
            //   {
            //     hour: 16,
            //     Deployed: 0,
            //     InProgress: 0,
            //     Maintenance: 0
            //   },
            //   {
            //     hour: 17,
            //     Deployed: 1583,
            //     InProgress: 4312,
            //     Maintenance: 5935
            //   },
            //   {
            //     hour: 18,
            //     Deployed: 11988.5,
            //     InProgress: 20095.5,
            //     Maintenance: 36946
            //   },
            //   {
            //     hour: 19,
            //     Deployed: 18289,
            //     InProgress: 26658,
            //     Maintenance: 48218
            //   },
            //   {
            //     hour: 20,
            //     Deployed: 6484,
            //     InProgress: 9871.5,
            //     Maintenance: 15534
            //   },
            //   {
            //     hour: 21,
            //     Deployed: 3640.5,
            //     InProgress: 2003.5,
            //     Maintenance: 2966
            //   },
            //   {
            //     hour: 22,
            //     Deployed: 4366,
            //     InProgress: 1067.5,
            //     Maintenance: 624
            //   },
            //   {
            //     hour: 23,
            //     Deployed: 21.5,
            //     InProgress: 55,
            //     Maintenance: 1607.5
            //   }
            // ]
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
                            key={`${index}`}
                            className="legend-item"
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

        return (
            <div>
                <ResponsiveContainer height={150}>
                    <BarChart layout="horizontal" data={this.props.data}>
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
                            dataKey="time_span"
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
