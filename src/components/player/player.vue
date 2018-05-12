<template>
  <div class="player">
    <transition name="normal"
                @enter = "enterTransition"
                @after-enter="afterEnterTransition"
                @leave = "leaveTransition"
                @after-leave="afterLeaveTransition"
    >
      <div  class="normal-player" v-show="fullScreen">
      <div class="background">
        <img width="100%" height="100%" >
      </div>
      <div class="top">
        <div class="back" @click="back">
          <i class="icon-back"></i>
        </div>
        <h1 class="title" v-html="currentSong.name"></h1>
        <h2 class="subtitle" v-html="currentSong.singer"></h2>
      </div>
      <div class="middle"
        @touchstart.prevent = "middleTouchStart"
           @touchmove.prevent = "middleTouchMove"
              @touchend = "middleTouchEnd"
      >
        <div class="middle-l" ref="middleL">
          <div class="cd-wrapper" ref="cdWrapper">
            <div class="cd" :class="cdIcon" >
              <img class="image " width="40" height="40" :src="currentSong.image" >
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{lyricTxt}}</div>
          </div>
        </div>
        <scroll class="middle-r" ref="scroll" :data="currentLyric.lines">
          <div  class="lyric-wrapper">
            <div >
              <p ref="lyricLine" class="text"  :class="{'current':index===lyricIndex}" v-for="(lyric,index) of currentLyric.lines">{{lyric.txt}}</p>
            </div>
          </div>
        </scroll>
      </div>
      <div class="bottom">
        <div class="dot-wrapper">
          <span class="dot" :class="{'active':currentPage==='cd'}"></span>
          <span class="dot" :class="{'active':currentPage==='lyric'}"></span>
        </div>
        <div class="progress-wrapper">
          <span class="time time-l">{{computedTime(currentTime)}}</span>
          <div class="progress-bar-wrapper">
              <progress-bar :percent="percent" @progressChangePercent="progressChangePercent"></progress-bar>
          </div>
          <span class="time time-r">{{computedTime(currentSong.duration)}}</span>
        </div>
        <div class="operators">
          <div class="icon i-left" >
            <i :class="changeIconMode" @click="changeIconModeClick"></i>
          </div>
          <div class="icon i-left" :class="diableCls">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center" :class="diableCls">
            <i  @click="startAndStop" :class="startAndStopIcon"></i>
          </div>
          <div class="icon i-right"  :class="diableCls">
            <i  class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right" @click="changeLikeList" >
            <i  :class="likeListCls" ></i>
          </div>
        </div>
      </div>
    </div>
    </transition>

    <transition name="mini">
      <div class="mini-player" v-show="!fullScreen && playList.length>0" @click="openMini">
      <div class="icon" >
        <img  width="40" height="40" :class="cdIcon" :src="currentSong.image">
      </div>
      <div class="text">
        <h2 class="name" v-html="currentSong.name"></h2>
        <p class="desc" v-html="currentSong.singer"></p>
      </div>
      <div class="control">
        <progress-circle :percent="percent" :width="width" :height="height">
          <i class="icon-mini" :class="startAndStopMiniIcon" @click.stop="startAndStop"></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="open">
        <i class="icon-playlist" ></i>
      </div>
    </div>
    </transition>
    <play-list ref="playList"></play-list>
    <!--canplay audio的官方api 指的是 如果 audio加载完毕之后触发-->
    <audio :src="currentSong.url" ref="audio" @timeupdate="timeupdate" @ended="ended" @canplay="play" @error="error"></audio>
  </div>
</template>

