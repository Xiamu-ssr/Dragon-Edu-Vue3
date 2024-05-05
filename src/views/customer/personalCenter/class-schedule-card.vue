<template>
	<el-row style="width: 100%;display: flex;justify-content: center;align-items: center;">
		<el-col :span="10">
			<div style="font-size: 24px">
				{{ localValue.courseInfo?.courseName }}
			</div>
		</el-col>
		<el-col :span="6">
			<div style="width: 100%;">
				<el-progress type="dashboard" :percentage="localValue.percentageShow" :color="localValue.colors" width="100" :duration="1000">
					<template #default="{ percentage }">
						<span>已学习{{ localValue.percentageLast }} 分钟</span>
					</template>
				</el-progress>
			</div>
		</el-col>
		<el-col :span="4">
			<el-button type="primary" plain @click="toCoursePlay">进入学习页面</el-button>
		</el-col>
	</el-row>
</template>
<script setup lang="ts">
import {PropType} from "vue";
import {ScheduleVO} from "@/api/learn/schedule/types";
const {proxy} = getCurrentInstance() as ComponentInternalInstance;

//对外变量
const props = defineProps({
	courseInfo: Object as PropType<ScheduleVO>
})
const emit = defineEmits(['update:courseInfo'])
//本地变量
const localValue = reactive({
	courseInfo: computed({
		get: () => props.courseInfo,
		set: (value) => {}
	}),
	percentageLast: 0,//最终的学习时长，显示文字
	percentageReal: 0,//真实学习时长，备份用
	percentageShow: 0,//动画动态时长，显示动画
	colors: [
		{ color: '#F56C6C', percentage: 20 },
		{ color: '#ED8754', percentage: 40 },
		{ color: '#E6A23C', percentage: 60 },
		{ color: '#A6B23B', percentage: 80 },
		{ color: '#67C23A', percentage: 100 },
	],

})

const toCoursePlay = () =>{
	if (localValue.courseInfo?.courseId == undefined){
		proxy?.$modal.msgWarning("网络貌似开小差了，请刷新页面")
		return
	}
	proxy?.$tab.openPage("/coursePlay", "", {courseId:localValue.courseInfo.courseId});
}


onMounted(() => {
	localValue.percentageReal = localValue.courseInfo.learningTime

	let interval = setInterval(() => {
		if (localValue.percentageReal == null){
			localValue.percentageShow = 0;
			clearInterval(interval);
		}else if (localValue.percentageShow >= 100){
			localValue.percentageShow -= 100;
            localValue.percentageReal -= 100;
		} else if (localValue.percentageShow < localValue.percentageReal){
			const step = (localValue.percentageShow+10) < localValue.percentageReal ? 10 : (localValue.percentageReal-localValue.percentageShow)
			localValue.percentageShow = localValue.percentageShow + step
			localValue.percentageLast = localValue.percentageLast + step;
		}else {
			clearInterval(interval);
		}
	}, 300);
})

</script>
<style scoped lang="scss">

</style>
