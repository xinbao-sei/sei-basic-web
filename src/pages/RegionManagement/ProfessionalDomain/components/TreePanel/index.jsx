import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Empty, Popconfirm, Button, message, } from 'antd';
import { formatMessage, } from "umi-plugin-react/locale";
import { ToolBar } from 'seid';
import { cloneDeep, isEqual, } from 'lodash';
import cls from 'classnames';
import CreateFormModal from './CreateFormModal';
import MoveTreeModal from './MoveTreeModal';
import TreeView from '@/components/TreeView';

@connect(({ professionalDomain, }) => ({ professionalDomain, }))
class TreePanel extends Component {

  state = {
    mTmVisible: false,
  };

  getMoveTreeData = (selectedNode, treeData) => treeData.map((item, key) => {
    if (item.children && item.children.length > 0) {
      if (item.id !== selectedNode.id) {
        item.children = this.getMoveTreeData(selectedNode, item.children);
        return item;
      }
    } else {
      if (item.id !== selectedNode.id) {
        return item;
      }
    }
  }).filter((treeNode) => treeNode);

  moveCurNodeFromTree = (currNode) => {
    const { professionalDomain, } = this.props;
    const { treeData } = professionalDomain;
    return this.getMoveTreeData(currNode, cloneDeep(treeData));
  }

  handleSelect = (selectedItems) => {
    if (selectedItems && selectedItems.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'professionalDomain/updateState',
        payload: {
          selectedTreeNode: selectedItems[0],
          moveTreeData: this.moveCurNodeFromTree(selectedItems[0])
        },
      });
    }
  }

  handleTreeOpt = (type) => {
    const { professionalDomain, dispatch, } = this.props;
    const { selectedTreeNode } = professionalDomain;

    switch(type) {
      case "addRootNode":
      case "addChildNode":
        this.formType = type;
        if (type === 'addChildNode' && !selectedTreeNode) {
          message.warn("请选择父亲节点！");
        } else {
          dispatch({
            type: 'professionalDomain/updateState',
            payload: {
              showCreateModal: true,
            },
          });
        }
        break;
      case "showMoveModal":
        if (selectedTreeNode) {
          if (selectedTreeNode.parentId) {
            this.setState({
              mTmVisible: true,
            });
          } else {
            message.warn('根节点不能移动！');
          }
        } else {
          message.warn('请选择要移动的节点！');
        }
        break;
      case "moveNode":
        if (this.targetParentNode) {
          this.setState({
            mTmVisible: false,
          });
          dispatch({
            type: 'professionalDomain/move',
            payload: {
              nodeId: selectedTreeNode.id,
              targetParentId: this.targetParentNode.id,
            },
          }).then(res => {
            if (res.success) {
              this.targetParentNode = null;

              this.reloadData();
            }
          });
        } else {
          message.warn('请选择要移动到的父节点！');
        }
        break;
      case "delNode":
        if (selectedTreeNode) {
          dispatch({
            type: 'professionalDomain/del',
            payload: {
              id: selectedTreeNode.id
            },
          }).then(res => {
            if (res.success) {
              dispatch({
                type: 'professionalDomain/updateState',
                payload: {
                  selectedTreeNode: null,
                },
              });
              this.reloadData();
            }
          });
        } else {
          message.warn('请选择要删除的节点！');
        }
        break;
    }
  }

  handleCancel = (type) => {
    if (type == "create") {
      const { dispatch } = this.props;
      dispatch({
        type: 'professionalDomain/updateState',
        payload: {
          showCreateModal: false,
        },
      });
    } else {
      this.setState({
        mTmVisible: false
      });
    }
  }

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "professionalDomain/queryTree",
    });
  }

  getToolBarProps = () => {
    return {
      left: (<Fragment>
        <Button style={{ marginRight: 8}} type="primary" onClick={() => {this.handleTreeOpt('addRootNode')}}>新增根节点</Button>
        <Button.Group onChange={(e) => { this.handleTreeOpt(e.target.value) }} >
          <Button onClick={() => {this.handleTreeOpt('addChildNode')}}>创建节点</Button>
          <Button onClick={() => {this.handleTreeOpt('showMoveModal')}}>移动</Button>
          <Popconfirm
            placement="topLeft"
            title={formatMessage({ id: "global.delete.confirm", defaultMessage: "确定要删除吗？提示：删除后不可恢复" })}
            onConfirm={_ => {this.handleTreeOpt('delNode')}}
          >
            <Button type="danger">删除</Button>
          </Popconfirm>
        </Button.Group>
      </Fragment>),
    };
  }

  render() {
    const { mTmVisible, } = this.state;
    const { professionalDomain, } = this.props;
    const { showCreateModal, moveTreeData, selectedTreeNode, treeData } = professionalDomain;

    return (
      <div>
        <TreeView treeData={treeData} toolBar={this.getToolBarProps()} onSelect={this.handleSelect} />
        { showCreateModal ? (
          <CreateFormModal
            formType={this.formType}
            title={this.formType==="addRootNode" ? "新增根节点" : '新增子节点' }
            visible={showCreateModal}
            onCancel={() => { this.handleCancel('create') }}
          />
         ) : (null)
        }
        { mTmVisible ? (<MoveTreeModal
          treeData={moveTreeData}
          visible={mTmVisible}
          title={`移动结点【${selectedTreeNode.name}】到:`}
          onCancel={() => { this.handleCancel('move') }}
          onChange={(node) => { this.targetParentNode = node; }}
          onMove={() => { this.handleTreeOpt('moveNode') }}
          />
          ) : (null)}
      </div>
    );
  }
}

export default TreePanel;