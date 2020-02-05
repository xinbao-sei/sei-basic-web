/*
* @Author: zp
* @Date:   2020-02-02 11:57:38
* @Last Modified by:   zp
* @Last Modified time: 2020-02-05 10:53:35
*/
import { del, getTree, save, move } from "./service";
import { message } from "antd";
import { formatMessage } from "umi-plugin-react/locale";
import { utils } from 'seid';

const { pathMatchRegexp, dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: "region",

  state: {
    treeData: [],
    showCreateModal: false,
    selectedTreeNode: null,
    moveTreeData: [],
  },
  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp("/regionManagement/region", location.pathname)) {
          dispatch({
            type: "queryTree"
          });
        }
      });
    }
  },
  effects: {
    * queryTree({ payload }, { call, put }) {
      const ds = yield call(getTree, payload);
      if (ds.success) {
        yield put({
          type: "updateState",
          payload: {
            treeData: ds.data
          }
        });
      } else {
        throw ds;
      }
      return ds;
    },
    * save({ payload }, { call, put }) {
      const re = yield call(save, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.save-success", defaultMessage: "保存成功" }));
      } else {
        message.error(re.message);
      }
      yield put({
        type: "updateState",
        payload: {
          showCreateModal: false,
        }
      });
      return re;
    },
    * del({ payload }, { call }) {
      const re = yield call(del, payload);
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: "global.delete-success", defaultMessage: "删除成功" }));
      } else {
        message.error(re.message);
      }

      return re;
    },
    * move({ payload }, { call }) {
      const re = yield call(move, payload);
      message.destroy();
      if (re.success) {
        message.success(re.message);
      } else {
        message.error(re.message);
      }

      return re;
    }
  }
});
