import React, { Component } from 'react';
import { Form, Input } from 'antd';
import { FORMITEMLAYOUT } from '../../util/common.js';

const FormItem = Form.Item;
class DetialForm extends Component {
  componentDidMount() {

  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
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
        </Form>
      </div>
    );
  }
}

const Detial = Form.create()(DetialForm);
export default Detial;
