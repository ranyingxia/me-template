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
// 一行放两个
export const FORMITEMLAYOUTWITHTWOLABEL = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  },
}
// 表达底部按钮
export const FORMBTNLAYOUT = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 4,
      offset: 20,
    },
  },
}

export const DEALRULES = {
  nothing: '不处理',
  empty: '可以为空',
  timeM: '时间格式化保留到分',
  timeS: '时间格式化保留到秒',
  money: '分转元',
  phone: '电话号码加密解密',
}

export const FILTERSELECT = {
  'number-filer': '数字输入栏',
  'phone-filer': '手机号输入栏',
  'text-filer': '文本输入栏',
  'time-d-filer': '时间间隔输入栏',
  'select-filer': '下拉框输入栏',
}


export const EMPTY_HOLDER = '--'
export const ERROR_HOLDER = '请填写'
