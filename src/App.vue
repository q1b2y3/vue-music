<template>
  <div id="app">
  	
		<m-header></m-header>
		
  	<tab></tab>
  	<!--显示切换的tab-->
  	<keep-alive>
  		<router-view></router-view>
  	</keep-alive>
  	
  	<player></player>
    <!--<img src="./assets/logo.png">
    <router-view></router-view>-->
  </div>
</template>



<script type="text/ecmascript-6">
	
import MHeader from 'components/m-header/m-header'
import Tab from 'components/tab/tab'
import Player from 'components/player/player'

export default {
  name: 'app',
  components: {
  	MHeader, 
  	Tab,
  	Player
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: white;
}
</style>
