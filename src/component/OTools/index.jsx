import React, { Component } from "react";
import { Button, Popconfirm, Upload, Icon, Input } from 'antd';
import './style';
import XLSX from 'xlsx';

class OTools extends Component {
  constructor (props) {
    super(props);
  }
  
  // 循环生成表头
  _getColHeaders (headers) {
    if (headers instanceof Array) return { datas: [ headers ], nestedMergeCells: [], };
    return { datas: [], nestedMergeCells: [], };
  }

  // 生成多行表头，及合并单元格规则
  _getNestedHeaders (headers) {
    const result = [];
    const nestedMergeCells = [];
    for (let i = 0; i < headers.length; i++) {
      const header = headers[i];
      result[i] = [];
      for (let j = 0; j < header.length; j++) {
        const head = header[j];
        if (head instanceof Object) {
          const { label, colspan } = head;
          const _len = result[i].length;
          result[i].length = result[i].length + Number(colspan);
          result[i].fill(label, _len);
          nestedMergeCells.push({
            s: {
              r: i,
              c: _len,
            },
            e: {
              r: i,
              c: result[i].length - 1,
            },
          });
        } else {
          result[i].push(head);
        }
      }
    }
    return { datas: result, nestedMergeCells, };
  }
  
  // 生成合并单元格规则
  _getMergeCells (cells, num) {
    const result = [];
    for (let i = 0; i < cells.length; i++) {
      const cell = cells[i];
      result[i] = { 
        s: {
          r: cell.row + num,
          c: cell.col,
        },
        e: {
          r: cell.row + num + cell.rowspan - 1,
          c: cell.col + cell.colspan - 1,
        },
      };
    }
    return result;
  }

  // 将字母转换为对应的索引，例如：A -> 1, B -> 2, ..., AA -> 27, AB -> 28, ...
  _convertL2C (letter) {
    const _letterArr = letter.toUpperCase().split('').reverse();
    let code = 0;
    _letterArr.forEach((item, index) => {
      // 字母转索引为26进制
      code += (item.charCodeAt() - 64) * Math.pow(26, index);
    });
    return code;
  }

  // 提取数字
  _getNum (str) {
    return str.replace(/[^0-9]/ig,""); 
  }

  // 提取字母
  _getLetter (str) {
    return str.replace(/[^a-zA-Z]/ig,"");
  }

  // 判断是否是大写字母开头，数字结尾，并且只有大写字母和数字，即表格坐标
  _isCellPos (pos) {
    return /^[A-Z][A-Z0-9]*[0-9]$/g.test(pos);
  }

  // 将一个sheet转换成二维数组
  _sheet2ArrOfArr (sheet) {
    // 设置单元格起始坐标和结束坐标，生成空的二位数组
    const [ StartP, EndP ] = sheet['!ref'].split(':');
    let [ startR, startC, endR, endC ] = [ this._getNum(StartP) - 0, this._convertL2C(this._getLetter(StartP)), this._getNum(EndP) - 0, this._convertL2C(this._getLetter(EndP)), ];
    if (startR > endR) [ startR, endR ] = [ endR, startR ];
    if (startC > endC) [ startC, endC ] = [ endC, startC ];
    const _ArrOfArr = new Array(endR - startR + 1).fill(void 0).map(() => new Array(endC - startC + 1).fill(''));
    // 遍历sheet的属性，将单元格数据塞进二维数组中
    Object.keys(sheet).forEach(item => {
      if (this._isCellPos(item)) _ArrOfArr[this._getNum(item) - 1][this._convertL2C(this._getLetter(item)) - 1] = sheet[item].v.toString();
    });
    return _ArrOfArr;
  }

