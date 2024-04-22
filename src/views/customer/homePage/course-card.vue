<template>
  <el-card
    shadow="hover"
    style="width: 380px;margin: 10px; border-radius: 10px"
  >
    <div class="wave-orange-card"></div>
    <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
      <el-image
        :src="fileBaseUrl+courseBase.pic"
        fit="fill"
        style="width: 200px"
      />
    </div>
    <div style="height: 30px; font-size: 20px;margin-top: 10px">
      <span>{{ courseBase.name }}</span>
    </div>
    <div style="height: 40px; ">
      <el-rate
        v-model="courseBase.star"
        size="large"
        show-score
        text-color="#ff9900"
        :score-template="courseBase.star.toString() + 'points'"
        disabled
      />
    </div>
    <div style="height: 40px; ">
      <el-tag v-if="courseBase.charge" type="warning" size="large" effect="light">
        <span style="font-size: 20px;font-weight: bold">￥{{ courseBase.price }}</span>
        &nbsp;&nbsp;
        <span class="slash-deleted-text" style="font-size: 14px;color: #909399">{{ courseBase.originalPrice }}</span>
      </el-tag>
      <el-tag v-else type="success" size="large"><span style="font-size: 20px">免费</span></el-tag>
      <span>&nbsp;&nbsp; 6w人报名</span>
    </div>
  </el-card>
</template>

<script lang="ts" setup>

import {CourseBaseVO} from "@/api/course/types";
import {PropType} from "vue";

const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;
interface CourseBaseExtraHotVo extends CourseBaseVO {
  isHot: boolean;
}
const props = defineProps({
  courseBase: Object as PropType<CourseBaseExtraHotVo>,
});
const emit = defineEmits(['update:courseBase'])


</script>

<style scoped>
:deep(.wave-orange-card){
  background-image: url("src/assets/svg/wave_orange.svg");
  background-repeat: no-repeat;
  background-size: cover; /* 或使用 100% 100% 来确保完全覆盖 */
  background-position: center; /* 根据需要调整 */
  overflow: hidden; /* 避免内容溢出 */
  position: absolute; /* 固定定位，不随滚动条移动 */
  width: 340px; /* card的宽度为380 */
  height: 200px; /*pic的大小为200*200*/
  opacity: 0.6;
}
:deep(.slash-deleted-text) {
  position: relative;
  overflow: hidden; /* 防止斜线溢出容器 */
}

:deep(.slash-deleted-text::after) {
  content: '';
  position: absolute;
  left: 0;
  top: 10%; /* 调整为文本高度的一半 */
  width: 100%; /* 与容器同宽 */
  border-bottom: 1px solid #F56C6C; /* 删除线的样式 */
  transform: rotate(25deg); /* 调整角度为倾斜 */
  transform-origin: left bottom;
}
</style>
