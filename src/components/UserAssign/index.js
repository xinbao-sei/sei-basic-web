/*
 * @Author: Eason
 * @Date: 2020-02-15 11:53:29
 * @Last Modified by: Eason
 * @Last Modified time: 2020-05-25 10:31:39
 */
import React, { Component } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { Layout, Button, Input, Tooltip } from 'antd';
import { ListLoader, ListCard } from 'suid';
import { constants } from '@/utils';
import Organization from './Organization';
import styles from './index.less';

const { SERVER_PATH } = constants;
const { Sider, Content } = Layout;
const { Search } = Input;

class UserAssign extends Component {
  static listCardRef;

  static propTypes = {
    onBackAssigned: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      orgId: null,
      selectedKeys: [],
    };
  }

  handlerOrganizationChange = orgId => {
    this.setState({ orgId });
  };

  handerAssignUserSelectChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  handlerOrganizationAfterLoaded = orgId => {
    this.setState({ orgId });
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
    const { orgId, selectedKeys } = this.state;
    const { extParams } = this.props;
    const listCardProps = {
      className: 'anyone-user-box',
      title: '可选择的用户',
      bordered: false,
      searchPlaceHolder: '输入用户代码或名称关键字查询',
      searchProperties: ['code', 'userName'],
      checkbox: true,
      selectedKeys,
      itemField: {
        title: item => item.userName,
        description: item => (
          <>
            {item.userTypeRemark}
            <br />
            {item.remark}
          </>
        ),
      },
      remotePaging: true,
      showArrow: false,
      showSearch: false,
      cascadeParams: {
        organizationId: orgId,
      },
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-basic/user/queryUsers`,
        params: { ...extParams, includeSubNode: true },
      },
      onListCardRef: ref => (this.listCardRef = ref),
      onSelectChange: this.handerAssignUserSelectChange,
      customTool: this.renderCustomTool,
    };
    return (
      <Layout className={cls(styles['user-panel-box'])}>
        <Sider width={320} className={cls('auto-height')}>
          <Organization
            onSelectChange={this.handlerOrganizationChange}
            onAfterLoaded={this.handlerOrganizationAfterLoaded}
          />
        </Sider>
        <Content className={cls('auto-height')} style={{ paddingLeft: 4 }}>
          {orgId ? <ListCard {...listCardProps} /> : <ListLoader />}
        </Content>
      </Layout>
    );
  }
}

export default UserAssign;
