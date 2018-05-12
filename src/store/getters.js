//第二个页面取值(从state中取值)
import state from "./state";

export const singer=state=>state.singer
//是否播放中
export const playing = state =>state.playing
//播放列表
export  const playList = state =>state.playList
//目前播放的音乐
export  const currentIndex = state =>state.currentIndex
//播放序列
export  const sequenceList = state =>state.sequenceList
//全屏和mini进行切换
export  const fullScreen = state =>state.fullScreen
//获取播放状态}
export  const mode = state =>state.mode
//当前播放的音乐信息
export const currentSong = state => {
  return state.playList[state.currentIndex] || {};
}
export const disc=state=>state.disc

export const rank=state=>state.rank

export const searchHistory = state =>state.searchHistory;

export const playHistory = state =>state.playHistory;

export const likeList = state =>state.likeList;