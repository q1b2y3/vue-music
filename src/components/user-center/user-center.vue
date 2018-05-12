<template>
  <transition name="slide">
    <div class="user-center">
      <div class="back" @click="back" >
        <i class="icon-back"></i>
      </div>
      <div class="switches-wrapper">
        <switches @switche="switche" :switches="switches" :currentIndex="switchCurrentIndex"></switches>
      </div>
      <div ref="playBtn" class="play-btn" @click="switchCurrentIndex===0?randomMusic(likeList):randomMusic(playHistory)">
        <i class="icon-play"></i>
        <span class="text">随机播放全部</span>
      </div>
      <div class="list-wrapper" ref="listWrapper" >
        <scroll ref="favoriteList" :data="likeList" class="list-scroll" v-if="switchCurrentIndex===0">
          <div class="list-inner">
            <song-list :songs="likeList"></song-list>
          </div>
        </scroll>
        <scroll ref="playList" :data="playHistory" class="list-scroll" v-if="switchCurrentIndex===1">
          <div class="list-inner">
            <song-list :songs="playHistory" @select="select"></song-list>
          </div>
        </scroll>
      </div>
      <div class="no-result-wrapper">
        <!--<no-result ></no-result>-->
      </div>
      <!--<top-tip ref="topTip">-->
        <!--<div class="tip-title">-->
          <!--<i class="icon-ok"></i>-->
          <!--<span class="text">1首歌曲已经添加到播放列表</span>-->
        <!--</div>-->
      <!--</top-tip>-->
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  import Switches from 'base/switches/switches'
  import {searchMixin} from 'common/js/mixin'
  import SongList from 'base/song-list/song-list'
  import TopTip from 'base/top-tip/top-tip'
  import Song from 'common/js/song'
  
  export  default {
    mixins:[searchMixin],
    data(){
      return {
        switches:[{title:"我喜欢的"},{title:"最近播放"}],
        switchCurrentIndex:0
      }
    },
    methods:{
      select(song,index,mode){
        //自己写一个 插入歌曲播放的action
        let obj = Object.assign({},song);

        this.searchAction(obj);
//        this.$refs.topTip.show();
      },
      back(){
        this.$router.back();
      },
      switche(index){
        this.switchCurrentIndex = index;
      }
    },
    components:{
      Switches,
      SongList,
      TopTip
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .user-center
    position: fixed
    top: 0
    bottom: 0
    z-index: 100
    width: 100%
    background: $color-background
    &.slide-enter-active, &.slide-leave-active
      transition: all 0.3s
    &.slide-enter, &.slide-leave-to
      transform: translate3d(100%, 0, 0)
    .back
      position absolute
      top: 0
      left: 6px
      z-index: 50
      .icon-back
        display: block
        padding: 10px
        font-size: $font-size-large-x
        color: $color-theme
    .switches-wrapper
      margin: 10px 0 30px 0
    .play-btn
      box-sizing: border-box
      width: 135px
      padding: 7px 0
      margin: 0 auto
      text-align: center
      border: 1px solid  $color-text-l
      color: $color-text-l
      border-radius: 100px
      font-size: 0
      .icon-play
        display: inline-block
        vertical-align: middle
        margin-right: 6px
        font-size: $font-size-medium-x
      .text
        display: inline-block
        vertical-align: middle
        font-size: $font-size-small
    .list-wrapper
      position: absolute
      top: 110px
      bottom: 0
      width: 100%
      .list-scroll
        height: 100%
        overflow: hidden
        .list-inner
          padding: 20px 30px
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
