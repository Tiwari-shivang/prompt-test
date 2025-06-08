import React, { useCallback, useState } from "react";
import { useNavigate } from 'react-router-dom'
import { PieChart, Pie, Sector, Cell, ResponsiveContainer, Legend } from "recharts";
import { useGetEmployeeCount } from '../../../../query/members/allMembers/allMembersQuery'
import './doughnutChart.scss'

const COLORS = ["#0088FE", "#FF8042"];

const renderActiveShape = (props) => {
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
    name
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 5) * cos;
  const sy = cy + (outerRadius + 5) * sin;
  const mx = cx + (outerRadius + 10) * cos;
  const my = cy + (outerRadius + 15) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 8;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={5} textAnchor="middle" fill={fill} 
        fontSize="12">
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 8}
        y={ey}
        textAnchor={textAnchor}
        fill="#333"
        fontSize="10"
      >{`${name}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 8}
        y={ey}
        dy={13}
        textAnchor={textAnchor}
        fill="#999"
        fontSize="10"
      >
        {`${value}`}
      </text>
    </g>
  );
};

const DoughnutChart = () => {
  const navigate = useNavigate()
  const { data, isLoading } = useGetEmployeeCount();
  if(data.male){
    var employee = [
      { name: "Male", value: data.male },
      { name: "Female", value: data.female }
    ]
  }



  const [activeIndex, setActiveIndex] = useState(0);
  const onPieEnter = useCallback(
    (_, index) => {
      setActiveIndex(index);
    },
    [setActiveIndex]
  );

  const handlerClickOnItems = (data) => {
    navigate("/dashboard/employeeList", { state: { data } })
  }

  const renderLegend = (props) => {
    const { payload } = props;
  
    return (
      <ul>
        {
          payload.map((item, index) =>(
            <li key={index} style={{color : `${item.color}`, borderColor:`${item.color}`, cursor:'pointer',}}  onClick={() => handlerClickOnItems(item.value)}>{item.value}</li>
          ))
        }
      </ul>
    );
  }


  return (
      <ResponsiveContainer width="100%" height={166}>
        <PieChart >
        <Pie
            activeIndex={activeIndex}
            activeShape={renderActiveShape}
            data={employee}
            cx={"50%"}
            cy={"50%"}
            innerRadius={"52%"}
            outerRadius={"70%"}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={0}
            onMouseEnter={onPieEnter}
        >
            {employee.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </Pie>
            
            <Legend 
             content={renderLegend}
            />
        </PieChart>
      </ResponsiveContainer>

  );
}
export default DoughnutChart
