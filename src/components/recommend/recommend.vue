<template>
    <div class="recommend" ref="recommend" >
      <scroll  class="recommend-content" ref="scroll" :data="descItems">
      	<!--让slider和推荐栏位一起滚动  所以要加入 一个 div标签进行包裹-->
      	<div>
          <div v-if="sliderItems.length" class="slider-wrapper">
          	<slider>
          		<div v-for= "item of sliderItems">
          			<a :href="item.linkUrl">
          				<img @load="imgLoad" :src="item.picUrl"/>
          			</a>
          		</div>
          	</slider>
          </div>
          <div class="recommend-list">
            <h1 class="list-title">热门歌单推荐</h1>
            <ul>
            	 <li @click="selectItem(item)" v-for="item of descItems" class="item">
	              <div class="icon">
	              	<!--needsclick加一个可以点击的效果-->
	              	<!--v-lazy图片懒加载-->
	                <img class="needsclick" width="60" height="60" v-lazy="item.cover" >
	              </div>
	              <div class="text">
	                <!--creator字符转义-->
	                <h2 class="name" v-html="item.username"></h2>
	                <p class="desc" v-html="item.title"></p>
	              </div>
	            </li>
            </ul>
          </div>
        </div>
      	<div class="loading-container" v-if="!descItems.length">
        <loading ></loading>
      </div>
      </scroll>
      <router-view></router-view>
    </div>

</template>

<script>
	import {getRecommend,getDiscList,getMovieList} from 'api/getRecommend'
	import {ERR_OK} from 'common/js/config'
	import Slider from 'base/slide/slider'
	import Scroll from 'base/scroll/scroll'
	import Loading from 'base/loading/loading'
    import {playListMixin} from 'common/js/mixin'
    import {mapMutations} from 'vuex'
	//VUE生命周期 mounted
	export default{
	    mixins:[playListMixin],
		data(){
			return{
				sliderItems:[],
				descItems:[]
			}
		},
		created(){
			this._getRecommend();
			setTimeout(()=>{
				this._getDiscList();
			},3000)
//			this._getMovieList()

		},
		methods:{
		      handlePlayList(playList){
		        let bottomHeight = playList.length>0?"50px":0
		        this.$refs.recommend.style.bottom = bottomHeight;
		        this.$refs.scroll.refresh();
		      },
			_getRecommend(){
				getRecommend().then(rep=>{
					//如果rep.code 为0 那么代表请求成功
					if(rep.code === ERR_OK){
						//赋值
						this.sliderItems = rep.data.slider;
					}

				})
			},
		      selectItem(item) {
		        this.$router.push({
		          path: `/recommend/${item.dissid}`
		        })
		        this.setDisc(item)
		      },
			_getDiscList(){
				getDiscList().then(rep=>{
					if(rep.code === ERR_OK){
						this.descItems = rep.recomPlaylist.data.v_hot
					}
				})
			},
			_getMovieList(){
				getMovieList().then(req=>{
					console.log(req)
				})
			},
			//解决请求接口时间不统一 导致scroll无法刷新到最新的值的问题
			imgLoad(){
				//只允许进来一次
				if(!this.imgLoadFlag){
					//如果我获取到节点 的template的话 那么可以执行 这个模版中的方法
					this.$refs.scroll.refresh();
					this.imgLoadFlag = true;
				}
			},
		      ...mapMutations({
		        setDisc: 'SET_DISC'
		      })
		},
		components:{
			Slider,
			Scroll,
			Loading
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .recommend
    position: fixed
    width: 100%
    top: 88px
    bottom: 0
    .recommend-content
      height: 100%
      overflow: hidden
      .slider-wrapper
        position: relative
        width: 100%
        overflow: hidden
      .recommend-list
        .list-title
          height: 65px
          line-height: 65px
          text-align: center
          font-size: $font-size-medium
          color: $color-theme
        .item
          display: flex
          box-sizing: border-box
          align-items: center
          padding: 0 20px 20px 20px
          .icon
            flex: 0 0 60px
            width: 60px
            padding-right: 20px
          .text
            display: flex
            flex-direction: column
            justify-content: center
            flex: 1
            line-height: 20px
            overflow: hidden
            font-size: $font-size-medium
            .name
              margin-bottom: 10px
              color: $color-text
            .desc
              color: $color-text-d
      .loading-container
        position: absolute
        width: 100%
        top: 50%
        transform: translateY(-50%)
</style>
