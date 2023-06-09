import React, { PureComponent } from 'react';
import { toUpper, trim } from 'lodash';
import { Form, Input, Switch } from 'antd';
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
  handlerFormSubmit = () => {
    const { form, save, currentPageRow, currentFeatureGroup } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        canMenu: true,
        featureType: 'Page',
        featureGroupId: currentFeatureGroup.id,
        featureGroupCode: currentFeatureGroup.code,
        featureGroupName: currentFeatureGroup.name,
      };
      Object.assign(params, currentPageRow || {});
      Object.assign(params, formData);
      params.code = `${params.featureGroupCode}-${toUpper(trim(params.code))}`;
      save(params);
    });
  };

  getCode = () => {
    const { currentPageRow } = this.props;
    let newCode = '';
    if (currentPageRow) {
      const { code, featureGroupCode } = currentPageRow;
      newCode = code.substring(featureGroupCode.length + 1);
    }
    return newCode;
  };

  render() {
    const {
      form,
      currentPageRow,
      closePageFormModal,
      saving,
      showFormModal,
      currentFeatureGroup,
    } = this.props;
    const { getFieldDecorator } = form;
    const title = currentPageRow
      ? formatMessage({
          id: 'feature.page.edit',
          defaultMessage: '修改菜单项',
        })
      : formatMessage({ id: 'feature.page.add', defaultMessage: '新建菜单项' });
    return (
      <ExtModal
        destroyOnClose
        onCancel={closePageFormModal}
        visible={showFormModal}
        centered
        bodyStyle={{ paddingBottom: 0 }}
        confirmLoading={saving}
        onOk={this.handlerFormSubmit}
        title={title}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label={formatMessage({ id: 'global.name', defaultMessage: '名称' })}>
            {getFieldDecorator('name', {
              initialValue: currentPageRow ? currentPageRow.name : '',
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
          <FormItem label={formatMessage({ id: 'global.code', defaultMessage: '代码' })}>
            {getFieldDecorator('code', {
              initialValue: this.getCode(),
              rules: [
                {
                  required: true,
                  message: formatMessage({
                    id: 'global.code.required',
                    defaultMessage: '代码不能为空',
                  }),
                },
              ],
            })(
              <Input
                addonBefore={`${currentFeatureGroup.code}-`}
                maxLength={50 - `${currentFeatureGroup.code}-`.length}
                placeholder={formatMessage({
                  id: 'global.code.tip',
                  defaultMessage: '规则:名称各汉字首字母大写',
                })}
              />,
            )}
          </FormItem>
          <FormItem label={formatMessage({id: 'basic_000328', defaultMessage: '页面路由地址'})}>
            {getFieldDecorator('groupCode', {
              initialValue: currentPageRow ? currentPageRow.groupCode : '',
              rules: [
                {
                  required: true,
                  message: formatMessage({id: 'basic_000329', defaultMessage: '页面路由地址不能为空'}),
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem
            label={formatMessage({ id: 'feature.tenantCanUse', defaultMessage: '租户可用' })}
          >
            {getFieldDecorator('tenantCanUse', {
              initialValue: currentPageRow ? currentPageRow.tenantCanUse || false : false,
              valuePropName: 'checked',
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default FormModal;
