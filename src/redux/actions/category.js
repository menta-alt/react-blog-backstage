import { ADD_CATEGORY, DELETE_CATEGORY } from "../constant";

// 添加专栏
export const addCategory = data => ({type: ADD_CATEGORY, data})

// 删除专栏
export const deleteCategory = data => ({type: DELETE_CATEGORY, data})
