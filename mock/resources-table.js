const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'resources_name|1': ['通知公告', '轮播图', '房间管理', '区域管理'],
    'resources_no': /[1-9]{10}/,
    'parent_node|1': ['在线客服', '基础数据管理'],
    'sub_system|1': ['业务管理系统', '宿舍管理系统'],
    'resources_url': '@url',
    'resources_api': /\/[a-z]{4,10}/,
    'resources_type|1': ['菜单', '导航栏', '组件'],
    'resources_visibility|1': ['是', '否']
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/resources-table/list',
    type: 'get',
    response: config => {
      const { resources_name, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (resources_name && !item.resources_name.startsWith(resources_name)) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: pageList
        }
      }
    }
  },

  {
    url: '/vue-element-admin/resources-table/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const res of List) {
        if (res.id === +id) {
          return {
            code: 20000,
            data: res
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/resources-table/pv',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        data: {
          pvData: [
            { key: 'PC', pv: 1024 },
            { key: 'mobile', pv: 1024 },
            { key: 'ios', pv: 1024 },
            { key: 'android', pv: 1024 }
          ]
        }
      }
    }
  },

  {
    url: '/vue-element-admin/resources-table/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/resources-table/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

