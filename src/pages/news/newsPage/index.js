import React, {Component} from 'react';
import {ScrollView, Text, View} from "@tarojs/components";
import './index.scss'
import getNavHeight from '../../../utils/navHeightUtils'
import {AtCard} from "taro-ui";
import NewsInfoItem from "../../../components/NewsInfoItem";
class NewsPage extends Component {
	state = {
		navBarHeight : 0,
		newsPageInfo:{}
	}

	componentDidMount() {
		this.setState({navBarHeight:getNavHeight()});
		const pages = getCurrentPages()
		const current = pages[pages.length - 1]
		const eventChannel = current.getOpenerEventChannel()
		eventChannel.on('acceptDataFromOpenerPage',data => {
			// console.log("收到的数据",data)
			this.setState({newsPageInfo:data.data});
		})
	}

	render() {
		let {date,contents,title} = this.state.newsPageInfo
		contents = contents ? contents : []
		return (
			<View className='index'>
				<View className='news_card_container'>
					<AtCard
						extra={date}
						title={title}
					>
						<ScrollView
							className='news_card_scrollView'
							scrollY
							scrollWithAnimation
						>
							<View className='at-article'>
								<View className='at-article__content'>
									<View className='at-article__h3'>
										{title}
									</View>
									{contents.map(ele => {
										return <NewsInfoItem newsInfoItem={ele}/>
									})}
								</View>
							</View>

						</ScrollView>
					</AtCard>
				</View>

			</View>
		);
	}
}

export default NewsPage;