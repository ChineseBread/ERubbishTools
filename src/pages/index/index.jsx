import React, { Component } from 'react'
import {View, Text, Swiper, SwiperItem, Image} from '@tarojs/components'
import QQMapWX from 'qqmap-wx-jssdk/qqmap-wx-jssdk.min'
import Taro from "@tarojs/taro";
import { AtNoticebar,AtSearchBar } from 'taro-ui'
import RubbishNavBar from "../../components/RubbishNavBar/index";
import './index.scss'
import swiperItem01 from '../../static/img/swiper-item01.jpeg'
import swiperItem02 from '../../static/img/swiper_item02.jpeg'
import {taroRequest} from "../../utils/request";
import CustomBar from "../../components/CustomBar";
class Index extends Component {
    state = {
      user_location:'',
      inputValue:'',
      // banner:[swiperItem01,swiperItem02,swiperItem03]
      banner:[swiperItem01,swiperItem02]
    }
    handleChange = value => {
      this.setState({inputValue:value});
    }
    handleSearchRequest = async () => {
        await Taro.showLoading({
          title: '查询中...'
        })
        let {inputValue,user_location} = this.state
        user_location = user_location ? user_location : '连云港'
        try{
            let searchResult = await taroRequest("/garbage/search",{name:inputValue, city:user_location})
            await Taro.hideLoading()
            // console.log(searchResult)

            if (searchResult.data.Ok && searchResult.data.Lists){
                await Taro.navigateTo({
                    url:'../searchInfo/index',
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', { data: searchResult.data.Lists,inputValue })
                    }
                })
            }else{
                await Taro.showToast({
                    title: '未查询到数据',
                    icon: 'error',
                    duration: 2000
                })
            }
        }catch (e){
            await Taro.hideLoading()
            await Taro.showToast({
                title: '网络异常',
                icon: 'error',
                duration: 2000
            })
        }

        /*Taro.request({
            // url:'http://192.168.1.10:8000/garbage/search',
            url:'https://mixphp1-1448796-1308610184.ap-shanghai.run.tcloudbase.com/garbage/search',
            data:{
                name:inputValue,
                city:user_location
            },
            success:response =>{
                console.log(response)
                Taro.hideLoading()
                if (response.data.Ok && response.data.Lists){
                    Taro.navigateTo({
                        url:'../searchInfo/index',
                        success: function (res) {
                          // 通过eventChannel向被打开页面传送数据
                            res.eventChannel.emit('acceptDataFromOpenerPage', { data: response.data.Lists,inputValue })
                        }
                    })
                }else {
                    Taro.showToast({
                      title: '未查询到数据',
                      icon: 'error',
                      duration: 2000
                    })
                }

            },
            fail:reason => {
                Taro.hideLoading()
                Taro.showToast({
                  title: '网络异常',
                  icon: 'error',
                  duration: 2000
                })
            }
        })*/



    }

    componentDidMount = async () => {
        await Taro.getLocation({
            type: 'gcj02', //返回可以用于 Taro.openLocation的经纬度
            success: res => {
                const latitude = res.latitude
                const longitude = res.longitude

                //下载qqmap-wx-jssdk,然后引入其中的js文件

                let qqmapsdk = new QQMapWX({
                    key: 'OXGBZ-DMN6F-GZSJ7-JDDKU-VP2CS-PLBE6' // 必填
                });

                //逆地址解析,通过经纬度获取位置等信息
                qqmapsdk.reverseGeocoder({
                    location:{latitude,longitude},
                    success: city =>{
                      // console.log("城市",city.result.address_component.city)
                      this.setState({user_location:city.result.address_component.city});
                    }

                })
              }

        })
        try {
            let result = await taroRequest("/bing/wallpaper",)
            if(result && result.data && result.data.length >= 1){
                // console.log(result.data);
                let banner = result.data.map(ele => "https://cn.bing.com/" + ele.ImageContent.Image.Url)
                this.setState({banner});
            }
        }catch (e){
            //不报错
        }

       /* Taro.request({
            url:'https://mixphp1-1448796-1308610184.ap-shanghai.run.tcloudbase.com/bing/wallpaper',
            success: res => {
                if (res.data && res.data.length >= 1){
                    console.log(res.data);
                    let banner = res.data.map(ele => "https://cn.bing.com/" + ele.ImageContent.Image.Url)
                    this.setState({banner});
                }
            }
        })*/
    }


    render () {
        let {user_location,inputValue,banner} = this.state
        return (
          <View className='index'>
              <CustomBar className={"nav_title_container"} >

                  <View className='user_location_container'>
                     <View>
                         <Text className='iconfont icon-weizhi myIcon'/>
                         <Text className='user_current_location'>{user_location ? user_location : '无'}</Text>
                     </View>
                  </View>
                  <View className='nav_title'>
                      ERubbish
                  </View>


              </CustomBar>
              <AtNoticebar marquee>
                欢迎使用垃圾识别分类小程序,长时间无法获取数据可能是因为正在更新数据库,任何疑问请联系开发者
              </AtNoticebar>
              <View className="index_container">
                  <View className='swiper_container'>
                      <Swiper
                          className='test-h'
                          indicatorColor='#999'
                          indicatorActiveColor='#262626'
                          // vertical
                          circular
                          indicatorDots
                          autoplay>
                              {
                                  banner.map((ele,index) => {
                                      return (
                                          <SwiperItem key={index}>
                                              <Image src={ele}/>
                                          </SwiperItem>
                                      )
                                  })
                              }
                      </Swiper>
                  </View>
              </View>
              <View className='search'>
                  <AtSearchBar
                    placeholder='输入内容来查询'
                    value={inputValue}
                    onChange={this.handleChange.bind(this)}
                    onActionClick={this.handleSearchRequest}
                  />
              </View>
              <RubbishNavBar/>
          </View>
        )
    }
}

export default Index

