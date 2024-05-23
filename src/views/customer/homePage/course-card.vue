<template>
  <div
    id="card"
    style="padding: 5px;margin: 20px"
	@click="toCoursePlay(courseBase?.id)"
  >
    <el-card
      shadow="hover"
      style="width: 350px; border-radius: 10px;"
    >
      <div class="wave-orange-card"></div>
      <div style="display: flex;flex-direction: column;justify-content: center;align-items: center;">
        <el-image
          :src="fileBaseUrl+courseBase?.pic"
          fit="fill"
          style="width: 200px"
        />
      </div>
      <div style="height: 36px; font-size: 20px;margin-top: 6px">
        <span v-html="courseBase.name"></span>
      </div>
      <div style="height: 40px; ">
        <!--这里不能使用星级，因为数据来源于es，用户评分不可能实时更新，容易造成疑惑-->
        <!--<el-rate-->
        <!--  v-model="courseBase.star"-->
        <!--  size="large"-->
        <!--  show-score-->
        <!--  text-color="#ff9900"-->
        <!--  :score-template="courseBase.star.toString() + 'points'"-->
        <!--  disabled-->
        <!--/>-->
        <el-progress :text-inside="true" :stroke-width="26" :percentage="courseBase?.star * 20" :color="customColors">
          <template #default="{ percentage }">
            推荐指数&nbsp;{{ (percentage).toFixed(2) }}%
          </template>
        </el-progress>
      </div>
      <div style="height: 40px;">
        <el-tag v-if="courseBase.charge" type="warning" size="large" effect="light">
          <span style="font-size: 20px;font-weight: bold">￥{{ courseBase.price }}</span>
          &nbsp;&nbsp;
          <span class="slash-deleted-text" style="font-size: 14px;color: #909399">{{ courseBase.originalPrice }}</span>
        </el-tag>
        <el-tag v-else type="success" size="large"><span style="font-size: 20px">免费</span></el-tag>
        <span>&nbsp;&nbsp; 6w人报名</span>
      </div>
    </el-card>
  </div>
</template>

<script lang="ts" setup>
import {CourseBaseVO} from "@/api/course/types";
import {PropType} from "vue";
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;
interface CourseBaseExtraHotVo extends CourseBaseVO {
  isHot: boolean;
}
const props = defineProps({
  courseBase: Object as PropType<CourseBaseExtraHotVo>,
});
const emit = defineEmits(['update:courseBase'])

const customColors = [
  { color: '#909399', percentage: 20 },
  { color: '#67C23A', percentage: 40 },
  { color: '#409EFF', percentage: 60 },
  { color: '#E6A23C', percentage: 80 },
  { color: '#F56C6C', percentage: 100 },
]

const toCoursePlay = (courseId:string | number | undefined) =>{
	if (courseId == undefined){
		proxy?.$modal.msgWarning("网络貌似开小差了，请刷新页面")
		return
	}
	proxy?.$tab.openPage("/coursePlay", "", {courseId:courseId});
}


</script>

<style scoped>

/* 卡片图片背景 */
:deep(.wave-orange-card){
  background-image: url("@/assets/svg/wave_orange.svg");
  background-repeat: no-repeat;
  background-size: cover; /* 或使用 100% 100% 来确保完全覆盖 */
  background-position: center; /* 根据需要调整 */
  overflow: hidden; /* 避免内容溢出 */
  position: absolute; /* 固定定位，不随滚动条移动 */
  width: 310px; /* card的宽度为350 */
  height: 200px; /*pic的大小为200*200*/
  opacity: 0.6;
}

/* 删除线 */
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

/* 卡片背景 */
:deep(:root) {
  --margin: 100px;
  /* 上演一出黄金分割率的好戏 */
  --card-width: 360px;
  /* 上演一出黄金分割率的好戏 */
  --card-height: calc(var(--card-height) * 1.618);
}

#card{
  width: var(--card-width);
  height: var(--card-height);
  position: relative;
  cursor: pointer;
  transition: transform 0.4s ease; /* 设置放大动画的过渡效果为2秒 */
}

/* 定义自定义属性 --rotate */
@property --rotate{
  /* 自定义属性的默认值 */
  initial-value: 90deg;
  /*
  定义自定义属性允许的语法结构，
  此处定义该元素仅接受角度值。
  */
  syntax: '<angle>';
  /* 定义该自定义属性是否允许被其他元素所继承 */
  inherits: false;
}

/* 定义动画 */
@keyframes edge{
  from{
    --rotate: 0deg;
  }
  to{
    --rotate: 360deg;
  }
}

#card::before{
  content: '';
  width: 104%;
  height: 102%;
  background: linear-gradient(var(--rotate),
  rgb(44, 251, 255), rgb(81, 154, 255), rgb(97, 57, 242));
  position: absolute;
  z-index: -1;
  top: -1%;
  left: -2%;
  /* 设置边框圆角半径 */
  border-radius: 0.5vw;
  /*
  为当前元素指定使用的动画，并将该动画的
  持续时间设置为 3.5s，动画速度保持不变，
  动画播放次数为无限次。
  */
  animation: edge 10s linear infinite;
}

#card::after{
  content: '';
  width: 80%;
  height: 100%;
  background: linear-gradient(var(--rotate),
  rgb(44, 251, 255), rgb(81, 154, 255), rgb(97, 57, 242));
  position: absolute;
  top: 5%;
  left: 10%;
  filter: blur(2vw);
  z-index: -1;
  /* 使用动画 */
  animation: edge 3.5s linear infinite;
}

/* 卡片悬浮变化背景 */
#card:hover {
  transform: scale(1.02); /* 鼠标悬浮时放大到1.1倍 */
}

#card::before, #card::after {
  transition: background 1s ease; /* 将过渡应用于background，确保背景渐变的平滑变化 */
}

#card:hover::before, #card:hover::after {
  background: linear-gradient(var(--rotate), #f82747, #fc5c7c, #ffc3d3); /* 渐变为淡红色 */
}

</style>
