import { lazy } from 'react'
import { Navigate } from 'react-router-dom'

const Home = lazy(() => import('@/pages/Home'))
const WriteBlog = lazy(() => import('@/pages/WriteBlog/'))
const BlogManage = lazy(() => import('@/pages/BlogManage'))
const CategoryManage = lazy(() => import('@/pages/CategoryManage'))
const LogManage = lazy(() => import('@/pages/LogManage/'))
const TagManage = lazy(() => import('@/pages/TagManage/'))
const MessageManage = lazy(() => import('@/pages/MessageManage/'))
const AboutMe = lazy(() => import('@/pages/AboutManage/AboutMe/'))
const AboutSite = lazy(() => import('@/pages/AboutManage/AboutSite/'))
const WorksManage = lazy(() => import('@/pages/WorksManage/'))

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
    path: '/content/category',
    element: <CategoryManage/>
  },
  {
    path: '/content/message',
    element: <MessageManage/>
  }, 
  {
    path: '/content/work',
    element: <WorksManage/>
  },
  {
    path: '/content/aboutme',
    element: <AboutMe/>
  },
  {
    path: '/content/aboutsite',
    element: <AboutSite/>
  },
  {
    path: '/',
    element: <Navigate to="/home"/> 
  }
]

export default routes