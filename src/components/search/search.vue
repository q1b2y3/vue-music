<template>
  <div class="search">
    <div class="search-box-wrapper">
      <search-box :currentSearch="query" ref="searchBox" @querykey="querykey"></search-box>
    </div>
        <div ref="shortcutWrapper" class="shortcut-wrapper" v-show="!query">
          <scroll ref="shortcut" :data="shortCut" class="shortcut">
            <div>
              <!--热门搜索-->
              <div class="hot-key">
              <h1 class="title">热门搜索</h1>
              <ul>
                <li @click="queryItemKey(item.k)" v-for="item of hotKeyList" class="item">{{item.k}}</li>
              </ul>
              <ul>
                <li @click="changePage" class="item-change">换一批</li>
              </ul>
            </div>
              <!--搜索历史-->
              <div class="search-history" >
                <h1 class="title">
                  <span class="text">搜索历史</span>
                  <span  class="clear" @click="open">
                      <i class="icon-clear" ></i>
                    </span>
                </h1>
                <search-list @select="queryItemKey" @delete="deleteHistoryOne"></search-list>
              </div>
            </div>
          </scroll>
        </div>
        <div ref="searchResult" class="search-result" v-show="query">
            <suggest ref="suggest" :query="query" @select="selectHistory"></suggest>
        </div>
    <confirm ref="confirm" @del="deleteHistoryAll" title="确认删除历史记录吗?"></confirm>
    <router-view ></router-view>
  </div>
</template>
<script>
  import SearchBox from 'base/search-box/search-box'
  import {getSearchHotList} from 'api/getSearch'
  import {ERR_OK} from 'common/js/config'
  import Suggest from 'components/suggest/suggest'
  import SearchList from 'base/search-list/search-list'
  import Confirm from 'base/confirm/confirm'
  import Scroll from 'base/scroll/scroll'
  import {mapActions,mapGetters} from 'vuex'
  import {playListMixin} from 'common/js/mixin'
  
  export default {
    mixins:[playListMixin],
    data(){
      return{
        hotKeyList:[],
        oldHodKeyList:[],
        pageCurrentNum:1,     //当前页
        pageCurrentCount:10,  //每个页面显示的个数
        pageMaxNum:10,        //最大个数
        pageMinNum:0,         //最小个数
        pageMax:0,            //总共页面个数
        query:""
      }
    },
    created(){
      this._getSearchHotList();

    },
    computed:{
      shortCut(){
          return this.hotKeyList.concat(this.searchHistory);
      },
      ...mapGetters([
        "searchHistory"
      ])
    },
    watch:{
      pageCurrentNum(){
        this.hotKeyList = this.changeHotKey(this.oldHodKeyList);
      },
      //数据只要已更新 就刷新
      //实时刷新
      query(){
        setTimeout(()=>{
          this.$refs.shortcut.refresh();
        },20)
      }
    },
    methods:{
      handlePlayList(playList){
        let bottomHeight = playList.length>0?"50px":0
        this.$refs.shortcutWrapper.style.bottom = bottomHeight;
        this.$refs.shortcut.refresh()
        this.$refs.searchResult.style.bottom = bottomHeight;
        this.$refs.suggest.refresh()
      },
      querykey(query){
        this.query = query
      },
      _getSearchHotList(){
        getSearchHotList().then(req=>{
          if(ERR_OK === req.code){
            this.oldHodKeyList = req.data.hotkey.slice();
            //取出热搜 前十条数据 后期还要做 换一批
            this.hotKeyList = this.changeHotKey(this.oldHodKeyList);
            this.pageMax =Math.ceil(req.data.hotkey.length / this.pageMaxNum);
          }
        })
      },
      //换一批
      changeHotKey(hotKeyList){
        return hotKeyList.filter((obj,index)=>{
         return (index >= this.pageMinNum && index < this.pageMaxNum);
        });
      },
      changePage(){
        this.pageCurrentNum += 1;
        if(this.pageCurrentNum  === this.pageMax+1){
          this.pageCurrentNum = 1;
        }
        this.pageMaxNum = this.pageCurrentNum * this.pageCurrentCount;
        this.pageMinNum = (this.pageCurrentNum-1) * this.pageCurrentCount;
      },
    //改变checkBox的值
      queryItemKey(query){
        this.$refs.searchBox.queryItemKey(query);
//        this.selectHistory();
      },
      selectHistory(){
        //在我们的 sessionHistory中 记录query
        this.setHistoryAction(this.query);
      },
      //删除历史单个元素
      deleteHistoryOne(item){
          this.deleteHistoryOneAction(item);
      },
      open(){
        this.$refs.confirm.open();
      },
      deleteHistoryAll(){
        this.deleteHistoryAllAction();
        this.$refs.confirm.close();
      },
      ...mapActions([
        "setHistoryAction",
        "deleteHistoryOneAction",
        "deleteHistoryAllAction"
      ])
    },
    components:{
      SearchBox,
      Suggest,
      SearchList,
      Confirm,
      Scroll
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .search
    .search-box-wrapper
      margin: 20px
    .shortcut-wrapper
      position: fixed
      top: 178px
      bottom: 0
      width: 100%
      .shortcut
        height: 100%
        overflow: hidden
        .hot-key
          margin: 0 20px 20px 20px
          .title
            margin-bottom: 20px
            font-size: $font-size-medium
            color: $color-text-l
            text-align:left
          .item
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-text-d
          .item-change
            display: inline-block
            padding: 5px 10px
            margin: 0 20px 10px 0
            border-radius: 6px
            border:1px solid $color-border-color
            background: $color-highlight-background
            font-size: $font-size-medium
            color: $color-change-color
        .search-history
          position: relative
          margin: 0 20px
          .title
            display: flex
            align-items: center
            height: 40px
            font-size: $font-size-medium
            color: $color-text-l
            text-align:left
            .text
              flex: 1
            .clear
              extend-click()
              .icon-clear
                font-size: $font-size-medium
                color: $color-text-d
    .search-result
      position: fixed
      width: 100%
      top: 178px
      bottom: 0
</style>


