<template>
  <div id="app">
    <div class="wrap">
 <router-view v-if="isRouterAlive"/>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',
  provide(){
    return{
      reload:this.reload
    }
  },
  data () {
    return {
      isRouterAlive: true
    }
  },
  methods: {
    reload () {
      this.isRouterAlive = false
      this.$nextTick(function() {
         this.isRouterAlive = true
      })
    }
  }
}
</script>

<style>
  #app{
    position: relative;
  }
  @media only screen and (min-width: 1200px) {
    .wrap{
      width: 65%;
      margin: 0 auto;
    }
  }
</style>
