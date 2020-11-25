<template>
  <div>
    <img th:src="flowPic" />
  </div>
</template>
<script>
import diagram from '@/api/flowables/task'
export default {
  data(){
    return{
      flowPic:undefined,
      flowImgParamData:"297e080b742446ee017424496cbe0001"
    }
  },
  created:{
    find()
  },
  methods:{
    find(){
      this.flowPic="/flowable/task/diagram/297e080b742446ee017424496cbe0001"
      // diagram(this.flowImgParamData).then((res) => {
      //     let url = window.URL.createObjectURL(res)
      //     this.flowPic = url
      // }).catch(err => {

      //   this.$Message.error({
      //     content: '图片加载失败',
      //   })
      // })
    }
  }
}
</script>
