import React, { Component } from 'react';
import { cloneDeep } from 'lodash';
import { connect } from 'dva';
import { Popconfirm, Button } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { message } from 'suid';
import TreeView from '@/components/TreeView';
import CreateFormModal from './CreateFormModal';
import MoveTreeModal from './MoveTreeModal';

@connect(({ professionalDomain }) => ({ professionalDomain }))
class TreePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mTmVisible: false,
    };
  }

  getMoveTreeData = (selectedNode, treeData) =>
    treeData
      .map(item => {
        const node = { ...item };
        if (node.children && node.children.length > 0) {
          if (node.id !== selectedNode.id) {
            node.children = this.getMoveTreeData(selectedNode, node.children);
            return node;
          }
        } else if (node.id !== selectedNode.id) {
          return node;
        }
        return null;
      })
      .filter(treeNode => treeNode);

  moveCurNodeFromTree = currNode => {
    const { professionalDomain } = this.props;
    const { treeData } = professionalDomain;
    return this.getMoveTreeData(currNode, cloneDeep(treeData));
  };

  handleSelect = selectedItems => {
    if (selectedItems && selectedItems.length) {
      const { dispatch } = this.props;
      dispatch({
        type: 'professionalDomain/updateState',
        payload: {
          selectedTreeNode: selectedItems[0],
          moveTreeData: this.moveCurNodeFromTree(selectedItems[0]),
        },
      });
    }
  };

  handleTreeOpt = type => {
    const { professionalDomain, dispatch } = this.props;
    const { selectedTreeNode } = professionalDomain;

    switch (type) {
      case 'addRootNode':
      case 'addChildNode':
        this.formType = type;
        if (type === 'addChildNode' && !selectedTreeNode) {
          message.warn(formatMessage({id: 'basic_000178', defaultMessage: '请选择父亲节点！'}));
        } else {
          dispatch({
            type: 'professionalDomain/updateState',
            payload: {
              showCreateModal: true,
            },
          });
        }
        break;
      case 'showMoveModal':
        if (selectedTreeNode) {
          if (selectedTreeNode.parentId) {
            this.setState({
              mTmVisible: true,
            });
          } else {
            message.warn(formatMessage({id: 'basic_000179', defaultMessage: '根节点不能移动！'}));
          }
        } else {
          message.warn(formatMessage({id: 'basic_000180', defaultMessage: '请选择要移动的节点！'}));
        }
        break;
      case 'moveNode':
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
              selectedTreeNode.parentId = this.targetParentNode.id;
              this.targetParentNode = null;

              this.reloadData().then(() => {
                dispatch({
                  type: 'professionalDomain/updateState',
                  payload: {
                    selectedTreeNode,
                  },
                });
              });
            }
          });
        } else {
          message.warn(formatMessage({id: 'basic_000181', defaultMessage: '请选择要移动到的父节点！'}));
        }
        break;
      case 'delNode':
        if (selectedTreeNode) {
          dispatch({
            type: 'professionalDomain/del',
            payload: {
              id: selectedTreeNode.id,
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
          message.warn(formatMessage({id: 'basic_000182', defaultMessage: '请选择要删除的节点！'}));
        }
        break;
      default:
        break;
    }
  };

  handleCancel = type => {
    if (type === 'create') {
      const { dispatch } = this.props;
      dispatch({
        type: 'professionalDomain/updateState',
        payload: {
          showCreateModal: false,
        },
      });
    } else {
      this.setState({
        mTmVisible: false,
      });
    }
  };

  reloadData = () => {
    const { dispatch } = this.props;
    return dispatch({
      type: 'professionalDomain/queryTree',
    });
  };

  getToolBarProps = () => ({
    /** 左部占用一行 */
    rowLeft: true,
    left: (
      <>
        <Button
          style={{ marginRight: 8 }}
          type="primary"
          onClick={() => {
            this.handleTreeOpt('addRootNode');
          }}
        >
          {formatMessage({id: 'basic_000183', defaultMessage: '新增根节点'})}
        </Button>
        <Button.Group
          onChange={e => {
            this.handleTreeOpt(e.target.value);
          }}
        >
          <Button
            onClick={() => {
              this.handleTreeOpt('addChildNode');
            }}
          >
            {formatMessage({id: 'basic_000184', defaultMessage: '创建节点'})}
          </Button>
          <Button
            onClick={() => {
              this.handleTreeOpt('showMoveModal');
            }}
          >
            {formatMessage({id: 'basic_000185', defaultMessage: '移动'})}
          </Button>
          <Popconfirm
            placement="topLeft"
            title={formatMessage({
              id: 'global.delete.confirm',
              defaultMessage: formatMessage({id: 'basic_000021', defaultMessage: '确定要删除吗？提示：删除后不可恢复'}),
            })}
            onConfirm={() => {
              this.handleTreeOpt('delNode');
            }}
          >
            <Button type="danger">{formatMessage({id: 'basic_000186', defaultMessage: '删除'})}</Button>
          </Popconfirm>
        </Button.Group>
      </>
    ),
  });

  render() {
    const { mTmVisible } = this.state;
    const { professionalDomain } = this.props;
    const { showCreateModal, moveTreeData, selectedTreeNode, treeData } = professionalDomain;

    return (
      <div style={{ height: '100%' }}>
        <TreeView
          treeData={treeData}
          toolBar={this.getToolBarProps()}
          onSelect={this.handleSelect}
        />
        {showCreateModal ? (
          <CreateFormModal
            formType={this.formType}
            title={this.formType === 'addRootNode' ? formatMessage({id: 'basic_000183', defaultMessage: '新增根节点'}) : formatMessage({id: 'basic_000187', defaultMessage: '新增子节点'})}
            visible={showCreateModal}
            onCancel={() => {
              this.handleCancel('create');
            }}
          />
        ) : null}
        {mTmVisible ? (
          <MoveTreeModal
            treeData={moveTreeData}
            visible={mTmVisible}
            title={formatMessage({id: 'basic_000188', defaultMessage: '移动结点【{node}】到'}, {node: selectedTreeNode.name})}
            onCancel={() => {
              this.handleCancel('move');
            }}
            onChange={node => {
              this.targetParentNode = node;
            }}
            onMove={() => {
              this.handleTreeOpt('moveNode');
            }}
          />
        ) : null}
      </div>
    );
  }
}

export default TreePanel;
