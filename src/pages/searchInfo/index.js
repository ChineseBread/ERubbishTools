import React, {Component} from 'react';
import {Text, View} from "@tarojs/components";
import {AtCard, AtFloatLayout} from "taro-ui";
import './index.scss'
import RubbishInfo from '../../static/RubbishInfo.json'
class Index extends Component {
    state = {
        searchInfo:[],
        inputValue:'',
        floatLayOutTitle:'',
        isOpened:false,
        floatLayOutContent:''
    }
    iconMap = new Map([['干垃圾','icon-ganlaji'],['湿垃圾','icon-shilaji'],['可回收垃圾',' icon-kehuishouwu'],['有害垃圾','icon-youhailaji'],['厨余垃圾','icon-chuyulaji'],['不可回收垃圾','icon-bukehuishou_huaban1']])
    componentWillMount() {
        const pages = getCurrentPages()
        const current = pages[pages.length - 1]
        const eventChannel = current.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage',data=>{
            // console.log(data)
            this.setState({searchInfo:data.data,inputValue:data.inputValue});
        })
    }
    getIconClass = type =>{
        let result = this.iconMap.get(type)
        result　= result ? result : 'icon-qitalaji'
        return result
    }
    openLayOut = type =>{
        return()=>{
            let floatLayOutTitle = type
            let floatLayOutContent = RubbishInfo[floatLayOutTitle]
            this.setState({floatLayOutTitle,floatLayOutContent,isOpened:true});
        }
    }
    render() {
        let {searchInfo,inputValue,floatLayOutTitle,isOpened,floatLayOutContent} = this.state
        return (
            <View className="searchInfo_index">
              <AtFloatLayout isOpened={isOpened} title={floatLayOutTitle} onClose={()=>this.setState({isOpened: false})}>
                  {floatLayOutContent}
              </AtFloatLayout>
                <View className="header">
                    {`有关${inputValue}的结果`}
                </View>
                {/*<AtDivider />*/}
                {searchInfo.map(ele => {
                    return(
                        <View style={{
                            margin:'20rpx 0rpx'
                        }}>
                            <AtCard
                              renderIcon={ <Text className={`iconfont ${this.getIconClass(ele.category)} searchInfo_card_icon`}/>}
                              title={ele.name}
                              extra={ele.category}
                              onClick={this.openLayOut(ele.category)}
                            />
                        </View>

                    )
                })}
            </View>
      );
    }
}

export default Index;
