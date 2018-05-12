/**
 * 混合组件
 * 第一个混合方法 为了解决ini高度的问题
 */
import {mapGetters,mapMutations,mapActions} from 'vuex'
import {Mode,LIKE_STATE} from 'common/js/config'
import {shuffle} from 'common/js/util'
import SearchBox from 'base/search-box/search-box'
import Suggest from 'components/suggest/suggest'
import Scroll from 'base/scroll/scroll'
import SearchList from 'base/search-list/search-list'
import Song from 'common/js/song'

export const playListMixin = {
    methods:{
      handlePlayList(){
        throw new Error("您必须要实现一个公共方法...FUN[handlePlayList] " +
          "让当前列表 增加迷你播放器的高度。提示:播放器高度为50px")
      }
    },
    activated(){
      this.handlePlayList(this.playList);
    },
    mounted(){
      this.handlePlayList(this.playList);
    },
    watch:{
      playList(newPlayList){
        this.handlePlayList(newPlayList);
      }
    },
    computed:{
      ...mapGetters([
        'playList'
      ])
    }
}

export const playerMixin={
  methods:{
    changeIconModeClick(){
      let newSongsList;
      //让图标进行切换 以及 状态的切换
      let modes = this.mode +1;
      if(modes > Mode.random){
        modes=Mode.sequence;
      }
      //把状态写入vuex
      this.setMode(modes);
      if(modes === Mode.random){
        //如果是随机的话 那么我需要打乱数组
        newSongsList  = shuffle(this.playList);
      }else{
        //如果是其它模式 则不需要打乱数组
        newSongsList = this.sequenceList;
      }
      //避免当前乐曲被打乱 所以 我们要取出currentIndex 放入到 vuex中
      this._getCurrentIndexByList(newSongsList);
      //更新vuex中的播放列表
      this.setPlayList(newSongsList);
    },
    _getCurrentIndexByList (list){
      let currentIndexs = list.findIndex(item=>{
        return item.id === this.currentSong.id
      })
      this.setCurrentIndex(currentIndexs);
    },
    changeIconText(){
      return this.mode === Mode.sequence ? "顺序播放" : this.mode === Mode.loop ? "单曲循环" : "随机播放"
    },
    ...mapMutations({
      setMode:"SET_MODE",
      setCurrentIndex:"SET_CURRENT_INDEX",
      setPlayList:"SET_PLAY_LIST"
    })
  },
  computed:{
    changeIconMode() {
      return this.mode === Mode.sequence ? "icon-sequence" : this.mode === Mode.loop ? "icon-loop" : "icon-random"
    },
    ...mapGetters([
      'mode',
      'currentSong',
      'sequenceList',
      'playList'
    ])
  }
}

export const searchMixin = {
  data(){
    return{
      query:""
    }
  },
  methods:{
    selectHistory(){
      //在我们的 sessionHistory中 记录query
      this.setHistoryAction(this.query);
    },
    //删除历史单个元素
    deleteHistoryOne(item){
      this.deleteHistoryOneAction(item);
    },
    deleteHistoryAll(){
      this.deleteHistoryAllAction();
      this.$refs.confirm.close();
    },
    queryItemKey(query){
      this.$refs.searchBox.queryItemKey(query);
//        this.selectHistory();
    },
    randomMusic(songs){
      //重新写一遍随机mode
      this.setMode(Mode.random)
      let ary = [];
      songs.forEach(item=>{
        ary.push(new Song(item))
      })
      //触发vuex的action
      this.randomMusicPlay({list:ary});
    },
    ...mapMutations({
      setMode:"SET_MODE"
    }),
    ...mapActions([
      "setHistoryAction",
      "deleteHistoryOneAction",
      "deleteHistoryAllAction",
      'startTouchMusicRandomPlay',
      'searchAction',
      'randomMusicPlay'
    ])
  },
  computed:{
    ...mapGetters([
      "searchHistory",
      'playHistory',
      'mode',
      'likeList'
    ])
  },
  components:{
    SearchBox,
    Suggest,
    Scroll,
    SearchList
  }
}


export const likeMixin = {
  data(){
    return {
      like:0
    }
  },
  methods:{
    _getLike(){
      let flag = false;
      this.likeList.forEach(song=>{
        if(!flag){
          //判断歌曲 是否在歌曲列表中
          if(this.currentSong.id=== song.id){
            this.like = 1;
            flag = true;
          }else{
            this.like = 0;
          }
        }
      })
    },
    changeLikeList(){
      if(this.like === LIKE_STATE){
        //写入

        this.setLikeListAction(this.currentSong);
        this.like = 1;
      }else{
        console.log(this.currentSong)
        this.delLikeAction(this.currentSong);
        //删除
        this.like = 0;
      }
    },
    changeOneLike(song){
      let flag = false;
      if(this.likeList.length === 0){
        this.setLikeListAction(song);
        return;
      }
      this.likeList.forEach(item=>{
        if(!flag){
          if(item.id === song.id){
            this.delLikeAction(new Song(song));
            flag = true
          }
        }
      })
      if(!flag){
        this.setLikeListAction(new Song(song));
      }
    },
    likeListClsIcon(song){
      let flag = false;
      let icon = "icon-not-favorite";
      this.likeList.forEach(item=>{
        if(!flag){
          if(item.id === song.id){
            flag = true
            icon =  "icon-favorite"
          }else{
            icon = "icon-not-favorite"
          }
        }
      })
      return icon;
    },
    ...mapActions([
      'setLikeListAction',
      'delLikeAction'
    ])
  },
  computed:{
    likeListCls(){
      return this.like ===0?"icon-not-favorite":"icon-favorite"
    },
    ...mapGetters([
      "currentSong",
      'likeList'
    ])
  }
}
