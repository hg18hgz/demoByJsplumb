import React, { Component } from "react";
import { Modal, List, Button, Form, Input } from "antd";
import { v4 as uuidv4 } from "uuid";
export default class node extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
    };
  }
  componentDidMount() {
    this.props.initNode(this.props.id);
  }
  componentDidUpdate() {
    this.props.initNode(this.props.id);
  }
  handleAssociate() {
    this.setState({ isShow: true });
  }
  onFinish(values) {
    this.setState({ isShow: false });

    const { snapMap, id, handleSnapChange, handleSnapAdd } = this.props;
    const { key1, val1, key2, val2 } = values;
    const curObjId = uuidv4();
    const curObj = {
      id: curObjId,
      name: val1,
    };
    const curSnap = {
      id,
      data: [...snapMap[id].data, curObj],
    };

    const newId = handleSnapAdd(key2);
    const newObjId = uuidv4();
    const newObj = {
      id: newObjId,
      name: val2,
    };
    const newSnap = {
      id: newId,
      data: [...snapMap[newId].data, newObj],
    };
    handleSnapChange(curSnap, newSnap);
  }
  render() {
    const { item } = this.props;
    return (
      <div className="">
        <List
          style={{ width: "200px" }}
          header={<div>header:{item.headerName}</div>}
          bordered
          dataSource={item.data}
          renderItem={(item) => {
            return <List.Item id={item.id}>{item.name}</List.Item>;
          }}
        />

        <div>
          <div style={{ marginLeft: "100px" }}>|</div>
          <Button
            style={{ marginLeft: "60px" }}
            onClick={() => this.handleAssociate()}
          >
            addItem
          </Button>
        </div>

        <Modal
          title="addObj"
          visible={this.state.isShow}
          width="80%"
          destroyOnClose
          onOk={() => this.handleModalOk()}
          onCancel={() => {
            this.setState({ isShow: false });
          }}
          footer={null}
        >
          <Form name="basic" onFinish={(v) => this.onFinish(v)}>
            <Form.Item label="key1" name="key1">
              <Input disabled defaultValue={item.headerName} />
            </Form.Item>
            <Form.Item label="val1" name="val1">
              <Input />
            </Form.Item>
            <Form.Item label="key2" name="key2">
              <Input />
            </Form.Item>
            <Form.Item label="val2" name="val2">
              <Input />
            </Form.Item>
            <Button type="primary" htmlType="submit">
              ok
            </Button>
          </Form>
        </Modal>
      </div>
    );
  }
}
