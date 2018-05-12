<template>
  <transition name="slide">
    <div  v-show="addSongFlag" class="add-song"  @click.stop>
      <div class="header">
        <h1 class="title">添加歌曲到列表</h1>
        <div class="close" @click="close">
          <i class="icon-close"></i>
        </div>
      </div>
      <div class="search-box-wrapper">
        <search-box @querykey="querykey" ref="searchBox"  placeholder="搜索歌曲"></search-box>
      </div>
      <div class="shortcut" v-show="!query">
        <switches :currentIndex="currentIndex" :switches="switches" @switche="switchesClick"></switches>
        <div class="list-wrapper">
          <scroll v-show="currentIndex===0" :data="playHistory" ref="songList" class="list-scroll" >
            <div class="list-inner">
              <song-list :songs="playHistory" @select="select">
              </song-list>
            </div>
          </scroll>
          <scroll  v-show="currentIndex===1" ref="searchList"  :data="searchHistory" class="list-scroll">
            <div class="list-inner">
              <search-list @select="queryItemKey" @delete="deleteHistoryOne"></search-list>
            </div>
          </scroll>
        </div>
      </div>
      <div class="search-result" v-show="query">
        <suggest  @select="selectHistory" :query="query"></suggest>
      </div>
      <top-tip ref="topTip">
        <div class="tip-title">
          <i class="icon-ok"></i>
          <span class="text">1首歌曲已经添加到播放列表</span>
        </div>
      </top-tip>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import SongList from 'base/song-list/song-list'
  import {searchMixin} from 'common/js/mixin'
  import Switches from 'base/switches/switches'
  import Song from 'common/js/song'
  import TopTip from 'base/top-tip/top-tip'
  export default {
    mixins:[searchMixin],
    data(){
      return {
        addSongFlag:false,
        switches:[{title:'最近播放'},{title:"搜索历史"}],
        currentIndex:0
      }
    },
    methods:{
      select(song,index,mode){
          //自己写一个 插入歌曲播放的action
        this.searchAction(song);
        this.$refs.topTip.show();
      },
      switchesClick(currentIndex){
        this.currentIndex = currentIndex;
        if(timer1){
          clearTimeout(timer1);
        }
        if(timer2){
          clearTimeout(timer2);
        }
        let timer1;
        let timer2;
        if(currentIndex===0){
          timer1 =  setTimeout(()=>{
            this.$refs.songList.refresh();
          },20)
          return
        }
        timer2 =  setTimeout(()=>{
            this.$refs.searchList.refresh();
          },20)
      },
      listrefresh(){
        setTimeout(()=>{
          this.$refs.songList.refresh();
        },20)
      },
      open(){
        this.addSongFlag = true
      },
      close(){
        this.addSongFlag = false
      },
      querykey(query){
        this.query = query
      }
    },
    components: {
      SongList,
      Switches,
      TopTip
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .add-song
    position: fixed
    top: 0
    bottom: 0
    width: 100%
    z-index: 200
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .header
      position: relative
      height: 44px
      text-align: center
      .title
        line-height: 44px
        font-size: $font-size-large
        color: $color-text
      .close
        position: absolute
        top: 0
        right: 8px
        .icon-close
          display: block
          padding: 12px
          font-size: 20px
          color: $color-theme

    .search-box-wrapper
      margin: 20px
    .shortcut
      .list-wrapper
        position: absolute
        top: 165px
        bottom: 0
        width: 100%
        .list-scroll
          height: 100%
          overflow: hidden
          .list-inner
            padding: 20px 30px
    .search-result
      position: fixed
      top: 124px
      bottom: 0
      width: 100%
    .tip-title
      text-align: center
      padding: 18px 0
      font-size: 0
      .icon-ok
        font-size: $font-size-medium
        color: $color-theme
        margin-right: 4px
      .text
        font-size: $font-size-medium
        color: $color-text
</style>
