<template>
	<div class="singer" ref="singer">
		<list-view :data="singerList" ref="list" @select="select" ></list-view>
		
		<router-view></router-view>
	</div>
</template>

<script>
	import {getSinger} from 'api/getSinger'
	import {ERR_OK} from 'common/js/config'
	import Singer from 'common/js/singer'
	import ListView from 'base/listview/listview'
	//把singer写入的话  需要  把mapMutations进行引入
	import {mapMutations} from 'vuex'
	import {playListMixin} from 'common/js/mixin'
	
	const HOT_TITLE="热门"
	const HOT_LIMIT=10
	export default{
		mixins:[playListMixin],
		data(){
			return{
				singerList:[]
			}
		},
		created(){
			this._getSinger()
			
		},
		methods:{
			handlePlayList(playList){
				//如果playList 有值  那么就在这里增加 mini的高度
				let bottomHeight=playList.length>0?"50px":"";
				this.$refs.singer.style.bottom=bottomHeight;
				this.$refs.list.refresh();
			},
			select(singer){
				this.$router.push({
					path:`/singer/${singer.id}`,
				});
				this.setSinger(singer);
			},
			//获取数据
			_getSinger(){
				getSinger().then(req=>{
					if(req.code===ERR_OK){
						//this.singerList=req.data.list;
						//获取到歌手数据后才可以获取热门歌手   
						//所以_normalSinger方法必须在singerList方法之后才可以使用
						//this._normalSinger(this.singerList);
						this.singerList=this._normalSinger(req.data.list);
						//console.log(this.singerList)
					}
				})
			},
			//对获取的数据进行分类输出   热门歌手     字母分类歌手
			//增加hot map 记录热度
			_normalSinger(singerList){
				let map={
					hot:{
						//热门标题
						title:HOT_TITLE,
						//热门歌手
						items:[]
					}
				}
				//console.log(singerList)
				singerList.forEach((group,index)=>{
					//遍历前10个热门歌手
					if(index<HOT_LIMIT){
						map.hot.items.push(new Singer({
							id:group.Fsinger_id,
							name:group.Fsinger_name,
							imgid:group.Fsinger_mid
						}));
					
					}
					//console.log(map.hot.items);
					//按照字母取值
					let key=group.Findex
					if(!map[key]){
						map[key]={
							title:key,
							items:[]
						}
					}
					//遍历每个歌手的字母  放入map[key]中
					map[key].items.push(new Singer({
						id:group.Fsinger_id,
						name:group.Fsinger_name,
						imgid:group.Fsinger_mid
					}))
				});
				return this._mapSortToMap(map);
			},
			//对歌手进行排序
			_mapSortToMap(mapList){
				let ret=[];   //字母数组
				let hot=[];    //热门数组
				let other=[];   //其他的
				
				for(let key in mapList){
					let val=mapList[key];
					//用来匹配title  为a-zA-Z的字母
					if(val.title.match(/[a-zA-Z]/)){
						ret.push(val);
					}
					else if(val.title.match(/[0-9]/)){
					}
					else{
						hot.push(val);
					}
				}
				//按照title的升序  进行排序
				ret.sort((a,b)=>{
					return a.title.charCodeAt(0) - b.title.charCodeAt(0)
				});
				//热门--->字母
				return hot.concat(ret);
			},
			...mapMutations({
				setSinger:'SET_SINGER'
			})
		},
		components:{
			Singer,
			ListView
		}
	}
</script>


<style scoped lang="stylus" rel="stylesheet/stylus">
  .singer
    position: fixed
    top: 88px
    bottom: 0
    width: 100%
</style>