import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Home = lazy(() => import('@/pages/Home'))
const WriteBlog = lazy(() => import('@/pages/WriteBlog/'))
const BlogManage = lazy(() => import('@/pages/BlogManage'))
const ClassManage = lazy(() => import('@/pages/ClassManage'))
const LogManage = lazy(() => import('@/pages/LogManage/'))
const TagManage = lazy(() => import('@/pages/TagManage/'))
const MessageManage = lazy(() => import('@/pages/MessageManage/'))

const routes = [
  {
    path: '/home',
    element: <Home/>
  },
  {
    path: '/writeblog',
    element: <WriteBlog/>
  },
  {
    path: '/content/blog',
    element: <BlogManage/>
  },
  {
    path: '/content/log',
    element: <LogManage/>
  },
  {
    path: '/content/tag',
    element: <TagManage/>
  },
  {
    path: '/content/classes',
    element: <ClassManage/>
  },
  {
    path: '/content/message',
    element: <MessageManage/>
  }, 
  {
    path: '/',
    element: <Navigate to="/home"/> 
  }
]

export default routes