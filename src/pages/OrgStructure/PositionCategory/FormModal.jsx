import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { formatMessage } from 'umi-plugin-react/locale';
import { ExtModal } from 'suid';

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
    const { form, save, rowData } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {};
      Object.assign(params, rowData || {});
      Object.assign(params, formData);
      save(params);
    });
  };

  render() {
    const { form, rowData, closeFormModal, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    const title = rowData
      ? formatMessage({
          id: 'global.edit',
          defaultMessage: formatMessage({id: 'basic_000020', defaultMessage: '编辑'}),
        })
      : formatMessage({ id: 'global.add', defaultMessage: '新建' });
    return (
      <ExtModal
        destroyOnClose
        onCancel={closeFormModal}
        visible={showModal}
        centered
        confirmLoading={saving}
        title={title}
        onOk={this.onFormSubmit}
        width={600}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({ id: 'global.code', defaultMessage: '代码' })}>
            {getFieldDecorator('code', {
              initialValue: rowData ? rowData.code : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'global.code.required',
                    defaultMessage: '代码不能为空',
                  }),
                },
                {
                  max: 6,
                  message: formatMessage({id: 'basic_000195', defaultMessage: '岗位类别代码不能超过6个字符'}),
                },
              ],
            })(<Input disabled={!!rowData} placeholder={formatMessage({id: 'basic_000412', defaultMessage: '最大长度为6个字符'})}/>)}
          </FormItem>
          <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
            {getFieldDecorator('name', {
              initialValue: rowData ? rowData.name : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'global.name.required',
                    defaultMessage: '名称不能为空',
                  }),
                },
              ],
            })(<Input />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
