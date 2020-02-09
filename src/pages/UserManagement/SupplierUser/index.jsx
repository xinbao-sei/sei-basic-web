import React, { Component, } from 'react';
import withRouter from 'umi/withRouter';
import { connect } from 'dva';
import cls from 'classnames';
import { Spin, Empty, } from "antd";
import { formatMessage, FormattedMessage } from "umi-plugin-react/locale";
import TablePanel from './components/TablePanel';
import { PageWrapper, } from '@/components';
import SupplierUserConfig from './components/SupplierUserConfig';
import styles from "./index.less";

@withRouter
@connect(({ supplierUser, loading, }) => ({ supplierUser, loading, }))
class SupplierUser extends Component {

  render() {
    const { supplierUser, loading,  } = this.props;
    const { showConfig, rowData, } = supplierUser;

    return (
      <PageWrapper className={cls(styles['container-box'])}>
        <Spin spinning={loading.global} wrapperClassName={cls("spin-wrapper")}>
          <div style={{ height: '100%', display: !showConfig ? '' : 'none', }}>
            <TablePanel />
          </div>
          { rowData && showConfig ? (<SupplierUserConfig style={{ display: showConfig ? '' : 'none', }} />) : (null)}
        </Spin>
      </PageWrapper>
    );
  }
}

export default SupplierUser;