const Mock = require('mockjs')

const List = []
const count = 5
// eslint-disable-next-line no-unused-vars
const roles = ['宿管', 'HR', '测试人员', '会员', '系统管理员']

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    role_name: roles[i],
    role_no: /\d{10}/,
    role_remark: roles[i],
    'role_company|1': ['分公司1', '分公司2'],
    'role_institutions|1': ['博思软件'],
    'status|1': ['启用', '禁用']
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/role-table/list',
    type: 'get',
    response: config => {
      const { role_name, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (role_name && item.role_name.indexOf(role_name) < 0) return false
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
    url: '/vue-element-admin/role-table/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const role of List) {
        if (role.id === +id) {
          return {
            code: 20000,
            data: role
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/role-table/pv',
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
    url: '/vue-element-admin/role-table/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/role-table/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

