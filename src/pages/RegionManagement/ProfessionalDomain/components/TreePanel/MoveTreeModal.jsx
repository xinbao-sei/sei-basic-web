import React, { PureComponent } from 'react';
import { ExtModal } from 'suid';
import TreeView from '@/components/TreeView';
import { formatMessage } from 'umi-plugin-react/locale';

class MoveTreeModal extends PureComponent {
  render() {
    const { visible, onCancel, onChange, treeData, onMove, title } = this.props;
    return (
      <ExtModal
        visible={visible}
        destroyOnClose
        centered
        onCancel={onCancel}
        maskClosable={false}
        title={title}
        onOk={onMove}
        okText={formatMessage({id: 'basic_000185', defaultMessage: '移动'})}
        width={400}
      >
        <TreeView height={300} onChange={onChange} treeData={treeData} />
      </ExtModal>
    );
  }
}

export default MoveTreeModal;
