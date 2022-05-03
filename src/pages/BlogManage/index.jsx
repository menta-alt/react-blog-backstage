import React, { useState, useEffect } from 'react'
import { Table, Input, InputNumber, Popconfirm, Form, Typography, Button } from 'antd'
import { PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { httpGet, httpPost } from '@/utils/api/axios'
import './index.less'

const { Search } = Input

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
  const { data, setData } = props
  const [form] = Form.useForm()
  const [editingKey, setEditingKey] = useState('')
  const [result, setResult] = useState()
  const [isSearch, setIsSearch] = useState(false)

  const isEditing = record => record.key === editingKey

  const edit = record => {
    form.setFieldsValue({
      title: '',
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

  const deleteHandler = record => {
    httpPost(`/content/blog/${record.key}`).then(() => {
      let res = data.filter(item => item.key !== record.key)
      setData(res)
    })
  }

  // 列的配置
  const columns = [
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
      editable: true,
      width: '18%'
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      width: '9%',
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
      width: '5%',
      sorter: (a, b) => a.readCount - b.readCount
    },
    {
      title: '评论量',
      dataIndex: 'commentCounts',
      align: 'center',
      width: '5%',
      sorter: (a, b) => a.commentCounts - b.commentCounts
    },
    {
      title: '专栏',
      dataIndex: 'category',
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
              onClick={() => deleteHandler(record)}
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
    const newResult = data.filter(item => item.title.includes(value))
    setResult(newResult)
    setIsSearch(true)
  }

  return (
    <Form form={form} component={false}>
      <div className="tableTop">
        <Search 
          placeholder="请输入关键词" 
          size="large" 
          onSearch={onSearch} 
          enterButton 
          className="searchInput" 
        />
        <Button 
          type="primary" 
          size="large" 
          className='showAllBtn'
          onClick={() => {onSearch("")}}
        >显示全部文章</Button> 
        <span className="sum">总共 : {isSearch ? result.length : data.length} 篇文章</span>
      </div>
      <Table
        components={{
          body: {
            cell: EditableCell
          }
        }}
        bordered
        scroll={{ x: 2000 }}
        dataSource={isSearch ? result : data}
        columns={mergedColumns}
        rowClassName="editable-row"
        pagination={false}
      />
    </Form>
  )
}

export default function BlogManage() {
  const [data, setData] = useState([])
  const [tagsList, setTagsList] = useState([])
  const [category, setCategory] = useState('')

  useEffect(() => {
    httpGet('/articles').then(res => {
      setData(formatData(res))

      // httpPost('/categoryName', { "categoryId": res.categoryId }).then((categoryName) => {
      //   setCategory(categoryName)
      // })
      // Promise.all([
      //   new Promise((resolve, reject) => {
      //     httpPost('/categoryName', { "categoryId": res.categoryId })
      //     .then((categoryName) => {
      //       resolve(categoryName)
      //     })
      //   }),

      //   new Promise((resolve, reject) => {
      //     httpPost('/tagsName', { "articleId": res.id })
      //     .then((tags) => {
      //       resolve(tags)
      //     })
      //   })
      // ]).then(results => {
      //   setCategory(results[0])
      //   setTagsList(results[1])
      // })
    })
  }, [])

  // 处理请求的数据为要展示的内容 data为array
  const formatData = data => {
    let tagsData = []
    data.forEach(item => {
      tagsData.push({
        key: item.id.toString(),
        title: item.title,
        createTime: item.createTime,
        readCount: item.viewCounts,
        commentCounts: item.commentCounts,
        category: category,
        tag: tagsList,
        url: 'http://baidu.com',
        status: 'publish'
      })
    })

    return tagsData
  }

  return (
    <div>
      <EditableTable data={data} setData={setData} />
    </div>
  )
}
