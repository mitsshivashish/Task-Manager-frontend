import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import CustomToolTip from "./CustomToolTip";
import CustomLegend from "./CustomLegend";

const CustomPieChart = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height={325}>
      <PieChart>
        <Pie
          data={data}
          dataKey="count"
          nameKey="status"
          cs="50%"
          cy="50%"
          outerRadius={130}
          innerRadius={100}
          labelLine={false}
        >{data.map((entry,index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]}></Cell>
        ))}</Pie>

        <Tooltip content={<CustomToolTip></CustomToolTip>}></Tooltip>
        <Legend content={<CustomLegend></CustomLegend>}></Legend>
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CustomPieChart;
