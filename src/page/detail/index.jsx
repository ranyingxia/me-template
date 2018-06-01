import React, { Component } from 'react';
import { FORMITEMLAYOUT, FULLFORMITEMLAYOUT, FORMBTNLAYOUT, DEALRULES, ERROR_HOLDER } from '../../util/common.js';
import { Form, Input, Checkbox, Row, Col, Card, Select, Button, Icon } from 'antd';
import './index.css';

const FormItem = Form.Item;
const Option = Select.Option;
const DEFAULTSELECT = 'nothing';
let uuid = 0;
class DetialForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      itemList: [{
        itemKey: 0,
        childAddKey: 1,
        cardName: '',
        childList: [{
          key: 0,
          name: null,
          param: null,
          deal: DEFAULTSELECT,
        }],
      }],
    };
    this.itemAddKey = this.state.itemList.length;
  }
  /**
   * 验证并提交表单
   */
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { apiGetDetail, apiGetOther, isCheckEdit, isCkeckRole } = values;
        // 最终要提交的接口数据
        const postData = {
          apiGetDetail,
          apiGetOther,
          isCheckEdit,
          isCkeckRole,
          childList: this.bindDealData(),
        }
        console.log(postData);
        return postData;
      }
    })
  }
  /**
   * 处理接口返回数据
   */
  bindDealData() {
    return this.state.itemList.map((item) => {
      const { cardName, childList } = item;
      return {
        cardName,
        childList: childList.map((value) => {
          const { key, ...other } = value;
          return other
        }),
      }
    })
  }
  // setSate
  bindSetTarget(target, value, callback) {
    this.setState({
      [target]: value,
    }, () => {
      callback && callback();
    })
  }
  //  增加一行规则
  bindAddRuleRow = () => {
    const row = {
      itemKey: this.itemAddKey,
      childAddKey: 1,
      cardName: '',
      childList: [{
        key: 0,
        name: null,
        param: null,
        deal: DEFAULTSELECT,
      }],
    }
    this.state.itemList.push(row);
    this.bindSetTarget('itemList', this.state.itemList, () => { this.itemAddKey += 1 });
  }
  // 删除一行card
  bindDelRuleRow(index) {
    this.state.itemList.splice(index, 1);
    this.bindSetTarget('itemList', this.state.itemList);
  }
  // 新增一行优惠券
  bindAddCouponRow(itemData, ruleIndex) {
    const row = {
      key: itemData.childAddKey,
      name: null,
      param: null,
      deal: DEFAULTSELECT,
    }
    const target = this.state.itemList[ruleIndex];
    target.childList.push(row);
    this.bindSetTarget('itemList', this.state.itemList, () => { target.childAddKey += 1 });
  }
  // 删除一行优惠券
  bindDelCouponRow(ruleIndex, couponIndex) {
    this.state.itemList[ruleIndex].childList.splice(couponIndex, 1);
    this.bindSetTarget('itemList', this.state.itemList);
  }
  /**
   * Input blur
   * @param {*} e 值
   * @param {*} ruleIndex 规则行序列号
   * @param {*} couponIndex   优惠券行序列号
   * @param {*} key 某行优惠券的某列的key值
   */
  bindSetCoupon(e, ruleIndex, couponIndex, key) {
    const target = this.state.itemList[ruleIndex].childList[couponIndex];
    const value = e.target.value.trim();
    target[key] = value;
  }
  bindSetDeal(e, ruleIndex, couponIndex, key) {
    const target = this.state.itemList[ruleIndex].childList[couponIndex];
    target[key] = e;
  }
  bindCardInputBlur(e, ruleIndex) {
    const target = this.state.itemList[ruleIndex];
    const value = e.target.value.trim();
    target.cardName = value;
    const key = `cardName-${target.itemKey}`;
    this.props.form.setFieldsValue({
      [key]: value
    });
    
  }
  add = () => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // We need at least one passenger
    if (keys.length === 1) {
      return;
    }

    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  renderFormItems() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const formItemLayoutWithOutLabel = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 8, offset: 8 },
      },
    };
    getFieldDecorator('keys', { initialValue: [] });
    const keys = getFieldValue('keys');    
    const formItems = keys.map((k, index) => {
      return (
        <FormItem
          {...formItemLayoutWithOutLabel}
          required={false}
          key={k}
        >
          {getFieldDecorator(`apiGetOther[${k}]`, {
            validateTrigger: ['onChange', 'onBlur'],
            rules: [
              {required: true, message: "Please input passenger's name or delete this field.",
            }],
          })(
            <Input placeholder="页面上的其他接口，例如：/api/sub1/sub2" style={{ width: '80%', marginRight: 8 }} />
          )}
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              type="minus-circle-o"
              disabled={keys.length === 1}
              onClick={() => this.remove(k)}
            />
          ) : null}
        </FormItem>
      );
    });
    return formItems;    
  }
  renderFormBtn() {
    return (<FormItem {...FORMBTNLAYOUT}>
      <Button type="primary" htmlType="submit">保存</Button>
    </FormItem>)
  }
  /**
   * render 基础信息
   */
  renderForm() {
    const { getFieldDecorator } = this.props.form;
    return(
      <div>
        <FormItem
          {...FORMITEMLAYOUT}
          label="详情接口api"
        >
          {getFieldDecorator('apiGetDetail', {
            rules: [
              {required: true, message: ERROR_HOLDER }
            ],
          })(
            <Input placeholder="获取详情的接口,例如：/api/sub1/sub2" />
          )}
        </FormItem>
        <FormItem
          {...FORMITEMLAYOUT}
          label="其他接口api"
        >
          <Button type="dashed" onClick={this.add} style={{ width: '80%'}}>
            <Icon type="plus" /> Add
          </Button>
        </FormItem>
        {this.renderFormItems()}
        <FormItem
          {...FULLFORMITEMLAYOUT}
          label="是否需要编辑权限"
        >
          {getFieldDecorator('isCheckEdit', {
          })(
            <Checkbox />
          )}
          <span className="greyTip">（是否需要编辑权限逻辑即：未开始时可修改，已生效只能结束，已结束只能查看）</span>
        </FormItem>
        <FormItem
          {...FORMITEMLAYOUT}
          label="角色鉴权"
        >
          {getFieldDecorator('isCkeckRole', {
          })(
            <Checkbox />
          )}
        </FormItem>
      </div>
    )
  }
  // render规则
  renderHead(items, ruleIndex) {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row className="rule-title">
        <Col span={12}>
          <FormItem labelCol={{ sm: { span: 4 } }} wrapperCol={{ sm: { span: 10 } }} label="title">
            {getFieldDecorator(`cardName-${items.itemKey}`, {
              rules: [{ required: true, message: ERROR_HOLDER }],
            })(
              <Input onBlur={e => this.bindCardInputBlur(e, ruleIndex)} placeholder="请填写Card组件的title"/>
            )}
          </FormItem>
        </Col>
        <Col span={3} offset={9} style={{ paddingTop: 12 }}>
          {
          this.state.itemList.length < 2 ? null
            : <Button type="primary" size="small" icon="plus" onClick={() => this.bindDelRuleRow(ruleIndex)}>删除&nbsp;</Button>
          }
        </Col>
      </Row>
    )
  }
  // render优惠券表头
  renderCol(itemData, ruleIndex) {
    const colArr = ['列名', '字段', '字段处理'];
    return (<Row className="rule-head">
      {colArr.map((value, index) => (
        <Col key={index} span={index === 2 ? 4 : 3}>{value}</Col>
      ))}
      <Col span={3}>
        <Button type="primary" size="small" icon="plus" onClick={() => this.bindAddCouponRow(itemData, ruleIndex)}>添加&nbsp;</Button>
      </Col>
    </Row>)
  }
  // render优惠券列表
  renderCoupon(itemData, ruleIndex) {
    const { childList, itemKey } = itemData
    const isShowDelIcon = childList.length > 1;
    return (<div className="rule-content">
      {childList.map((item, index) =>
        this.renderCouponItem(item, index, ruleIndex, itemKey, isShowDelIcon))
      }
    </div>)
  }
  /**
   * render优惠券item
   * @param {any} couponItem 每一行优惠数的数据
   * @param {any} couponIndex 优惠券的序列号
   * @param {any} ruleIndex   优惠券所属的“规则行”的序列号
   * @param {any} itemKey 优惠券所属的“规则行”的key值
   * @param {any} isShowDelIcon 该行优惠券末尾是否允许删除
   */
  renderCouponItem(couponItem, couponIndex, ruleIndex, itemKey, isShowDelIcon) {
    const { key} = couponItem;
    const { getFieldDecorator } = this.props.form;
    const ONLYKEY = `${itemKey}-${key}`;
    return (
      <Row key={ONLYKEY} className="rule-coupon-item">
        <Col span={3}>
          <FormItem>
            {getFieldDecorator(`name-${ONLYKEY}`, {
              rules: [{ required: true, message: ERROR_HOLDER }],
              initialValue: '',
            })(
              <Input
                style={{ width: '90%' }}  placeholder="例：商品Id"
                onBlur={val => this.bindSetCoupon(val, ruleIndex, couponIndex, 'name')}
              />
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            {getFieldDecorator(`param-${ONLYKEY}`, {
              rules: [{ required: true, message: ERROR_HOLDER }],
              initialValue: '',
            })(
              <Input
                style={{ width: '90%' }}  placeholder="例：id"
                onBlur={val => this.bindSetCoupon(val, ruleIndex, couponIndex, 'param')}
              />,
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator(`deal-${ONLYKEY}`, {
              initialValue: 'nothing',
            })(
              <Select
                onChange={e => this.bindSetDeal(e, ruleIndex, couponIndex, 'deal')}
              >
                {
                  Object.keys(DEALRULES).map(((v) => <Option key={v}>{DEALRULES[v]}</Option>))
                }
              </Select>,
            )}
          </FormItem>
        </Col>
        {
          isShowDelIcon ? <Col span={3}>
            <Button
              shape="circle" icon="minus"
              style={{ marginTop: 5 }}
              onClick={() => this.bindDelCouponRow(ruleIndex, couponIndex)} />
          </Col> : null
        }
      </Row>
    )
  }
  render() {
    const { itemList } = this.state;
    return (
      <Card bordered={false}>
        <Form onSubmit={this.handleSubmit}>
          <Card title="基础配置" type="inner" >
            {this.renderForm()}
          </Card>
          <Card title="列表设置" type="inner" >
            {
              itemList && itemList.map((item, index) => (
                <div className="coupon-rule-item" key={item.itemKey}>
                  {this.renderHead(item, index)}
                  {this.renderCol(item, index)}
                  {this.renderCoupon(item, index)}
                </div>
              ))
            }
            <Row>
              <Col span={3}>
                <Button type="primary" icon="plus" onClick={this.bindAddRuleRow}>添加规则</Button>
              </Col>
            </Row>
          </Card>
          <div style={{ marginTop: 25 }}>
            {this.renderFormBtn()}
          </div>
        </Form>
      </Card>
    );
  }
}

const Detial = Form.create()(DetialForm);
export default Detial;
