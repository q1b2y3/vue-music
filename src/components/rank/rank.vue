<template>
  <div class="rank" ref="rank">
    <scroll  class="toplist" ref="toplist" :data="rankItems">
      <ul>
        <li @click="select(item)" class="item" v-for="item of rankItems">
          <div class="icon">
            <img width="100" height="100" v-lazy="item.picUrl" />
          </div>
          <ul class="songlist">
            <li class="song" v-for="(item,index) of item.songList">
              <span >{{index+1}} {{item.songname}}</span>
              <span> {{item.singername}}</span>
            </li>
          </ul>
        </li>
      </ul>
      <div class="loading-container" v-show="!rankItems.length">
      	<loading></loading>
      </div>
    </scroll>
    <router-view></router-view>
  </div>
</template>

<script>
	import {getRankSong} from 'api/getRank'
	import {ERR_OK} from 'common/js/config'
	import Scroll from 'base/scroll/scroll'
	import {mapMutations} from 'vuex'
	import Loading from 'base/loading/loading'
	import {playListMixin} from 'common/js/mixin'
	
	export default{
		mixins:[playListMixin],
		data(){
			return{
				rankItems:[]
			}
		},
		created(){
			this._getRankSong();
		},
		methods:{
			handlePlayList(playList){
				//如果playList 有值  那么就在这里增加 mini的高度
				let bottomHeight=playList.length>0?"50px":"";
				this.$refs.rank.style.bottom=bottomHeight;
				this.$refs.toplist.refresh();
			},
			select(item){
				
				this.$router.push({
					path:`/rank/${item.id}`
				});
				this.setRank(item);
			},
			_getRankSong(){
				getRankSong().then(req=>{
					if(req.code===ERR_OK){
						this.rankItems=req.data.topList;
					}
				})
			},
			...mapMutations({
				setRank:'SET_RANK'
			})
		},
		components:{
			Scroll,
			Loading
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .rank
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .toplist
      height: 100%
      overflow: hidden
      .item
        display: flex
        margin: 0 20px
        padding-top: 20px
        height: 100px
        &:last-child
          padding-bottom: 20px
        .icon
          flex: 0 0 100px
          width: 100px
          height: 100px
        .songlist
          flex: 1
          display: flex
          flex-direction: column
          justify-content: center
          padding: 0 20px
          height: 100px
          overflow: hidden
          background: $color-highlight-background
          color: $color-text-d
          font-size: $font-size-small
          text-align:left
          .song
            no-wrap()
            line-height: 26px
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>