import React, {Component} from 'react';
import {Image, ScrollView, Text, View} from "@tarojs/components";
import Taro from "@tarojs/taro";
import {AtCard, AtLoadMore} from "taro-ui";
import './index.scss'
import {taroRequest} from "../../utils/request";
import CustomBar from "../../components/CustomBar";
class News extends Component {
	state = {
		newsInfoList:[],
		pageNum:2,
		status: 'more',
		// screenHeight:0,
		// screenWidth:0,
		// imgWidth:0,
		// imgHeight:0
	}
	handleClick = async () =>{
		let {pageNum,newsInfoList} = this.state
		// 开始加载
		this.setState({
			status: 'loading'
		})
		await Taro.showToast({
			title: '加载中...',
			icon: 'loading',
			duration: 2000
		})
		// await Taro.showLoading()
		try {
			let result = await taroRequest(`/news/env/list/${pageNum}`)
			// console.log(result)
			Taro.hideToast()
			if (result.statusCode === 200 && result.data.length >= 1){
				this.setState({newsInfoList:[...newsInfoList,...result.data],status: 'more',pageNum:++pageNum});
			}else {
				await Taro.showToast({
					title:'未找到数据',
					status:'error',
					duration:2000
				})
				this.setState({status:'noMore'});
			}
		}catch (e){
			Taro.hideToast()
			Taro.showToast({
				title:'请求失败',
				status:'error',
				duration:2000
			}).then(()=>{
				this.setState({status:'more'});
			})
		}
		/*Taro.request({
			url:`https://mixphp1-1448796-1308610184.ap-shanghai.run.tcloudbase.com/news/env/list/${pageNum}`,
			success:res => {
				console.log(res)
				Taro.hideLoading()
				if (res.statusCode === 200 && res.data.length >= 1){
					this.setState({newsInfoList:[...newsInfoList,...res.data],status: 'more',pageNum:++pageNum});
				}else {
					this.setState({status:'noMore'});
				}
			},
			fail: reason => {
				Taro.showToast({
					title:'请求失败',
					status:'error',
					duration:2000
				}).then(()=>{
					this.setState({status:'more'});
				})

			}
		})*/
	}
	componentDidMount= async () => {
		// await this.getSystemInfo()
		// this.getNavHeight()
		await Taro.showToast({
			title: '加载中...',
			icon: 'loading',
			duration: 2000
		})
		// await Taro.showLoading()
		try {
			let result = await taroRequest("/news/env/list/1");
			Taro.hideToast()
			if (result.statusCode === 200 && result.data.length >= 1){
				this.setState({newsInfoList:result.data});
			}else {
				await Taro.showToast({
					title:'未找到数据',
					status:'error',
					duration:2000
				})
			}
		}catch (e){
			Taro.hideToast()
			await Taro.showToast({
				title:'请求失败',
				status:'error',
				duration:2000
			})
		}

		/*Taro.request({
			url:'https://mixphp1-1448796-1308610184.ap-shanghai.run.tcloudbase.com/news/env/list/1',
			success:res => {
				console.log(res)
				Taro.hideLoading()
				if (res.statusCode === 200 && res.data.length >= 1){
					this.setState({newsInfoList:res.data});
				}else {
					Taro.showToast({
						title:'未找到数据',
						status:'error',
						duration:2000
					})
				}
			},
			fail: reason => {
				Taro.hideLoading()
				Taro.showToast({
					title:'请求失败',
					status:'error',
					duration:2000
				})
			}
		})*/
	}
	/*getSystemInfo = async () => {
		await Taro.getSystemInfo({
			success: res =>{
				this.setState({
					screenHeight: res.windowHeight,
					screenWidth: res.windowWidth,
				});
			}
		});
	}
	getIcon = src => {
		if (src){
			let {imgWidth,imgHeight} = this.state
			return (
				<Image style={{height:imgHeight,width:imgWidth}} className='renderIcon_Image' src={`https://mee.gov.cn/ywdt/hjywnews/${src}`} onload={this.adjustScale}/>
			)
		}
	}
	adjustScale = event => {
		let {width,height} = event.detail
		let radio = width / height
		let imgWidth = this.state.screenWidth * 0.79
		let imgHeight = imgWidth / radio;
		this.setState({
			imgWidth,
			imgHeight
		});
	}*/
	/*
	await Taro.navigateTo({
                    url:'../searchInfo/index',
                    success: function (res) {
                        // 通过eventChannel向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', { data: searchResult.data.Lists,inputValue })
                    }
                })
	 */
	toNewsInfoPage = pageSrc => {
		// console.log(pageSrc)
		return async () =>{
			///news/env/detail?src=../../ywgz/zysthjbhdc/dcjz/202112/t20211204_963027.shtml
			try {
				let result = await taroRequest("/news/env/detail",{src:pageSrc})

				if(result && result.statusCode === 200 && result.data){
					await Taro.navigateTo({
						url:'./newsPage/index',
						success: res => {
							// 通过eventChannel向被打开页面传送数据
							res.eventChannel.emit('acceptDataFromOpenerPage', { data:result.data})
						}
					})
				}
			}catch (e){
				await Taro.showToast({
					title:"网络异常",
					status:"error",
					duration:2000
				})
			}

		}
	}
	render() {
		let {newsInfoList} = this.state
		return (
			<View className="index">
				<CustomBar className={"news_header_container"}>
					<Text>新闻资讯</Text>
				</CustomBar>
				<View className="news_container">
					<ScrollView
						className='scrollview'
						scrollY
						scrollWithAnimation
					>
						{
							newsInfoList.map(ele => {
								return (
									<View className="news_card_item">
										<AtCard
											title={ele.title}
											extra={ele.date}
											note={'查看详情'}
											onClick={this.toNewsInfoPage(ele.src)}
										>
											<View className='news_content_container'>
												{/*<View>
													{this.getIcon(ele.img)}
												</View>*/}
												{ele.content}
											</View>
										</AtCard>
									</View>
								)
							})
						}
						<AtLoadMore
							moreText='更多咨询...'
							loadingText='努力加载中...'
							noMoreText='什么也没有了...'
							moreBtnStyle={{backgroundColor:'#f0f0f0',width:'90%',borderRadius:"20px"}}
							onClick={this.handleClick.bind(this)}
							status={this.state.status}
						/>
					</ScrollView>




				</View>

			</View>
		);
	}
}

export default News;