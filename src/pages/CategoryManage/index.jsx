import React, { useState, useEffect } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import { httpGet, httpPost } from '@/utils/api/axios'
import './index.less'
import AddMask from '@/components/AddMask'

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
const EditableTable = props => {
  const { setClickAdd, data, setData } = props
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')

  const isEditing = record => record.key === editingKey

  const edit = record => {
    form.setFieldsValue({
      name: '',
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
      key: '1',
      title: '专栏名',
      dataIndex: 'name',
      width: '35%',
      editable: true,
      align: 'center'
    },
    {
      key: '2',
      title: '创建时间',
      dataIndex: 'createTime',
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

export default function ClassManage() {
  const [clickAdd, setClickAdd] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    httpGet('/categories').then(res => setData(formatData(res)))
  }, [])

  // 处理请求的数据为要展示的内容 data为array
  const formatData = data => {
    let categoryData = []
    data.forEach(item => {
      categoryData.push({
        key: item.id.toString(),
        name: item.categoryName,
        createTime: item.createTime,
        count: 0
      })
    })

    return categoryData
  }

  // 处理添加一行数据到表格
  const onFinish = values => {
    setClickAdd(false)
    console.log("values,",values);
    httpPost('/categories/publish', { categoryName: values.categoryName }).then(res => {
      const newData = {
        key: res.id,
        name: res.categoryName,
        createTime: res.createTime,
        count: 0
      }

      setData([newData, ...data])
    })
  }

  return (
    <div>
      <EditableTable 
        setClickAdd={setClickAdd} 
        data={data} 
        setData={setData}  
      />
      <AddMask
        clickAdd={clickAdd}
        setClickAdd={setClickAdd}
        title="添加专栏"
        info={[
          {
            label: '专栏名',
            name: 'categoryName'
          }
        ]}
        onFinish={onFinish}
      />
    </div>
  )
}
