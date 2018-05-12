//执行动作
import * as types from './mutations-type'
import {shuffle} from 'common/js/util'
import {Mode} from 'common/js/config'
import Song from 'common/js/song'
import {setHistory,delHistoryOne,delHistoryAll,setPlayHistory,setLikeList,delLike} from 'common/js/cache'
/**
 *  通过action vuex自动调用到 我们的mutations里面对应的方法
 * @param commit    回调 mutations的方法
 * @param state     参数
 * @param list      传入的歌曲list
 * @param index     传入的歌曲索引
 */
export const selectPlay = ({commit,state},{list,index})=>{
  commit(types.SET_PLAY_STATE,true);
  commit(types.SET_PLAY_LIST,list);
  commit(types.SET_FULL_SCREEN,true);
  commit(types.SET_CURRENT_INDEX,index);
  commit(types.SET_SEQUENCE_LIST,list);
}

export const startTouchMusicRandomPlay = ({commit,state},{list,index})=>{

  let {randomlist,currentindex} = randomListFun(list,state.mode,index)

  commit(types.SET_CURRENT_INDEX,currentindex);
  commit(types.SET_PLAY_STATE,true);
  commit(types.SET_PLAY_LIST,randomlist);
  commit(types.SET_FULL_SCREEN,true);
  commit(types.SET_SEQUENCE_LIST,list);
}

export const randomMusicPlay = ({commit,state},{list})=>{
  let {randomlist} = randomListFun(list,state.mode)
  commit(types.SET_PLAY_STATE,true);
  commit(types.SET_PLAY_LIST,randomlist);
  commit(types.SET_FULL_SCREEN,true);
  commit(types.SET_CURRENT_INDEX,0);
  commit(types.SET_SEQUENCE_LIST,list);
  commit(types.SET_MODE,Mode.random);
}

export const randomListFun = (list,mode,index=-1) =>{
  let randomList;
  let currentIndexs;
  if(mode === Mode.random){
    randomList = shuffle(list);
    if(index>=0){
      currentIndexs = randomList.findIndex(item=>{
        return item.id === index;
      })
    }
  }
  return {randomlist:randomList,currentindex:currentIndexs}
}

export const searchAction =  ({commit,state},item)=>{
    let currentIndex = state.currentIndex;
    let sequenceList = state.sequenceList.slice();
    let songs = [];
    //播放列表
    let playList = state.playList.slice();
      //当前播放器有没有打开
      if(playList.length<=0){
        playList = playList.concat(item);
        currentIndex = 0;
        commit(types.SET_MODE,Mode.loop);
      }else{
        currentIndex++;
        playList.splice(currentIndex,0,item);
    }

    playList.forEach(item=>{
      songs.push(new Song(item));
    })
    sequenceList = songs.slice();

    commit(types.SET_SEQUENCE_LIST,sequenceList);
    commit(types.SET_PLAY_LIST,songs);
    commit(types.SET_CURRENT_INDEX,currentIndex);
    commit(types.SET_FULL_SCREEN,true);
    commit(types.SET_PLAY_STATE,true);
}


export const setHistoryAction = ({commit},query)=>{
  commit(types.SET_SEARCH_HISTORY,setHistory(query));
}

export const deleteHistoryOneAction =  ({commit},query)=>{
  commit(types.SET_SEARCH_HISTORY,delHistoryOne(query));
}

export const deleteHistoryAllAction = ({commit})=>{
  commit(types.SET_SEARCH_HISTORY,delHistoryAll());
}
//删除某个歌曲
export const delSongForList = ({commit,state},song)=>{
  let playList = state.playList.slice();
  //好久不见
  let currentSong = state.playList[state.currentIndex];
  //当前的currentIndex 2
  let current = state.currentIndex;

  let index = playList.findIndex(item=>{
    return item.id === song.id
  });
  //[1,2,2,3,3,21,31,2312]  ===》3
  playList.splice(index,1);
  let sequenceList = playList.slice();
  //currentIndex 列表改变之后 歌所在的位置
  let currentIndex = playList.findIndex(song=>{
      return song.id === currentSong.id;
  })
  if(currentIndex<0){
    currentIndex = current;
  }
  if(playList.length===0){
      this.clearList({commit});
      return;
  }
  commit(types.SET_CURRENT_INDEX,currentIndex);
  commit(types.SET_PLAY_LIST,playList);
  commit(types.SET_SEQUENCE_LIST,sequenceList);
  // commit(types.SET_FULL_SCREEN,true);
  commit(types.SET_PLAY_STATE,true);
}

export const clearList = ({commit})=>{
  commit(types.SET_SEQUENCE_LIST,[]);
  commit(types.SET_PLAY_STATE,false);
  commit(types.SET_PLAY_LIST,[]);
  commit(types.SET_CURRENT_INDEX,-1);
}

export const setPlayHistoryAction =  ({commit},song)=>{
	console.log(song);
  	commit(types.SET_PLAY_HISTORY,setPlayHistory(Object.assign({},song)));
}

export const setLikeListAction = ({commit},song)=>{
  commit(types.SET_LIKE_LIST,setLikeList(Object.assign({},song)));
}
export const delLikeAction = ({commit},song)=>{
  commit(types.SET_LIKE_LIST,delLike(Object.assign({},song)));
}
