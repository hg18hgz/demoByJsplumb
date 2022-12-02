import React, { Component } from "react";
import { Button, Modal, Form, Input } from "antd";
import Node from "./node";
import { jsPlumb } from "jsplumb";
import { v4 as uuidv4 } from "uuid";
export default class container extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snapMap: {},
      renderMap: {},
      jsplumbInstance: jsPlumb.getInstance({}),
      isModalOpen: false,
    };
  }
  componentDidMount() {
    jsPlumb.ready(() => {
      const jsplumbInstance = jsPlumb.getInstance({});

      this.setState({ jsplumbInstance });
    });
  }
  initNode(id) {
    this.addEndPoints(id);
  }
  addEndPoints(toId) {
    const { snapMap, jsplumbInstance } = this.state;
    snapMap[toId].data.forEach((item) => {
      let uuid = item.id;
      if (!jsplumbInstance.getEndpoint(uuid)) {
        jsplumbInstance.addEndpoint(uuid, {
          anchor: ["Right"],
          uuid,
        });
      }
    });
  }
  handleSnapAdd(headerName) {
    const { snapMap } = this.state;
    const instanceId = uuidv4();
    snapMap[instanceId] = {
      headerName,
      data: [],
    };

    return instanceId;
  }
  handleSnapChange(...list) {
    const { snapMap } = this.state;
    list.forEach((item) => {
      snapMap[item.id].data = item.data;
    });
    this.setState({ snapMap });
  }

  showModal = () => {
    this.setState({ isModalOpen: true });
  };

  onFinish = (values) => {
    this.setState({ isModalOpen: false });
    this.handleSnapAdd(values.key);
  };
  render() {
    const { snapMap } = this.state;
    return (
      <div>
        <Button type="primary" onClick={this.showModal}>
          addList
        </Button>
        {Object.keys(snapMap).map((id) => {
          const nodePayload = {
            item: snapMap[id],
            initNode: (id) => this.initNode(id),
            id,
            snapMap,
            handleSnapChange: (...list) => this.handleSnapChange(...list),
            handleSnapAdd: (k) => this.handleSnapAdd(k),
          };
          return <Node {...nodePayload} key={id} id={id} />;
        })}

        <Modal
          title="add Node"
          open={this.state.isModalOpen}
          onOk={this.handleOk}
          onCancel={() => {
            this.setState({ isModalOpen: false });
          }}
          footer={null}
        >
          <Form name="basic" onFinish={this.onFinish}>
            <Form.Item label="key" name="key">
              <Input />
            </Form.Item>

            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form>
        </Modal>
      </div>
    );
  }
}
