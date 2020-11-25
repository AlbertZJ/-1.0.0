<template>
  <div>
    <img v-bind:src="flowPic" />
  </div>
</template>
<script>
import {diagram} from '@/api/flowables/task'
export default {
  data(){
    return{
      flowPic:undefined,
      flowImgParamData:"297e080b742446ee017424496cbe0001"
    }
  },
  created(){
    this.find()
  },
  methods:{
    find(){
      diagram(this.flowImgParamData).then((res) => {
        const blob='data:image/png;base64,' + btoa(new Uint8Array(res.data).reduce((data, byte) => data + String.fromCharCode(byte), ''))
        // const blob=new Blob([res],{type:'image/png'})
          const url =window.URL.createObjectURL(blob)
          this.flowPic = url
           this.$alert("url:"+this.flowPic)
      }).catch(err => {

        this.$Message.error({
          content: '图片加载失败',
        })
      })
    }
  }
}
</script>