<script>
  import animations from 'create-keyframe-animation'
  import {prefixStyle} from 'common/js/dom'
  import ProgressBar  from 'base/process-bar/process-bar'
  import ProgressCircle from 'base/process-circle/process-circle'
  import {shuffle} from 'common/js/util'
  import {getLyric} from 'api/song'
  import Lyric from 'lyric-parser'
  import Scroll from 'base/scroll/scroll'
  import PlayList from 'components/playlist/playlist'
  import {playerMixin,likeMixin} from 'common/js/mixin'
  import {mapGetters,mapMutations,mapActions} from 'vuex'
  
  const transform = prefixStyle('transform');
  const transitionDuration = prefixStyle('transitionDuration');


  export default {
    mixins:[playerMixin,likeMixin],
    data(){
      return {
//        当前歌曲 是否准备完毕  默认false
        ready : false,
        currentTime:0,
        width:32,
        height:32,
        currentLyric:'',
        currentPage:'cd',
        lyricIndex:0,
        lyricTxt:'',
        like:0
      }
    },
    created(){
      this.touch = {};
    },
    methods:{
      back(){
        //切换fullScreen
        this._setFullScreen();
      },
      openMini(){
        this._setFullScreen();
      },
      enterTransition(e,done){
        const {x,y,scale} = this. _getPosAndScale();
        //创建动画
        animations.registerAnimation({
          name:'move',
          animation:{
            0:{transform:`translate3d(${x}px,${y}px,0) scale(${scale})`},
            60:{transform:`translate3d(0,0,0) scale(1.2)`},
            100:{transform:`translate3d(0,0,0) scale(1)`},
          },
          presets: {
            duration: 600,
            easing: 'linear'
          }
        });
        animations.runAnimation(this.$refs.cdWrapper,'move',done)
      },
      afterEnterTransition(){
        animations.unregisterAnimation('move');
        this.$refs.cdWrapper.style.animation = '';
      },
      leaveTransition(e,done){
        const {x,y,scale} = this. _getPosAndScale();
        this.$refs.cdWrapper.style.transition = 'all 0.6s'
        this.$refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
        this.$refs.cdWrapper.addEventListener("transitionend",done);
      },
      afterLeaveTransition(){
        this.$refs.cdWrapper.style.animation = '';
        this.$refs.cdWrapper.style[transform] = '';
      },
      _getPosAndScale(){
        const miniR = 40;
        const miniLeft = 40;
        const miniBottom = 30;
        const normalTop = 80;
        const normalWidth = window.innerWidth * 0.8;
        const scale = miniR / normalWidth;
        //小光盘 到大光盘 需要运动的X距离
        const x = -(window.innerWidth/2 - miniLeft);
        //小光盘 到大光盘 运动的Y的距离
        const y = window.innerHeight - normalTop - miniBottom - normalWidth/2;
        return {
          x,y,scale
        }
      },
      _setFullScreen(){
        this.setFullScreen(!this.fullScreen);
      },
      startAndStop(){
        //解决暂停和播放的问题
        if(this.currentLyric){
          this.currentLyric.togglePlay();
        }
        this.setPlayState(!this.playing);
      },
      prev(){
        if(!this.ready){
          return
        }
        let currentIndex = this.currentIndex - 1;
        if(currentIndex<0){
          currentIndex = this.playList.length-1;
        }
        //暂停切换 还为暂停
        if(!this.playing){
          this.startAndStop();
        }
        this.setCurrentIndex(currentIndex);
        this.ready = false;
      },
      next(){
        //如果该歌曲 没有进行加载 那么 直接返回 不进行播放
        if(!this.ready){
          return
        }
        //判断 下一曲 以及 范围
        let currentIndex = this.currentIndex + 1;
        if(currentIndex>this.playList.length-1){
          currentIndex = 0;
        }
        //暂停切换 还为暂停
        if(!this.playing){
          this.startAndStop();
        }
        //写入vuex里面的 currentIndex
        this.setCurrentIndex(currentIndex);
        //最后在重新 赋值false 为了让 下一首歌 也能有准备的效果
        this.ready = false;
      },
      play(){
        //只有 音乐加载过后 触发audio里面的canplay 那么 我才能加载下一首
        this.ready = true;
      },
      timeupdate(e){
        this.currentTime =e.target.currentTime;

      },
      //取出数组中的我们要取出currentIndex 放入到vuex中
      computedTime(time){
        //取整
        let currenttime = time | 0;
        //200s
        let min = currenttime / 60 | 0;
        let sec = this._pad(currenttime % 60 | 0);
        return `${min}:${sec}`
      },
      progressChangePercent(percent){
          let duration =  this.currentSong.duration;
          this.currentTime = percent * duration;
          this.$refs.audio.currentTime = this.currentTime;

          //用来 跳转歌词
          this.currentLyric.seek(this.currentTime * 1000);

          if(!this.playing){
            this.startAndStop();
          }
      },
      _pad(sec){
        let secStr = sec.toString();
        if(secStr.length<2){
          secStr = "0" + secStr
        }
        return secStr;
      },
      error(){
        this.ready = true;
      },
      ended(){
        if(this.mode === Mode.loop){
          //继续播放当前歌曲
          this.loop();
        }else{
          this.next()
        }
      },
      //继续播放当前歌曲
      loop(){
          this.$refs.audio.currentTime = 0;
          //解决单曲循环 歌词重置问题
          this.currentLyric.seek(0);

          this.$refs.audio.play();
      },
      _handler(lyric){
        this.lyricIndex = lyric.lineNum;
        this.lyricTxt = lyric.txt
        if(lyric.lineNum>5){
          //让scroll进行滚动 滚动 当前行数-5
          let currentScrollEl= this.$refs.lyricLine[lyric.lineNum-5];
          this.$refs.scroll.scrollToElement(currentScrollEl,1000);
        }else{
          this.$refs.scroll.scrollTo(0,0,1000);
        }
      },
      middleTouchStart(e){
        this.touch.toggleFlag = true;
        this.touch.moved = true;

        let touch = e.touches[0];
        this.touch.startX = touch.pageX;
        this.touch.startY = touch.pageY;
      },
      middleTouchMove(e){
        if(!this.touch.toggleFlag){
          return;
        }
        let touch = e.touches[0];
        let deltaX = touch.pageX - this.touch.startX;
        let deltaY = touch.pageY - this.touch.startY;
        //用来判断 当前如果是lyric 就不能向左边滑动
        if((this.currentPage === 'lyric' && deltaX<0)||(this.currentPage === 'cd' && deltaX>0)){
          this.touch.toggleFlag = false
          this.touch.moved = false
          return
        }
        //判断 是歌词滚动 还是 歌词切换
        if(Math.abs(deltaY)>Math.abs(deltaX)){
          return
        }
        let innerWidth = this.currentPage === 'cd' ? 0:(-window.innerWidth);
        //滑动逻辑
        let offsetX = Math.min(0,Math.max(-window.innerWidth,innerWidth+deltaX));
        //获取比例
        this.touch.pecant = Math.abs(offsetX/window.innerWidth);

        //操作 自定义组件中  里面的所有区域节点
        this.$refs.scroll.$el.style[transform] = `translate3d(${offsetX}px,0,0)`;
        //背景透明度
        this.$refs.middleL.style.opacity = 1-this.touch.pecant;
        this.$refs.scroll.$el.style[transitionDuration] = ``
      },
      middleTouchEnd(e){
        //解决切换问题
        if(!this.touch.moved){
          return
        }
        if(!this.touch.toggleFlag){
          return;
        }
        let pecent = this.touch.pecant;
        let offsetX;
        let opacity;
        if(this.currentPage==='cd'){
          if(pecent>0.7){
            //移动
//            offsetX = -window.innerWidth * (1-pecent);
            offsetX = -window.innerWidth;
            opacity = 0;
            this.currentPage = 'lyric'
          }else{
            offsetX = 0;
            opacity = 1;
          }
        }else{
          //改变el的transform
          if(pecent>0.3){
            offsetX = 0;
            this.currentPage = 'cd'
            opacity = 1;
          }else{
            offsetX = -window.innerWidth;
            opacity = 0;
          }
        }
        let time = 300;
        //位置
        this.$refs.scroll.$el.style[transform] = `translate3d(${offsetX}px,0,0)`
        //设置滑动的 时间 间隔
        this.$refs.scroll.$el.style[transitionDuration] = `${time}ms`

        this.$refs.middleL.style.opacity = opacity;

        this.touch.toggleFlag = false
      },
      open(){
        this.$refs.playList.open();
      },
      ...mapMutations({
        setFullScreen:'SET_FULL_SCREEN',
        setPlayState:'SET_PLAY_STATE',
        setMode:"SET_MODE"
      }),
      ...mapActions([
        'setPlayHistoryAction'
      ])

    },
    watch:{
      playing(newPlay){
        let audio = this.$refs.audio;
        this.$nextTick(()=> {
          newPlay?audio.play():audio.pause()
        });
      },
      currentSong(newSong){
         if(!this.playing){
           return
         }
         this.setPlayHistoryAction(newSong);
         //解决歌曲切换 歌词跳动问题
         if(this.currentLyric){
           this.currentLyric.stop();
         }
          this.currentSong.getLyric().then(lyric=>{
             this.currentLyric = new Lyric(lyric,this._handler);
              this.currentLyric.play();
          }).catch(()=>{
            this.currentLyric = ""
            this.lyricIndex = 0;
            this.lyricTxt = "暂无歌词"
          });
          this._getLike();
          this.$nextTick(()=>{
                this.$refs.audio.play();
          });
      }
    },
    computed:{
      diableCls(){
//        如果没有准备号该歌曲 那么 这首歌曲的按钮为不可点击的样式
        return this.ready?'':'disable'
      },
      startAndStopIcon(){
        return this.playing?'icon-pause':'icon-play'
      },
      startAndStopMiniIcon(){
        return this.playing?'icon-pause-mini':'icon-play-mini'
      },
      cdIcon(){
        return this.playing?'play':'play pause'
      },
      percent(){
          return this.currentTime/this.currentSong.duration
      },
      ...mapGetters([
        'playing',
        'playList',
        'fullScreen',
        'currentIndex'
      ])
    },
    components:{
      ProgressBar,
      ProgressCircle,
      Scroll,
      PlayList
    }
  }
