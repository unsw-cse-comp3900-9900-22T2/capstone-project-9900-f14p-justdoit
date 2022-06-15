
export const fatherSubMenu = (type) => {
  const json = [
    {
      value: 'ctrip_page_tag',
      name: '携程页面',
      type: 'contents', //配置icon
      child: [
        {
          value: 'ctrip_page_page_both_index',
          page: '/webapp/you/destask/ugc/CtripPage',
          name: '页面汇总',
          type: 'list',
          hasPage: [
            {
              schema: /^(\/webapp\/you\/destask\/ugc\/CtripPage\/detail\?id=)([0-9a-zA-Z]+)+/,
              title: (name) => {
                return `${name}的页面详情`
              }
            }
          ]
        },
        {
          value: 'ctrip_page_page_type',
          page: '/webapp/you/destask/ugc/CtripPage/pageType',
          name: '页面类型',
          type: 'page'
        },
        {
          value: 'trip_page_error',
          page: '/webapp/you/destask/ugc/CtripPage/tripPageError',
          name: 'trip5XX4XX',
          type: 'page'
        }
      ]
    }
  ]
  json.unshift({
    value: 'weekly_tag',
    name: '周报目录',
    type: 'contents', //配置icon
    child: [
      {
        value: 'weekly_tag_weekly_list',
        page: '/webapp/you/destask/ugc/Assessment/AssessmentTable',
        name: '周报列表',
        type: 'list', //配置icon
        hasPage: [
          {
            schema: /^(\/webapp\/you\/destask\/ugc\/Assessment\/AssessmentLookDetail\?id=)([0-9a-zA-Z]+)+/,
            title: (name) => {
              return `${name}周报详情`
            }
          },
          {
            schema: /^(\/webapp\/you\/destask\/ugc\/Assessment\?id=)([0-9a-zA-Z]+)+/,
            title: (id) => {
              return `修改${id}周报`
            }
          }
        ]
      },
      {
        value: 'weekly_tag_write_weekly',
        page: '/webapp/you/destask/ugc/Assessment',
        name: '写周报',
        type: 'write'
      }
    ]
  })
  json.push({
    value: 'page_knowledge_tag',
    name: '知识库',
    type: 'knowledge', //配置icon
    child: [
      {
        value: 'page_knowledge_iframe',
        page:
          '/webapp/you/destask/ugc/Iframe?url=' +
          encodeURIComponent(
            'https://m.fat325.qa.nt.ctripcorp.com/webapp/you/destask/knowledge/manage'
          ) +
          '',
        name: '知识库',
        type: 'knowledge'
      },
      {
        value: 'page_project_iframe',
        page:
          '/webapp/you/destask/ugc/Iframe?url=' +
          encodeURIComponent(
            'https://m.fat325.qa.nt.ctripcorp.com/webapp/you/destask/project/manage'
          ) +
          '',
        name: '项目管理',
        type: 'knowledge'
      },
      {
        value: 'page_slb_iframe',
        page:
          '/webapp/you/destask/ugc/Iframe?url=' +
          encodeURIComponent(
            'https://m.fat325.qa.nt.ctripcorp.com/webapp/you/destask/slb/manage'
          ) +
          '',
        name: 'SLB',
        type: 'knowledge'
      }
    ]
  })
  json.push({
    value: 'user_task_tag',
    name: '任务',
    type: 'userTask', //配置icon
    child: [
      {
        value: 'user_task_index',
        page: '/webapp/you/destask/ugc/UserTask',
        name: '任务处理',
        type: 'userTask'
      },
      {
        value: 'user_task_both',
        page: '/webapp/you/destask/ugc/UserTask/taskBoth',
        name: '任务管理',
        type: 'list'
      }
    ]
  })
  if (type === '0') {
    json.push({
      value: 'user_tag',
      name: '用户',
      type: 'user',
      child: [
        {
          value: 'user_tag_user_list',
          page: '/webapp/you/destask/ugc/User/List',
          name: '用户列表',
          type: 'user', //配置icon
          hasPage: [
            {
              schema: /^(\/webapp\/you\/destask\/ugc\/User\/Add\?id=)([0-9a-zA-Z]+)+/,
              title: (name) => {
                return `修改${name}密码`
              }
            }
          ]
        },
        {
          value: 'user_tag_add_user',
          page: '/webapp/you/destask/ugc/User/Add',
          name: '新增用户',
          type: 'addUser'
        }
      ]
    })
  }
  json.push({
    value: 'page_setting_tag',
    name: '页面权限',
    type: 'setting', //配置icon
    child: [
      {
        value: 'page_setting_page_power',
        page: '/webapp/you/destask/ugc/Setting/pagePower',
        name: '页面权限',
        type: 'setting'
      }
    ]
  })
  json.push({
    value: 'page_personal_information',
    name: '个人信息',
    type: 'user', //配置icon
    child: [
      {
        value: 'page_personal_information_change',
        page: '/webapp/you/destask/ugc/Personal/Information',
        name: '个人信息',
        type: 'user'
      },
      {
        value: 'page_personal_service_test_change',
        page: '/webapp/you/destask/ugc/Personal/ServiceTest',
        name: '服务测试',
        type: 'outlined'
      },
      {
        value: 'page_personal_high_lighter',
        page: '/webapp/you/destask/ugc/Personal/HighLighter',
        name: '文字高亮',
        type: 'outlined'
      }
    ]
  })
  return json
}
