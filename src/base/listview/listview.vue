<template>
	<!--监听data值为props中的data-->
	<scroll class="listview" ref="listview" :data="data" 
		:listenType="listenType" :probeType="probeType"
		@scroll="scroll">
		<ul>
			<li class="list-group" v-for="group of data" ref="listgroup">
				<h2 class="list-group-title">{{group.title}}</h2>
				<ul>
					<li @click="selectItem(item)" class="list-group-item" 
						v-for="(item,index) of group.items">
						<img v-lazy="item.avatar" class="avatar"/>
						<span class="name">{{item.name}}</span>
					</li>
				</ul>
			</li>
		</ul>
		
		<div class="list-shortcut">
			<ul>
				<!--touchmoveStop防止事件冒泡-->
				<li class="item" :data-index="index" 
					v-for="(sortcut,index) of shorcutList"  
					@touchstart="onTouchStart"
					@touchmove.stop.prevent="touchmoveStop" 
					:class="{'current':currentIndex===index}">
					{{sortcut}}
				</li>
			</ul>
		</div>
		<div class="list-fixed" ref="fixed" v-show="fixedTitle">
			<h1 class="fixed-title">{{fixedTitle}}</h1>
		</div>
		<div class="loading-container" v-show="!data.length">
			<loading></loading>
		</div>

	</scroll>
</template>

<script>
	import Scroll from 'base/scroll/scroll'
	import {getData} from 'common/js/dom'
	import Loading from 'base/loading/loading'
	
	
	
	const ANCHAR_HEIGHT=18
	const FIXED_HEIGHT=30
	export default{
		
		//展示数据
		props:{
			//data通过singer.vue中的:data="singerList"获取数据
			data:{
				type:Array,   
				default:null
			}
		},
		created(){
			//记录每个group高度的数组
			this.listHeight=[]
			//记录指尖的信息
			this.touch={}
		},
		data(){
			return{
				scrollY:-1,         //监听到滚动的Y
				listenType:true,    //监听目前是否滚动
				probeType:3,        //设置页面的滚动方式
				currentIndex:0,    //当前滚动的序号
				diff:-1
			}
		},
		methods:{
			refresh(){
				this.$refs.listview.refresh();
			},
			
			selectItem(item){
				this.$emit("select",item);
			},
			//第一步：点击跳转事件
			onTouchStart(e){
				let prefixindex=getData(e.target,'index');
				
				let firsttouch=e.touches[0];
				//consoe.log(firsttouch.pageY);
				
				//获取第一个手指的Y值
				this.touch.y1=firsttouch.pageY;
				//获取刚点击时的序号
				this.touch.ancherIndex=prefixindex;
				//0代表动画效果
				//this.$refs.listview.scrollToElement(this.$refs.listgroup[prefixindex],0)
				this._toScroll(prefixindex);
				
			},
			touchmoveStop(e){
				let prefixindex=getData(e.target,'index');
				let firsttouch=e.touches[0];
				this.touch.y2=firsttouch.pageY;
				//之间滑动的高度/每个之间的距离 向上取整  这样可以得到当前的序号index
				let delte=(this.touch.y2-this.touch.y1)/ANCHAR_HEIGHT|0;
				let anchardelte=parseInt(this.touch.ancherIndex)+delte;
				//this.$refs.listview.scrollToElement(this.$refs.listgroup[delte],0)
				this._toScroll(anchardelte);
				//console.log(anchardelte);
				
			},
			_toScroll(index){
				if(index<0){
					this.currentIndex=0;
				}
				else if(index>this.$refs.listgroup.length){
					this.currentIndex=this.$refs.listgroup.length-1;
				}
				else{
					this.currentIndex=parseInt(index);
				}
				this.$refs.listview.scrollToElement(this.$refs.listgroup[index],0)

			},
			scroll(pos){
				//console.log(pos);
				this.scrollY=pos.y;
			},
			_calculateHeight(){
				this.listHeight=[];
				//动态的计算每个group的高度
				let groupHeight=0;
				//找一个 记录每个group的高度的对象数组
				this.listHeight.push(groupHeight);
				//获取节点
				let listGroup=this.$refs.listgroup;
				for(let i=0;i<listGroup.length;i++){
					//计算每个节点的长度   放入listHeight中
					groupHeight+=listGroup[i].clientHeight
					this.listHeight.push(groupHeight)
				}
				//console.log(this.listHeight);
			}
		},
		watch:{
			data(){
				//保证渲染出数据
				setTimeout(()=>{
					this._calculateHeight();
				},20)
				//获取每个值的高度
			},
			scrollY(newY){
				//console.log(newY)
				//更新currentIndex的值
				if(newY>0){
					this.currentIndex=0;
					return;
				}
				for(let i=0;i<this.listHeight.length-1;i++){
					if(-newY>=this.listHeight[i] && -newY<this.listHeight[i+1]){
						this.currentIndex=i;
						//获取两个title的距离
						this.diff=this.listHeight[i+1]+newY;
						//console.log(this.diff);
						return;
					}
				}
				//css样式中多了空的元素
				this.currentIndex=this.listHeight.length-2;
			},
			diff(newDiff){
				let fixedTop=newDiff>0&&newDiff<FIXED_HEIGHT?(newDiff-FIXED_HEIGHT):0;
				//当this.fixedTop不为0时不需要添加样式
				if(this.fixedTop===fixedTop){
					return;
				}
				this.fixedTop=fixedTop;
				//加效果
				this.$refs.fixed.style.transform=`translate3d(0,${fixedTop}px,0)`;
			}
		},
		computed:{
			shorcutList(){
				return this.data.map(group=>{
					return group.title.substr(0,1);
				})
			},
			fixedTitle(){
				if(this.scrollY>0){
					return "";
				}
				return this.data[this.currentIndex]?this.data[this.currentIndex].title:""
			}
		},
		components:{
			Scroll,
			Loading
		}
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"


  .listview
    position: relative
    width: 100%
    height: 100%
    overflow: hidden
    background: $color-background
    .list-group
      padding-bottom: 30px
      .list-group-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
        text-align:left
      .list-group-item
        display: flex
        align-items: center
        padding: 20px 0 0 30px
        .avatar
          width: 50px
          height: 50px
          border-radius: 50%
        .name
          margin-left: 20px
          color: $color-text-l
          font-size: $font-size-medium
    .list-shortcut
      position: absolute
      z-index: 30
      right: 0
      top: 50%
      transform: translateY(-50%)
      width: 20px
      padding: 20px 0
      border-radius: 10px
      text-align: center
      background: $color-background-d
      font-family: Helvetica
      .item
        padding: 3px
        line-height: 1
        color: $color-text-l
        font-size: $font-size-small
        &.current
          color: $color-theme
    .list-fixed
      position: absolute
      top: 0
      left: 0
      width: 100%
      .fixed-title
        height: 30px
        line-height: 30px
        padding-left: 20px
        font-size: $font-size-small
        color: $color-text-l
        background: $color-highlight-background
        text-align:left
    .loading-container
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>