// FORM表单的配置
export const FORMITEMLAYOUT = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
}
export const DEALRULES = [
  {id: 'nothing', name: '不处理'},
  {id: 'empty', name: '可以为空'},
  {id: 'timeM', name: '时间格式化保留到分'},
  {id: 'timeS', name: '时间格式化保留到秒'},
  {id: 'money', name: '分转元'}
]

export const EMPTY_HOLDER = '--'
