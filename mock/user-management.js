const Mock = require('mockjs')

const List = []
const count = 100

for (let i = 0; i < count; i++) {
  List.push(Mock.mock({
    id: '@increment',
    job_no: /[1-9]{10}/,
    user_name: '@cname',
    password: /[a-z0-9]{6,12}/,
    'company|1': ['公司1', '公司2', '公司3', '公司4', '公司5'],
    'department|1': ['部门1', '部门2', '部门3', '部门4', '部门5', '部门6'],
    'role|1': ['会员', '测试人员', 'HR', '总管'],
    'position|1': ['财务', '销售', '技术'],
    'sex|1': ['男', '女'],
    birthday: +Mock.Random.date('T'),
    phone_num: /1[358][0-9]{9}/,
    'status|1': ['启用', '禁用']
  }))
}

module.exports = [
  {
    url: '/vue-element-admin/user-management/list',
    type: 'get',
    response: config => {
      const { user_name, job_no, phone_num, role, page = 1, limit = 20, sort } = config.query

      let mockList = List.filter(item => {
        if (user_name && !item.user_name.startsWith(user_name)) return false
        if (job_no && !item.job_no.startsWith(job_no)) return false
        if (phone_num && !item.phone_num.startsWith(phone_num)) return false
        if (role && item.role.indexOf(role) < 0) return false
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const pageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      console.log('lsfjoewowe')
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
    url: '/vue-element-admin/user-management/detail',
    type: 'get',
    response: config => {
      const { id } = config.query
      for (const usr of List) {
        if (usr.id === +id) {
          return {
            code: 20000,
            data: usr
          }
        }
      }
    }
  },

  {
    url: '/vue-element-admin/user-management/pv',
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
    url: '/vue-element-admin/user-management/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  {
    url: '/vue-element-admin/user-management/update',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]

