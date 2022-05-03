import { ADD_CATEGORY, DELETE_CATEGORY } from "../constant";
import { httpGet } from '@/utils/api/axios'

let categoryList = []

httpGet('/categories').then( res => {
  res.forEach(item => {
    categoryList.push(item.categoryName)
  })
})

const initState = categoryList

export default function categoryReducer(preState=initState,action) {

  const {type, data} = action
  
	switch (type) {
		case ADD_CATEGORY: 
			return [data, ...preState]

    case DELETE_CATEGORY:
      return preState.filter((item) => (
        item !== data
      ))

		default:
			return preState
	}
}