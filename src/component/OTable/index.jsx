import React, { Component } from "react";
import { HotTable } from "@handsontable-pro/react";
import { Pagination, Spin, } from 'antd';
import OTools from '../OTools';
import './style';

class OTable extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { settings, style, title, titleStyle, tools, toolsStyle, page, getInstance, loading, ...others } = this.props;
    const _loading = loading || false;
    const _settings = {
      licenseKey: "6b707-44dd1-25aa5-64530-1f53b",
      fillHandle: {
        autoInsertRow: false,
      },
      stretchH: 'all',
      // 水平垂直居中
      className: 'htCenter htMiddle',
      // 点击表格外部不会取消选中状态
      outsideClickDeselects: false,
      // 高亮当前选中行
      currentRowClassName: 'o-table-current-row',
      rowHeaders: true,
      colHeaders: true,
      rowHeights: 30,
      /** 添加自动排序会有BUG：点击添加行，第一行数据置空 */
      // columnSorting: true,
      // 默认表格的值四舍五入，保留两位小数
      /* beforeValueRender (value, cellProperties) {
        if (value !== undefined && value !== null && value !== '' && !isNaN(Number(value))) {
          value = Math.round( value * 100 ) / 100;
        }
        return value;
      }, */
      ...settings,
    };

    return (
      <div className='o-table' style={style} >
        {(title || tools) &&
          <div className='o-table-title' >
            <div style={titleStyle} className='o-table-title-text' >{title && title}</div>
            <div className='o-table-title-btn' >
              {tools && <OTools style={toolsStyle} tools={tools} tableInstance={this._Hottable} />}
            </div>
          </div>
        }
        <div className='o-table-box' >
          <HotTable
            settings={_settings}
            ref={(instance) => {
              this._Hottable = instance || {};
              if (getInstance instanceof Function) getInstance(this._Hottable);
            }}
            {...others}
          />
          {_settings.data && _settings.data.length < 1 &&
            <div className='o-table-nodata-box' >
              <span className = 'o-table-nodata' >暂无数据</span>
            </div>
          }
          <Spin spinning = { _loading } tip = { '正在加载数据...' } ><span></span></Spin>
        </div>
        {page &&
          <div className='o-table-page' >
            <Pagination {...page} />
          </div>}
      </div>
    );
  }
}

export default OTable;