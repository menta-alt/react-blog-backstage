import { ADD_TAG, DELETE_TAG } from '../constant'

// 添加标签
export const addTag = data => ({type: ADD_TAG, data})

// 删除标签
export const deleteTag = data => ({type: DELETE_TAG, data})
