export default () =>{
	let menuButtonObject = wx.getMenuButtonBoundingClientRect(); //获取胶囊对象
	let sysinfo = wx.getSystemInfoSync(); // 获取设备系统对象
	let statusBarHeight = sysinfo.statusBarHeight; // 获取状态栏高度
	let menuBottonHeight =  menuButtonObject.height; //获取胶囊顶部高度
	let menuBottonTop =  menuButtonObject.top; // 获取胶囊距离顶部的高度
	let navBarHeight = statusBarHeight + menuBottonHeight + (menuBottonTop - statusBarHeight) * 4; //计算nav导航栏的高度（上图蓝色线段的长度）

	return navBarHeight
	/*this.setState({ //更新高度数据
		navBarHeight,
	})*/
}