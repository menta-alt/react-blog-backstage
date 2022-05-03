import React, { useEffect, useState } from 'react'
import Editor from 'md-editor-rt'
import 'md-editor-rt/lib/style.css'
// 自行处理不安全的 html 内容,xss防范
import sanitizeHtml from 'sanitize-html'
import { httpPost, httpGet } from '@/utils/api/axios.js'
import { Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import './index.less'

export default function AboutMe() {
  const [text, setText] = useState('')
  const [htmlText, setHtmlText] = useState('')
  const [previewTheme] = useState('github')

  useEffect(() => {
    httpGet('/aboutme').then(res => {
      setText(res.content)
    })
  },[])

  // 发布关于我
  const publish = () => {
    httpPost('/aboutme/publish', {
      "content": text,
      "contentHtml": htmlText
    }).then(res => {
      alert('发布成功');
    })
  }

  return (
    <div>
      <Button 
        className='publish' 
        type="primary" 
        shape="round" 
        icon={<UploadOutlined />} 
        onClick={publish}
      >发布关于我</Button>
      <Editor 
        modelValue={text} 
        onChange={setText} 
        onHtmlChanged={setHtmlText}
        previewTheme={previewTheme} 
        sanitize={html => sanitizeHtml(html)} 
      />
    </div>
  )
}
