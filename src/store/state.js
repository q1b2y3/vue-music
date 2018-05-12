import {Mode} from "../common/js/config";
import {getHistory,getPlayHistory,getLikeList} from '../common/js/cache'
//状态的监听

const state={
	singer:{},
    playing:false,    //是否显示
    playList:[],       //播放列表
    currentIndex:-1,    //当前播放的索引
    sequenceList:[],   //索引播放列表
    fullScreen:false,   //是否全屏展示音乐播放器
    mode:Mode.sequence, //播放类型
    disc:{},
    rank:{},
    searchHistory:getHistory(),
    playHistory:getPlayHistory(),
  	likeList:getLikeList()
}
export default state
