<template>
  <scroll ref="suggest" :data="queryList" :fullType="fullType" @scrollToEnd="searchMore"  class="suggest" >
    <ul class="suggest-list">
      <li @click="selectSinger(item)"  v-for="item of queryList"  class="suggest-item">
        <div class="icon" >
          <i :class="getIconCls(item)"></i>
        </div>
        <div class="name">
          <p class="text" v-html="getContent(item)"></p>
        </div>
      </li>
      <loading v-show="hasMore" title=""></loading>
    </ul>
    <div v-show="!hasMore && !queryList.length" class="no-result-wrapper">
      <no-result :title="title"></no-result>
    </div>
  </scroll>
</template>

<script>
  import {getSearch} from 'api/getSearch'
  import {ERR_OK} from 'common/js/config'
  import {creatSong} from 'common/js/song'
  import Scroll from 'base/scroll/scroll'
  import Loading from 'base/loading/loading'
  import {mapMutations,mapActions} from 'vuex'
  import Singer from 'common/js/singer'
  import NoResult from 'base/no-result/no-result'

  const perpage = 20;
  const ZHIDA_FLAG = true;

  export default {
    props:{
      query:{
        type:String,
        default:""
      }
    },

    data(){
      return {
        pageNum:1,
        queryList:[],
        fullType:true,
        hasMore:true,
        title:"抱歉您搜索的歌曲或者歌手不存在"
      }
    },
    watch:{
      query(newQuery){
        this.pageNum = 1;
        this.hasMore = true;
        this.queryList = [];
        if(newQuery) {
          this._getSearch();
        }
      }
    },
    methods:{
      selectSinger(item){
        if (item.type === ZHIDA_FLAG) {
          this.$router.push({
            path:`/search/${item.query.singermid}`
          })
          let querySinger = item.query
          //{id,name,imgid}

          let singer = new Singer({
            id:querySinger.singerid,
            name:querySinger.singername,
            imgid:querySinger.singermid})

          this.setSinger(singer);
        }else{
          //逻辑
          this.searchAction(item);
        }
        this.$emit("select");
      },
      getContent(item){
        if (item.type === ZHIDA_FLAG) {
          return item.query.singername
        }else{
          return `${item.singer} - ${item.name}`
        }
      },
      searchMore(){
        if(!this.hasMore){
          return
        }
        this.pageNum++
        //重新发送请求
        getSearch({w:this.query,p:this.pageNum,perpage:perpage}).then(req=>{
          if(req.code === ERR_OK){
            this.hasMoreFlag(req.data);
            this.queryList = this.queryList.concat(this._normalSearchList(req.data));
            console.log(this.queryList)
          }
        })
      },
      hasMoreFlag(queryList){
        //如果 我们要求返回20条数据 可就给我们返回10条
        //如果没有给我们返回数据
        if(!queryList.song.list||queryList.song.list.length < perpage){
          this.hasMore = false;
        }
      },
      getIconCls(item) {
        if (item.type === ZHIDA_FLAG) {
          return 'icon-mine'
        } else {
          return 'icon-music'
        }
      },
      _getSearch(){
        if(!this.hasMore){
          return
        }
        getSearch({w:this.query,p:this.pageNum,perpage:perpage}).then(req=>{
            if(req.code === ERR_OK){
              this.hasMoreFlag(req.data);
                this.queryList = this._normalSearchList(req.data);
            }
        })
      },
      _normalSearchList(queryList){
        let ret = [];
        if(queryList.zhida&&queryList.zhida.type !==0&&this.pageNum===1){
          ret.push({query:queryList.zhida,type:ZHIDA_FLAG})
        }
        queryList.song.list.forEach(song=>{
          ret.push(creatSong(song))
        })
        return ret;
      },
      refresh(){
        this.$refs.suggest.refresh();
      },
      ...mapActions([
        'searchAction'
      ]),
      ...mapMutations({
        setSinger:"SET_SINGER"
      })
    },
    components:{
      Scroll,
      Loading,
      NoResult
    }
  }

</script>
<style scoped lang="stylus" rel="stylesheet/stylus">
  @import "~common/stylus/variable"
  @import "~common/stylus/mixin"

  .suggest
    height: 100%
    overflow: hidden
    .suggest-list
      padding: 0 30px
      .suggest-item
        display: flex
        align-items: center
        padding-bottom: 20px
      .icon
        flex: 0 0 30px
        width: 30px
        [class^="icon-"]
          font-size: 14px
          color: $color-text-d
      .name
        flex: 1
        font-size: $font-size-medium
        color: $color-text-d
        overflow: hidden
        .text
          no-wrap()
    .no-result-wrapper
      position: absolute
      width: 100%
      top: 50%
      transform: translateY(-50%)
</style>
