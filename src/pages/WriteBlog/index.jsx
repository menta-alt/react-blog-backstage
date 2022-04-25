import React, { useState } from 'react'
import { Form, Row, Col, Input, Select, Button } from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import Editor from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
// 自行处理不安全的 html 内容,xss防范
import sanitizeHtml from 'sanitize-html'
import './index.less'

const { Option } = Select
const { TextArea } = Input

export default function WriteBlog() {
  const [text, setText] = useState('')
  const [previewTheme] = useState('github')
  const [clickPublish, SetClickPublish] = useState(false)

  const children = []
  for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
  }

  const handleClassesChange = value => {
    console.log(`selected ${value}`)
  }

  const handleTagChange = value => {
    console.log(`selected ${value}`)
  }

  // 点击发布文章
  const publishHandler = () => {
    SetClickPublish(true)
  }

  // 取消发布文章
  const cancelPublishHandler = () => {
    SetClickPublish(false)
  }

  const onFinish = values => {
    console.log('Success:', values)
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <div className="publish">
        <Input placeholder="请输入文章标题" defaultValue="[无标题]" size="large" />
        <Button type="primary" shape="round" size="large" onClick={publishHandler}>
          发布文章
        </Button>
      </div>

      <Editor modelValue={text} onChange={setText} previewTheme={previewTheme} sanitize={html => sanitizeHtml(html)} />

      <div className={clickPublish ? 'mask' : 'nomask'}>
        <div className="publishCard">
          <div className="top">
            <h3>发布文章</h3>
            <CloseOutlined className="closeBtn" onClick={cancelPublishHandler}/>
          </div>

          <Form 
            name="publish" 
            onFinish={onFinish} 
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="摘要"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <TextArea className="textarea" rows={5} placeholder="请输入摘要" />
            </Form.Item>

            <Form.Item
              label="文章分类"
              name="classes"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Select className="select" style={{ width: 200 }} placeholder="设置文章所属专栏" onChange={handleClassesChange}>
                {children}
              </Select>
            </Form.Item>

            <Form.Item
              label="文章标签"
              name="tag"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Select className="select" showArrow mode="tags" placeholder="设置文章标签" onChange={handleTagChange}>
                {children}
              </Select>
            </Form.Item>

            <Row>
              <Col
                span={24}
                style={{
                  textAlign: 'right'
                }}
              >
                <Button 
                  type="primary" 
                  htmlType="submit"
                  style={{
                    marginRight: '10px',
                  }}
                >
                  发布
                </Button>
                <Button 
                  onClick={cancelPublishHandler}
                >
                  取消
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
    </>
  )
}
