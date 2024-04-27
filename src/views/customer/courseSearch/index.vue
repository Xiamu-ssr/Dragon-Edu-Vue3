<template>
	<div
		style="width: 100%;display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;font-family:CuHei;">
		<div class="wave-blue-card">
		</div>
		<div style="width: 1200px">
			<!-- Menu -->
			<PageHeader v-model:input="pageParams.name" @search-event="()=>{reloadCoursePageClear();}"/>
			<!-- category..queryParams -->
			<div
				style="height: 280px;background-color: white;color: #909399;border-radius: 20px;padding: 20px;margin-top: 20px">
				<div style="margin-top: 20px;font-size: 20px;color: #409EFF">课程大分类</div>
				<div class="mb-4" style="margin-top: 10px">
					<el-radio-group v-model="radio1" :disabled="loading" size="large" @change="categoryChange">
						<el-radio-button label="-1">全部</el-radio-button>
						<el-radio-button
							v-for="(SC, index) in categoryList"
							:label="index"
						>
							{{ SC.name }}
						</el-radio-button>
					</el-radio-group>
				</div>
				<div style="margin-top: 20px;font-size: 20px;color: #409EFF">课程小分类</div>
				<div class="mb-4" style="margin-top: 10px">
					<el-radio-group v-model="radio2" :disabled="loading" size="large" @change="categorySmallChange">
						<el-radio-button label="-1">全部</el-radio-button>
						<el-radio-button
							v-for="(LC, index) in categorySmallList"
							:label="index"
						>
							{{ LC.name }}
						</el-radio-button>
					</el-radio-group>
				</div>
			</div>
		</div>
		<!-- 分割线 -->
		<el-divider style="margin-top: 100px;">
			<el-tag effect="light"
					style="font-size: 30px;height: 50px;display: flex;justify-content: center;align-items: center;" type="primary">
				<el-icon size="20" style="width: 20px;">
					<Star/>
				</el-icon>
				<span>&nbsp;全部课程（共{{ pageParams.total }}个结果）&nbsp;</span>
				<el-icon size="20" style="width: 20px;">
					<Star/>
				</el-icon>
			</el-tag>
		</el-divider>
		<!-- 排序等条件 -->
		<div style="width: 1200px">
			<div style="float: left;display: flex;justify-content: center;align-items: center;">
				<el-radio-group v-model="pageParams.orderByParam.order" :disabled="loading" size="small"
								@change="orderChange">
					<el-radio-button label="-1">综合</el-radio-button>
					<el-radio-button label="star">评分</el-radio-button>
					<el-radio-button label="update_time">更新时间</el-radio-button>
					<el-radio-button label="price1">价格
						<el-icon :size="10"><CaretTop/></el-icon>
					</el-radio-button>
					<el-radio-button label="price2">价格
						<el-icon :size="10"><CaretBottom/></el-icon>
					</el-radio-button>
				</el-radio-group>
			</div>
			<div style="float: right">
				<el-checkbox-group v-model="checkboxGroup1" :disabled="loading" size="small" @change="chargeChange">
					<el-checkbox border label="yes">付费</el-checkbox>
					<el-checkbox border label="no">免费</el-checkbox>
				</el-checkbox-group>
			</div>
		</div>
		<!-- 课程搜索结果 -->
		<div class="flex flex-wrap" style="width: 1200px;margin-top: 80px">
			<el-skeleton :loading="loading" animated style="width: 360px;">
				<template #template>
					<div class="flex flex-wrap" style="width: 1200px;">
						<el-skeleton-item
							v-for="i in 6"
							style="width: 360px; height: 360px;padding: 5px;margin: 20px"
							variant="image"
						/>
					</div>
				</template>
				<template #default>
					<CourseCard
						v-for="(course, index) in courseList"
						:course-base="course"
					/>
				</template>
			</el-skeleton>
		</div>
		<!--页码 -->
		<el-pagination
			v-model:current-page="pageParams.pageNum"
			v-model:page-size="pageParams.pageSize"
			:total="pageParams.total"
			@current-change="getCoursePageClear"
			layout="prev, pager, next"
			background
			style="margin-top: 60px"
			:disabled="loading"
		/>
		<!-- 页脚 -->
		<PageFooter/>

	</div>
</template>

<script lang="ts" setup>
import PageHeader from "@/views/customer/homePage/page-header.vue";
import {listCategory} from "@/api/course/Open";
import {CourseQueryBo} from "@/api/course/Hot/types";
import {CourseBaseExtraHotVo} from "@/api/course/types";
import {useRoute} from "vue-router";
import {getESCourseData} from "@/api/es/Open";
import CourseCard from "@/views/customer/homePage/course-card.vue";
import PageFooter from "@/views/customer/homePage/page-footer.vue";
import {getCategory, sleep} from "@/utils/my";

