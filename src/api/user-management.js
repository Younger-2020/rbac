import request from '@/utils/request'

export function fetchList(query) {
  console.log('fetching!!')
  return request({
    url: '/vue-element-admin/user-management/list',
    method: 'get',
    params: query
  })
}

export function fetchUser(id) {
  return request({
    url: '/vue-element-admin/user-management/detail',
    method: 'get',
    params: { id }
  })
}

export function fetchPv(pv) {
  return request({
    url: '/vue-element-admin/user-management/pv',
    method: 'get',
    params: { pv }
  })
}

export function createUser(data) {
  return request({
    url: '/vue-element-admin/user-management/create',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/vue-element-admin/user-management/update',
    method: 'post',
    data
  })
}
