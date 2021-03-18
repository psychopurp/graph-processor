import ReactEchartsCore from "echarts-for-react/lib/core";
import * as echarts from "echarts";
import "echarts/lib/chart/line";
import "echarts/lib/component/tooltip";
import { useRequest } from "ahooks";
import { getEdges } from "../api/getTasks";

export const Graph = (props) => {
  const { data, error, loading } = useRequest(
    () => {
      return getEdges(props.filepath);
    },
    { initialData: [] },
  );

  return (
    <div style={{ height: "100%", width: "100%" }}>
      {" "}
      <ReactEchartsCore
        echarts={echarts}
        theme="light"
        option={getOptions(data)}
        style={{ height: "100%", width: "100%", marginTop: "0px" }}
      />
    </div>
  );
};

const getOptions = (data) => {
  let links = [];
  let nodes = [];
  let nodeSet = new Set();
  if (data.length !== 0) {
    for (let item of data) {
      nodeSet.add(item[0]);
      nodeSet.add(item[1]);
      links.push({
        source: item[0],
        target: item[1],
      });
    }
  }
  for (let item of nodeSet) {
    nodes.push({ name: item });
  }
  console.log(links);
  return {
    title: {
      text: "Graph",
    },
    tooltip: {},
    animationDurationUpdate: 1500,
    animationEasingUpdate: "quinticInOut",
    series: [
      {
        type: "graph",
        layout: "circular",
        symbolSize: 1,
        roam: true,
        label: {
          show: false,
        },
        force: {
          repulsion: 20,
        },
        data: nodes,
        links: links,
        lineStyle: {
          opacity: 0.5,
          width: 0.3,
          curveness: 0,
        },
      },
    ],
  };
};
