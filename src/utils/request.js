import Taro from "@tarojs/taro";

let  cloudRequest =  (path,data={},method="get") =>{
	return new Promise((resolve, reject) => {
		Taro.cloud.callContainer({
			config: {
				env: 'prod-6g1piqcz50f420ba', // 微信云托管的环境ID
			},
			path, // 填入业务自定义路径和参数，根目录，就是 /
			method, // 按照自己的业务开发，选择对应的方法
			data,
			header: {
				'X-WX-SERVICE': 'mixphp1', // xxx中填入服务名称（微信云托管 - 服务管理 - 服务列表 - 服务名称）
			}
			// 其余参数同 wx.request
		}).then(value => {
			resolve(value)
		},reason => {
			reject(reason)
		})
	})
}
let taroRequest = (url,data={},method="get") => {
	return new Promise(((resolve, reject) => {
		Taro.request({
			// url:'http://192.168.1.10:8000/garbage/search',
			url:`https://mixphp1-1448796-1308610184.ap-shanghai.run.tcloudbase.com${url}`,
			data,
			success:response => {
				resolve(response)
			},
			fail:reason => {
				reject(reason)
			}
		})
	}))
}
export {cloudRequest,taroRequest}