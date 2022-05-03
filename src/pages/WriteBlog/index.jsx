import React, { useEffect, useRef, useState } from 'react'
import { Form, Row, Col, Input, Select, Button} from 'antd'
import { CloseOutlined } from '@ant-design/icons'
import store from '@/redux/store.js'
import { httpPost } from '@/utils/api/axios.js'
import Editor from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
// 自行处理不安全的 html 内容,xss防范
import sanitizeHtml from 'sanitize-html'
import './index.less'

const { Option } = Select
const { TextArea } = Input

export default function WriteBlog() {
  const [text, setText] = useState('')
  const [htmlText, setHtmlText] = useState('')
  const titleRef = useRef()
  const [title, setTitle] = useState('')
  const [previewTheme] = useState('github')
  const [clickPublish, SetClickPublish] = useState(false)

  useEffect(() => {
    titleRef.current.focus()
  },[])

  const tagOptions = []
  // 这里绑定的key值就是之后onFinish中values中的值
  for (let i = 0; i < store.getState().tags.length; i++) {
    tagOptions.push(<Option key={store.getState().tags[i]}>{store.getState().tags[i]}</Option>)
  }

  const categoriesOptions = []
  for (let i = 0; i < store.getState().category.length; i++) {
    categoriesOptions.push(<Option key={store.getState().category[i]}>{store.getState().category[i]}</Option>)
  }

  const handleClassesChange = value => {
    console.log(`selected ${value}`)
  }

  const handleTagChange = value => {
    console.log(`selected ${value}`)
  }

  // 点击发布文章按钮
  const publishBtnHandler = () => {
    SetClickPublish(true)
    setTitle(titleRef.current.input.value)
  }

  // 取消发布文章
  const cancelPublishHandler = () => {
    SetClickPublish(false)
  }


  const onFinish = values => {
    
    SetClickPublish(false)

    const articleParams = {
      title: title,
      body: {
        content: text,
        contentHtml: htmlText,
      },
      categoryName: values.category,
      summary: values.summary,
      tagsName: values.tags
    }


    httpPost('/articles/publish', JSON.stringify(articleParams)).then(res => {
      alert("发布成功！")
      setText('')
      titleRef.current.focus()
    })
  }

  const onFinishFailed = errorInfo => {
    console.log('Failed:', errorInfo)
  }

  return (
    <>
      <div className="publish">
        <Input 
          className='titleInput'
          allowClear
          placeholder="请输入文章标题" 
          defaultValue="[无标题]" 
          size="large" 
          ref={titleRef}
        />
        <Button type="primary" shape="round" size="large" onClick={publishBtnHandler}>
          发布文章
        </Button>
      </div>

      <Editor 
        modelValue={text} 
        onChange={setText} 
        onHtmlChanged={setHtmlText}
        previewTheme={previewTheme} 
        sanitize={html => sanitizeHtml(html)} 
      />

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
              name="summary"
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
              name="category"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Select className="select" style={{ width: 200 }} placeholder="设置文章所属专栏" onChange={handleClassesChange}>
                {categoriesOptions}
              </Select>
            </Form.Item>

            <Form.Item
              label="文章标签"
              name="tags"
              rules={[
                {
                  required: true
                }
              ]}
            >
              <Select className="select" showArrow mode="tags" placeholder="设置文章标签" onChange={handleTagChange}>
                {tagOptions}
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
