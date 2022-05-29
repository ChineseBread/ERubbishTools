import { Component } from 'react'
import { Provider } from 'react-redux'
import configStore from './store'
import Taro from "@tarojs/taro";
import './app.scss'
const store = configStore()
class App extends Component {
    componentDidMount () {
        Taro.cloud.init({
            env:'prod-6g1piqcz50f420ba',
            traceUser:true
        })

    }

    componentDidShow () {}

    componentDidHide () {}

    componentDidCatchError () {}

    // 在 App 类中的 render() 函数没有实际作用
    // 请勿修改此函数
    render () {
        return (
            <Provider store={store}>
                {this.props.children}
            </Provider>
        )
    }
}

export default App
