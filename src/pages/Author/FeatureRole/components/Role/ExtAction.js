import React, { Component, Fragment } from "react";
import cls from "classnames";
import { connect } from "dva";
import isEqual from 'react-fast-compare';
import { Dropdown, Menu } from "antd";
import { utils, ExtIcon } from 'seid';
import { constants } from '@/utils';
import UserView from './UserView';
import StationView from './StationView';
import styles from "./ExtAction.less";

const { getUUID } = utils;
const { ROLE_VIEW } = constants;
const { Item } = Menu;

const menuData = () => {
  return [
    {
      title: '查看岗位',
      key: ROLE_VIEW.SATION,
      disabled: false,
      icon: 'flag',
    },
    {
      title: '查看用户',
      key: ROLE_VIEW.USER,
      disabled: false,
      icon: 'user'
    }
  ];
};

@connect(({ role, loading }) => ({ role, loading }))
class ExtAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      menuShow: false,
      selectedKeys: "",
      assignUserData: [],
      assinStationData: [],
    };
  }

  componentDidUpdate() {
    const { role } = this.props;
    if (!isEqual(this.state.assignUserData, role.assignUserData)) {
      this.setState({
        assignUserData: role.assignUserData
      });
    }
    if (!isEqual(this.state.assinStationData, role.assinStationData)) {
      this.setState({
        assinStationData: role.assinStationData
      });
    }
  }

  getUserData = () => {
    const { roleData, dispatch } = this.props;
    if (roleData) {
      dispatch({
        type: 'role/getAssignedEmployeesByFeatureRole',
        payload: {
          featureRoleId: roleData.id,
        }
      });
    }
  };

  getStationData = () => {
    const { roleData, dispatch } = this.props;
    if (roleData) {
      dispatch({
        type: 'role/getAssignedPositionsByFeatureRole',
        payload: {
          featureRoleId: roleData.id,
        }
      });
    }
  };

  onActionOperation = (e, record) => {
    e.domEvent.stopPropagation();
    if (e.key === ROLE_VIEW.SATION || e.key === ROLE_VIEW.USER) {
      this.setState({
        selectedKeys: e.key,
        menuShow: true
      }, () => {
        if (e.key === ROLE_VIEW.USER) {
          this.getUserData();
        }
        if (e.key === ROLE_VIEW.SATION) {
          this.getStationData();
        }
      });
    } else {
      this.setState({
        selectedKeys: "",
        menuShow: false,
      });
    }
  };

  getMenu = (menus, record) => {
    const { loading } = this.props;
    const { selectedKeys, assignUserData, assinStationData } = this.state;
    const menuId = getUUID();
    return (
      <Menu
        id={menuId}
        className={cls(styles["action-menu-box"])}
        onClick={e => this.onActionOperation(e, record)}
        selectedKeys={[selectedKeys]}
      >
        {
          menus.map(m => {
            if (m.key === ROLE_VIEW.USER) {
              return (
                <Item key={m.key}>
                  <UserView
                    key={`user-${m.key}`}
                    loading={loading.effects['role/getAssignedEmployeesByFeatureRole']}
                    assignUserData={assignUserData}
                    menuId={menuId}
                    title={m.title}
                    icon={m.icon}
                  />
                </Item>
              );
            }
            if (m.key === ROLE_VIEW.SATION) {
              return (
                <Item key={m.key}>
                  <StationView
                    loading={loading.effects['role/getAssignedPositionsByFeatureRole']}
                    assinStationData={assinStationData}
                    menuId={menuId}
                    title={m.title}
                    icon={m.icon}
                  />
                </Item>
              );
            }
            return (
              <Item
                key={m.key}
                disabled={m.disabled}
              >
                <ExtIcon type={m.icon} antd />
                {m.title}
              </Item>
            );
          })
        }
      </Menu>
    );
  };

  onVisibleChange = v => {
    this.setState({
      menuShow: v,
      selectedKeys: !v ? "" : this.state.selectedKeys,
    });
  };

  render() {
    const { roleData } = this.props;
    const { menuShow } = this.state;
    const menusData = menuData();
    return (
      <Fragment>
        {
          menusData.length > 0
            ? <Dropdown
              trigger={["click"]}
              overlay={this.getMenu(menusData, roleData)}
              className="action-drop-down"
              placement="bottomLeft"
              visible={menuShow}
              onVisibleChange={this.onVisibleChange}
            >
              <ExtIcon className={cls('action-item')} type="more" antd />
            </Dropdown>
            : null
        }
      </Fragment>
    );
  }
}

export default ExtAction;