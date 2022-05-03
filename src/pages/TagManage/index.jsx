import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import store from '@/redux/store.js'
import { addTag, deleteTag } from '@/redux/actions/tags.js'
import { httpGet, httpPost } from '@/utils/api/axios'
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
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
const EditableTable = (props) => {
  const {setClickAdd, data, setData} = props
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

  const deleteHandler = (record) => {
    httpPost(`/content/tag/${record.key}`).then(() => {
      let res = data.filter((item) => ( item.key !== record.key ))
      setData(res)
      store.dispatch(deleteTag(record.name))
    })
  }
  
  const addHandler = () => {
    setClickAdd(true)
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
              onClick={() => deleteHandler(record)}
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
        <Button onClick={addHandler} type="primary" className="addBtn" icon={<PlusCircleOutlined/>}>
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
  const [clickAdd, setClickAdd] = useState(false)
  const [data, setData] = useState([])

  useEffect(() => {
    httpGet('/tags').then( res => {
      setData(formatData(res)) 
    })
  },[])

  // 处理请求的数据为要展示的内容 data为array
  const formatData = (data) => {
    let tagsData = []
    data.forEach( item => {
      tagsData.push(
        {
          key: item.id.toString(),
          name: item.tagName,
          createTime: item.createTime,
          count: 0
        }
      )
    })
       
    return tagsData
  }

  // 处理添加一行数据到表格
  const onFinish = values => {

    setClickAdd(false)

    httpPost('/tags/publish', { tagName: values.tagName }).then(res => {
      const newData = {
        key: res.id,
        name: res.tagName,
        createTime: res.createTime,
        count: 0
      }

      setData([newData, ...data])
      store.dispatch(addTag(res.tagName))
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
        title='添加标签'
        info={
          [
            {
              label: '标签名',
              name: 'tagName'
            }
          ]
        }
        onFinish={onFinish}
      />
    </div>
  )
}
