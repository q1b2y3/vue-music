<template>
	<transition name="slide">
		<music-list :title="title" :rankFlag="rankFlag" :bgImg="bgImage" :songs="songs"></music-list>
	</transition>
</template>

<script>
	import {getRankList} from 'api/getRank'
	import {mapGetters} from 'vuex'
	import {ERR_OK} from 'common/js/config'
	import {creatSong} from 'common/js/song'
	import MusicList from 'components/music-list/music-list'
	
	
	export default{
		
		created(){
          this._getRankList();
      },
      data(){
        return{
          songs:[],
          rankFlag:true
        }
      },
      methods:{
        _getRankList(){
          getRankList(this.rank.id).then(req=>{
          	console.log(req);
              if(ERR_OK === req.code){
                this.songs = this._normalizeSongs(req.songlist);
               
              }
          })
        },
        _normalizeSongs(list) {
          let ret = []
          list.forEach((musicData) => {
            if (musicData.data.songid && musicData.data.albummid) {
              ret.push(creatSong(musicData.data))
            }
          })
          return ret
        }
      },
      computed:{
        bgImage(){
          if(this.songs.length>0){
            return this.songs[0].image;
          }
        },
        title(){
            return this.rank.topTitle
        },
        ...mapGetters([
          "rank"
        ])
      },
      components:{
        MusicList
      }
	}
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .slide-enter-active, .slide-leave-active
    transition: all 0.3s

  .slide-enter, .slide-leave-to
    transform: translate3d(100%, 0, 0)
</style>