  // 将一个sheet转成最终的excel文件的blob对象，然后利用URL.createObjectURL下载
  sheet2blob (sheet, sheetName) {
    sheetName = sheetName || 'sheet1';
    var workbook = {
        SheetNames: [sheetName],
        Sheets: {}
    };
    workbook.Sheets[sheetName] = sheet;
    // 生成excel的配置项
    var wopts = {
        bookType: 'xlsx', // 要生成的文件类型
        bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
        type: 'binary'
    };
    var wbout = XLSX.write(workbook, wopts);
    var blob = new Blob([s2ab(wbout)], {type:"application/octet-stream"});
    // 字符串转ArrayBuffer
    function s2ab(s) {
        var buf = new ArrayBuffer(s.length);
        var view = new Uint8Array(buf);
        for (var i=0; i!=s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
        return buf;
    }
    return blob;
  }

  /**
    * 通用的打开下载对话框方法，没有测试过具体兼容性
    * @param url 下载地址，也可以是一个blob对象，必选
    * @param saveName 保存文件名，可选
  */
  openDownloadDialog(url, saveName) {
    if(typeof url == 'object' && url instanceof Blob) {
      url = URL.createObjectURL(url); // 创建blob地址
    }
    var aLink = document.createElement('a');
    aLink.href = url;
    aLink.download = saveName || ''; // HTML5新增的属性，指定保存文件名，可以不要后缀，注意，file:///模式下不会生效
    var event;
    if(window.MouseEvent) event = new MouseEvent('click');
    else {
      event = document.createEvent('MouseEvents');
      event.initMouseEvent('click', true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    }
    aLink.dispatchEvent(event);
  }

  // 点击导出按钮
  handleExport (e) {
    const { tools } = this.props;
    if (tools) {
      if (tools.handleExport instanceof Function) tools.handleExport(e, this._Hottable);
      else if (tools.handleExport === true || tools.handleExport instanceof Object) {
        const TABLE = this._Hottable.hotInstance;
        console.log(this._Hottable)
        const settings = TABLE.getSettings();
        let tableName = '表格.xlsx';
        /* const cellStyle = {
          alignment: {
            vertical: 'center',
            horizontal: 'center',
          }
        }; */

        let datas = TABLE.getData();
        let colHeaders = settings.nestedHeaders ? this._getNestedHeaders(settings.nestedHeaders) : this._getColHeaders(settings.colHeaders);
        let mergeCells = settings.mergeCells && this._getMergeCells(settings.mergeCells, colHeaders.datas.length);

        datas = [ ...colHeaders.datas, ...datas ];
        mergeCells = [ ...colHeaders.nestedMergeCells, ...mergeCells ];

        const sheet = XLSX.utils.aoa_to_sheet(datas);
        if (mergeCells.length > 0) sheet['!merges'] = mergeCells;
        if (tools.handleExport instanceof Object && tools.handleExport.filename) tableName = tools.handleExport.filename;
        this.openDownloadDialog(this.sheet2blob(sheet), tableName);
      }
    }
  }

  // 点击导入按钮
  handleImport (e) {
    const { tools } = this.props;
    const file = e.file;
    // 创建文件读取器
    const fileReader = new FileReader();
    // 以二进制方式打开文件
    fileReader.readAsBinaryString(file);
    fileReader.onload = (e) => {
      let workbook = {};
      try {
        const data = e.target.result;
        workbook = XLSX.read(data, {type:"binary"});
      } catch (e) {
        console.log('文件类型不正确');
        return;
      }
      // 读取第一张表
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      // 获取二维数组结果
      const ArrOfArr = this._sheet2ArrOfArr(sheet);

      // 根据传入数据的类型不同进行相应的处理
      if (tools.handleImport instanceof Object && tools.handleImport.afterImport instanceof Function) tools.handleImport.afterImport(ArrOfArr, this._Hottable);
      else if (tools.handleImport === true) {
        const TABLE = this._Hottable.hotInstance;
        TABLE.loadData(ArrOfArr);
      }
    };
  }

  // 点击上传按钮
  handleUpload (e) {
    const { tools } = this.props;
    if (tools) tools.handleUpload instanceof Function && tools.handleUpload(e);
  }

  // 点击增加按钮
  handleAdd (e) {
    const { tools } = this.props;
    if (tools) tools.handleAdd instanceof Function && tools.handleAdd(e);
  }

  // 点击删除按钮
  handleDelete (e) {
    const { tools } = this.props;
    if (tools) tools.handleDelete instanceof Function && tools.handleDelete(e);
  }

  // 点击修改按钮
  handleModify (e) {
    const { tools } = this.props;
    if (tools) tools.handleModify instanceof Function && tools.handleModify(e);
  }

  // 点击保存按钮
  handleSave (e) {
    const { tools } = this.props;
    if (tools) tools.handleSave instanceof Function && tools.handleSave(e);
  }

  // 点击查看按钮
  handleDescribe (e) {
    const { tools } = this.props;
    if (tools) tools.handleDescribe instanceof Function && tools.handleDescribe(e);
  }

  render () {
    const { style, tools, tableInstance, } = this.props;
    const text = '确定删除选中数据？';
    this._Hottable = tableInstance;

    return (        
      tools && 
        <div className = 'o-tools' style = { style } >
          {tools.handleExport && <Button icon = 'export' onClick = { (e) => this.handleExport(e) } >{ tools.exportTitle || '导出' }</Button>}
          {tools.handleImport && 
            <Upload
              action = ''
              showUploadList = { false }
              multiple = { false }
              // onChange = { (info) => this.handleImport(info) }
              customRequest = { (e) => this.handleImport(e) }
            >
              <Button icon = 'import' >{ tools.importTitle || '导入' }</Button>
            </Upload>
          }
          {tools.handleUpload && 
            <Upload
              onChange = { (info) => this.handleUpload(info) }
            >
              <Button icon = 'upload' >{ tools.uploadTitle || '上传' }</Button>
            </Upload>
          }
          {tools.handleAdd && <Button type="primary" icon="plus"  onClick = { (e) => this.handleAdd(e) } >{ tools.addTitle || '增加' }</Button>}
          { tools.handleDelete && 
            <Popconfirm 
              placement="top" 
              title={ text } 
              onConfirm={ (e) => this.handleDelete(e) } 
              okText="确定" 
              cancelText="取消"
            >
              <Button type="danger" icon="delete" >删除</Button>
            </Popconfirm> }
          {tools.handleModify && <Button icon="edit"  onClick = { (e) => this.handleModify(e) } >{ tools.modifyTitle || '修改' }</Button> }
          {tools.handleDescribe && <Button icon="info-circle"  onClick = { (e) => this.handleDescribe(e) } >{ tools.describeTitle || '查看' }</Button> }
          {tools.handleSave && <Button icon="save"  onClick = { (e) => this.handleSave(e) } >{ tools.saveTitle || '保存' }</Button>}
        </div>
    );
  }
}

export default OTools;