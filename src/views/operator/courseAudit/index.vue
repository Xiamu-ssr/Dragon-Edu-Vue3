<template>
	<div class="p-2">
		<transition :enter-active-class="proxy?.animate.searchAnimate.enter"
					:leave-active-class="proxy?.animate.searchAnimate.leave">
			<div v-show="showSearch" class="search">
				<el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="68px">
					<el-form-item label="课程名称" prop="name">
						<el-input v-model="queryParams.name" clearable placeholder="请输入课程名称" style="width: 240px"
								  @keyup.enter="handleQuery"/>
					</el-form-item>
					<el-form-item label="大分类" prop="mt">
						<el-select
							v-model="queryParams.mt"
							clearable
							placeholder="请输入大分类"
						>
							<el-option
								v-for="item in categoryList"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</el-form-item>
					<!--          <el-form-item label="小分类" prop="st">-->
					<!--            <el-input v-model="queryParams.st" placeholder="请输入小分类" clearable style="width: 240px" @keyup.enter="handleQuery" />-->
					<!--          </el-form-item>-->
					<el-form-item>
						<el-button icon="Search" type="primary" @click="handleQuery">搜索</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</transition>

		<el-card shadow="never">

			<el-table v-loading="loading" :data="baseList" @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="55"/>
				<!--        <el-table-column v-if="true" align="center" label="主键" prop="id"/>-->
				<el-table-column align="center" label="课程名称" prop="name"/>
				<!--        <el-table-column align="center" label="课程标签" prop="tags"/>-->
				<el-table-column align="center" label="分类">
					<template #default="scope">
						{{ showCategoryById(categoryList, scope.row.mt, scope.row.st, 1) }}
					</template>
				</el-table-column>
				<el-table-column align="center" label="课程图片" prop="pic">
					<template #default="scope">
						<el-image :src="fileBaseUrl+scope.row.pic" fit="fill" style="width: 100px; height: 100px"/>
					</template>
				</el-table-column>
				<el-table-column align="center" label="课程状态" prop="status">
					<template #default="scope">
						<dict-tag :options="course_status" :value="scope.row.status"/>
					</template>
				</el-table-column>
				<el-table-column align="center" label="审核意见" prop="mind"/>
				<el-table-column align="center" class-name="small-padding fixed-width" label="操作">
					<template #default="scope">
						<el-tooltip content="查看" placement="top">
							<el-button icon="View" link type="primary" @click=""></el-button>
						</el-tooltip>
						<el-tooltip content="通过" placement="top">
							<el-button icon="Select" link type="success" @click="handlePass(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip content="不通过" placement="top">
							<el-button icon="CloseBold" link type="danger"
									   @click="()=>{rejectBo.mind='';rejectBo.id=scope.row.id;dialog.visible=true;}"></el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>

			<pagination
				v-show="total>0"
				v-model:limit="queryParams.pageSize"
				v-model:page="queryParams.pageNum"
				:total="total"
				@pagination="getList"
			/>
		</el-card>

		<!-- 审核不通过的意见	  -->
		<el-dialog
			v-model="dialog.visible"
			:title="dialog.title"
			align-center
			width="500"
		>
			<el-input
				v-model="rejectBo.mind"
				:rows="4"
				placeholder="请输入审核意见"
				style="width: 340px"
				type="textarea"
			/>
			<template #footer>
				<div class="dialog-footer">
					<el-button @click="dialog.visible = false">取消</el-button>
					<el-button type="primary" @click="handleReject">确定</el-button>
				</div>
			</template>
		</el-dialog>

	</div>
</template>

<script lang="ts" name="CourseAudit" setup>
import {coursePass, courseReject, listBase,} from '@/api/course/Audit';
import {CourseBaseVO} from '@/api/course/types';
import {globalHeaders} from "@/utils/request";
import {getCategory, showCategoryById} from "@/utils/my";

const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const {course_status} = toRefs<any>(proxy?.useDict("course_status"));
console.log(course_status.value)

const baseList = ref<CourseBaseVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const active = ref(0)

const queryFormRef = ref<ElFormInstance>();

const queryParams = reactive({
	pageNum: 1,
	pageSize: 10,
	name: undefined,
	mt: undefined,
	st: undefined,
	status: ""
});

const headers = ref(globalHeaders());
const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;
const categoryList = ref([])

//审核不通过
const dialog = reactive<DialogOption>({
	visible: false,
	title: ''
});
const rejectBo = reactive({
	"id": undefined,
	"mind": ""
});


/**===================================================================================================搜索区域          */
/** 查询课程列表 */
const getList = async () => {
	loading.value = true;
	//获取课程基本信息列表
	const res = await listBase(queryParams);
	baseList.value = res.rows;
	total.value = res.total;
	loading.value = false;
}

/** 搜索按钮操作 */
const handleQuery = () => {
	queryParams.pageNum = 1;
	getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
	queryFormRef.value?.resetFields();
	handleQuery();
}

/**=================================================================================================表格操作 */
/** 多选框选中数据 */
const handleSelectionChange = (selection: CourseBaseVO[]) => {
	ids.value = selection.map(item => item.id);
	single.value = selection.length != 1;
	multiple.value = !selection.length;
}

const handlePass = async (row: CourseBaseVO) => {
	await coursePass(row.id);
	getList();
}

const handleReject = async () => {
	await courseReject(rejectBo);
	getList();
	dialog.visible = false;
}


onMounted(async () => {
	getList();
	await getCategory(proxy).then(rsp => {
		categoryList.value = rsp
	});
});
</script>

<style scoped>
:deep(.avatar-uploader .avatar ) {
	width: 178px;
	height: 178px;
	display: block;
}

:deep(.avatar-uploader .el-upload ) {
	border: 1px dashed var(--el-border-color);
	border-radius: 6px;
	cursor: pointer;
	position: relative;
	overflow: hidden;
	transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover ) {
	border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon ) {
	font-size: 28px;
	color: #8c939d;
	width: 178px;
	height: 178px;
	text-align: center;
}
</style>
