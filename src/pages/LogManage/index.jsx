import React, { useState } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import './index.less'
import { Link } from 'react-router-dom'
import moment from 'moment'
import AddMask from '@/components/AddMask'

const originData = [
  {
    key: '1',
    time: '2022-12-11',
    description: '使用 React.memo 优化部分组件对于频繁显示/隐藏的组件，改为使用 CSS 实现修改添加 emoji 表情为复制到剪切板啊烦恼'
  },
  {
    key: '2',
    time: '2022-12-08',
    description: '使用 React.memo 优化部分组件对于频繁显示/隐藏的组件，改为使用 CSS 实现修改添加 emoji 表情为复制到剪切板啊烦恼'
  },
  {
    key: '3',
    time: '2022-11-29',
    description: '使用 React.memo 优化部分组件对于频繁显示/隐藏的组件，改为使用 CSS 实现修改添加 emoji 表情为复制到剪切板啊烦恼'
  },
  {
    key: '4',
    time: '2022-10-20',
    description: '使用 React.memo 优化部分组件对于频繁显示/隐藏的组件，改为使用 CSS 实现修改添加 emoji 表情为复制到剪切板啊烦恼'
  },
  {
    key: '5',
    time: '2022-06-29',
    description: '使用 React.memo 优化部分组件对于频繁显示/隐藏的组件，改为使用 CSS 实现修改添加 emoji 表情为复制到剪切板啊烦恼'
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
const EditableTable = (props) => {
  const {setClickAdd, data, setData} = props
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')

  const isEditing = record => record.key === editingKey

  const edit = record => {
    form.setFieldsValue({
      time: '',
      description: '',
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

  const handleAdd = () => {
    setClickAdd(true)
  }

  // 列的配置
  const columns = [
    {
      title: '时间',
      dataIndex: 'time',
      width: '20%',
      align: 'center',
      editable: true,
      sorter: (a, b) => {
        let aTimeString = a.time
        let bTimeString = b.time
        let aTime = new Date(aTimeString).getTime()
        let bTime = new Date(bTimeString).getTime()
        return aTime - bTime
      }
    },
    {
      title: '日志详情描述',
      dataIndex: 'description',
      align: 'center',
      editable: true,
      width: '55%'
    },
    {
      title: '操作',
      dataIndex: 'operation',
      align: 'center',
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
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record)
      })
    }
  })

  return (
    <Form form={form} component={false}>
      <div className="tableTop">
        <span className="sum">总共 : {data.length} 项</span>
        <Button onClick={handleAdd} type="primary" className="addBtn" icon={<PlusCircleOutlined />}>
          Add
        </Button>
      </div>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        dataSource={data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  )
}


export default function LogManage() {
  const [clickAdd, setClickAdd] = useState(false)
  const [data, setData] = useState([])
  const [id, setId] = useState(data.length)

  // 处理添加一行数据到表格
  const onFinish = values => {
    const newData = {
      key: (id + 1).toString(),
      time: moment().format('YYYY-MM-DD HH:mm:ss'),
      description: values.logInfo,
    }
    setId(id + 1)
    setData([newData, ...data])
    setClickAdd(false)
  }
  
  return (
    <div>
      <EditableTable 
        setClickAdd={setClickAdd}
        data={data}
        setData={setData}
        id={id}
        setId={setId}
      />
      <AddMask 
        clickAdd={clickAdd}
        setClickAdd={setClickAdd}
        title='添加日志'
        info={
          [
            {
              label: '日志详情描述',
              name: 'logInfo'
            }
          ]
        }
        onFinish={onFinish}
      />
    </div>
  )
}
