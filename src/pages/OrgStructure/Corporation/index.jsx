import React, { Component } from 'react';
import { connect } from 'dva';
import { get } from 'lodash';
import cls from 'classnames';
import { Button, Popconfirm, Tag } from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
import { ExtTable, utils, ExtIcon, DataAudit } from 'suid';
import { constants } from '@/utils';
import FormModal from './FormModal';
import styles from './index.less';

const { DataAduitButton } = DataAudit;
const { APP_MODULE_BTN_KEY } = constants;
const { authAction } = utils;

@connect(({ corporation, loading }) => ({ corporation, loading }))
class Corporation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      delRowId: null,
    };
  }

  reloadData = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'corporation/queryList',
    });
  };

  add = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'corporation/updateState',
      payload: {
        showModal: true,
        rowData: null,
      },
    });
  };

  edit = rowData => {
    const { dispatch } = this.props;
    dispatch({
      type: 'corporation/updateState',
      payload: {
        showModal: true,
        rowData,
      },
    });
  };

  save = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'corporation/save',
      payload: {
        ...data,
      },
    }).then(res => {
      if (res.success) {
        dispatch({
          type: 'corporation/updateState',
          payload: {
            showModal: false,
          },
        });
        this.reloadData();
      }
    });
  };

  del = record => {
    const { dispatch } = this.props;
    this.setState(
      {
        delRowId: record.id,
      },
      () => {
        dispatch({
          type: 'corporation/del',
          payload: {
            id: record.id,
          },
        }).then(res => {
          if (res.success) {
            this.setState({
              delRowId: null,
            });
            this.reloadData();
          }
        });
      },
    );
  };

  closeFormModal = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'corporation/updateState',
      payload: {
        showModal: false,
        rowData: null,
      },
    });
  };

  renderDelBtn = row => {
    const { loading } = this.props;
    const { delRowId } = this.state;
    if (loading.effects['corporation/del'] && delRowId === row.id) {
      return <ExtIcon className="del-loading" type="loading" antd />;
    }
    return <ExtIcon className="del" type="delete" antd />;
  };

  getExtableProps = () => {
    const {
      corporation: { list },
    } = this.props;
    const { loading } = this.props;
    const columns = [
      {
        title: formatMessage({
          id: 'global.operation',
          defaultMessage: formatMessage({ id: 'basic_000019', defaultMessage: '操作' }),
        }),
        key: 'operation',
        width: 130,
        align: 'center',
        dataIndex: 'id',
        className: 'action',
        required: true,
        render: (_, record) => (
          <span className={cls('action-box')}>
            {authAction(
              <ExtIcon
                key={APP_MODULE_BTN_KEY.EDIT}
                className="edit"
                onClick={() => this.edit(record)}
                type="edit"
                ignore="true"
                antd
              />,
            )}
            <Popconfirm
              key={APP_MODULE_BTN_KEY.DELETE}
              placement="topLeft"
              title={formatMessage({
                id: 'global.delete.confirm',
                defaultMessage: formatMessage({
                  id: 'basic_000021',
                  defaultMessage: '确定要删除吗？提示：删除后不可恢复',
                }),
              })}
              onConfirm={() => this.del(record)}
            >
              {this.renderDelBtn(record)}
            </Popconfirm>
            <DataAduitButton title={record.name} entityId={record.id} />
          </span>
        ),
      },
      {
        title: formatMessage({ id: 'global.rank', defaultMessage: '序号' }),
        dataIndex: 'rank',
        width: 80,
      },
      {
        title: formatMessage({ id: 'corporation.erpCode', defaultMessage: 'ERP公司代码' }),
        dataIndex: 'erpCode',
        width: 120,
        required: true,
      },
      {
        title: formatMessage({ id: 'global.name', defaultMessage: '名称' }),
        dataIndex: 'name',
        width: 220,
        required: true,
      },
      {
        title: formatMessage({ id: 'corporation.shortName', defaultMessage: '简称' }),
        dataIndex: 'shortName',
        width: 120,
        required: true,
      },
      {
        title: formatMessage({ id: 'basic_000410', defaultMessage: '纳税人识别号' }),
        dataIndex: 'taxNo',
        width: 180,
        required: true,
        render: t => t || '-',
      },
      {
        title: formatMessage({ id: 'basic_000411', defaultMessage: '关联的组织机构' }),
        dataIndex: 'organizationName',
        width: 260,
        required: true,
        render: (t, r) => get(r, 'organization.name') || '-',
      },
      {
        title: formatMessage({
          id: 'corporation.baseCurrencyName',
          defaultMessage: '本位币货币名称',
        }),
        dataIndex: 'baseCurrencyName',
        width: 80,
        optional: true,
      },
      {
        title: formatMessage({
          id: 'corporation.baseCurrencyCode',
          defaultMessage: '本位币货币代码',
        }),
        dataIndex: 'baseCurrencyCode',
        width: 80,
        optional: true,
      },
      {
        title: formatMessage({
          id: 'corporation.defaultTradePartner',
          defaultMessage: '默认贸易伙伴代码',
        }),
        dataIndex: 'defaultTradePartner',
        width: 120,
        optional: true,
      },
      {
        title: formatMessage({
          id: 'corporation.relatedTradePartner',
          defaultMessage: '关联交易贸易伙伴',
        }),
        dataIndex: 'relatedTradePartner',
        width: 120,
        optional: true,
      },
      {
        title: formatMessage({
          id: 'corporation.internalSupplier',
          defaultMessage: '内部供应商代码',
        }),
        dataIndex: 'internalSupplier',
        width: 100,
        optional: true,
      },
      {
        title: formatMessage({ id: 'corporation.frozen', defaultMessage: '冻结' }),
        dataIndex: 'frozen',
        width: 80,
        render: (_text, row) => {
          if (row.frozen) {
            return (
              <Tag color="red">
                {formatMessage({ id: 'basic_000123', defaultMessage: '已冻结' })}
              </Tag>
            );
          }
          return null;
        },
      },
    ];
    const toolBarProps = {
      left: (
        <>
          {authAction(
            <Button key={APP_MODULE_BTN_KEY.CREATE} type="primary" onClick={this.add} ignore="true">
              <FormattedMessage id="global.add" defaultMessage="新建" />
            </Button>,
          )}
          <Button onClick={this.reloadData}>
            <FormattedMessage id="global.refresh" defaultMessage="刷新" />
          </Button>
        </>
      ),
    };
    return {
      columns,
      lineNumber: false,
      bordered: false,
      loading: loading.effects['corporation/queryList'],
      toolBar: toolBarProps,
      dataSource: list,
    };
  };

  getFormModalProps = () => {
    const { loading, corporation } = this.props;
    const { showModal, rowData } = corporation;
    return {
      save: this.save,
      rowData,
      showModal,
      closeFormModal: this.closeFormModal,
      saving: loading.effects['corporation/save'],
    };
  };

  render() {
    return (
      <div className={cls(styles['container-box'])}>
        <ExtTable {...this.getExtableProps()} />
        <FormModal {...this.getFormModalProps()} />
      </div>
    );
  }
}

export default Corporation;
