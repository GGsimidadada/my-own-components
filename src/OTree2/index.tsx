import React, { Component } from 'react';
import { Tree, Input, Button } from 'antd';
const TreeNode = Tree.TreeNode;
const data: TreeNode[] = [
    {
        key: 'root', title: 'root', children: [
            { key: 'child1', title: 'child1' },
            { key: 'child2', title: 'child2' },
            { key: 'child3', title: 'child3' },
        ]
    }
];

interface TreeNode {
    key: string,
    title: string,
    children?: TreeNode[],
}

export default class OTree2 extends Component {
    public state = {
        data,
        selectedKeys: [],
    }

    setTitle2Key(data: TreeNode[], value: string, key: string) {
        for (let item of data) {
            if (item.key === key) {
                item.title = value;
                return true;
            }
            if (item.children instanceof Array && item.children.length > 0) {
                const result = this.setTitle2Key(item.children, value, key);
                if (result) return true;
            }
        }
        return false;
    }

    addData2Key (data: TreeNode[], value: TreeNode, key: string) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.key === key) {
                data.splice(i + 1, 0, value);
                return true;
            }
            if (item.children instanceof Array && item.children.length > 0) {
                const result = this.addData2Key(item.children, value, key);
                if (result) return true;
            }
        }
        return false;
    }

    removeData2Key (data: TreeNode[], key: string) {
        for (let i = 0; i < data.length; i++) {
            const item = data[i];
            if (item.key === key) {
                data.splice(i, 1);
                return true;
            }
            if (item.children instanceof Array && item.children.length > 0) {
                const result = this.removeData2Key(item.children, key);
                if (result) return true;
            }
        }
        return false;
    }

    handleRename(value: string, key: string) {
        const { data } = this.state;
        const result = this.setTitle2Key(data, value, key);
        if (result) this.setState({ data });
    }

    handleAdd () {
        const { data, selectedKeys } = this.state;
        const key = selectedKeys[0];
        if (key) {
            const result = this.addData2Key(data, { key: `${ Math.random() }`, title: '新建节点' }, key);
            console.log(data);
            if (result) this.setState({ data });
        } else {
            data.push({ key: `${ Math.random() }`, title: '新建节点' });
            this.setState({ data });
        }
    }

    handleDelete () {
        const { data, selectedKeys } = this.state;
        const key = selectedKeys[0];
        if(key) {
            const result = this.removeData2Key(data, key);
            if (result) this.setState({ data });
        }
    }

    handleSelect (keys: string[], info: any) {
        const { selectedKeys } = this.state;
        if (keys.length === 0) keys = selectedKeys;
        this.setState({ selectedKeys: keys });
    }

    renderTreeNode(data: any[]) {
        return data.map(d => {
            if (d.children instanceof Array) {
                return <TreeNode
                    key={d.key}
                    title={
                        <RenameTitle
                            asKey={d.key}
                            title={d.title}
                            afterChange={(value, key) => this.handleRename(value, key)}
                        />
                    }
                    dataRef={d} >
                    {this.renderTreeNode(d.children)}
                </TreeNode>
            }
            return <TreeNode
                key={d.key}
                title={
                    <RenameTitle
                        asKey={d.key}
                        title={d.title}
                        afterChange={(value, key) => this.handleRename(value, key)}
                    />
                }
                dataRef={d}
            />
        });
    }

    render() {
        const { data, selectedKeys } = this.state;
        return (
            <div>
                <div>
                    <Button onClick = { () => this.handleAdd() } >增加</Button>
                    <Button onClick = { () => this.handleDelete() } >删除</Button>
                </div>
                <Tree
                    selectedKeys = { selectedKeys }
                    onSelect = { (keys, info) => this.handleSelect(keys, info) }
                >
                    {this.renderTreeNode(data)}
                </Tree>
            </div>
        )
    }
}

interface RTProps {
    title: string,
    asKey: string,
    afterChange: (value: string, key: string) => void
}

class RenameTitle extends Component<RTProps> {
    public state = {
        isRename: false,
    }

    handleBlur(value: string) {
        this.handleRename(value);
        this.onClose();
    }

    handleRename(value: string) {
        const { afterChange, asKey } = this.props;
        afterChange instanceof Function && afterChange(value, asKey);
    }

    onClose() {
        this.setState({ isRename: false });
    }

    onOpen() {
        this.setState({ isRename: true });
    }

    render() {
        const { isRename } = this.state;
        const { title } = this.props;
        return (
            <div
                style={{
                    height: '100%',
                    position: 'relative'
                }}
                onDoubleClick={() => this.onOpen()}
            >
                <span>{title}</span>
                {isRename &&
                    <Input
                        autoFocus={true}
                        defaultValue={title}
                        style={{
                            position: 'absolute',
                            top: '0',
                            left: '0',
                            width: '100%',
                            minWidth: '100px',
                            height: '100%',
                            backgroundColor: '#fff'
                        }}
                        onBlur={(e) => this.handleBlur(e.target.value)}
                    />}
            </div>
        )
    }
}