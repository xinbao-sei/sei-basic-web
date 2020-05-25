import React, { PureComponent } from 'react';
import { Form, Input, Switch } from 'antd';
import { ExtModal, ComboTree, utils } from 'suid';
import { constants } from '@/utils';

const { objectAssignHave } = utils;
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
class CopyModal extends PureComponent {
  static copyToOrgNode = null;

  onFormSubmit = () => {
    const { form, save } = this.props;
    form.validateFields((err, formData) => {
      if (err) {
        return;
      }
      const params = {
        positionId: '',
        copyFeatureRole: false,
        targetOrgIds: [formData.orgId],
      };
      objectAssignHave(params, formData);
      save(params, this.copyToOrgNode);
    });
  };

  getComboGridProps = () => {
    const { form } = this.props;
    return {
      form,
      name: 'positionCategoryName',
      store: {
        autoLoad: false,
        url: `${SERVER_PATH}/sei-basic/positionCategory/findAllUnfrozen`,
      },
      field: ['positionCategoryId', 'positionCategoryCode'],
      columns: [
        {
          title: '代码',
          width: 80,
          dataIndex: 'code',
        },
        {
          title: '名称',
          width: 220,
          dataIndex: 'name',
        },
      ],
      searchProperties: ['code', 'name'],
      rowKey: 'id',
      reader: {
        name: 'name',
        field: ['id', 'code'],
      },
    };
  };

  getComboTreeProps = () => {
    const { form } = this.props;
    return {
      form,
      name: 'orgName',
      field: ['orgId'],
      store: {
        url: `${SERVER_PATH}/sei-basic/organization/findOrgTreeWithoutFrozen`,
      },
      afterSelect: item => {
        this.copyToOrgNode = item;
      },
      reader: {
        name: 'name',
        field: ['id'],
      },
    };
  };

  handlerCloseModal = () => {
    const { closeModal } = this.props;
    if (closeModal) {
      closeModal();
    }
  };

  render() {
    const { form, currentEmployee, saving, showModal } = this.props;
    const { getFieldDecorator } = form;
    return (
      <ExtModal
        destroyOnClose
        onCancel={this.handlerCloseModal}
        visible={showModal}
        centered
        confirmLoading={saving}
        maskClosable={false}
        title="复制岗位到指定组织机构"
        okText="保存"
        onOk={this.onFormSubmit}
      >
        <Form {...formItemLayout} layout="horizontal">
          <FormItem label="源岗位Id" style={{ display: 'none' }}>
            {getFieldDecorator('positionId', {
              initialValue: currentEmployee ? currentEmployee.id : '',
            })(<Input />)}
          </FormItem>
          <FormItem label="源岗位">
            {getFieldDecorator('positionName', {
              initialValue: currentEmployee ? currentEmployee.name : '',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input disabled />)}
          </FormItem>
          <FormItem label="目标组织机构id" style={{ display: 'none' }}>
            {getFieldDecorator('orgId', {
              initialValue: '',
            })(<Input />)}
          </FormItem>
          <FormItem label="目标组织机构">
            {getFieldDecorator('orgName', {
              initialValue: '',
              rules: [
                {
                  required: true,
                  message: '目标组织机构不能为空',
                },
              ],
            })(<ComboTree {...this.getComboTreeProps()} />)}
          </FormItem>
          <FormItem label="复制功能角色">
            {getFieldDecorator('copyFeatureRole', {
              initialValue: false,
              valuePropName: 'checked',
            })(<Switch size="small" />)}
          </FormItem>
        </Form>
      </ExtModal>
    );
  }
}

export default CopyModal;
