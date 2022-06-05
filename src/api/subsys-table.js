import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/subsys-table/list',
    method: 'get',
    params: query
  })
}

export function fetchSubsys(id) {
  return request({
    url: '/vue-element-admin/subsys-table/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/subsys-table/pv',
    method: 'get',
    params: { pv }
  })
}

export function createSubsys(data) {
  return request({
    url: '/vue-element-admin/subsys-table/create',
    method: 'post',
    data
  })
}

export function updateSubsys(data) {
  return request({
    url: '/vue-element-admin/subsys-table/update',
    method: 'post',
    data
  })
}
