import request from '@/utils/request'

export function fetchList(query) {
  return request({
    url: '/vue-element-admin/resources-table/list',
    method: 'get',
    params: query
  })
}

export function fetchResources(id) {
  return request({
    url: '/vue-element-admin/resources-table/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/resources-table/pv',
    method: 'get',
    params: { pv }
  })
}

export function createResources(data) {
  return request({
    url: '/vue-element-admin/resources-table/create',
    method: 'post',
    data
  })
}

export function updateResources(data) {
  return request({
    url: '/vue-element-admin/resources-table/update',
    method: 'post',
    data
  })
}
