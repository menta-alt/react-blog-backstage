import React, { useState } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import './index.less'
import { Link } from 'react-router-dom'

const originData = []

for (let i = 1; i <= 10; i++) {
  originData.push({
    key: i.toString(),
    name: `Edrward ${i}`,
    time: '2022-07-10',
    count: `${i}`
  })
}

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
  const [id, setId] = useState(originData.length)

  const isEditing = record => record.key === editingKey

  const edit = record => {
    form.setFieldsValue({
      name: '',
      time: '',
      count: '',
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

  // 处理添加一行数据到表格
  const handleAdd = () => {

    const newData = {
      key: (id+1).toString(),
      name: `Edrward ${id+1}`,
      time: '2022-12-10',
      count: `${id+1}`
    }
    
    setId(id + 1)
    setData([newData, ...data])
  }

  // 列的配置
  const columns = [
    {
      key: '1',
      title: '标签名',
      dataIndex: 'name',
      width: '35%',
      editable: true,
      align: 'center'
    },
    {
      key: '2',
      title: '创建时间',
      dataIndex: 'time',
      width: '25%',
      align: 'center'
    },
    {
      key: '3',
      title: '文章数',
      dataIndex: 'count',
      width: '15%',
      align: 'center'
    },
    {
      key: '4',
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

export default function TagManage() {
  return (
    <div>
      <EditableTable />
    </div>
  )
}
