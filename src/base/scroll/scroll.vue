<template>
	<div ref="wrapper">
		<slot>
			
		</slot>
	</div>
</template>

<script>
	import BScroll from 'better-scroll'
	export default{
		props:{
			probeType:{
				type:Number,
				default:1
			},
			data:{
				type:Array,
				default:null
			},
			click:{
				type:Boolean,
				default:true
			},
			//是否监听滚动
			listenType:{
				type:Boolean,
				default:false
			}
		},
		mounted(){
			setTimeout(()=>{
				this._initScroll();
			},20)
		},
		methods:{
			_initScroll(){
				if(!this.$refs.wrapper){
					return;
				}
				this.scroll=new BScroll(this.$refs.wrapper,{
					//滚动列表可以点击触发事件
					click:this.click,
					//滚动类型1为Y轴滚动
					probeType:this.probeType
				})
				
				if(this.listenType){
					let me=this
					//pos指监听的Y值
					this.scroll.on('scroll',(pos)=>{
						me.$emit('scroll',pos)
					})
				}
				
			},
			disable(){
				this.scroll && this.scroll.disable();
			},
			enable(){
				this.scroll && this.scroll.enable();
			},
			refresh(){
				this.scroll && this.scroll.refresh();
			},
			//滚动到某个位置
			scrollTo(){
				this.scroll && this.scroll.scrollTo.apply(this.scroll,arguments);

			},
			//滚动到某个节点
			scrollToElement(){
				this.scroll && this.scroll.scrollToElement.apply(this.scroll,arguments);
			}
		},
		watch:{
			
			data(){
				setTimeout(()=>{
					this.refresh()
				},20)
			}
		}
	}
</script>

<style>
</style>