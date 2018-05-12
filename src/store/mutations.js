//开始配置mutation
import * as types from './mutations-type'
const mutation={
	//第一个参数   监听哪那个状态   第二个参数   写入哪个对象
	[types.SET_SINGER](state,singer){
		state.singer=singer
	},
	[types.SET_DISC](state,disc){
		state.disc=disc
	},
    [types.SET_PLAY_STATE](state,playing) {
    	state.playing = playing;
	},
	[types.SET_PLAY_LIST](state,playList) {
	    state.playList = playList;
	},
	[types.SET_CURRENT_INDEX](state,currentIndex) {
	    state.currentIndex = currentIndex;
	},
	[types.SET_SEQUENCE_LIST](state,sequenceList) {
	    state.sequenceList = sequenceList;
	},
	[types.SET_FULL_SCREEN](state,fullScreen) {
	    state.fullScreen = fullScreen;
	},
	[types.SET_MODE](state,mode) {
	    state.mode = mode;
	},
	[types.SET_RANK](state,rank){
		state.rank=rank;
	},
	[types.SET_SEARCH_HISTORY](state,searchHistory) {
    	state.searchHistory = searchHistory;
 	},
  	[types.SET_PLAY_HISTORY](state,playHistory) {
   		state.playHistory = playHistory;
  	},
  	[types.SET_LIKE_LIST](state,likeList) {
    	state.likeList = likeList;
  	}
}
export default mutation
