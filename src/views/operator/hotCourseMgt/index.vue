<template>
	<div class="p-2"
		 style="display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;">
		<!--  热门课程  -->
		<el-card class="hot-card" shadow="hover" style="margin-bottom:32px">
			<transition :enter-active-class="proxy?.animate.searchAnimate.enter"
						:leave-active-class="proxy?.animate.searchAnimate.leave">
				<div v-show="showSearch" class="search">
					<el-form :inline="true" label-width="68px">
						<el-form-item label="课程名称" prop="name">
							<el-input v-model="hotPage.name" clearable placeholder="请输入课程名称"
									  style="width: 240px"/>
						</el-form-item>
						<el-form-item>
							<el-button icon="Search" type="primary" @click="reloadHot">搜索</el-button>
						</el-form-item>
					</el-form>
				</div>
			</transition>
			<el-table-v2
				v-model:sort-state="sortHotState"
				:columns="hotColumns"
				:data="hotList"
				:height="350"
				:row-height="120"
				:scrollbar-always-on="true"
				:width="1400"
				@column-sort="onHotSort"
				@end-reached="getCourseHotNextPage"
			>
				<template v-if="loadingHot" #overlay>
					<div
						class="el-loading-mask"
						style="display: flex; align-items: center; justify-content: center"
					>
						<el-icon :size="26" class="is-loading" color="var(--el-color-primary)">
							<loading-icon/>
						</el-icon>
					</div>
				</template>
			</el-table-v2>
		</el-card>

		<!--  非热门课程  -->
		<el-card class="not-hot-card" shadow="hover" style="margin-bottom:32px">
			<transition :enter-active-class="proxy?.animate.searchAnimate.enter"
						:leave-active-class="proxy?.animate.searchAnimate.leave">
				<div v-show="showSearch" class="search">
					<el-form :inline="true" label-width="68px">
						<el-form-item label="课程名称" prop="name">
							<el-input v-model="notHotPage.name" clearable placeholder="请输入课程名称"
									  style="width: 240px"/>
						</el-form-item>
						<el-form-item>
							<el-button icon="Search" type="primary" @click="reloadNotHot">搜索</el-button>
						</el-form-item>
					</el-form>
				</div>
			</transition>
			<el-table-v2
				v-model:sort-state="sortNotHotState"
				:columns="notHotColumns"
				:data="notHotList"
				:height="450"
				:row-height="120"
				:scrollbar-always-on="true"
				:width="1400"
				@column-sort="onNotHotSort"
				@end-reached="getCourseNotHotNextPage"
			>
				<template v-if="loadingNotHot" #overlay>
					<div
						class="el-loading-mask"
						style="display: flex; align-items: center; justify-content: center"
					>
						<el-icon :size="26" class="is-loading" color="var(--el-color-primary)">
							<loading-icon/>
						</el-icon>
					</div>
				</template>
			</el-table-v2>
		</el-card>
	</div>
</template>

<script lang="tsx" name="hotCourseMgt" setup>
import {CourseBaseVO} from '@/api/course/types';
import {addHot, delHot, getESCourseData} from "@/api/course/Hot";
import {Column, ElImage, ElRate, ElSwitch, ElTag, SortBy, SortState, TableV2SortOrder} from "element-plus";
import {InfoFilled, Loading as LoadingIcon} from '@element-plus/icons-vue'
import {CourseQueryBo} from "@/api/course/Hot/types";
import {getCategory} from "@/utils/my";
import {showCategoryById} from "@/utils/my";

const testValue = ref(4.2)
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const {course_status} = toRefs<any>(proxy?.useDict("course_status"));

const buttonLoading = ref(false);

const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);

//文件
const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;
const categoryList = ref([])

interface CourseBaseExtraHotVo extends CourseBaseVO {
	isHot: boolean;
}

