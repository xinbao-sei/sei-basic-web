/*
 * @Author: Eason
 * @Date: 2020-02-15 11:53:29
 * @Last Modified by: Eason
 * @Last Modified time: 2020-05-25 10:57:36
 */
import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Layout, Button, Input, Tooltip, Tag } from 'antd';
import { ListCard } from 'suid';
import { constants } from '@/utils';
import RoleGroup from './RoleGroup';
import styles from './index.less';

const { SERVER_PATH, ROLE_TYPE } = constants;
const { Sider, Content } = Layout;
const { Search } = Input;

class FeatureRoleAssign extends Component {
  static listCardRef;

  static propTypes = {
    onBackAssigned: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      roleGroupId: null,
      selectedKeys: [],
    };
  }

  handlerSelectRoleGroupChange = roleGroupId => {
    this.setState({ roleGroupId });
  };

  handerAssignUserSelectChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  handlerSearchChange = v => {
    this.listCardRef.handlerSearchChange(v);
  };

  handlerSearch = () => {
    this.listCardRef.handlerSearch();
  };

  assignedSave = () => {
    const { selectedKeys } = this.state;
    const { save, onBackAssigned } = this.props;
    if (save) {
      save(selectedKeys, re => {
        if (re.success) {
          onBackAssigned && onBackAssigned();
        }
      });
    }
  };

  assignedCancel = () => {
    this.setState({ selectedKeys: [] });
  };

  renderName = row => {
    let tag;
    if (row.publicUserType && row.publicOrgId) {
      tag = (
        <Tag color="green" style={{ marginLeft: 8 }}>
          公共角色
        </Tag>
      );
    }
    return (
      <>
        {row.name}
        {tag}
      </>
    );
  };

  renderDescription = row => {
    let pubUserType;
    let publicOrg;
    if (row.publicUserType) {
      pubUserType = (
        <div className="field-item info">
          <span className="label">用户类型</span>
          <span className="value">{row.userTypeRemark}</span>
        </div>
      );
    }
    if (row.publicOrgId) {
      publicOrg = (
        <div className="field-item info">
          <span className="label">组织机构</span>
          <span className="value">{row.publicOrgName}</span>
        </div>
      );
    }
    return (
      <div className="desc-box">
        <div className="field-item">{row.code}</div>
        {publicOrg || pubUserType ? (
          <div className="public-box">
            {pubUserType}
            {publicOrg}
          </div>
        ) : null}
      </div>
    );
  };

  renderRoleTypeRemark = item => {
    switch (item.roleType) {
      case ROLE_TYPE.CAN_USE:
        return <span style={{ color: '#52c41a', fontSize: 12 }}>{item.roleTypeRemark}</span>;
      case ROLE_TYPE.CAN_ASSIGN:
        return <span style={{ color: '#fa8c16', fontSize: 12 }}>{item.roleTypeRemark}</span>;
      default:
    }
  };

  renderCustomTool = () => {
    const { selectedKeys } = this.state;
    const { saving } = this.props;
    const hasSelected = selectedKeys.length > 0;
    return (
      <>
        <div>
          <Button type="danger" ghost disabled={!hasSelected} onClick={this.assignedCancel}>
            取消
          </Button>
          <Button
            type="primary"
            disabled={!hasSelected}
            loading={saving}
            onClick={this.assignedSave}
          >
            {`确定 (${selectedKeys.length})`}
          </Button>
        </div>
        <div>
          <Tooltip title="输入名称关键字查询">
            <Search
              placeholder="输入名称关键字查询"
              onChange={e => this.handlerSearchChange(e.target.value)}
              onSearch={this.handlerSearch}
              onPressEnter={this.handlerSearch}
              style={{ width: 132 }}
            />
          </Tooltip>
        </div>
      </>
    );
  };

  render() {
    const { roleGroupId, selectedKeys } = this.state;
    const { currentPosition } = this.props;
    const listCardProps = {
      className: 'anyone-user-box',
      title: '可选择的角色',
      bordered: false,
      searchPlaceHolder: '输入代码或名称关键字查询',
      checkbox: true,
      selectedKeys,
      itemField: {
        title: item => this.renderName(item),
        description: item => this.renderDescription(item),
        extra: item => this.renderRoleTypeRemark(item),
      },
      showArrow: false,
      showSearch: false,
      cascadeParams: {
        featureRoleGroupId: roleGroupId,
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/position/getCanAssignedFeatureRoles`,
        params: { positionId: get(currentPosition, 'id', null) },
      },
      onListCardRef: ref => (this.listCardRef = ref),
      onSelectChange: this.handerAssignUserSelectChange,
      customTool: this.renderCustomTool,
    };
    return (
      <Layout className={cls(styles['user-panel-box'])}>
        <Sider width={280} className={cls('auto-height')}>
          <RoleGroup onSelectChange={this.handlerSelectRoleGroupChange} />
        </Sider>
        <Content className={cls('auto-height')} style={{ paddingLeft: 4 }}>
          <ListCard {...listCardProps} />
        </Content>
      </Layout>
    );
  }
}

export default FeatureRoleAssign;