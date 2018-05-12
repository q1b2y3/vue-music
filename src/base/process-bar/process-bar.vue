<template>
  <div class="progress-bar" ref="processbar" @click="processClick">
    <div class="bar-inner">
      <div class="progress" ref="process"></div>
      <div class="progress-btn-wrapper" >
        <div class="progress-btn" 
        	ref="processBtn"
        	@touchstart="touchstart"
        	@touchmove="touchmove"
        	@touchend="touchend"></div>
      </div>
    </div>
  </div>
</template>

<script>
	import {prefixStyle} from 'common/js/dom'
	
	const transform=prefixStyle('transform')
	const PROBTN="16"
	
export default{
	props:{
		percent:{
			type:Number,
			default:0
		}
	},
	created(){
		this.touch={};
		this.touchStart=false;   //是否开始点击
	},
	methods:{
		touchstart(e){
			this.touchStart=true;
			//获取点击的当前位置
			this.touch.x=e.touches[0].pageX;
			//距离左边的距离
			this.touch.left=this.$refs.process.clientWidth;
		},
		touchmove(e){
			//当没有滑动点击的时候
			if(!this.touchStart){
				return 
			}
			const deltaX=e.touches[0].pageX-this.touch.x;
			//从最小值  直接开始拖动   到   中间拖动  取最小值
			const offsetX=Math.min(this.$refs.processbar.clientWidth-PROBTN,Math.max(deltaX+this.touch.left))
			this.processChange(offsetX);
		},
		touchend(){
			this.touchStart=false;
			//传入目前的百分比
			let percent=this.$refs.process.clientWidth/(this.$refs.processbar.clientWidth-PROBTN);
			
			this.$emit('processChangePercent',percent);
		},
		//实现动画偏移
		processChange(offsetX){
			if(offsetX<0){
				offsetX=0; 
			}
			//给进度条加长度
			this.$refs.process.style.width=`${offsetX}px`;
			//给按钮加动画
			this.$refs.processBtn.style[transform]=`translate3d(${offsetX}px,0,0)`;
		},
		processClick(e){
			let offsetX=this.$refs.processbar.getBoundingClientRect();
			//console.log(offsetX);
			this.processChange(e.pageX-offsetX.left);
			//console.log(e.pageX-offsetX.left);
			this.touchend();
		}
	},
	watch:{
		//业务逻辑  ：长度随百分比的变化而变化
		percent(newPercent){
			//console.log(newPercent);
			if(newPercent>0 && !this.touchStart){
				//进度条长度
				let proWidth=this.$refs.processbar.clientWidth-PROBTN;
				//填充的长度
				let changeWidth=newPercent*proWidth;
			
				this.processChange(changeWidth);
			}
		}
	}
}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-bar
    height: 30px
    .bar-inner
      position: relative
      top: 13px
      height: 4px
      background: rgba(0, 0, 0, 0.3)
      .progress
        position: absolute
        height: 100%
        background: $color-theme
      .progress-btn-wrapper
        position: absolute
        left: -8px
        top: -13px
        width: 30px
        height: 30px
        .progress-btn
          position: relative
          top: 7px
          left: 7px
          box-sizing: border-box
          width: 16px
          height: 16px
          border: 3px solid $color-text
          border-radius: 50%
          background: $color-theme
</style>