//热门课程数据
const loadingHot = ref(false)
const hotPage = reactive<CourseQueryBo>({
	pageNum: 0,
	pageSize: 3,
	total: 0,
	name: undefined,
	mt: undefined,
	st: undefined,
	charge: undefined,
	isHot: true,
	orderByParam: {
		order: undefined,
		sort: undefined
	}
});
const hotList = ref<CourseBaseExtraHotVo[]>([]);
const hotColumns: Column<any>[] = [
	{
		key: 'name',
		dataKey: 'name',
		title: '课程名称',
		width: 150,
		cellRenderer: ({cellData}) => <div v-html={cellData}></div>,
	},
	{
		key: 'category',
		title: '分类',
		width: 150,
		align: 'center',
		cellRenderer: ({rowData}) => <p>{showCategoryById(categoryList.value, rowData ['mt'], rowData ['st'], 1)}</p>,
	},
	{
		key: 'pic',
		dataKey: 'pic',
		title: '图片',
		width: 160,
		align: 'center',
		cellRenderer: ({cellData}) =>
			<ElImage
				src={fileBaseUrl + cellData}
				fit="fill"
				style={{width: '100px', height: '100px'}}
			/>,
	},
	{
		key: 'charge',
		dataKey: 'charge',
		title: '是否付费',
		width: 150,
		align: 'center',
		cellRenderer: ({cellData}) => <ElTag
			type={cellData ? 'warning' : 'primary'}>{cellData ? '付费' : '免费'}</ElTag>,
	},
	{
		key: 'originalPrice',
		dataKey: 'originalPrice',
		title: '原价',
		width: 150,
		align: 'center',
		cellRenderer: ({rowData}) => <del>{rowData['charge'] ? rowData['originalPrice'] : '0.00'}</del>,
	},
	{
		key: 'price',
		dataKey: 'price',
		title: '现价',
		width: 150,
		align: 'center',
		sortable: true,
		cellRenderer: ({rowData}) => <p>{rowData['charge'] ? rowData['price'] : '0.00'}</p>,
		headerCellRenderer: ({column}) =>
			<div style="align-items: center;display: flex;">
				<p>现价</p>
				<el-tooltip content="多个排序以最后一次点击为准">
					<el-icon><InfoFilled/></el-icon>
				</el-tooltip>
			</div>
	},
	{
		key: 'star',
		dataKey: 'star',
		title: '评分',
		width: 200,
		align: 'center',
		sortable: true,
		cellRenderer: ({cellData}) =>
			<ElRate
				modelValue={cellData}
				show-score
				text-color="#ff9900"
				score-template={`${cellData} points`}
				disabled
			/>,
		headerCellRenderer: ({column}) =>
			<div style="align-items: center;display: flex;">
				<p>评分</p>
				<el-tooltip content="多个排序以最后一次点击为准">
					<el-icon><InfoFilled/></el-icon>
				</el-tooltip>
			</div>
	},
	{
		key: 'controller',
		dataKey: 'isHot',
		title: '操作',
		width: 200,
		align: 'center',
		cellRenderer: ({cellData, rowData, rowIndex}) =>
			<ElSwitch
				v-model={cellData}
				onUpdate:modelValue={(newVal) => rowData.isHot = newVal}
				active-text="热门"
				inactive-text="非热门"
				onChange={() => switchChangeHot(rowData.isHot, rowData.id)}
			/>
	}
]
const sortHotState = ref<SortState>({
	'price': TableV2SortOrder.DESC,
	'star': TableV2SortOrder.DESC,
})
const onHotSort = ({key, order}: SortBy) => {
	console.log(key, order)
	sortHotState.value[key] = order
	let sort = order + "";
	hotPage.orderByParam.order = key + "";
	hotPage.orderByParam.sort = sort.toUpperCase();
	reloadHot();
}

//非热门课程数据
const loadingNotHot = ref(false)
const notHotPage = reactive<CourseQueryBo>({
	pageNum: 0,
	pageSize: 6,
	total: 0,
	name: undefined,
	mt: undefined,
	st: undefined,
	charge: undefined,
	isHot: false,
	orderByParam: {
		order: undefined,
		sort: undefined
	}
});
const notHotList = ref<CourseBaseExtraHotVo[]>([]);
const notHotColumns: Column<any>[] = [
	{
		key: 'name',
		dataKey: 'name',
		title: '课程名称',
		width: 150,
		cellRenderer: ({cellData}) => <div v-html={cellData}></div>,
	},
	{
		key: 'category',
		title: '分类',
		width: 150,
		align: 'center',
		cellRenderer: ({rowData}) => <p>{showCategoryById(categoryList.value, rowData ['mt'], rowData ['st'], 1)}</p>,
	},
	{
		key: 'pic',
		dataKey: 'pic',
		title: '图片',
		width: 160,
		align: 'center',
		cellRenderer: ({cellData}) =>
			<ElImage
				src={fileBaseUrl + cellData}
				fit="fill"
				style={{width: '100px', height: '100px'}}
			/>,
	},
	{
		key: 'charge',
		dataKey: 'charge',
		title: '是否付费',
		width: 150,
		align: 'center',
		cellRenderer: ({cellData}) => <ElTag
			type={cellData ? 'warning' : 'primary'}>{cellData ? '付费' : '免费'}</ElTag>,
	},
	{
		key: 'originalPrice',
		dataKey: 'originalPrice',
		title: '原价',
		width: 150,
		align: 'center',
		cellRenderer: ({rowData}) => <del>{rowData['charge'] ? rowData['originalPrice'] : '0.00'}</del>,
	},
	{
		key: 'price',
		dataKey: 'price',
		title: '现价',
		width: 150,
		align: 'center',
		sortable: true,
		cellRenderer: ({rowData}) => <p>{rowData['charge'] ? rowData['price'] : '0.00'}</p>,
		headerCellRenderer: ({column}) =>
			<div style="align-items: center;display: flex;">
				<p>现价</p>
				<el-tooltip content="多个排序以最后一次点击为准">
					<el-icon><InfoFilled/></el-icon>
				</el-tooltip>
			</div>
	},
	{
		key: 'star',
		dataKey: 'star',
		title: '评分',
		width: 200,
		align: 'center',
		sortable: true,
		cellRenderer: ({cellData}) =>
			<ElRate
				modelValue={cellData}
				show-score
				text-color="#ff9900"
				score-template={`${cellData} points`}
				disabled
			/>,
		headerCellRenderer: ({column}) =>
			<div style="align-items: center;display: flex;">
				<p>评分</p>
				<el-tooltip content="多个排序以最后一次点击为准">
					<el-icon><InfoFilled/></el-icon>
				</el-tooltip>
			</div>
	},
	{
		key: 'controller',
		dataKey: 'isHot',
		title: '操作',
		width: 200,
		align: 'center',
		cellRenderer: ({cellData, rowData, rowIndex}) =>
			<ElSwitch
				v-model={cellData}
				onUpdate:modelValue={(newVal) => rowData.isHot = newVal}
				active-text="热门"
				inactive-text="非热门"
				onChange={() => switchChangeNotHot(rowData.isHot, rowData.id)}
			/>
	}
]
const sortNotHotState = ref<SortState>({
	'price': TableV2SortOrder.DESC,
	'star': TableV2SortOrder.DESC,
})
const onNotHotSort = ({key, order}: SortBy) => {
	console.log(key, order)
	sortNotHotState.value[key] = order
	let sort = order + "";
	notHotPage.orderByParam.order = key + "";
	notHotPage.orderByParam.sort = sort.toUpperCase();
	reloadNotHot();
}


