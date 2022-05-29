import React, {Component} from 'react';
import {View} from "@tarojs/components";
import getNavHeight from '../../utils/navHeightUtils'
class CustomBar extends Component {
	state = {
		navBarHeight :0
	}

	componentDidMount() {
		this.setState({navBarHeight:getNavHeight()});
	}

	render() {
		return (
			<View style={{height:this.state.navBarHeight}} className={this.props.className}>
				{this.props.children}
			</View>
		);
	}
}

export default CustomBar;