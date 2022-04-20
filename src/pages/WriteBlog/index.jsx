import React, { useState } from 'react'
import { Input, Select, Button } from 'antd'
import Editor from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
// 自行处理不安全的 html 内容,xss防范
import sanitizeHtml from 'sanitize-html'
import './index.less'

const { Option } = Select

export default function WriteBlog() {
  const [text, setText] = useState('hello md-editor-rt')
  const [previewTheme] = useState('github')

  const children = []
  for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>)
  }

  const handleClassesChange = (value) => {
    console.log(`selected ${value}`)
  }

  const handleTagChange = (value) => {
    console.log(`selected ${value}`)
  }

  return (
    <>
      <div className="publish">
        <Input placeholder="请输入文章标题" defaultValue='[无标题]'/>
        <Button type="primary" shape="round" >
          发布文章
        </Button>
      </div>
      
      <Select 
        className='select' 
        size='large'
        style={{ width: 200 }} 
        placeholder="设置文章所属专栏" 
        onChange={handleClassesChange}
      >
        {children}
      </Select>
      <Select 
        className='select' 
        showArrow 
        size="large"
        mode="tags" 
        placeholder="设置文章标签"
        onChange={handleTagChange}
      >
        {children}
      </Select>

      <Editor 
        modelValue={text} 
        onChange={setText} 
        previewTheme={previewTheme} 
        sanitize={(html) => sanitizeHtml(html)}
      />
    </>
  )
}
