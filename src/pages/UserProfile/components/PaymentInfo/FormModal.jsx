import React, { PureComponent } from 'react';
import { Form, Input, InputNumber } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal, ComboGrid } from 'suid';
import { userUtils, constants } from '@/utils';

const { getCurrentUser } = userUtils;
const { SERVER_PATH } = constants;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

@Form.create()
class FormModal extends PureComponent {
  onFormSubmit = () => {
    const { form, save, editData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, editData || {});
      Object.assign(params);
      Object.assign(params, formData);
      save(params);
    });
  };

  getComboGridProps = () => {
    const { form } = this.props;

    return {
      form,
      allowClear: true,
      remotePaging: true,
      name: 'bankName',
      field: ['bankId'],
      searchPlaceHolder: '输入代码或名称关键字查询',
      searchProperties: ['name', 'code'],
      searchWidth: 220,
      width: 420,
      columns: [
        {
          title: '代码',
          width: 180,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 220,
          dataIndex: 'name',
        },
        {
          title: '银行类别',
          width: 180,
          dataIndex: 'bankCategory.name',
        },
      ],
      store: {
        type: 'POST',
        url: `${SERVER_PATH}/sei-fim/personalPaymentInfo/findByPage`,
      },
      reader: {
        name: 'name',
        field: ['id'],
      },
    };
  };

  render() {
    const { form, editData, onClose, saving, visible } = this.props;
    const { getFieldDecorator } = form;
    const user = getCurrentUser();
    const { account: receiverCode, userId: receiverId, userName: receiverName } = user;
    const title = editData
      ? formatMessage({
          id: 'global.edit',
          defaultMessage: '编辑',
        })
      : formatMessage({ id: 'global.add', defaultMessage: '新建' });

    return (
      <ExtModal
        destroyOnClose
        onCancel={onClose}
        visible={visible}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title={title}
        okText="保存"
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="收款方类型" hidden>
            {getFieldDecorator('receiverType', {
              initialValue: 'H',
            })(<Input />)}
          </FormItem>
          <FormItem label="收款方Id" hidden>
            {getFieldDecorator('receiverId', {
              initialValue: editData ? editData.receiverId : receiverId,
            })(<Input />)}
          </FormItem>
          <FormItem label="收款方代码" hidden>
            {getFieldDecorator('receiverCode', {
              initialValue: editData ? editData.receiverCode : receiverCode,
            })(<Input />)}
          </FormItem>
          <FormItem label="收款方名称">
            {getFieldDecorator('receiverName', {
              initialValue: editData ? editData.receiverName : receiverName,
              rules: [
                {
                  required: true,
                  message: '请输入收款方名称',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="银行开户名">
            {getFieldDecorator('bankAccountName', {
              initialValue: editData ? editData.bankAccountName : receiverName,
              rules: [
                {
                  required: true,
                  message: '请输入银行开户名',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="银行id" hidden>
            {getFieldDecorator('bankId', {
              initialValue: editData ? editData.bankId : '',
            })(<Input />)}
          </FormItem>
          <FormItem label="银行">
            {getFieldDecorator('bankName', {
              initialValue: editData ? editData.bank.name : '',
              rules: [
                {
                  required: true,
                  message: '请输入银行',
                },
              ],
            })(<ComboGrid {...this.getComboGridProps()} />)}
          </FormItem>
          <FormItem label="银行帐号">
            {getFieldDecorator('bankAccountNumber', {
              initialValue: editData ? editData.bankAccountNumber : '',
              rules: [
                {
                  required: true,
                  message: '请输入银行帐号',
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label="排序">
            {getFieldDecorator('rank', {
              initialValue: editData ? editData.rank : '',
              rules: [
                {
                  required: true,
                  message: '请输入排序',
                },
              ],
            })(<InputNumber style={{ width: '100%' }} />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