const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();
//分类数据
const categoryList = ref([])
const categorySmallList = ref([])

//课程数据
const radio1 = ref("-1")
const radio2 = ref("-1")
const checkboxGroup1 = ref([])
const loading = ref(false)
const pageParamsDefault = <CourseQueryBo>{
	pageNum: 1,
	pageSize: 6,
	total: 0,
	name: undefined,
	mt: undefined,
	st: undefined,
	charge: undefined,
	isHot: undefined,
	orderByParam: {
		order: "-1",//这里提交前记得判断并置为undefined，保留-1字符串是为了单选框，同时price1和price2都是price也需要处理
		sort: "ASC"
	}
}
const pageParams = reactive<CourseQueryBo>({...pageParamsDefault});
const courseList = ref<CourseBaseExtraHotVo[]>([]);

/** =========================================================================================================== 条件变化选择  */
/** 大分类变化 */
const categoryChange = (index: number) => {
	console.log("categoryChange")
	if (index == -1) {
		pageParams.mt = undefined;
		categorySmallList.value = []
	} else {
		pageParams.mt = categoryList.value[index].id;
		//更新小分类
		categorySmallList.value = categoryList.value[index].children
	}
	//同时置空小分类数据
	radio2.value = "-1"
	pageParams.st = undefined
	reloadCoursePageClear();
}
/** 小分类变化 */
const categorySmallChange = (index: number) => {
	console.log("categorySmallChange")
	if (index == -1) {
		pageParams.st = undefined;
	} else {
		pageParams.st = categorySmallList.value[index].id;
	}
	reloadCoursePageClear();
}
/** 排序变化 */
const orderChange = (value: string) => {
	if (value == "price2") {
		pageParams.orderByParam.sort = 'DESC';
	} else {
		pageParams.orderByParam.sort = 'ASC';
	}
	reloadCoursePageClear();
}
/** 付费规则变化 */
const chargeChange = (value: []) => {
	if (value.length == 0 || value.length == 2) {
		pageParams.charge = undefined;
	} else if (value.length == 1 && value[0] == 'yes') {
		pageParams.charge = true;
	} else if (value.length == 1 && value[0] == 'no') {
		pageParams.charge = false;
	} else {
		pageParams.charge = undefined;
	}
	reloadCoursePageClear();
}

/** ==============================================================================================================数据查询*/
const getCoursePage = async (pageParamsTmp: any) => {
	if (pageParamsTmp.pageNum == 1) {
	} else if (pageParamsTmp.pageNum < 1) {
		proxy?.$modal.msgWarning("再怎么往前翻也翻不过去！")
		return;
	} else if (pageParamsTmp.pageNum > Math.ceil(pageParamsTmp.total / pageParamsTmp.pageSize)) {
		proxy?.$modal.msgWarning("已经翻到底啦！")
		return;
	}
	loading.value = true;
	getESCourseData(pageParamsTmp).then(rsp => {
		courseList.value = rsp.list;
		pageParams.total = rsp.total;
	}).finally(() => {
		sleep(500).then(() => {
			loading.value = false;
		})
	})
}

/** 查询条件不变时，查询课程数据，页码改变可以用这个 */
const getCoursePageClear = async () => {
	//清理pageParams
	let pageParamsTmp = JSON.parse(JSON.stringify(pageParams));
	if (pageParamsTmp.orderByParam.order == "-1") {
		pageParamsTmp.orderByParam.order = undefined;
	} else if (pageParamsTmp.orderByParam.order == "price1" || pageParamsTmp.orderByParam.order == "price2") {
		pageParamsTmp.orderByParam.order = "price";
	}
	if (pageParamsTmp.name != undefined && pageParamsTmp.name.trim() == "") {
		pageParamsTmp.name = undefined;
	}
	getCoursePage(pageParamsTmp);
}

/** 查询条件变化后，重新查询课程数据 */
const reloadCoursePageClear = () => {
	pageParams.pageNum = 1;
	// courseList.value = []
	getCoursePageClear();
}


onMounted(async () => {
	await getCategory(proxy).then(rsp => {
		categoryList.value = rsp
	});
	pageParams.name = route.query.name;
	reloadCoursePageClear();
})

</script>

<style lang="scss" scoped>
:deep(.wave-blue-card) {
	background-image: url("src/assets/svg/wave_blue_static.svg");
	background-repeat: no-repeat;
	background-size: cover; /* 或使用 100% 100% 来确保完全覆盖 */
	background-position: center; /* 根据需要调整 */
	overflow: hidden; /* 避免内容溢出 */
	position: absolute; /* 固定定位，不随滚动条移动 */
	top: 0;
	left: 0;
	width: 100%;
	height: 400px !important; /* 固定高度 */
	z-index: -1; /* 设置层级在最底下 */
}
</style>
