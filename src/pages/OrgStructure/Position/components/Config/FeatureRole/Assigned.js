import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Drawer, Popconfirm, Tag } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import { constants } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './Assigned.less';

const { SERVER_PATH, ROLE_TYPE } = constants;

class FeatureRoleAssigned extends PureComponent {
  static listCardRef;

  static propTypes = {
    currentPosition: PropTypes.object,
    onShowAssign: PropTypes.func,
  };

  static defaultProps = {
    currentPosition: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
      removeId: '',
    };
  }

  handerAssignedStationSelectChange = selectedKeys => {
    this.setState({ selectedKeys });
  };

  handlerShowAssign = () => {
    const { onShowAssign } = this.props;
    if (onShowAssign) {
      onShowAssign();
    }
  };

  batchRemoveAssigned = () => {
    const { selectedKeys } = this.state;
    const { save } = this.props;
    if (save) {
      save(selectedKeys, re => {
        if (re.success) {
          this.listCardRef.remoteDataRefresh();
          this.setState({ selectedKeys: [] });
        }
      });
    }
  };

  removeAssigned = (item, e) => {
    e && e.stopPropagation();
    const { save } = this.props;
    if (save) {
      const selectedKeys = [item.id];
      this.setState({
        removeId: item.id,
      });
      save(selectedKeys, re => {
        if (re.success) {
          this.listCardRef.remoteDataRefresh();
          this.setState({ removeId: '', selectedKeys: [] });
        }
      });
    }
  };

  onCancelBatchRemoveAssigned = () => {
    this.setState({
      selectedKeys: [],
    });
  };

  renderCustomTool = () => {
    const { selectedKeys } = this.state;
    const { saving } = this.props;
    const hasSelected = selectedKeys.length > 0;
    return (
      <>
        <Button type="primary" icon="plus" onClick={this.handlerShowAssign}>
          {formatMessage({id: 'basic_000130', defaultMessage: '添加功能角色'})}
        </Button>
        <Drawer
          placement="top"
          closable={false}
          mask={false}
          height={44}
          getContainer={false}
          style={{ position: 'absolute' }}
          visible={hasSelected}
        >
          <Button onClick={this.onCancelBatchRemoveAssigned} disabled={saving}>
            {formatMessage({id: 'basic_000131', defaultMessage: '取消'})}
          </Button>
          <Popconfirm title={formatMessage({id: 'basic_000132', defaultMessage: '确定要移除选择的角色吗？'})} onConfirm={this.batchRemoveAssigned}>
            <Button type="danger" loading={saving}>
              {formatMessage({id: 'basic_000133', defaultMessage: '批量移除'})}
            </Button>
          </Popconfirm>
          <span className={cls('select')}>{`${formatMessage({id: 'basic_000134', defaultMessage: '已选择'})} ${selectedKeys.length} ${formatMessage({id: 'basic_000405', defaultMessage: '项'})}`}</span>
        </Drawer>
      </>
    );
  };

  renderName = row => {
    let tag;
    if (row.publicUserType && row.publicOrgId) {
      tag = (
        <Tag color="green" style={{ marginLeft: 8 }}>
          {formatMessage({id: 'basic_000103', defaultMessage: '公共角色'})}
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
          <span className="label">{formatMessage({id: 'basic_000058', defaultMessage: '用户类型'})}</span>
          <span className="value">{row.userTypeRemark}</span>
        </div>
      );
    }
    if (row.publicOrgId) {
      publicOrg = (
        <div className="field-item info">
          <span className="label">{formatMessage({id: 'basic_000018', defaultMessage: '组织机构'})}</span>
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

  renderItemAction = item => {
    const { saving } = this.props;
    const { removeId } = this.state;
    return (
      <>
        <div className="tool-action" onClick={e => e.stopPropagation()}>
          <Popconfirm title="确定要移除吗?" onConfirm={e => this.removeAssigned(item, e)}>
            {saving && removeId === item.id ? (
              <ExtIcon className={cls('del', 'action-item')} type="loading" antd />
            ) : (
              <ExtIcon className={cls('del', 'action-item')} type="minus-circle" antd />
            )}
          </Popconfirm>
        </div>
      </>
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

  render() {
    const { currentPosition } = this.props;
    const { selectedKeys } = this.state;
    const positionId = get(currentPosition, 'id', null);
    const assignedListCardProps = {
      className: 'station-box',
      bordered: false,
      checkbox: true,
      pagination: false,
      selectedKeys,
      itemField: {
        title: item => this.renderName(item),
        description: item => this.renderDescription(item),
        extra: item => this.renderRoleTypeRemark(item),
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/positionFeatureRole/getChildrenFromParentId`,
        params: {
          parentId: positionId,
        },
      },
      showArrow: false,
      showSearch: false,
      onListCardRef: ref => (this.listCardRef = ref),
      itemTool: this.renderItemAction,
      customTool: this.renderCustomTool,
      onSelectChange: this.handerAssignedStationSelectChange,
    };
    return (
      <div className={cls(styles['assigned-box'])}>
        {positionId && <ListCard {...assignedListCardProps} />}
      </div>
    );
  }
}

export default FeatureRoleAssigned;
