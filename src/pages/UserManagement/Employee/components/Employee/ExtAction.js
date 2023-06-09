import React, { PureComponent } from 'react';
import cls from 'classnames';
import { Dropdown, Menu } from 'antd';
import { utils, ExtIcon } from 'suid';
import { constants } from '@/utils';
import { formatMessage } from 'umi-plugin-react/locale';
import styles from './ExtAction.less';

const { getUUID } = utils;
const { EMPLOYEE_ACTION } = constants;
const { Item } = Menu;

const menuData = () => [
  {
    title: formatMessage({id: 'basic_000151', defaultMessage: '配置岗位'}),
    key: EMPLOYEE_ACTION.STATION,
    disabled: false,
  },
  {
    title: formatMessage({id: 'basic_000126', defaultMessage: '配置功能角色'}),
    key: EMPLOYEE_ACTION.FEATURE_ROLE,
    disabled: false,
  },
  {
    title: formatMessage({id: 'basic_000127', defaultMessage: '配置数据角色'}),
    key: EMPLOYEE_ACTION.DATA_ROLE,
    disabled: false,
  },
  {
    title: formatMessage({id: 'basic_000147', defaultMessage: '重置密码'}),
    key: EMPLOYEE_ACTION.RESET_PASSWORD,
    disabled: false,
  },
  {
    title: formatMessage({id: 'basic_000152', defaultMessage: '复制权限到用户'}),
    key: EMPLOYEE_ACTION.COPY_AUTH,
    disabled: false,
  },
];

class ExtAction extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
      selectedKeys: '',
    };
  }

  onActionOperation = e => {
    e.domEvent.stopPropagation();
    this.setState({
      selectedKeys: '',
      menuShow: false,
    });
    const { onAction, employeeData } = this.props;
    if (onAction) {
      onAction(e.key, employeeData);
    }
  };

  getMenu = menus => {
    const { selectedKeys } = this.state;
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles['action-menu-box'])}
        onClick={e => this.onActionOperation(e)}
        selectedKeys={[selectedKeys]}
      >
        {menus.map(m => {
          return (
            <Item key={m.key} disabled={m.disabled}>
              <span className="view-popover-box-trigger">{m.title}</span>
            </Item>
          );
        })}
      </Menu>
    );
  };

  onVisibleChange = v => {
    const { selectedKeys } = this.state;
    this.setState({
      menuShow: v,
      selectedKeys: !v ? '' : selectedKeys,
    });
  };

  render() {
    const { menuShow } = this.state;
    const menusData = menuData();
    return (
      <>
        {menusData.length > 0 ? (
          <Dropdown
            trigger={['click']}
            overlay={this.getMenu(menusData)}
            className="action-drop-down"
            placement="bottomLeft"
            visible={menuShow}
            onVisibleChange={this.onVisibleChange}
          >
            <ExtIcon className={cls('action-item')} type="more" antd />
          </Dropdown>
        ) : null}
      </>
    );
  }
}

export default ExtAction;
