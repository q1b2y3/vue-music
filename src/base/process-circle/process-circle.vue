<template>
  <div class="progress-circle">
    <svg :width="width" :height="height" viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
    	<!--影响背景的宽高-->
      <circle class="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
      <!--影响进度条的宽高-->
      <!--stroke-dasharray 2piR 3.14 -->
      <!--stroke-dashoffset剩余的百分比-->
      <circle class="progress-bar" r="50" cx="50" cy="50" fill="transparent" :stroke-dasharray="dasharray" 
      	:stroke-dashoffset="centPercent" />
    </svg>
    
    <slot>
    	
    </slot>
  </div>
</template>

<script type="text/ecmascript-6">

  export default {
    props: {
      percent: {
        type: Number,
        default: 0
      },
      width:{
      	type: Number,
        default: 0
      },
      height:{
      	type: Number,
        default: 0
      }
    },
    data(){
    	return{
    		dasharray:100 * Math.PI
    	}
    },
    computed: {
	    centPercent() {
	       return (1 - this.percent) * this.dasharray
	    }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .progress-circle
    position: relative
    circle
      stroke-width: 8px
      transform-origin: center
      &.progress-background
        transform: scale(0.9)
        stroke: $color-theme-d
      &.progress-bar
        transform: scale(0.9) rotate(-90deg)
        stroke: $color-theme
</style>
