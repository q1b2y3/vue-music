import goodStorage from 'good-storage';
import Song from 'common/js/song'

//记录查询历史的cache
const SET_HISTORY = '__search__';
const SET_PLAY_HISTORY = "__play__";
const SET_LIKE_LIST = "__like__"
const SET_HISTORY_NUM = 200;
/**
 * @param arry 记录的数组
 * @param val  记录的值
 * @param campare  存在函数
 * @param maxLen   数组记录的最大值
 */
export function setArray(arry,val,campare,maxLen){
    let index = arry.findIndex(campare);
    //如果写入的对象 在数组中第一位 那么就不用管
    if(index===0){
      return;
    }
    //如果在后面 那么 先删除 然后再在第一位添加
    if(index>0){
      arry.splice(index,1);
    }
    arry.unshift(val);
    //如果数组的长度最后 大于 最大记录的长度 那么把最后一个值 进行删除
    if(arry&&arry.length>maxLen){
      arry.pop();
    }
}
//记录本地
export function setHistory(query){
  //从storage中获取 SET_HISTORY 如果没有则返回[]
  let arry = goodStorage.get(SET_HISTORY,[]);
  //写入数组中
  setArray(arry,query,(item)=>{
    return item === query
  },SET_HISTORY_NUM)
  //记录到 storage中
  goodStorage.set(SET_HISTORY,arry);
  //返回数组 记录到vuex中去
  return arry;
}

export function getHistory(){
  return goodStorage.get(SET_HISTORY,[]);
}
//删除单个元素
export function delHistoryOne(query){
  let arry = goodStorage.get(SET_HISTORY,[]);
  let index = arry.findIndex(item=>{
      return item === query
  })
  arry.splice(index,1);
  goodStorage.set(SET_HISTORY,arry);
  return arry;
}
export function delHistoryAll(){
  return goodStorage.clear();
}

//写入最近播放歌曲列表
export function setPlayHistory(songs){
  //从storage中获取 SET_HISTORY 如果没有则返回[]
  let arry = goodStorage.get(SET_PLAY_HISTORY,[]);
  //写入数组中
  setArray(arry,songs,(song)=>{
    return song.id === songs.id
  },SET_HISTORY_NUM)
  //记录到 storage中
  goodStorage.set(SET_PLAY_HISTORY,arry);
  //返回数组 记录到vuex中去
  return arry;
}

export function getPlayHistory(){
  return goodStorage.get(SET_PLAY_HISTORY,[]);
}
//取出收藏列表
export function getLikeList(){
  return goodStorage.get(SET_LIKE_LIST,[]);
}
//将歌曲记录到列表中
export function setLikeList(song){
  //从storage中获取 SET_HISTORY 如果没有则返回[]
  let arry = goodStorage.get(SET_LIKE_LIST,[]);
  arry.push(song);
  //记录到 storage中
  goodStorage.set(SET_LIKE_LIST,arry);
  //返回数组 记录到vuex中去
  return arry;
}
export function delLike(song){
  let arry = goodStorage.get(SET_LIKE_LIST,[]);
  let index = arry.findIndex(item=>{

    return item.id === song.id
  })
  if(index>=0){
    arry.splice(index,1);
  }
  return goodStorage.set(SET_LIKE_LIST,arry);
}
