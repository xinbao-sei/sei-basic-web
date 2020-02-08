import { utils } from 'seid';
import { constants } from '../../../utils';

const { request } = utils;

const { SERVER_PATH } = constants;

/** 获取租户列表*/
export async function getTenantList(params) {
  const url = `${SERVER_PATH}/sei-basic/tenant/findAll`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 租户保存 */
export async function saveTenant(data) {
  const url = `${SERVER_PATH}/sei-basic/tenant/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 租户删除 */
export async function delTenant(params) {
  const url = `${SERVER_PATH}/sei-basic/tenant/delete/${params.id}`;
  return request({
    url,
    method: "DELETE",
  });
}

/** 
 * 获取租户根组织机构
 * params tenantCode
*/
export async function getTenantRootOrganization(params) {
  const url = `${SERVER_PATH}/sei-basic/organization/findRootByTenantCode`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 租户根组织机构保存 */
export async function saveTenantRootOrganization(data) {
  const url = `${SERVER_PATH}/sei-basic/organization/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 
 * 获取租户管理员信息
 * params tenantCode
*/
export async function getTenantAdmin(params) {
  const url = `${SERVER_PATH}/sei-basic/employee/findAdminByTenantCode`;
  return request({
    url,
    method: "GET",
    params,
  });
}

/** 租户管理员保存 */
export async function saveTenantAdmin(data) {
  const url = `${SERVER_PATH}/sei-basic/employee/save`;
  return request({
    url,
    method: "POST",
    data,
  });
}


/** 为租户分配应用模块 */
export async function assignAppModuleItem(data) {
  const url = `${SERVER_PATH}/sei-basic/tenantAppModule/insertRelations`;
  return request({
    url,
    method: "POST",
    data,
  });
}

/** 租户移除已分配的应用模块 */
export async function removeAssignedAppModuleItem(data) {
  const url = `${SERVER_PATH}/sei-basic/tenantAppModule/removeRelations`;
  return request({
    url,
    method: "DELETE",
    data,
  });
}

/** 
 * 获取租户未分配的应用模块
 * params parentId
 */
export async function getUnAssignedAppModuleItemList(params) {
  const url = `${SERVER_PATH}/sei-basic/tenantAppModule/getUnassigned`;
  return request({
    url,
    method: "GET",
    params,
  });
}