import React, { useState } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import './index.less'

const { Search } = Input

// 一定要有key 值，不然改变的时候全部变了
const originData = [
  {
    key: '1',
    title: 'java',
    time: '2022-04-28 13:14:09',
    readCount: '123',
    classes: '前端基础',
    tag: 'html',
    url: 'http://baidu.com',
    status: 'publish'
  },
  {
    key: '2',
    title: 'js',
    time: '2022-04-29 13:14:09',
    readCount: '1024',
    classes: '前端基础',
    tag: 'html',
    url: 'http://baidu.com',
    status: 'publish'
  },
  {
    key: '3',
    title: 'html',
    time: '2022-04-27 13:14:09',
    readCount: '523',
    classes: '前端基础',
    tag: 'html',
    url: 'http://baidu.com',
    status: 'publish'
  },
  {
    key: '4',
    title: 'html5',
    time: '2022-04-26 13:14:09',
    readCount: '12',
    classes: '前端基础',
    tag: 'html',
    url: 'http://baidu.com',
    status: 'publish'
  },
  {
    key: '5',
    title: 'vue',
    time: '2022-04-24 13:14:09',
    readCount: '87',
    classes: '前端基础',
    tag: 'html',
    url: 'http://baidu.com',
    status: 'publish'
  },
  {
    key: '6',
    title: 'vite',
    time: '2022-04-23 13:14:09',
    readCount: '45',
    classes: '前端基础',
    tag: 'html',
    url: 'http://baidu.com',
    status: 'publish'
  }
]

// 创建表格的单元格
const EditableCell = ({ editing, dataIndex, title, inputType, record, index, children, ...restProps }) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{
            margin: 0
          }}
          rules={[
            {
              required: true,
              message: `Please Input ${title}!`
            }
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  )
}

// 创建表格组件
const EditableTable = () => {
  const [form] = Form.useForm()
  const [data, setData] = useState(originData)
  const [editingKey, setEditingKey] = useState('')
  const [result, setResult] = useState()
  const [isSearch, setIsSearch] = useState(false)

  const isEditing = record => record.key === editingKey

  const edit = record => {
    form.setFieldsValue({
      title: '',
      time: '',
      readCount: '',
      classes: '',
      tag: '',
      url: '',
      status: '',
      ...record
    })
    setEditingKey(record.key)
  }

  const cancel = () => {
    setEditingKey('')
  }

  const save = async key => {
    try {
      const row = await form.validateFields()
      const newData = [...data]
      const index = newData.findIndex(item => key === item.key)

      if (index > -1) {
        const item = newData[index]
        newData.splice(index, 1, { ...item, ...row })
        setData(newData)
        setEditingKey('')
      } else {
        newData.push(row)
        setData(newData)
        setEditingKey('')
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo)
    }
  }

  // 列的配置
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
      editable: true,
      width: '18.75%'
    },
    {
      title: '时间',
      dataIndex: 'time',
      width: '10%',
      align: 'center',
      sorter: (a, b) => {
        let aTimeString = a.time
        let bTimeString = b.time
        let aTime = new Date(aTimeString).getTime()
        let bTime = new Date(bTimeString).getTime()
        return aTime - bTime
      }
    },
    {
      title: '阅读量',
      dataIndex: 'readCount',
      align: 'center',
      width: '6.25%',
      sorter: (a, b) => a.readCount - b.readCount
    },
    {
      title: '分类',
      dataIndex: 'classes',
      align: 'center',
      width: '12.75%'
    },
    {
      title: '标签',
      dataIndex: 'tag',
      align: 'center',
      width: '18.75%'
    },
    {
      title: 'URL',
      dataIndex: 'url',
      align: 'center',
      editable: true,
      width: '14.75%'
    },
    {
      title: '状态',
      dataIndex: 'status',
      align: 'center',
      width: '6.25%'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
      width: '12.5%',
      render: (_, record) => {
        const editable = isEditing(record)
        return editable ? (
          <span>
            <Typography.Link
              onClick={() => save(record.key)}
              style={{
                marginRight: 8
              }}
            >
              Save
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a>Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <span>
            <Button
              type="primary"
              disabled={editingKey !== ''}
              onClick={() => edit(record)}
              style={{
                marginRight: 15,
                width: 70
              }}
            >
              Edit
            </Button>

            <Button
              type="primary"
              danger
              style={{
                width: 70
              }}
            >
              delete
            </Button>
          </span>
        )
      }
    }
  ]

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col
    }

    return {
      ...col,
      onCell: record => ({
        record,
        inputType: col.dataIndex === 'readCount' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  // 处理搜索获得内容
  const onSearch = value => {
    const newResult = data.filter((item) => (
      item.title.includes(value)
    ))
    setResult(newResult)
    setIsSearch(true)
  }

  return (
    <Form form={form} component={false}>
      <div className="tableTop">
        <Search placeholder="请输入关键词" onSearch={onSearch} enterButton className="searchInput" />
        <span className="sum">总共 : {data.length} 篇文章</span>
      </div>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        scroll={{ x: 2000 }}
        dataSource={ isSearch ? result : data }
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  )
}


export default function BlogManage() {
  return (
    <div>
      <EditableTable />
    </div>
  )
}
