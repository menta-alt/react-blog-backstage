//引入createStore，专门用于创建redux中最为核心的store对象
import {createStore} from 'redux'
import allReducers from './reducers'

const store = createStore(allReducers)

export default store