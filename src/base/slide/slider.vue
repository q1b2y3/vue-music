/**
 * Created by Lee.Teacher on 2017/10/6.
 */
<template>
<div class="slider" ref="slider">
    <div class="slider-group" ref="slidergroup">
      <slot>
      </slot>
    </div>
    <div class="dots">
    	<div class="dot" v-for="(item,index) of dots" :class="{active:currentPageIndex===index}">
    		
    	</div>
    </div>
  </div>
</template>

<script>
	import {addClass} from 'common/js/dom'
	import Bscroll from 'better-scroll'
	
	export default{
		//是否可以轮播
		//是否自动播放
		//轮播时间
		
		//私有属性
		props:{
			//是否可以轮播
			loop:{
				type:Boolean,
				default:true
			},
			//是否自动播放	
			autoPlay:{
				type:Boolean,
				default:true
			},
			//循环时间		
			interval:{
				type:Number,
				default:4000
			}
		},
		data(){
			return{
				dots:[],
				currentPageIndex:0
			}
		},
		mounted(){
			window.addEventListener("resize",()=>{
				if(!this.slider){
					return;
				}
				this._setSliderWidth(true);
				this.slider.refresh();
			})
			//浏览器渲染时17ms渲染一次
			setTimeout(()=>{
				//初始化slider样式
				this._setSliderWidth();
				//使slider滚动起来
				this._initSlider();
				//初始化dots的数量
				this._initDot();
				//自动滚动
				if(this._autoPlay){
					this._play();
				}
			},20);//20ms的效率最高
		},
		methods:{
			_setSliderWidth(sliderflag){
				this.children=this.$refs.slidergroup.children;
				//console.log(this.children);
				//总宽度
				let width=0;
				//获取到屏幕宽度
				let sliderWidth=this.$refs.slider.clientWidth;
				//console.log(sliderWidth)
				
				for(let i=0;i<this.children.length;i++){
					let child=this.children[i];
					//console.log(i)
					//添加class样式
					addClass(child,'slider-item');
					//设置每个slider宽度
					child.style.width=`${sliderWidth}px`;
					//累加所以宽度
					width+=sliderWidth;
				}
				if(this.loop&&!sliderflag){
					width+=2*sliderWidth;
				}
				//设置总宽度
				this.$refs.slidergroup.style.width=`${width}px`;
			},
			_initSlider(){
				this.slider=new Bscroll(this.$refs.slider,{
					scrollX:true,  //横向滚动
					scrollY:false,  //纵向滚动
					momentum:false,  //间隔
					//滑动效果
					snap:{            
						loop:true,     //循环
						threshold:0.3,  //百分比切换
						speed:400        //滚动速度
					}
				})
				//
				this.slider.on("scrollEnd",()=>{
					this.currentPageIndex=this.slider.getCurrentPage().pageX-1;
					if(this.loop){
						clearTimeout(this.timer);
						this._play();}
				})
			},
			_initDot(){
				this.dots=new Array(this.children.length);
			},
			_play(){
				let gotoPageIndex=this.currentPageIndex+1;
				if(this.loop){
					gotoPageIndex+=1;
				}
				this.timer=setTimeout(()=>{
					this.slider.goToPage(gotoPageIndex,0,400);
				},this.interval);
			}
		}
	}
</script>




<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  .slider
    min-height: 1px
    .slider-group
      position: relative
      overflow: hidden
      white-space: nowrap
      .slider-item
        float: left
        box-sizing: border-box
        overflow: hidden
        text-align: center
        a
          display: block
          width: 100%
          overflow: hidden
          text-decoration: none
        img
          display: block
          width: 100%
    .dots
      position: absolute
      right: 0
      left: 0
      bottom: 12px
      text-align: center
      font-size: 0
      .dot
        display: inline-block
        margin: 0 4px
        width: 8px
        height: 8px
        border-radius: 50%
        background: $color-text-l
        &.active
          width: 20px
          border-radius: 5px
          background: $color-text-ll
</style>