import React, { Component } from 'react';
import { FORMITEMLAYOUT, DEALRULES } from '../../util/common.js';
import { Form, Input, Checkbox, Tooltip, Row, Col, Card, Select, Button } from 'antd';
import './index.css';

const FormItem = Form.Item;
const Option = Select.Option;
class DetialForm extends Component {
  constructor(props){
    super(props)
    this.state = {
      campaignTO: {},
      cardList: [{
        ruleKey: 0,
        couponKey: 1,
        ruleGrantType: '',
        couponRuleTOs: [{
          key: 0,
          dailyAmount: null,
          soloAmount: null,
          userType: '',
        }],
      }],
    };
    this.ruleRowKey = this.state.cardList.length;
  }
  componentDidMount() {

  }
  handleSubmit = () => {

  }
  bindDealData() {
    return this.state.cardList.map((item) => {
      const { ruleGrantType, couponRuleTOs } = item;
      return {
        ruleGrantType,
        couponRuleTOs: couponRuleTOs.map((value) => {
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
      ruleKey: this.ruleRowKey,
      couponKey: 1,
      ruleGrantType: '',
      couponRuleTOs: [{
        key: 0,
        dailyAmount: null,
        soloAmount: null,
        userType: '',
      }],
    }
    this.state.cardList.push(row);
    this.bindSetTarget('cardList', this.state.cardList, () => { this.ruleRowKey += 1 });
  }
  // 删除一行规则
  bindDelRuleRow(index) {
    this.state.cardList.splice(index, 1);
    this.bindSetTarget('cardList', this.state.cardList);
  }
  // 新增一行优惠券
  bindAddCouponRow(itemData, ruleIndex) {
    const row = {
      key: itemData.couponKey,
      dailyAmount: null,
      soloAmount: null,
      userType: '',
    }
    const target = this.state.cardList[ruleIndex];
    target.couponRuleTOs.push(row);
    this.bindSetTarget('cardList', this.state.cardList, () => { target.couponKey += 1 });
  }
  // 删除一行优惠券
  bindDelCouponRow(ruleIndex, couponIndex) {
    this.state.cardList[ruleIndex].couponRuleTOs.splice(couponIndex, 1);
    this.bindSetTarget('cardList', this.state.cardList);
  }
  /**
   * Input blur
   * @param {*} e 值
   * @param {*} ruleIndex 规则行序列号
   * @param {*} couponIndex   优惠券行序列号
   * @param {*} key 某行优惠券的某列的key值
   */
  bindSetCoupon(e, ruleIndex, couponIndex, key) {
    const target = this.state.cardList[ruleIndex].couponRuleTOs[couponIndex];
    const value = e.target.value;
    target[key] = value === '' ? null : (+value);
  }
  bindSetUserType(e, ruleIndex, couponIndex, key) {
    const target = this.state.cardList[ruleIndex].couponRuleTOs[couponIndex];
    target[key] = +e;
  }
  bindCardInputBlur(e, ruleIndex) {
    const target = this.state.cardList[ruleIndex];
    const value = e.target.value.trim();
    target.ruleGrantType = value;
    const key = `ruleGrantType-${target.ruleKey}`;
    console.log(key)
    this.props.form.setFieldsValue({
      [key]: value
    });
    
  }
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
              {required: true, message: 'Input something!'}
            ],
          })(
            <Input placeholder="请填写获取列表详情接口" />
          )}
        </FormItem>
        <FormItem
          {...FORMITEMLAYOUT}
          label="是否需要编辑权限"
        >
          {getFieldDecorator('isCheckEdit', {
          })(
            <Tooltip
              placement="right"
              title="是否需要编辑权限逻辑：未开始时可修改，已生效只能结束，已结束只能查看"
            >
              <Checkbox />
            </Tooltip>
          )}
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
            {getFieldDecorator(`ruleGrantType-${items.ruleKey}`, {
              rules: [{ required: true, message: '请填写' }],
            })(
              <Input onBlur={e => this.bindCardInputBlur(e, ruleIndex)} placeholder="请填写Card组件的title"/>
            )}
          </FormItem>
        </Col>
        <Col span={3} offset={9} style={{ paddingTop: 12 }}>
          {
          this.state.cardList.length < 2 ? null
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
    const { couponRuleTOs, ruleKey } = itemData
    const isShowDelIcon = couponRuleTOs.length > 1;
    return (<div className="rule-content">
      {couponRuleTOs.map((item, index) =>
        this.renderCouponItem(item, index, ruleIndex, ruleKey, isShowDelIcon))
      }
    </div>)
  }
  /**
   * render优惠券item
   * @param {any} couponItem 每一行优惠数的数据
   * @param {any} couponIndex 优惠券的序列号
   * @param {any} ruleIndex   优惠券所属的“规则行”的序列号
   * @param {any} ruleKey 优惠券所属的“规则行”的key值
   * @param {any} isShowDelIcon 该行优惠券末尾是否允许删除
   */
  renderCouponItem(couponItem, couponIndex, ruleIndex, ruleKey, isShowDelIcon) {
    const { dailyAmount, soloAmount, userType, key} = couponItem;
    const { getFieldDecorator } = this.props.form;
    const ONLYKEY = `${ruleKey}-${key}`;
    return (
      <Row key={ONLYKEY} className="rule-coupon-item">
        <Col span={3}>
          <FormItem>
            {getFieldDecorator(`dailyAmount-${ONLYKEY}`, {
              rules: [{ required: true, message: '请填写字段名' }],
              initialValue: dailyAmount,
            })(
              <Input
                style={{ width: '90%' }}  placeholder="例：商品Id"
                onBlur={val => this.bindSetCoupon(val, ruleIndex, couponIndex, 'dailyAmount')}
              />
            )}
          </FormItem>
        </Col>
        <Col span={3}>
          <FormItem>
            {getFieldDecorator(`soloAmount-${ONLYKEY}`, {
              rules: [{ required: true, message: '请填写字段名' }],
              initialValue: soloAmount,
            })(
              <Input
                style={{ width: '90%' }}  placeholder="例：id"
                onBlur={val => this.bindSetCoupon(val, ruleIndex, couponIndex, 'soloAmount')}
              />,
            )}
          </FormItem>
        </Col>
        <Col span={4}>
          <FormItem>
            {getFieldDecorator(`userType-${ONLYKEY}`, {
              initialValue: `nothing`,
              rules: [{ required: true, message: '字段处理' }],
            })(
              <Select
                onChange={e => this.bindSetUserType(e, ruleIndex, couponIndex, 'userType')}
              >
                { DEALRULES.map(item =>
                  <Option key={item.id}>{item.name}</Option>)
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
    const { cardList } = this.state;
    return (
      <Card bordered={false}>
        <Form>
          <Card title="基础配置" type="inner" >
            {this.renderForm()}
          </Card>
          <Card title="列表设置" type="inner" >
            {
              cardList && cardList.map((item, index) => (
                <div className="coupon-rule-item" key={item.ruleKey}>
                  {this.renderHead(item, index)}
                  {this.renderCol(item, index)}
                  {this.renderCoupon(item, index)}
                </div>
              ))
            }
            <div>
              <Row>
                <Col span={3}>
                  <Button type="primary" icon="plus" onClick={this.bindAddRuleRow}>添加规则</Button>
                </Col>
              </Row>
            </div>
          </Card>
        </Form>
      </Card>
    );
  }
}

const Detial = Form.create()(DetialForm);
export default Detial;
