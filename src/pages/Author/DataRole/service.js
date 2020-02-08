import { utils } from 'seid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取数据角色组列表*/
export async function getRoleGroupList(params) {
  const url = `${SERVER_PATH}/sei-basic/dataRoleGroup/findAll`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 数据角色组保存 */
export async function saveRoleGroup(data) {
  const url = `${SERVER_PATH}/sei-basic/dataRoleGroup/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 数据角色组删除 */
export async function delRoleGroup(data) {
  const url = `${SERVER_PATH}/sei-basic/dataRoleGroup/delete/${data.id}`;
  return request({
    url,
    method: "DELETE",
  });
}

/** 
 * 根据角色组id获取数据角色列表
 * param roleGroupId
*/
export async function getDataRoleList(params) {
  const url = `${SERVER_PATH}/sei-basic/dataRole/findByDataRoleGroup`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 数据角色保存 */
export async function saveDataRole(data) {
  const url = `${SERVER_PATH}/sei-basic/dataRole/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 数据角色删除 */
export async function delDataRole(data) {
  const url = `${SERVER_PATH}/sei-basic/dataRole/delete/${data.id}`;
  return request({
    url,
    method: "DELETE",
  });
}

/** 
 * 通过数据角色Id和数据权限类型Id获取已分配的业务实体数据
 * param authTypeId
 * param roleId
*/
export async function getAssignedAuthDataList(params) {
  const url = `${SERVER_PATH}/sei-basic/dataRoleAuthTypeValue/getAssignedAuthDatas`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 
 * 通过数据角色Id和数据权限类型Id获取未分配的业务实体数据
 * param authTypeId
 * param roleId
*/
export async function getUnassignedAuthDataList(params) {
  const url = `${SERVER_PATH}/sei-basic/dataRoleAuthTypeValue/getUnassignedAuthDataList`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 
 * 通过数据角色Id和数据权限类型Id获取已分配的树形业务实体数据
 * param authTypeId
 * param roleId
*/
export async function getAssignedAuthTreeDataList(params) {
  const url = `${SERVER_PATH}/sei-basic/dataRoleAuthTypeValue/getAssignedAuthTreeDataList`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 
 * 通过数据角色Id和数据权限类型Id获取未分配的业务实体数据
 * param authTypeId
 * param roleId
*/
export async function getUnassignedAuthTreeDataList(params) {
  const url = `${SERVER_PATH}/sei-basic/dataRoleAuthTypeValue/getUnassignedAuthTreeDataList`;
  return request({
    url,
    method: "GET",
    params,
  });
}