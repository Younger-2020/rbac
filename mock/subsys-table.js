const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    'subsys_name|1': ['用户中心系统', '物流管理系统', '物流跟踪系统', '数据统计系统'],
    subsys_code: /\d{10}/,
    subsys_url: '@url',
    'subsys_remark|1': ['Monitor', 'PE', 'ones', 'OMP'],
    'status|1': ['启用', '禁用']
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/subsys-table/list',
    type: 'get',
    response: config => {
      const { subsys_name, subsys_code, subsys_remark, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (subsys_name && !item.subsys_name.startsWith(subsys_name)) return false
        if (subsys_code && !item.subsys_code.startsWith(subsys_code)) return false
        if (subsys_remark && !item.subsys_remark.contains(subsys_remark)) return false
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
    url: '/vue-element-admin/subsys-table/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const subsys of List) {
        if (subsys.id === +id) {
          return {
            code: 20000,
            data: subsys
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/subsys-table/pv',
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
    url: '/vue-element-admin/subsys-table/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/subsys-table/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