/**===================================================================================================搜索区域          */
/** 查询热门课程下一页数据 */
const getCourseHotNextPage = async () => {
	loadingHot.value = true;
	if (hotPage.pageNum == 0) {
		hotPage.pageNum = 1
	} else if (hotPage.pageNum < Math.ceil(hotPage.total / hotPage.pageSize)) {
		hotPage.pageNum++;
	} else {
		proxy?.$modal.msgWarning("已经翻到底啦！")
		loadingHot.value = false;
		return;
	}
	getESCourseData(hotPage).then(rsp => {
		console.log("getESCourseData", rsp);
		hotList.value.push(...rsp.list);
		hotPage.total = rsp.total;
	}).finally(() => {
		loadingHot.value = false;
	})
}

const switchChangeHot = async (newVal: boolean, id: string): void => {
	if (newVal) {
		proxy?.$modal.msgWarning("热门课程无法开启为热门课程，请勿失误操作")
	}
	loadingHot.value = true;
	await delHot(id).then(rsp => {

	})
	//刷新兩種數據
	reloadAllData()
}

/** 查询非热门课程下一页数据 */
const getCourseNotHotNextPage = async () => {
	loadingNotHot.value = true;
	if (notHotPage.pageNum == 0) {
		notHotPage.pageNum = 1
	} else if (notHotPage.pageNum < Math.ceil(notHotPage.total / notHotPage.pageSize)) {
		notHotPage.pageNum++;
	} else {
		proxy?.$modal.msgWarning("已经翻到底啦！")
		loadingNotHot.value = false;
		return;
	}
	getESCourseData(notHotPage).then(rsp => {
		console.log("getESCourseData", rsp);
		notHotList.value.push(...rsp.list);
		notHotPage.total = rsp.total;

	}).finally(() => {
		loadingNotHot.value = false;
	})
}

const switchChangeNotHot = async (newVal: boolean, id: string): void => {
	if (!newVal) {
		proxy?.$modal.msgWarning("非热门课程无法关闭为非热门课程，请勿失误操作")
	}
	loadingNotHot.value = true;
	await addHot(id).then(rsp => {

	})
	//刷新兩種數據
	reloadAllData()
}

/**
 * 刷新热门课程数据和非热门课程数据
 * */
const reloadAllData = () => {
	reloadHot();
	reloadNotHot();
}
const reloadHot = () => {
	//刷新热门数据
	loadingHot.value = true;
	hotPage.pageNum = 0;
	hotList.value = []
	getCourseHotNextPage().then(rsp => {

	}).finally(() => {
			loadingHot.value = false;
		}
	)
}
const reloadNotHot = () => {
	//刷新非热门数据
	loadingNotHot.value = true;
	notHotPage.pageNum = 0;
	notHotList.value = []
	getCourseNotHotNextPage().then(rsp => {

	}).finally(() => {
			loadingNotHot.value = false;
		}
	)
}

/**=================================================================================================表格操作 */


onMounted(async () => {
	await getCategory(proxy).then(rsp => {
		categoryList.value = rsp
	});
	reloadAllData()
});
</script>

<style scoped>
:deep(.example-showcase .el-table-v2__overlay) {
	z-index: 9 !important;
}

:deep(.hot-card) {
	background-image: url("@/assets/svg/wave_red.svg");
	background-repeat: no-repeat;
	background-size: cover; /* 或使用 100% 100% 来确保完全覆盖 */
	background-position: center; /* 根据需要调整 */
	overflow: hidden; /* 避免内容溢出 */
}

:deep(.not-hot-card) {
	background-image: url("@/assets/svg/wave_blue.svg");
	background-repeat: no-repeat;
	background-size: cover; /* 或使用 100% 100% 来确保完全覆盖 */
	background-position: center; /* 根据需要调整 */
	overflow: hidden; /* 避免内容溢出 */
}


</style>
