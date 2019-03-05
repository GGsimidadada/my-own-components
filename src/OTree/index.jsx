import React from 'react';
import './style';
import { Input, Tree } from 'antd';
const Search = Input.Search;
const TreeNode = Tree.TreeNode;

class OTree extends React.Component {
  constructor(props, context) {
    super(props, context);

    // 事件数列
    this.treeEvent = {
      'onSelect': ['onTreeSelect', 'afterTreeSelect'],
      'afterSelect': ['afterTreeSelect'],
      'onCheck': ['onTreeCheck', 'afterTreeCheck'],
      'afterCheck': ['afterTreeCheck'],
      'onExpand': ['onTreeExpand', 'afterTreeExpand'],
      'afterExpand': ['afterTreeExpand']
    };
    this.searchEvent = {
      'onSearch': ['onTreeSearch', 'afterTreeSearch'],
      'afterSearch': ['afterTreeSearch'],
      'onChange': ['onInputChange', 'afterInputChange'],
      'afterChange': ['afterInputChange'],
      'onBlur': ['onInputBlur', 'afterInputBlur'],
      'afterBlur': ['afterInputBlur'],
      'onFocus': ['onInputFocus', ['afterInputFocus']],
      'afterFocus': ['afterInputFocus']
    };

    const treeFuncList = this.addEvent(this.treeEvent);
    const searchFuncList = this.addEvent(this.searchEvent);
    // 默认的searchOption配置
    this.searchOption = Object.assign({
      placeholder: '搜索内容',
      style: {
        marginBottom: '5px'
      },
    }, searchFuncList);
    // 默认的tree配置
    this.treeOption = Object.assign({
      // ...默认配置
    }, treeFuncList);

    this.state = {
      treeOption: {

      },
      searchOption: {

      }
    };
  }

    componentWillMount() {
      this.initData(this.props);
    }

    componentDidMount() {

    }

    componentWillReceiveProps(nextProps) {
      this.initData(nextProps);
    }

    componentDidUpdate() {

    }

    // 初始化缓存
    initData(proto) {
      this.dataList = [];
      this.treeData = proto.treeData || [];
      this.generateList(this.treeData);
      this.searchable = this.isSearchAble(proto.search);
    }

    // 按下回车或者点击搜索按钮触发
    onTreeSearch(e) {
      this.search(e);
    }

    // 搜索框输入值触发
    onInputChange(e) {
      this.search(e);
    }

    // 点击展开树的按钮触发
    onTreeExpand(expandedKeys, e) {
      /* let { expandedKeys = [] } = this.state.treeOption;
      const key = e.node.props.eventKey;

      if (expandedKeys.indexOf(key) > -1) expandedKeys = expandedKeys.filter(item => item !== key);
      else expandedKeys = expandedKeys.concat(key); */

      /* this.setState({
        treeOption: Object.assign(this.state.treeOption, { expandedKeys })
      }); */
    }

    // 搜索
    search(e) {
      let value;
      let expandedKeys;
      if (typeof e === 'object') value = e.target.value;
      if (typeof e === 'string') value = e;

      if (value) {
        expandedKeys = [];
        this.dataList.forEach((item) => {
          if (item.title.indexOf(value) > -1) {
            const parentKeys = this.getParentKey(item.key);
            expandedKeys = !expandedKeys.includes(parentKeys) && expandedKeys.concat(parentKeys);
          }
        });
      } else {
        expandedKeys = this.state.treeOption.expandedKeys;
      }

      this.setState({
        treeOption: Object.assign(this.state.treeOption, { expandedKeys }),
        searchOption: Object.assign(this.state.searchOption, { searchValue: value }),
      });
    }

