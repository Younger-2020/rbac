import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/role-table/list',
    method: 'get',
    params: query
  })
}

export function fetchRole(id) {
  return request({
    url: '/vue-element-admin/role-table/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/role-table/pv',
    method: 'get',
    params: { pv }
  })
}

export function createRole(data) {
  return request({
    url: '/vue-element-admin/role-table/create',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/vue-element-admin/role-table/update',
    method: 'post',
    data
  })
}
