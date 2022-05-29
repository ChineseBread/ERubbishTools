import React, {Component} from 'react';
import {Swiper, SwiperItem, Text, View} from "@tarojs/components";
import './index.scss'
import {AtCard} from "taro-ui";
import RubbishInfo from '../../static/RubbishInfo.json'
class RubbishNavBar extends Component {
    state = {
        renderIcon:null,
        cardTitle:'可回收垃圾',
        cardContent:RubbishInfo.可回收垃圾
    }
    changeRubbish = (cardTitle,renderIconClassName,cardContent) => {
       return ()=>{
           this.setState({
               cardTitle,
               renderIcon:this.getIcon(renderIconClassName),
               cardContent
           });
       }
    }
    getIcon = renderIconClassName => {
        return <Text className={renderIconClassName}/>
    }
   // category = ['可回收垃圾','不可回收垃圾','干垃圾','湿垃圾','有害垃圾','厨余垃圾']
    render() {
      let{renderIcon,cardTitle,cardContent} = this.state
      return (
          <View className='RubbishIconNav'>
              <Swiper
                className='test-h'
                // indicatorColor='#999'
                // indicatorActiveColor='#333'
                // vertical
                circular
                // indicatorDots
              >
                <SwiperItem>
                    <View style={{
                      display:'flex',
                      justifyContent:'space-between',
                      flexDirection:'row',
                      alignItems:'center'
                    }}>
                        <View>
                          <Text className={`iconfont icon-kehuishouwu rubbish_icon ${cardTitle === '可回收垃圾' ? 'active':''}`} onClick={this.changeRubbish("可回收垃圾",'iconfont icon-kehuishouwu rubbish_card_icon',RubbishInfo['不可回收垃圾'])}/>
                        </View>
                        <View>
                          <Text className={`iconfont icon-youhailaji rubbish_icon ${cardTitle === '有害垃圾' ? 'active':''}`} onClick={this.changeRubbish("有害垃圾",'iconfont icon-youhailaji rubbish_card_icon',RubbishInfo['有害垃圾'])}/>
                        </View>
                        <View>
                          <Text className={`iconfont icon-ganlaji rubbish_icon ${cardTitle === '干垃圾' ? 'active':''}`} onClick={this.changeRubbish("干垃圾",'iconfont icon-kehuishouwu rubbish_card_icon',RubbishInfo['干垃圾'])}/>
                        </View>
                        <View>
                          <Text className={`iconfont icon-shilaji rubbish_icon ${cardTitle === '湿垃圾' ? 'active':''}`} onClick={this.changeRubbish("湿垃圾",'iconfont icon-shilaji rubbish_card_icon',RubbishInfo['湿垃圾'])}/>
                        </View>
                    </View>

                </SwiperItem>
                <SwiperItem>
                    <View style={{
                      display:'flex',
                      justifyContent:'space-around',
                      flexDirection:'row',
                      alignItems:'center'
                    }}>
                        <View>
                          <Text className={`iconfont icon-chuyulaji rubbish_icon ${cardTitle === '厨余垃圾' ? 'active':''}`} onClick={this.changeRubbish("厨余垃圾",'iconfont icon-chuyulaji rubbish_card_icon',RubbishInfo['厨余垃圾'])}/>
                        </View>
                        <View>
                          <Text className={`iconfont icon-bukehuishou_huaban1 rubbish_icon ${cardTitle === '不可回收垃圾' ? 'active':''}`} onClick={this.changeRubbish("不可回收垃圾",'iconfont icon-bukehuishou_huaban1 rubbish_card_icon',RubbishInfo['不可回收垃圾'])}/>
                        </View>
                        <View>
                          <Text className={`iconfont icon-qitalaji rubbish_icon ${cardTitle === '其他垃圾' ? 'active':''}`} onClick={this.changeRubbish("其他垃圾",'iconfont icon-qitalaji rubbish_card_icon',RubbishInfo['其他垃圾'])}/>
                        </View>
                    </View>

                </SwiperItem>
              </Swiper>
              <AtCard
                title={cardTitle}
                renderIcon={renderIcon}
              >
                  <View className="card_content_container">
                    {cardContent}
                  </View>
              </AtCard>
          </View>
      );
    }
}

export default React.memo(RubbishNavBar,()=>true);
