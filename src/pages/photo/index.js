import React, {Component, Fragment} from 'react';
import {Button, Image, ScrollView, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {AtCard, AtProgress, AtRadio, AtSteps} from "taro-ui";
import background from '../../static/img/background.jpeg'
import './index.scss'
import {taroRequest} from "../../utils/request";


class Photo extends Component {
    state = {
        current:-1,
        radio:'ImgIdentify',
        items :
        [{
            title: '等待上传',
            'icon': {
                value: 'upload',
            }
        },
        {
            title: '识别中',
            "icon":{
                value: 'loading'
            }
        },
        {
            title: '识别成功',
            'icon': {
                value: 'check-circle',
            }
        }],
        resultStatus:{
            message:{},
            status:"none"

        }
    }
    initializeState = () =>{
        this.setState({
            current:-1,
            // radio:'ImgIdentify',
            items :
                [{
                    title: '等待上传',
                    'icon': {
                        value: 'upload',
                    }
                },
                {
                    title: '识别中',
                    "icon":{
                        value: 'loading'
                    }
                },
                {
                    title: '识别成功',
                    'icon': {
                        value: 'check-circle',
                    }
                }],
            resultStatus:{
                message:{},
                status:"none"

            }
        })
    }
    handleUploadFile = async () => {
        this.initializeState()
        let result;

       result = await Taro.chooseImage({
           count: 1, // 默认9
           sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
           sourceType: ['album', 'camera'],

       })

        if (result.errMsg === 'chooseImage:ok'){
            // console.log(result)
            //成功获取文件
            let file = result.tempFiles[0]
            let {size,path} = file
            if (size > 3145728){
                await Taro.showToast({
                    title:'文件过大',
                    icon:'error',
                    duration:2000
                })
                return;
            }
            this.path = path
            this.setState(({items}) => {
                items[0] = { title: '上传中', 'icon': {value: 'upload'}}
                return {
                    items,
                    current:0
                }
            });
            try {
                result = await Taro.uploadFile({
                    url: 'https://mixphp1-1448796-1308610184.ap-shanghai.run.tcloudbase.com/upload/image', //仅为示例，非真实的接口地址
                    filePath: path,
                    name: 'img',
                    /*success :res => {
						let data = res.data
						//do something
						data = JSON.parse(data)
						if (data.Ok){
							resolve(data.uuid)
						}else{
							reject()
						}
					},
					fail:reason => {
						reject()
					}*/
                })
                result = JSON.parse(result.data);
                if (result.Ok){
                    this.setState(({items})=>{
                        items[0] = {title: '上传完成', status: 'success'}
                        return{
                            items,
                            current:1
                        }
                    });
                    let choice = this.state.radio === 'ImgIdentify'　?  '/image/classify' : "/garbage/classify"
                    let res = await taroRequest(choice,{uuid:result.uuid})
                    // console.log(res)
                    if(res.statusCode === 200 && res.data.hasOwnProperty("Data")){
                        this.setState(({items,resultStatus}) => {
                            items[1] = {title: '识别中', status: 'success'}
                            items[2] = {title: '识别完成', status: 'success'}
                            if (!res.data.Data.Sensitive){
                                resultStatus.status = 'success'
                                resultStatus.message = {
                                    // imgUrl:`http://192.168.1.10:8000/image/source/${uuid}`,
                                    imgUrl:this.path,
                                    // imgUrl:`https://mixphp1-1448796-1308610184.ap-shanghai.run.tcloudbase.com/image/source/${uuid}`,
                                    imgInfo:res.data.Data.Elements[0]
                                }
                            }else {
                                resultStatus.status = 'Sensitive'
                            }
                            return {
                                items,
                                resultStatus
                            }
                        });

                    }else{
                        throw ''
                    }
                }
            }catch (e){
                Taro.showToast({
                    title:'网络异常',
                    icon:'error',
                    duration:2000
                }).then(()=>{
                    this.initializeState()
                })
            }

        }

        /*Taro.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
        }).then(res => {
            return new Promise((resolve, reject) =>{
                console.log(res)
                if (!res) reject("未选择")
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                let file = res.tempFiles[0]
                let {size,path} = file
                if (size > 3145728){
                    reject()
                }
                this.path = path
                resolve(path)
            })

        },reason => {
            console.log(reason)
        }).then(path => {
            return new Promise(((resolve, reject) => {
                //上传文件
                this.setState(({items}) => {
                    items[0] = { title: '上传中', 'icon': {value: 'upload'}}
                    return {
                        items,
                        current:0
                    }
                });
                Taro.uploadFile({
                    url: 'https://mixphp1-1448796-1308610184.ap-shanghai.run.tcloudbase.com/upload/image', //仅为示例，非真实的接口地址
                    filePath: path,
                    name: 'img',
                    success :res => {
                        let data = res.data
                        //do something
                        data = JSON.parse(data)
                        if (data.Ok){
                            resolve(data.uuid)
                        }else{
                            reject()
                        }
                    },
                    fail:reason => {
                        reject()
                    }
                })
                /!*let uploadFileID = nanoid()
                Taro.cloud.uploadFile({
                    cloudPath:uploadFileID, // 对象存储路径，根路径直接填文件名，文件夹例子 test/文件名，不要 / 开头
                    filePath: path, // 微信本地文件，通过选择图片，聊天文件等接口获取
                    config: {
                        env: 'prod-6g1piqcz50f420ba' // 需要替换成自己的微信云托管环境ID
                    }
                }).then(res =>{
                    Taro.cloud.getTempFileURL({
                        fileList: [{
                            fileID: res.fileID, // 对象存储文件ID列表，最多50个，从上传文件接口或者控制台获取
                            maxAge: 86400 , // 有效期时长，单位秒，默认86400
                        }]
                    }).then(res => {
                        console.log(res)
                        if (res && res.length > 0){
                            request("upload/image",{url:res[0].tempFileURL},"post").then(value => {
                                // resolve(uuid)
                            },reason => {
                                // reject("上传失败")
                            })
                        }
                    }).catch(error => {
                        reject("获取地址失败")
                        // console.error(error)
                    })

                },reason => {
                    reject("上传失败")
                })*!/
            }))
        },reason => {
            if(reason !== '未选择'){
                Taro.showToast({
                    title:'文件过大',
                    icon:'error',
                    duration:2000
                }).then(()=>{
                    this.setState(({items}) => {
                        items[0] = { title: '上传文件', 'icon': {value: 'upload'}}
                        return {
                            items,
                            current:-1
                        }
                    });
                })
            }
        }).then(uuid => {
            //console.log('获取uuid')
            //发送识别请求
            return new Promise(((resolve, reject) => {
                this.setState(({items})=>{
                    items[0] = {title: '上传完成', status: 'success'}
                    return{
                        items,
                        current:1
                    }
                });

                let choice = this.state.radio === 'ImgIdentify'　?  '/image/classify' : "/garbage/classify"
                taroRequest(choice,{uuid}).then(res=>{
                    if(res.statusCode === 200 && res.data.hasOwnProperty("Data")){
                        if (!res.data.Data.Sensitive){
                            resolve({res,uuid})
                        }else {
                            reject({Sensitive:true})
                        }
                    }else{
                        reject()
                    }
                },reason => {
                    reject()
                })
               /!* Taro.request({
                    url:`https://mixphp1-1448796-1308610184.ap-shanghai.run.tcloudbase.com${choice}`,
                    // url:`http://192.168.1.10:8000${choice}`,
                    data: {uuid},
                    success:res => {
                        console.log(res)
                        if(res.statusCode === 200 && res.data.hasOwnProperty("Data")){
                            if (!res.data.Data.Sensitive){
                                resolve({res,uuid})
                            }else {
                                reject({Sensitive:true})
                            }
                        }else{
                            reject()
                        }

                    },
                    fail:reason =>{
                        reject('未选择')
                    }
                })*!/
            }))
        },reason => {
            if (reason === '未选择') return;
            Taro.showToast({
                title:'网络异常',
                icon:'error',
                duration:2000
            }).then(()=>{
                this.setState(({items}) => {
                    items[0] = { title: '上传文件', 'icon': {value: 'upload'}}
                    return {
                        items,
                        current:-1
                    }
                });
            })
        }).then(value => {
            // let{res,uuid} = value
            let{res} = value
            this.setState(({items,resultStatus}) => {
                items[1] = {title: '识别中', status: 'success'}
                items[2] = {title: '识别完成', status: 'success'}
                /!*
                垃圾识别
                    Elements: Array(1)
                    0:
                    Category: "可回收垃圾"
                    CategoryScore: 0.7134999999999999
                    Rubbish: ""
                    RubbishScore: 0
                物品识别
                Elements: Array(10)
                    0:
                    Height: 157
                    Score: 0.999327540397644
                    Type: "character"
                    Width: 621
                    X: 894
                    Y: 141
                 *!/
                resultStatus.status = 'success'
                resultStatus.message = {
                    // imgUrl:`http://192.168.1.10:8000/image/source/${uuid}`,
                    imgUrl:this.path,
                    // imgUrl:`https://mixphp1-1448796-1308610184.ap-shanghai.run.tcloudbase.com/image/source/${uuid}`,
                    imgInfo:res.data.Data.Elements[0]
                }
                return {
                    items,
                    current:2,
                    resultStatus
                }

            });

        },reason => {
            this.setState(({items}) => {
                items[1] = { title: '识别失败', status:'error'}
                return {
                    items,
                    current:1
                }
            });
            if (reason){
                if (reason === '未选择') return;
                if (reason.hasOwnProperty("Sensitive")){
                    //包含敏感信息
                    this.setState({resultStatus:{status:"Sensitive"}});
                }else{
                    //服务器错误
                    Taro.showToast({
                        title:'服务器繁忙',
                        status:'error',
                        duration:2000
                    })
                }
            }
        })*/
    }
    getImgIdentifyComponent = message =>{
        let{imgInfo,imgUrl} = message
        //sf5nkoovm0ksx211201105304
        return(
           <Fragment>
               <Image className='resultImg' src={imgUrl}/>
               <View className='score_container'>
                   <View style={{marginBottom:20}}>
                       种类:<Text>{imgInfo.Type}</Text>
                   </View>
                   <View>
                       种类分数:<AtProgress color="#40a9ff" percent={imgInfo.Score.toFixed(2)*100} />
                   </View>

               </View>
           </Fragment>
        )
    }
    getRubbishClassifyComponent = message =>{
        let{imgInfo,imgUrl} = message
        return(
            <Fragment>
                <Image src={imgUrl}/>
                <View className='score_container'>
                    <View style={{marginBottom:20}}>
                        垃圾种类:<Text>{imgInfo.Category ? imgInfo.Category : '这可能不是垃圾'}</Text>
                    </View>
                    <View>
                        分数:<AtProgress color="#40a9ff" percent={imgInfo.CategoryScore.toFixed(2)*100} />
                    </View>

                </View>
            </Fragment>
        )
    }
    render() {
        let {resultStatus,radio} = this.state
        return (
            <View>
                <View className="index">

                    <Image src={background} className='background'/>

                   <ScrollView
                       scrollY
                       scrollWithAnimation
                       style={{height:"100vh"}}
                   >
                      <View style={{
                          display:"flex",
                          flexDirection:"column",
                          alignItems:'center',
                          justifyContent:"space-around"
                      }}>
                          <View className="button_container" onClick={this.handleUploadFile}>

                              <Button className="header_button">
                                  <View className="header_icon_container">
                                      <View>
                                          <Text className='iconfont icon-xiangji2 header_icon'/>
                                      </View>
                                      <View>
                                          <Text className='header_icon_title'>上传图片</Text>

                                      </View>
                                  </View>
                                  <View>
                                      <Text className='button_bottom_info'>图片大小需小于3MB!!!</Text>
                                  </View>
                              </Button>

                          </View>
                          <View style={{
                              display:"flex",
                              flexDirection:'column',
                              justifyContent:"space-around",
                              width:"82%",
                              height:'90vh'
                          }}>
                              <View>
                                  <AtRadio
                                      customStyle={{width:"100%",borderRadius:'2px',boxShadow:"2px 2px 10px black"}}
                                      options={[
                                          { label: '图像识别', value: 'ImgIdentify', desc: '看看你的图片是什么东西' },
                                          { label: '垃圾识别', value: 'RubbishClassify',desc:"看看你的图片是什么垃圾" },
                                      ]}
                                      value={this.state.radio}
                                      onClick={radio => {
                                          this.setState({radio})
                                          this.initializeState();
                                      }}
                                  />
                              </View>
                              <View style={{zIndex:100,width:"100%",borderRadius:'2px',boxShadow:"2px 2px 10px black"}}>
                                  <AtCard
                                      renderIcon={<AtSteps
                                          items={this.state.items}
                                          current={this.state.current}
                                      />}
                                  >
                                      <View className='result_container'>
                                          <ScrollView
                                              className='scrollview'
                                              scrollY
                                              scrollWithAnimation
                                              style={{height:"40vh"}}
                                              /* scrollTop={scrollTop}
											   style={scrollStyle}
											   lowerThreshold={Threshold}
											   upperThreshold={Threshold}
											   onScrollToUpper={this.onScrollToUpper.bind(this)} // 使用箭头函数的时候 可以这样写 `onScrollToUpper={this.onScrollToUpper}`
											   onScroll={this.onScroll}*/
                                          >
                                              {resultStatus.status !== 'none' ? resultStatus.status ===  "Sensitive" ? <Text style={{fontFamily:'STHupo',color:'#f5222d'}}>包含敏感信息!</Text> :
                                                  radio === 'ImgIdentify' ? this.getImgIdentifyComponent(resultStatus.message) : this.getRubbishClassifyComponent(resultStatus.message):<></>
                                              }
                                          </ScrollView>


                                      </View>
                                  </AtCard>
                              </View>
                          </View>
                      </View>
                   </ScrollView>
              </View>
            </View>
        );
    }


}

export default Photo;
