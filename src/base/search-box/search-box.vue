<template>
  <div class='search-box'>
    <i class='icon-search'></i>
    <input v-model="currentSearch" class='box' :placeholder="placeholder">
    <i @click="holderSearch" class='icon-dismiss' v-show="iconFlag"></i>
  </div>
</template>
<script>
  import {debounce} from 'common/js/util'
  export default {
    data(){
      return{
        iconFlag:false,
        currentSearch:""
      }
    },
    methods:{
      holderSearch(){
        this.currentSearch = "";
        this.iconFlag = false;
      },
      queryItemKey(currentSearch){
        this.currentSearch = currentSearch;
      }
    },
    created(){
      this.$watch("currentSearch",debounce((newCurrentSearch)=>{
        this.$emit("querykey",newCurrentSearch);
      },300))
    },
    watch:{
      currentSearch(newCurrentSearch){
        if(newCurrentSearch.length>0&&newCurrentSearch.trim()!=""){
          this.iconFlag = true;
        }else{
          this.iconFlag = false;
        }
      }
    },
    props:{
      placeholder:{
        type:String,
        default:"搜索歌曲、歌单、专辑"
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"

  .search-box
    display: flex
    align-items: center
    box-sizing: border-box
    width: 100%
    padding: 0 6px
    height: 40px
    background: $color-highlight-background
    border-radius: 6px
    .icon-search
      font-size: 24px
      color: $color-background
    .box
      flex: 1
      margin: 0 5px
      line-height: 18px
      background: $color-highlight-background
      color: $color-text
      font-size: $font-size-medium
      &::placeholder
        color: $color-text-d
    .icon-dismiss
      font-size: 16px
      color: $color-background
</style>
