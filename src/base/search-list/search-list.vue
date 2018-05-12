<template>
  <div class="search-list">
    <transition-group name="list" tag="ul">
      <li :key="item" @click="select(item)" class="search-item" v-for="item of searchHistory">
        <span class="text">{{item}}</span>
        <span class="icon" >
          <i class="icon-delete" @click.stop="deleteOneHistory(item)"></i>
        </span>
      </li>
    </transition-group>
  </div>
</template>

<script type="text/ecmascript-6">
  import {mapGetters} from 'vuex'
  export default {
    props: {

    },
    methods: {
      select(item){
        this.$emit("select",item);
      },
      //删除单条数据
      deleteOneHistory(item){
        this.$emit("delete",item)
      }
    },
    computed:{
      ...mapGetters([
        "searchHistory"
      ])
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-list
    .search-item
      display: flex
      align-items: center
      height: 40px
      overflow: hidden
      &.list-enter-active, &.list-leave-active
        transition: all 0.1s
      &.list-enter, &.list-leave-to
        height: 0
      .text
        flex: 1
        color: $color-text-l
      .icon
        extend-click()
        .icon-delete
          font-size: $font-size-small
          color: $color-text-d
</style>
