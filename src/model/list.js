export default {
  inputTitle: '页面标题',
  inputBack: '是否需要返回按钮, bool',
  inputCheckrole: '是否需要鉴权逻辑',
  inputTab: {
    value: [
      {tabKey: 'table对应的key', tabText: 'tab文案'}
    ]
  },
  filterEnumsApi: '筛选栏下拉框枚举值的api',
  inputFilter: {
    value: [
      { text: "手机号",
        select: "phone-filer",
        key: "phone",
        from: "bonusType",
        defaultAll: true 
      },
    ]
  },
  tableDataApi: '对应的table数据的api',
  inputTableFrom: 'table 列表数据对应的字段',
  inputTable: {
    value: [
      {
        text: "第一行",
        percent: "50%",
        key: "name",
        ifDate: false,
        ifEncryptionPhoneNum: true,
      }
    ]
  }
}