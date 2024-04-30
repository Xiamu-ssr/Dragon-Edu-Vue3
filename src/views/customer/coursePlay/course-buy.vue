<template>
  <el-dialog
    v-model="localValue.dialogVisible"
    width="500"
    align-center
    :show-close="false"
    :close-on-click-modal="false"
  >
    <div  v-if="localValue.active == 1">
      <el-row justify="center"><span style="font-size: 30px;margin-bottom: 20px">您确定要购买吗？</span></el-row>
      <el-row justify="center" style="display: flex;justify-content: center;align-items: center;">
          <el-button type="primary" style="margin:20px" @click="getPayCode">确定购买</el-button>
          <el-button type="danger" style="margin:20px" @click="localValue.dialogVisible = false">取消购买</el-button>
      </el-row>
    </div>
    <div v-else>
      <el-row style="display: flex;flex-direction: column; /* 设置子元素垂直排列 */;justify-content: center;align-items: center;">
        <el-image v-if="!!localValue.qrcode" :src="localValue.qrcode"/>
        <el-tag type="warning" size="large" effect="light">
          <span style="font-size: 20px;font-weight: bold">￥{{ localValue.courseBase.price }}</span>
        </el-tag>
      </el-row>
      <el-row style="margin-top: 40px;display: flex;justify-content: center;align-items: center;">
        <el-button style="margin-right: 40px" type="success" plain @click="getPayResult">我已支付</el-button>
        <el-button style="margin-left: 40px" type="info" plain @click="localValue.dialogVisible = false">取消支付</el-button>
      </el-row>
    </div>
  </el-dialog>
</template>
<script setup lang="ts">
import {PropType} from "vue";
import {generatePayCode, queryPayResult} from "@/api/order/pay";
import {CourseBaseVO} from "@/api/course/types";

//对外变量
const props = defineProps({
  dialogVisible: Object as PropType<boolean>,
  courseBase: Object as PropType<CourseBaseVO>
})
const emit = defineEmits(['update:dialogVisible','update:courseBase'])
//本地变量
const localValue = reactive({
  dialogVisible: computed({
    get: () => props.dialogVisible,
    set: (value) => emit('update:dialogVisible', value)
  }),
  courseBase: computed({
    get: () => props.courseBase,
    set: (value) => emit('update:courseBase', value)
  }),
  active: 1,
  qrcode: "",
  payNo: 0
})

const getPayCode = () =>{
  localValue.active=2;
  generatePayCode(localValue.courseBase.id).then(rsp=>{
    console.log(rsp)
    localValue.qrcode = rsp['data']['qrcode']
    localValue.payNo = rsp['data']['payNo']
  })
}

const getPayResult = () =>{
	queryPayResult(localValue.payNo).then(rsp=>{
		console.log(rsp)
		if (rsp['data'] == true){
			//订单已支付成功
		}else {
			//支付失败
		}
	})
}

watch(()=>localValue.dialogVisible, (newValue)=>{
  if (!newValue){
    localValue.active = 1;
  }
})


onMounted(()=>{
})


</script>

<style scoped lang="scss">

</style>
