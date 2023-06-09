import React, { PureComponent } from 'react';
import cls from 'classnames';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Button, Drawer, Popconfirm } from 'antd';
import { ListCard, ExtIcon } from 'suid';
import { constants } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './Assigned.less';

const { SERVER_PATH } = constants;

class StationAssigned extends PureComponent {
  static listCardRef;

  static propTypes = {
    currentEmployee: PropTypes.object,
    onShowAssign: PropTypes.func,
  };

  static defaultProps = {
    currentEmployee: null,
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
          {formatMessage({id: 'basic_000173', defaultMessage: '添加岗位'})}
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
          <Popconfirm title={formatMessage({id: 'basic_000174', defaultMessage: '确定要移除选择的用户吗？'})} onConfirm={this.batchRemoveAssigned}>
            <Button type="danger" loading={saving}>
              {formatMessage({id: 'basic_000133', defaultMessage: '批量移除'})}
            </Button>
          </Popconfirm>
          <span className={cls('select')}>{`${formatMessage({id: 'basic_000134', defaultMessage: '已选择'})} ${selectedKeys.length} ${formatMessage({id: 'basic_000405', defaultMessage: '项'})}`}</span>
        </Drawer>
      </>
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

  render() {
    const { currentEmployee } = this.props;
    const { selectedKeys } = this.state;
    const employeeId = get(currentEmployee, 'id', null);
    const assignedListCardProps = {
      className: 'station-box',
      bordered: false,
      checkbox: true,
      pagination: false,
      selectedKeys,
      itemField: {
        title: item => (
          <>
            {item.name}
            <span style={{ color: '#999', marginLeft: 8 }}>{`(${item.code})`}</span>
          </>
        ),
        description: item => item.organizationNamePath,
      },
      store: {
        url: `${SERVER_PATH}/sei-basic/employeePosition/getChildrenFromParentId`,
        params: {
          parentId: employeeId,
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
        {employeeId && <ListCard {...assignedListCardProps} />}
      </div>
    );
  }
}

export default StationAssigned;
