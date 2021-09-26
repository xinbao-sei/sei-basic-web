/*
 * @Author: zp
 * @Date:   2020-02-02 11:57:38
 * @Last Modified by: Eason
 * @Last Modified time: 2021-09-26 08:26:41
 */
import { formatMessage } from 'umi-plugin-react/locale';
import { utils, message } from 'suid';
import { forceExit } from './service';

const { dvaModel } = utils;
const { modelExtend, model } = dvaModel;

export default modelExtend(model, {
  namespace: 'onlineUser',

  state: {
    rowId: null,
  },
  effects: {
    *forceExit({ payload, callback }, { call, put }) {
      const { sid, rowId } = payload;
      yield put({
        type: 'updateState',
        payload: {
          rowId,
        },
      });
      const re = yield call(forceExit, { sid });
      message.destroy();
      if (re.success) {
        message.success(formatMessage({ id: 'basic_000406', defaultMessage: '操作成功' }));
      } else {
        message.error(re.message);
      }
      if (callback && callback instanceof Function) {
        callback(re);
      }
    },
  },
});