    // 找出符合搜索条件的节点并高亮显示
    loop(data) {
      const { searchValue = '' } = this.state.searchOption;
      return data.map((item) => {
        const index = item.title.indexOf(searchValue);
        const beforeStr = item.title.substr(0, index);
        const afterStr = item.title.substr(index + searchValue.length);
        const title = index > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: '#f50' }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : <span>{item.title}</span>;
        const newData = {};
        Object.keys(item).forEach(key => {
          if (key !== 'children') {
            if (key === 'title') newData[key] = title;
            else newData[key] = item[key];
          }
        });
        if (item.children) {
          return (
            <TreeNode {...newData} dataRef={item} >
              {this.loop(item.children)}
            </TreeNode>
          );
        }
        return <TreeNode {...newData} dataRef={item} />;
      });
    }

    // 创建列表副本便于搜索
    generateList(data, key) {
      for (let i = 0; i < data.length; i++) {
        this.dataList.push(Object.assign(data[i], { parentKey: key }));
        if (data[i].children) {
          this.generateList(data[i].children, data[i].key);
        }
      }
    };

    // 根据内容找到父级所有的key
    getParentKey(key) {
      let keys = [];
      const find = key => {
        const data = this.dataList.filter(item => item.key === key)[0];
        if (data.parentKey) {
          keys = keys.concat(data.parentKey);
          find(data.parentKey);
        }
      };
      find(key);
      return keys;
    };

    // 注册默认函数
    addEvent(events) {
      const reg = /^on/g;
      const funcList = {};
      const _this = this;
      Object.keys(events).forEach(key => {
        if (this[events[key][0]] instanceof Function !== true) this[events[key][0]] = () => { /* console.log('addevent' + key); */ };
        if (reg.test(key)) {
          funcList[key] = function () {
            _this[events[key][0]](...arguments);
            _this[events[key][1]](...arguments);
          };
        }
      });
      return funcList;
    }

    // 根据传入的值判断是否需要显示搜索框
    isSearchAble(searchOption) {
      if (searchOption === undefined || searchOption === null) return false;
      else if (typeof searchOption === 'boolean') return searchOption;
      else if (searchOption instanceof Object) {
        Object.assign(this.searchOption, searchOption);
        return searchOption.searchable || false;
      }
      else throw new Error('search 需要设置为 Boolean 或者 Object');
    }

    // 设置搜索选项
    setSearchOption(searchOption) {
      if (searchOption instanceof Object) {
        let newSearchOption = {};
        // 将非函数覆盖默认值，将函数注册到组件中，覆盖原方法。
        Object.keys(searchOption).forEach(key => {
          if (searchOption[key] instanceof Function) key in this.searchEvent && (this[this.searchOption[key][0]] = searchOption[key]);
          else newSearchOption[key] = searchOption[key];
        });
        return Object.assign(this.searchOption, newSearchOption);
      }
      return this.searchOption;
    }

    // 设置树选项
    setTreeOption(treeOption) {
      if (treeOption instanceof Object) {
        let newTreeOption = {};
        // 将非函数覆盖默认值，将函数注册到组件中，覆盖原方法。
        Object.keys(treeOption).forEach(key => {
          if (treeOption[key] instanceof Function) key in this.treeEvent && (this[this.treeEvent[key][0]] = treeOption[key]);
          else newTreeOption[key] = treeOption[key];
        });

        return Object.assign(this.treeOption, this.state.treeOption, newTreeOption);
      }
      return Object.assign(this.treeOption, this.state.treeOption);
    }

    // 渲染树节点
    renderTreeNodes(treeData, funcname) {
      if (treeData instanceof Array) {
        return treeData.map(data => {
          // 由于TreeNode不能直接传入children属性，因此创建一个不含children的副本
          const { children, ...others } = data;
          if (children) {
            return (
              <TreeNode { ...others } dataRef={ data } >
                  {this.renderTreeNodes(children)}
              </TreeNode>
            );
          }
          return <TreeNode { ...others } dataRef={ data } />;
        });
      } else {
        throw new Error('treeData 必须是数组');
      }
    }

  render() {
    const { style } = this.props;
    const treeOption = this.setTreeOption(this.props.tree);
    const searchOption = this.setSearchOption(this.props.search);
    const className = this.searchable ? 'o-tree-box-s' : 'o-tree-box';
    return (
      <div className = 'o-tree' style = { style } >
        {
          this.searchable
          &&
          <Search className = 'o-tree-search-box' {...searchOption} />
        }
        {
          this.treeData.length > 0 ?
            <Tree className = { className } {...treeOption} >
              { this.searchable ? this.loop(this.treeData) : this.renderTreeNodes(this.treeData) }
            </Tree>
            :
            <span>暂无数据</span>
        }
      </div>                
    );
  }
}

export default OTree;