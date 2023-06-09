import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { getAllNodeKeys } from '@/utils';
import {
  delFeatureRole,
  saveFeatureRole,
  getFeatureRoleList,
  assignFeatureItem,
  removeAssignedFeatureItem,
  getUnAssignedFeatureItemList,
  getAssignedEmployeesByFeatureRole,
  getAssignedPositionsByFeatureRole,
  getAssignFeatureItem,
  unAssignStation,
  assignStation,
  unAssignUser,
  assignUser,
} from '../service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'featureRole',

  state: {
    listData: [],
    currentRole: null,
    showAssignFeature: false,
    showConfigStation: false,
    showConfigUser: false,
    assignListData: [],
    unAssignListData: [],
    unAssignListKeys: [],
    assignUserData: [],
    assinStationData: [],
  },
  effects: {
    *getFeatureRoleList({ payload }, { call, put }) {
      const re = yield call(getFeatureRoleList, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            showAssignFeature: false,
            listData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *saveFeatureRole({ payload, callback }, { call, put }) {
      const re = yield call(saveFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.save-success', defaultMessage: '保存成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentRole: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *delFeatureRole({ payload, callback }, { call, put }) {
      const re = yield call(delFeatureRole, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.delete-success', defaultMessage: '删除成功' }));
        yield put({
          type: 'updateState',
          payload: {
            currentRole: null,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *assignFeatureItem({ payload, callback }, { call, put }) {
      const re = yield call(assignFeatureItem, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.assign-success', defaultMessage: '分配成功' }));
        yield put({
          type: 'updateState',
          payload: {
            showAssignFeature: false,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *getAssignFeatureItem({ payload, callback }, { call, put }) {
      const re = yield call(getAssignFeatureItem, payload);
      message.destroy();
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            assignListData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *removeAssignedFeatureItem({ payload, callback }, { call }) {
      const re = yield call(removeAssignedFeatureItem, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'global.remove-success', defaultMessage: '移除成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
    *getUnAssignedFeatureItemList({ payload }, { call, put }) {
      const re = yield call(getUnAssignedFeatureItemList, payload);
      const unAssignListData = re.data || [];
      const unAssignListKeys = getAllNodeKeys(unAssignListData);
      yield put({
        type: 'updateState',
        payload: {
          unAssignListData: [],
          unAssignListKeys: [],
        },
      });
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            unAssignListData,
            unAssignListKeys,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *getAssignedEmployeesByFeatureRole({ payload }, { call, put }) {
      const re = yield call(getAssignedEmployeesByFeatureRole, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            assignUserData: re.data,
          },
        });
      } else {
        message.error(re.message);
      }
    },
    *getAssignedPositionsByFeatureRole({ payload }, { call, put }) {
      const re = yield call(getAssignedPositionsByFeatureRole, payload);
      if (re.success) {
        yield put({
          type: 'updateState',
          payload: {
            assinStationData: re.data,
          },
        });
      } else {
        message.error(re.message);
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
    *assignUser({ payload, callback }, { call }) {
      const re = yield call(assignUser, payload);
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
    *unAssignUser({ payload, callback }, { call }) {
      const re = yield call(unAssignUser, payload);
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
  },
});
