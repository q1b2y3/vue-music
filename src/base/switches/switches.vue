<template>
  <ul class="switches">
    <li @click="switchesClick(index)" class="switch-item" :class="{'active':currentIndex === index}" v-for="(item,index) of switches">
      <span >{{item.title}}</span>
    </li>
  </ul>
</template>

<script type="text/ecmascript-6">
  export default {
    props:{
      switches:{
        type:Array,
        default:[]
      },
      currentIndex:{
        type:Number,
        default:0
      }
    },
    methods:{
      switchesClick(index){
        this.$emit("switche",index);
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .switches
    display: flex
    align-items: center
    width: 240px
    margin: 0 auto
    border: 1px solid $color-highlight-background
    border-radius: 5px
    .switch-item
      flex: 1
      padding: 8px
      text-align: center
      font-size: $font-size-medium
      color: $color-text-d
      &.active
        background: $color-highlight-background
        color: $color-text
</style>
