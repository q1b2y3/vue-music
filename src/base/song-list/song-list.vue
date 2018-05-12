<template>
	<div class="song-list">
		<ul>
			<li class="item" v-for="(song,index) of songs" @click="selectSong(song,index)">
				<div class="rank" v-show="rankFlag">
	            	<span :class="rankNum(index+1)" class="text" v-text="index+1"></span>
	            </div>
				<div class="content">
					<h2 class="name">{{song.name}}</h2>
					<p class="desc">{{_initDescSong(song)}}</p>
				</div>
			</li>
		</ul>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
	export default{
		props:{
			songs:{
				type:Array,
				default:null
			},
			rankFlag:{
				type:Boolean,
				default:false
			}
		},
		methods:{
			_initDescSong(song){
				//console.log(song)
				return `${song.singer}·${song.album}`			
			},
			selectSong(song,index){
				//console.log(this.rankFlag);
				this.$emit("select",song,index,this.mode);
			},
			rankNum(index){
				return index<4?`icon icon${index-1}`:"text"		
			}
		},
		computed:{
			...mapGetters([
				'mode'
			])
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"


  .song-list
    .item
      display: flex
      align-items: center
      box-sizing: border-box
      height: 64px
      font-size: $font-size-medium
      .rank
        flex: 0 0 25px
        width: 25px
        margin-right: 30px
        text-align: center
        .icon
          display: inline-block
          width: 25px
          height: 24px
          background-size: 25px 24px
          &.icon0
            bg-rank('first')
          &.icon1
            bg-rank('second')
          &.icon2
            bg-rank('third')
        .text
          color: $color-theme
          font-size: $font-size-large
      .content
        flex: 1
        line-height: 20px
        overflow: hidden
        text-align:left
        .name
          no-wrap()
          color: $color-text
        .desc
          no-wrap()
          margin-top: 4px
          color: $color-text-d
</style>