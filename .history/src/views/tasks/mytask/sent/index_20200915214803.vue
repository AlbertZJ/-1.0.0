<template>
  <div>
    <img src="/flowable/task/diagram/297e080b742446ee017424496cbe0001" />
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
        const blob=new Blob([res],{type:'image/png'})
          // const url =window.URL.createObjectURL(blob)
          // this.flowPic = url
          //  this.$alert("url:"+this.flowPic)
      }).catch(err => {

        this.$Message.error({
          content: '图片加载失败',
        })
      })
    }
  }
}
</script>
