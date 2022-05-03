import React, { useState,Suspense, useEffect } from 'react'
import { Link, useRoutes, useNavigate } from 'react-router-dom'
import ErrorBoundary from '@/components/ErrorBoundary';
import routes from '@/routes/'
import { Layout, Menu, Breadcrumb } from 'antd'
import { HomeFilled, MenuUnfoldOutlined, MenuFoldOutlined, SettingFilled, FileTextFilled, TagsFilled, MessageFilled, ProfileFilled, ScheduleFilled, HddFilled,HighlightOutlined, RadarChartOutlined,SmileOutlined,TrophyOutlined,CrownOutlined } from '@ant-design/icons'

import './App.less'
import '@/style/base.css'

const { Header, Content, Footer, Sider } = Layout
const { SubMenu } = Menu

function App() {
  const element = useRoutes(routes)
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState('home') //默认高亮的选项是首页
  const [breadcrumb, setBreadcrumb] = useState('')

  // 处理浏览器首次加载和刷新后高亮和路由折叠的问题!!!

  // 处理侧边是否收起来
  const toggle = () => {
    console.log(collapsed)
    setCollapsed(!collapsed)
  }

  // 处理路由跳转
  const handleRoutes = (item) => {
    
    if(item.key !== '首页') {
      setBreadcrumb(item.keyPath)
    } else {
      setBreadcrumb('')
    }

    switch (item.key) {
      case '首页':
        navigate('/home')
        break

      case '写文章' :
        navigate('/writeblog')
        break

      case '博客管理':
        navigate('/content/blog')
        break

      case '标签管理':
        navigate('/content/tag')
        break

      case '专栏管理':
        navigate('/content/category')
        break

      case '作品管理':
        navigate('/content/work')
        break

      case '留言管理':
        navigate('/content/message')
        break

      case '日志管理':
        navigate('/content/log')
        break

      case '关于我':
        navigate('/content/aboutme')
        break

      case '关于站点':
        navigate('/content/aboutsite')
        break

      default:
        break
    }
  }

  return (
    <div className='App'>
      <Layout style={{ minHeight: '100vh' }} className='container'>
        <Sider trigger={null} collapsible collapsed={collapsed}>
          <Link to="/home" className="sidetop">
            <img src={require('@/images/rain.png')} alt="" className="logo" />
            <span style={{ display: collapsed ? 'none' : 'inline' }} className="sidetitle">
              Blog管理系统
            </span>
          </Link>
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" onClick={handleRoutes}>
            <Menu.Item key="首页" icon={<HomeFilled />} >
              首页
            </Menu.Item>
            <Menu.Item key="写文章" icon={<HighlightOutlined />}>
              写文章
            </Menu.Item>
            <SubMenu key="sub2" icon={<SettingFilled />} title="系统管理">
              <Menu.Item key="6">
                管理权限
              </Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <SubMenu key="内容管理" icon={<FileTextFilled/>} title="内容管理" onClick={handleRoutes}>
              <Menu.Item key="博客管理" icon={<ProfileFilled />} >
                博客管理
              </Menu.Item>
              <Menu.Item key="标签管理" icon={<TagsFilled />}>
                标签管理
              </Menu.Item>
              <Menu.Item key="专栏管理" icon={<HddFilled />}>
                专栏管理
              </Menu.Item>
              <Menu.Item key="作品管理" icon={<TrophyOutlined />}>
                作品管理
              </Menu.Item>
              <Menu.Item key="留言管理" icon={<MessageFilled />}>
                留言管理
              </Menu.Item>
              <Menu.Item key="日志管理" icon={<ScheduleFilled />}>
                日志管理
              </Menu.Item>
              <SubMenu key="关于管理" icon={<CrownOutlined />} title="关于管理" onClick={handleRoutes}>
                <Menu.Item key="关于我" icon={<SmileOutlined />}>
                  关于我
                </Menu.Item>
                <Menu.Item key="关于站点" icon={<RadarChartOutlined />}>
                  关于站点
              </Menu.Item>
              </SubMenu>
            </SubMenu>
          </Menu>
          <div className="footer"></div>
        </Sider>

        <Layout className="right-layout">
          <Header className="header">
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
              className: 'trigger',
              onClick: toggle
            })}

            <Breadcrumb className='breadcrumb'>
              <Breadcrumb.Item>首页</Breadcrumb.Item>
              <Breadcrumb.Item>{breadcrumb[breadcrumb.length - 1]}</Breadcrumb.Item>
              <Breadcrumb.Item>{breadcrumb.length === 1 ? '' : breadcrumb[0]}</Breadcrumb.Item>
            </Breadcrumb>
            
          </Header>

          <Content className='mainContent'>
            <div>
              <ErrorBoundary>
                <Suspense fallback={<></>}>
                  {/* 注册路由 */}
                  {element}
                </Suspense>
              </ErrorBoundary>
              
            </div>
          </Content>

          <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
      </Layout>
    </div>
  )
}

export default App
