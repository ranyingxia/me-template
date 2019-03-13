import React, { Component } from 'react';
import { Form, Input, Checkbox, Row, Col, Card, Select, Button, Icon, Collapse } from 'antd';
import axiosFun from '../../util/axios';
import { FORMITEMLAYOUT, FORMITEMLAYOUTWITHTWOLABEL, FORMBTNLAYOUT, DEALRULES, ERROR_HOLDER, FILTERSELECT } from '../../util/common.js';

import '../detail/index.css';

const FormItem = Form.Item;
const Option = Select.Option;
const Panel = Collapse.Panel;
let uuid = 0;
const FILTERROW = {
  id: 0,
  text: '',
  select: 'text-filer',
  key: '',
  from: '',
  defaultAll: false
}

const TABLEROW = {
  id: 1,
  text: '',
  percent: 20,
  key: '',
  dealType: 'nothing',
}
const FILTER = 'filterList';
const TABLE = 'tableList';
const REGEX = {
  NUMBER: /^[0-9]*$/,
}
class ListForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      filterList:[
        { ...FILTERROW }
      ],
      tableList: [
        { ...TABLEROW }
      ],
      showSelect: false,
    };
    this.addRowKey = 2;
  }
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  remove = (k) => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  /**
   * 验证并提交表单
   */
  handleSubmit = (e) => {
    e.preventDefault();
    const { filterList, tableList } = this.state;
    this.props.form.validateFieldsAndScroll((err, values) => {
      console.log(values);
      const { inputTitle, inputBack, inputCheckrole, filterEnumsApi, tableDataApi, inputTableFrom, tabTextList, tabKeyList } = values;
      if (!err) {
        // 最终要提交的接口数据
        const postData = {
          inputTitle,
          inputBack,
          inputCheckrole,
          filterEnumsApi,
          tableDataApi,
          inputTableFrom,
          inputTab:{
            value: this.dealTabData(tabTextList, tabKeyList) || [],
          },
          inputTable: {
            value: tableList,
          },
          inputFilter: {
            value: filterList,
          }
        }
        axiosFun.post('cps/api/list/create', postData);
      }
    })
  }
  // tab的数据
  dealTabData(tabTextList, tabKeyList) {
    return tabTextList && tabTextList.map((value, index) => ({
      tabText: value,
      tabKey: tabKeyList[index],
    }))
  }
  bindSetValueTarget = (e, stateKey, index, key) => {
    const value = typeof(e) === 'object' ? e.target.value : e;
    const target = this.state[stateKey][index];
    target[key] = value;
    this.setState({
      [stateKey]: this.state[stateKey]
    })
  }
  /**
   * 筛选栏
   */
  bindSelectChange = (val, stateKey, index, key) => {
    const target = this.state[stateKey][index];
    target[key] = val;
    this.setState({
      [stateKey]: this.state[stateKey],
      showSelect: val === 'select-filer',
    })
  }
  /**
   * 新增一行
   */
  bindAddRow(stateKey) {
    const addRow = {
      ...(stateKey === FILTER ? FILTERROW : TABLEROW),
      id: this.addRowKey,
    }
    this.addRowKey += 1;
    this.setState({
      [stateKey]: this.state[stateKey].concat(addRow),
    })
  }
  /**
   * 删除一行
   */
  bindDelRow(index, stateKey) {
    this.state[stateKey].splice(index, 1);
    this.setState({
      [stateKey]: this.state[stateKey]
    })
  }
  /**
   * render 基础信息
   */
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        <FormItem {...FORMITEMLAYOUT} label="页面标题">
          {getFieldDecorator('inputTitle', {
            rules: [
              {required: true, message: ERROR_HOLDER }
            ],
          })(
            <Input placeholder="例如：生产单" style={{ width: '80%'}} />
          )}
        </FormItem>
        <FormItem {...FORMITEMLAYOUTWITHTWOLABEL} label="标题提示">
          {getFieldDecorator('inputBack', {
          })(
            <Input placeholder="页面标题的icon(问号)提示文案" style={{ width: '80%'}} />
          )}
        </FormItem>
        <FormItem {...FORMITEMLAYOUT} label="顶部tab栏">
          <Button type="dashed" onClick={this.add} style={{ width: '80%'}}>
            <Icon type="plus" /> Add
          </Button>
        </FormItem>
        {this.renderFormItems()}
      </div>
    )
  }
  renderFormItems() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');    
    const formItems = keys.map((k, index) => {
      return (
        <Row key={k}>
          <Col span={8} offset={8}>
            <FormItem
              {...FORMITEMLAYOUTWITHTWOLABEL}
              required={false}
              label="tab文案"
            >
              {getFieldDecorator(`tabTextList[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{ required: true, message: ERROR_HOLDER }],
              })(
                <Input placeholder="例如：一级分销商" style={{ width: '80%' }} />
              )}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem
              {...FORMITEMLAYOUTWITHTWOLABEL}
              required={false}
              label="tab对应的key值"
            >
              {getFieldDecorator(`tabKeyList[${k}]`, {
                validateTrigger: ['onChange', 'onBlur'],
                rules: [{ required: true, message: ERROR_HOLDER }],
              })(
                <Input placeholder="会传给后端进行页面切换时候的filter数据" style={{ width: '80%', marginRight: 8 }} />
              )}
              <Icon
                className="dynamic-delete-button"
                type="minus-circle-o"
                style={{ cursor: 'pointer' }}
                onClick={() => this.remove(k)}
              />
            </FormItem>
          </Col>
        </Row>
      );
    });
    return formItems;    
  }
  // render表头
  renderFilterHead() {
    const { showSelect } = this.state;
    const colArr = ['label 文案', 'key值', '筛选栏类型', '从枚举接口获取的字段', 'select默认为全选'].slice(0, showSelect ? 5 : 3);
    return (<Row className="rule-head">
      {
        colArr.map((value, index) => (
          <Col key={index} span={index < 2 ? 3 : 4}>{value}</Col>
        ))
      }
    </Row>)
  }
  renderTableHead() {
    const colArr = ['title 文案', 'key值', '宽度百分比（%）', '字段处理'];
    return (<Row className="rule-head">
      {
        colArr.map((value, index) => (
          <Col key={index} span={3}>{value}</Col>
        ))
      }
    </Row>)
  }
  renderTableItem(item, index) {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row key={item.id} className="rule-coupon-item">
        <Col span={3}>
          <FormItem>
            {getFieldDecorator(`text-${item.id}`, {
              rules: [{ required: true, message: ERROR_HOLDER }],
              initialValue: '',
            })(
              <Input
                style={{ width: '90%' }}  placeholder="例：商品Id"
                onBlur={val => this.bindSetValueTarget(val, TABLE, index, 'text')}
              />
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            {getFieldDecorator(`key-${item.id}`, {
              rules: [{ required: true, message: ERROR_HOLDER }],
              initialValue: '',
            })(
              <Input
                style={{ width: '90%' }}  placeholder="例：id"
                onBlur={val => this.bindSetValueTarget(val, TABLE, index, 'key')}
              />,
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            {getFieldDecorator(`percent-${item.id}`, {
              rules: [
                { required: true, message: ERROR_HOLDER },
                { pattern: REGEX.NUMBER, message: '只能填写数字' }
              ],
              initialValue: `${item.percent}`,
            })(
              <Input
                style={{ width: '90%' }}  placeholder="例：20"
                onBlur={val => this.bindSetValueTarget(val, TABLE, index, 'percent')}
              />,
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator(`dealType-${item.id}`, {
              initialValue: `${item.dealType}`,
            })(
              <Select
                onChange={e => this.bindSetValueTarget(e, TABLE, index, 'dealType')}
              >
                {
                  Object.keys(DEALRULES).map(((v) => <Option key={v}>{DEALRULES[v]}</Option>))
                }
              </Select>,
            )}
          </FormItem>
        </Col>
        {
          this.state.tableList.length > 1 ? <Col span={3}>
            <Button
              shape="circle" icon="minus"
              style={{ marginTop: 5 }}
              onClick={() => this.bindDelRow(index, TABLE)} />
          </Col> : null
        }
      </Row>
    )    
  }
  renderFilterItem(item, index) {
    const { getFieldDecorator } = this.props.form;
    const { showSelect } = this.state;
    return (
      <Row key={item.id} className="rule-coupon-item">
        <Col span={3}>
          <FormItem>
            {getFieldDecorator(`text-${item.id}`, {
              rules: [{ required: true, message: ERROR_HOLDER }],
              initialValue: '',
            })(
              <Input
                style={{ width: '90%' }}  placeholder="例：商品Id"
                onBlur={val => this.bindSetValueTarget(val, FILTER, index, 'text')}
              />
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            {getFieldDecorator(`key-${item.id}`, {
              rules: [{ required: true, message: ERROR_HOLDER }],
              initialValue: '',
            })(
              <Input
                style={{ width: '90%' }}  placeholder="例：id"
                onBlur={val => this.bindSetValueTarget(val, FILTER, index, 'key')}
              />,
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator(`select-${item.id}`, {
              initialValue: 'text-filer',
            })(
              <Select
                onChange={val => this.bindSelectChange(val, FILTER, index, 'select')}
              >
                {
                  Object.keys(FILTERSELECT).map(((v) => <Option key={v}>{FILTERSELECT[v]}</Option>))
                }
              </Select>,
            )}
          </FormItem>
        </Col>
        {
          showSelect ? <div>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator(`from-${item.id}`, {
                })(
                  <Input 
                    style={{ width: '90%' }}  placeholder="例如：bonusType"
                    onBlur={val => this.bindSetValueTarget(val, FILTER, index, 'from')}
                  />
                )}
              </FormItem>
            </Col>
            <Col span={4}>
              <FormItem>
                {getFieldDecorator(`defaultAll-${item.id}`, {
                })(
                  <Checkbox onChange={val => this.bindSetValueTarget(val, FILTER, index, 'defaultAll')} />
                )}
              </FormItem>
            </Col>
          </div> : null 
        }
        {
          <Col span={3}>
            <Button
              shape="circle" icon="minus"
              style={{ marginTop: 5 }}
              onClick={() => this.bindDelRow(index, FILTER)} />
          </Col>
        }
      </Row>
    )
  }
  renderFilterForm() {
    const { getFieldDecorator } = this.props.form;
    return(
      <Row>
        <Col span={12}>
          <FormItem {...FORMITEMLAYOUTWITHTWOLABEL} label="筛选栏下拉框枚举值的api：">
            {getFieldDecorator('filterEnumsApi', {
            })(
              <Input placeholder="例如：/api/a/b"/>
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }
  renderTableForm() {
    const { getFieldDecorator } = this.props.form;
    return(
      <Row>
        <Col span={12}>
          <FormItem {...FORMITEMLAYOUTWITHTWOLABEL} label="table数据的api：">
            {getFieldDecorator('tableDataApi', {
              rules: [
                { required: true, message: ERROR_HOLDER },
                { whitespace: true, message: ERROR_HOLDER }
              ],
            })(
              <Input placeholder="例如：/api/a/b" />
            )}
          </FormItem>
        </Col>
        <Col span={12}>
          <FormItem {...FORMITEMLAYOUTWITHTWOLABEL} label="table接口对应的字段：">
            {getFieldDecorator('inputTableFrom', {
              rules: [
                { required: true, message: ERROR_HOLDER },
                { whitespace: true, message: ERROR_HOLDER }
              ],
            })(
              <Input placeholder="例: data.a 是table列表数据，则填入a" />
            )}
          </FormItem>
        </Col>
      </Row>
    )
  }
  renderFormBtn() {
    return (<FormItem {...FORMBTNLAYOUT}>
      <Button type="primary" htmlType="submit">保存</Button>
    </FormItem>)
  }
  render() {
    const { filterList, tableList } = this.state;
    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit}>
          <Collapse defaultActiveKey={['1', '2', '3']}>
            <Panel header="基础信息" key="1">
              {this.renderForm()}
            </Panel>
            <Panel header="筛选区" key="2">
              {this.renderFilterForm()}
              <div className="coupon-rule-item">
                {this.renderFilterHead()}
                <div className="rule-content">
                  { 
                    filterList.map((item, index) => this.renderFilterItem(item, index))
                  }
                  <Button type="primary" icon="plus" onClick={() => this.bindAddRow(FILTER)} style={{ marginLeft: 8, marginBottom: 20 }}>添加</Button>
                </div>
              </div>
            </Panel>
            <Panel header="Table区" key="3">
              {this.renderTableForm()}
              <div className="coupon-rule-item">
                {this.renderTableHead()}
                <div className="rule-content">
                  { 
                    tableList.map((item, index) => this.renderTableItem(item, index))
                  }
                  <div style={{ marginLeft: 8, marginBottom: 20 }}>
                    <Button type="primary" icon="plus" onClick={() => this.bindAddRow(TABLE)}>添加</Button>
                    <span className="greyTip">（注意：所有列的宽度加起来要为100）</span>
                  </div>
                </div>
              </div>
            </Panel>
          </Collapse>
          <div style={{ marginTop: 25 }}>
            {this.renderFormBtn()}
          </div>
        </Form>
      </Card>
    )
  }
}

const List = Form.create()(ListForm);
export default List;
