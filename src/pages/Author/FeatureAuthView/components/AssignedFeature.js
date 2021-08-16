import React, { Component } from 'react';
import { connect } from 'dva';
import cls from 'classnames';
import { isEqual } from 'lodash';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { Card, Button, Empty, Tree, Input, Tooltip } from 'antd';
import { ScrollBar, ListLoader, ExtIcon } from 'suid';
import { BannerTitle } from '@/components';
import { constants } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './AssignedFeature.less';

const { FEATURE_TYPE } = constants;

const { Search } = Input;
const { TreeNode } = Tree;
const childFieldKey = 'children';
const hightLightColor = '#f50';

@connect(({ featureView, loading }) => ({ featureView, loading }))
class FeatureView extends Component {
  constructor(props) {
    super(props);
    const { featureView } = props;
    const { assignListData = [] } = featureView;
    this.state = {
      allValue: '',
      assignListData,
    };
  }

  componentDidMount() {
    this.getAssignData();
  }

  componentDidUpdate(prevProps) {
    const { featureView } = this.props;
    const { currentRoleId, assignListData } = featureView;
    if (!isEqual(prevProps.featureView.currentRoleId, currentRoleId)) {
      this.getAssignData();
    }
    if (!isEqual(prevProps.featureView.assignListData, assignListData)) {
      this.setState({
        allValue: '',
        assignListData,
      });
    }
  }

  getAssignData = () => {
    const { featureView, dispatch } = this.props;
    const { currentRoleId } = featureView;
    if (currentRoleId) {
      dispatch({
        type: 'featureView/getAssignFeatureItem',
        payload: {
          featureRoleId: currentRoleId,
        },
      });
    }
  };

  filterNodes = (valueKey, treeData) => {
    const newArr = [];
    treeData.forEach(treeNode => {
      const nodeChildren = treeNode[childFieldKey];
      const fieldValue = treeNode.name;
      if (fieldValue.toLowerCase().indexOf(valueKey) > -1) {
        newArr.push(treeNode);
      } else if (nodeChildren && nodeChildren.length > 0) {
        const ab = this.filterNodes(valueKey, nodeChildren);
        const obj = {
          ...treeNode,
          [childFieldKey]: ab,
        };
        if (ab && ab.length > 0) {
          newArr.push(obj);
        }
      }
    });
    return newArr;
  };

  getLocalFilterData = () => {
    const { featureView } = this.props;
    const { assignListData } = featureView;
    const { allValue } = this.state;
    let newData = [...assignListData];
    const searchValue = allValue;
    if (searchValue) {
      newData = this.filterNodes(searchValue.toLowerCase(), newData);
    }
    return { assignListData: newData };
  };

  handlerSearchChange = v => {
    this.setState({ allValue: v });
  };

  handlerSearch = () => {
    const { assignListData } = this.getLocalFilterData();
    this.setState({ assignListData });
  };

  renderNodeIcon = featureType => {
    let icon = null;
    switch (featureType) {
      case FEATURE_TYPE.APP_MODULE:
        icon = (
          <ExtIcon
            type="appstore"
            tooltip={{ title: '应用模块' }}
            antd
            style={{ color: '#13c2c2' }}
          />
        );
        break;
      case FEATURE_TYPE.PAGE:
        icon = <ExtIcon type="doc" tooltip={{ title: '页面' }} style={{ color: '#722ed1' }} />;
        break;
      case FEATURE_TYPE.OPERATE:
        icon = <ExtIcon type="dian" tooltip={{ title: '功能项' }} />;
        break;
      default:
    }
    return icon;
  };

  getTooltip = code => {
    return {
      placement: 'top',
      title: (
        <>
          代码
          <br />
          <span style={{ fontSize: 12, color: '#d2d2d2' }}>{code}</span>
        </>
      ),
    };
  };

  renderTreeNodes = treeData => {
    const { allValue } = this.state;
    const searchValue = allValue || '';
    return treeData.map(item => {
      const readerValue = item.name;
      const readerChildren = item[childFieldKey];
      const i = readerValue.toLowerCase().indexOf(searchValue.toLowerCase());
      const beforeStr = readerValue.substr(0, i);
      const afterStr = readerValue.substr(i + searchValue.length);
      const title =
        i > -1 ? (
          <span>
            {beforeStr}
            <span style={{ color: hightLightColor }}>{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{readerValue}</span>
        );
      const nodeTitle = (
        <>
          <Tooltip {...this.getTooltip(item.code)}>{title}</Tooltip>
        </>
      );
      if (readerChildren && readerChildren.length > 0) {
        return (
          <TreeNode title={nodeTitle} key={item.id} icon={this.renderNodeIcon(item.featureType)}>
            {this.renderTreeNodes(readerChildren)}
          </TreeNode>
        );
      }
      return (
        <TreeNode
          icon={this.renderNodeIcon(item.featureType)}
          switcherIcon={<span />}
          title={nodeTitle}
          key={item.id}
        />
      );
    });
  };

  renderTree = () => {
    const { checkedKeys, assignListData } = this.state;
    if (assignListData.length === 0) {
      return (
        <div className="blank-empty">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="暂时没有数据" />
        </div>
      );
    }
    return (
      <Tree
        className="assigned-tree"
        defaultExpandAll
        blockNode
        showIcon
        switcherIcon={<ExtIcon type="down" antd style={{ fontSize: 12 }} />}
        checkedKeys={checkedKeys}
      >
        {this.renderTreeNodes(assignListData)}
      </Tree>
    );
  };

  render() {
    const { featureView, loading } = this.props;
    const { currentRoleName } = featureView;
    const { allValue } = this.state;
    const loadingAssigned = loading.effects['featureView/getAssignFeatureItem'];
    return (
      <div className={cls(styles['assigned-feature-box'])}>
        <Card title={<BannerTitle title={currentRoleName} subTitle={formatMessage({id: 'basic_000005', defaultMessage: '功能权限'})} />} bordered={false}>
          <div className={cls('tool-box')}>
            <Button onClick={this.getAssignData} loading={loadingAssigned} icon="reload">
              <FormattedMessage id="global.refresh" defaultMessage="刷新" />
            </Button>
            <div className="tool-search-box">
              <Search
                placeholder="输入名称关键字查询"
                value={allValue}
                onChange={e => this.handlerSearchChange(e.target.value)}
                onSearch={this.handlerSearch}
                onPressEnter={this.handlerSearch}
                style={{ width: 260 }}
              />
            </div>
          </div>
          <div className="assigned-body">
            <ScrollBar>{loadingAssigned ? <ListLoader /> : this.renderTree()}</ScrollBar>
          </div>
        </Card>
      </div>
    );
  }
}

export default FeatureView;
