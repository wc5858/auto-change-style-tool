import React from 'react';
import DataSet from '@antv/data-set';

let bizcharts;
if (process.browser) {
  bizcharts = require('bizcharts');
}

class ShowColors extends React.Component {
  render() {
    if (!process.browser) {
      return <div />;
    }
    const { Chart, Geom, Tooltip } = bizcharts;
    const { DataView } = DataSet;
    const data = {
      name: 'root',
      children: this.props.colorData
    };
    const dv = new DataView();
    dv.source(data, {
      type: 'hierarchy'
    }).transform({
      field: 'value',
      type: 'hierarchy.treemap',
      tile: 'treemapResquarify',
      as: ['x', 'y']
    });
    const nodes = dv.getAllNodes();
    nodes.map(node => {
      node.name = node.data.name;
      node.value = node.data.value;
      return node;
    });
    const scale = {
      value: {
        nice: false
      }
    };
    const htmlStr =
      '<li data-index={index}>' +
      '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
      '{name}<br/>' +
      '<span style="padding-left: 16px">占比：{count}%</span><br/>' +
      '</li>';
    return (
      <div>
        <Chart
          data={nodes}
          forceFit={true}
          height={window.innerWidth / 2}
          width={window.innerWidth / 2}
          scale={scale}
        >
          <Tooltip showTitle={false} itemTpl={htmlStr} />
          <Geom
            type="polygon"
            position="x*y"
            color={['name', name => `rgba(${name})`]}
            tooltip={[
              'name*value',
              (name, count) => ({
                name,
                count: (count * 100).toFixed(2)
              })
            ]}
            style={{
              lineWidth: 1,
              stroke: '#fff'
            }}
          />
        </Chart>
      </div>
    );
  }
}

export default ShowColors;
