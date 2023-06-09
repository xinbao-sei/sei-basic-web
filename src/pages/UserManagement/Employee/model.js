/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: Eason
 * @Last Modified time: 2020-08-10 09:12:08
 */
import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import {
  save,
  listAllTree,
  resetPassword,
  copyToEmployees,
  assignStation,
  unAssignStation,
  assignFeatureRole,
  unAssignFeatureRole,
  assignDataRole,
  unAssignDataRole,
  saveAssignFeatureRoleEffective,
  saveAssignDataRoleEffective,
} from './service';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'employee',

  state: {
    showFormModal: false,
    showResetPasswordModal: false,
    showCopyModal: false,
    showConfigFeatrueRole: false,
    showConfigStaion: false,
    showConfigDataRole: false,
    treeData: [],
    currentOrgNode: null,
    currentEmployee: null,
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/userManagement/employee', location.pathname)) {
          dispatch({
            type: 'queryTree',
          });
        }
      });
    },
  },
  effects: {
    *queryTree({ payload }, { call, put }) {
      const ds = yield call(listAllTree, payload);
      if (ds.success) {
        yield put({
          type: 'updateState',
          payload: {
            treeData: ds.data,
          },
        });
      } else {
        throw ds;
      }
    },
    *resetPassword({ payload, callback }, { call }) {
      const re = yield call(resetPassword, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({id: 'basic_000141', defaultMessage: '密码重置成功'}));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *save({ payload, callback }, { call }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *copyToEmployees({ payload, callback }, { call }) {
      const re = yield call(copyToEmployees, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({id: 'basic_000142', defaultMessage: '复制成功'}));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *assignStation({ payload, callback }, { call }) {
      const re = yield call(assignStation, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *unAssignStation({ payload, callback }, { call }) {
      const re = yield call(unAssignStation, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *assignFeatureRole({ payload, callback }, { call }) {
      const re = yield call(assignFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *unAssignFeatureRole({ payload, callback }, { call }) {
      const re = yield call(unAssignFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *assignDataRole({ payload, callback }, { call }) {
      const re = yield call(assignDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *unAssignDataRole({ payload, callback }, { call }) {
      const re = yield call(unAssignDataRole, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *saveAssignFeatureRoleEffective({ payload, callback }, { call }) {
      const re = yield call(saveAssignFeatureRoleEffective, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *saveAssignDataRoleEffective({ payload, callback }, { call }) {
      const re = yield call(saveAssignDataRoleEffective, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
