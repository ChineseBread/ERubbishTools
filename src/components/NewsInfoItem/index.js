import React, {Component} from 'react';
import {View} from "@tarojs/components";

class NewsInfoItem extends Component {
	componentDidMount() {
	}

	render() {
		// let {img,txt} = this.props.newsInfoItem
		let {txt} = this.props.newsInfoItem

		return (
			<View className='at-article__section'>
				<View className='at-article__p'>
					{txt}
				</View>
			</View>
		);
	}
}

export default NewsInfoItem;