</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .player
    .normal-player
      position: fixed
      left: 0
      right: 0
      top: 0
      bottom: 0
      z-index: 150
      background: $color-background
      .background
        position: absolute
        left: 0
        top: 0
        width: 100%
        height: 100%
        z-index: -1
        opacity: 0.6
        filter: blur(20px)
      .top
        position: relative
        margin-bottom: 25px
        .back
          position absolute
          top: 0
          left: 6px
          z-index: 50
          .icon-back
            display: block
            padding: 9px
            font-size: $font-size-large-x
            color: $color-theme
            transform: rotate(-90deg)
        .title
          width: 70%
          margin: 0 auto
          line-height: 40px
          text-align: center
          no-wrap()
          font-size: $font-size-large
          color: $color-text
        .subtitle
          line-height: 20px
          text-align: center
          font-size: $font-size-medium
          color: $color-text
      .middle
        position: fixed
        width: 100%
        top: 80px
        bottom: 170px
        white-space: nowrap
        font-size: 0
        .middle-l
          display: inline-block
          vertical-align: top
          position: relative
          width: 100%
          height: 0
          padding-top: 80%
          .cd-wrapper
            position: absolute
            left: 10%
            top: 0
            width: 80%
            height: 100%
            .cd
              width: 100%
              height: 100%
              box-sizing: border-box
              border: 10px solid rgba(255, 255, 255, 0.1)
              border-radius: 50%
              &.play
                animation: rotate 20s linear infinite
              &.pause
                animation-play-state: paused
              .image
                position: absolute
                left: 0
                top: 0
                width: 100%
                height: 100%
                border-radius: 50%

          .playing-lyric-wrapper
            width: 80%
            margin: 30px auto 0 auto
            overflow: hidden
            text-align: center
            .playing-lyric
              height: 20px
              line-height: 20px
              font-size: $font-size-medium
              color: $color-text-l
        .middle-r
          display: inline-block
          vertical-align: top
          width: 100%
          height: 100%
          overflow: hidden
          .lyric-wrapper
            width: 80%
            margin: 0 auto
            overflow: hidden
            text-align: center
            .text
              line-height: 32px
              color: $color-text-l
              font-size: $font-size-medium
              &.current
                color: $color-text
      .bottom
        position: absolute
        bottom: 50px
        width: 100%
        .dot-wrapper
          text-align: center
          font-size: 0
          .dot
            display: inline-block
            vertical-align: middle
            margin: 0 4px
            width: 8px
            height: 8px
            border-radius: 50%
            background: $color-text-l
            &.active
              width: 20px
              border-radius: 5px
              background: $color-text-ll
        .progress-wrapper
          display: flex
          align-items: center
          width: 80%
          margin: 0px auto
          padding: 10px 0
          .time
            color: $color-text
            font-size: $font-size-small
            flex: 0 0 30px
            line-height: 30px
            width: 30px
            &.time-l
              text-align: left
            &.time-r
              text-align: right
          .progress-bar-wrapper
            flex: 1
        .operators
          display: flex
          align-items: center
          .icon
            flex: 1
            color: $color-theme
            &.disable
              color: $color-theme-d
            i
              font-size: 30px
          .i-left
            text-align: right
          .i-center
            padding: 0 20px
            text-align: center
            i
              font-size: 40px
          .i-right
            text-align: left
          .icon-favorite
            color: $color-sub-theme
      &.normal-enter-active, &.normal-leave-active
        transition: all 0.4s
        .top, .bottom
          transition: all 0.4s cubic-bezier(0.86, 0.18, 0.82, 1.32)
      &.normal-enter, &.normal-leave-to
        opacity: 0
        .top
          transform: translate3d(0, -100px, 0)
        .bottom
          transform: translate3d(0, 100px, 0)
    .mini-player
      display: flex
      align-items: center
      position: fixed
      left: 0
      bottom: 0
      z-index: 180
      width: 100%
      height: 60px
      background: $color-highlight-background
      &.mini-enter-active, &.mini-leave-active
        transition: all 0.4s
      &.mini-enter, &.mini-leave-to
        opacity: 0
      .icon
        flex: 0 0 40px
        width: 40px
        padding: 0 10px 0 20px
        img
          border-radius: 50%
          &.play
            animation: rotate 10s linear infinite
          &.pause
            animation-play-state: paused
      .text
        display: flex
        flex-direction: column
        justify-content: center
        flex: 1
        line-height: 20px
        overflow: hidden
        .name
          margin-bottom: 2px
          no-wrap()
          font-size: $font-size-medium
          color: $color-text
        .desc
          no-wrap()
          font-size: $font-size-small
          color: $color-text-d
      .control
        flex: 0 0 30px
        width: 30px
        padding: 0 10px
        .icon-play-mini, .icon-pause-mini, .icon-playlist
          font-size: 30px
          color: $color-theme-d
        .icon-mini
          font-size: 32px
          position: absolute
          left: 0
          top: 0

  @keyframes rotate
    0%
      transform: rotate(0)
    100%
      transform: rotate(360deg)
</style>

