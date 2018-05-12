<template>
  <transition name="list-fade" >
    <div class="playlist" @click="close" v-show="playListFlag" >
      <div class="list-wrapper" @click.stop>
        <div class="list-header">
          <h1 class="title">
            <i class="icon" :class="changeIconMode" @click="changeIconModeClick" ></i>
            <span class="text" >{{changeIconText()}}</span>
            <span class="clear" @click="openConfirm"><i class="icon-clear"></i></span>
          </h1>
        </div>
        <scroll :refreshDelay="refreshDelay" ref="listContent" :data="playList"  class="list-content" >
          <transition-group ref="list" name="list" tag="ul">
            <li :key="index"  @click="selectSong(song)"  class="item" v-for="(song,index) of playList">
              <i class="current" :class="getIconCls(index)"></i>
              <!--icon-play-->
              <span class="text">{{song.name}}</span>

              <span  class="like" @click.stop="changeOneLike(song)">
                <i :class="likeListClsIcon(song)"></i>
              </span>

              <span  class="delete" @click.stop="delSong(song)">
                <i  class="icon-delete"></i>
              </span>
            </li>
          </transition-group>
        </scroll>
        <div class="list-operate">
          <div class="add" @click="addSongClick">
            <i class="icon-add"></i>
            <span class="text">添加歌曲到队列</span>
          </div>
        </div>
        <div class="list-close">
          <span @click="close">关闭</span>
        </div>
      </div>
      <add-song ref="addSong"></add-song>
      <comfirm ref="confirm" @del="clearPlayList" title="是否确认清除播放列表?"></comfirm>
    </div>

  </transition>
</template>
<script>
  import {mapGetters,mapActions,mapMutations} from "vuex"
  import {playerMixin,likeMixin} from 'common/js/mixin'
  import Comfirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import AddSong from 'components/add-song/add-song'
  export default {
    mixins:[playerMixin,likeMixin],
    data(){
      return {
        playListFlag:false,
        refreshDelay:120
      }
    },
    methods:{
      open(){
        this.playListFlag = true
        setTimeout(()=>{
          this.$refs.listContent.refresh()
        },20)
      },
      close(){
        this.playListFlag = false
      },
      getIconCls(index){
        return index===this.currentIndex?"icon-play":""
      },
      delSong(song){
        this.delSongForList(song);
        this.playListFlag = this.playList.length===0?false:true;
      },
      selectSong(song){
          let currentIndex = this.playList.findIndex(item=>{
            return item.id === song.id;
          });
          this.setCurrentIndex(currentIndex);
          this.setPlayState(true);
      },
      clearPlayList(){
        this.clearList();
        this.playListFlag = false
        this.$refs.confirm.close()
      },
      openConfirm(){
        this.$refs.confirm.open();
      },
      addSongClick(){
        this.$refs.addSong.open();
        this.$refs.addSong.listrefresh();
      },
      ...mapActions([
        'delSongForList','clearList'
      ]),
      ...mapMutations({
        setCurrentIndex: "SET_CURRENT_INDEX",
        setPlayState:"SET_PLAY_STATE"
      })
    },
    computed:{
      ...mapGetters([
        'playList',
        'currentIndex'

      ])
    },
    components:{
      Comfirm,
      Scroll,
      AddSong
    }
  }
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .playlist
    position: fixed
    left: 0
    right: 0
    top: 0
    bottom: 0
    z-index: 200
    background-color: $color-background-d
    &.list-fade-enter-active, &.list-fade-leave-active
      transition: opacity 0.3s
      .list-wrapper
        transition: all 0.3s
    &.list-fade-enter, &.list-fade-leave-to
      opacity: 0
      .list-wrapper
        transform: translate3d(0, 100%, 0)
    &.list-fade-enter
    .list-wrapper
      position: absolute
      left: 0
      bottom: 0
      width: 100%
      background-color: $color-highlight-background
      .list-header
        position: relative
        padding: 20px 30px 10px 20px
        .title
          display: flex
          align-items: center
          .icon
            margin-right: 10px
            font-size: 30px
            color: $color-theme-d
          .text
            flex: 1
            font-size: $font-size-medium
            color: $color-text-l
          .clear
            extend-click()
            .icon-clear
              font-size: $font-size-medium
              color: $color-text-d
      .list-content
        max-height: 240px
        overflow: hidden
        .item
          display: flex
          align-items: center
          height: 40px
          padding: 0 30px 0 20px
          overflow: hidden
          &.list-enter-active, &.list-leave-active
            transition: all 0.1s
          &.list-enter, &.list-leave-to
            height: 0
          .current
            flex: 0 0 20px
            width: 20px
            font-size: $font-size-small
            color: $color-theme-d
          .text
            flex: 1
            no-wrap()
            font-size: $font-size-medium
            color: $color-text-d
          .like
            extend-click()
            margin-right: 15px
            font-size: $font-size-small
            color: $color-theme
            .icon-favorite
              color: $color-sub-theme
          .delete
            extend-click()
            font-size: $font-size-small
            color: $color-theme
      .list-operate
        width: 140px
        margin: 20px auto 30px auto
        .add
          display: flex
          align-items: center
          padding: 8px 16px
          border: 1px solid $color-text-l
          border-radius: 100px
          color: $color-text-l
          .icon-add
            margin-right: 5px
            font-size: $font-size-small-s
          .text
            font-size: $font-size-small
      .list-close
        text-align: center
        line-height: 50px
        background: $color-background
        font-size: $font-size-medium-x
        color: $color-text-l
</style>
