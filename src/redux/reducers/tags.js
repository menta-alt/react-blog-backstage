import { ADD_TAG, DELETE_TAG } from '../constant'
import { httpGet } from '@/utils/api/axios'

let tagsList = []

httpGet('/tags').then( res => {
  res.forEach(item => {
    tagsList.push(item.tagName)
  })
})

const initState = tagsList

export default function tagReducer(preState=initState,action) {

  const {type, data} = action
  
	switch (type) {
		case ADD_TAG: 
			return [data, ...preState]

    case DELETE_TAG:
      return preState.filter((item) => (
        item !== data
      ))

		default:
			return preState
	}
}