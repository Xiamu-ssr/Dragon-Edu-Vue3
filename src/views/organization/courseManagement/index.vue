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
					<el-form-item label="状态" prop="status">
						<el-select v-model="queryParams.status" clearable placeholder="课程状态">
							<el-option v-for="dict in course_status" :key="dict.value" :label="dict.label"
									   :value="dict.value"/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="handleQuery">搜索</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</transition>

		<el-card shadow="never">
			<template #header>
				<el-row :gutter="10" class="mb8">
					<el-col :span="1.5">
						<el-button icon="Plus" plain type="primary" @click="handleAdd">新增</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button :disabled="multiple" icon="Delete" plain type="danger" @click="handleDelete()">删除
						</el-button>
					</el-col>
					<el-col :span="1.5">
						<el-button icon="Download" plain type="warning" @click="handleExport">导出</el-button>
					</el-col>
					<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
				</el-row>
			</template>

			<el-table v-loading="loading" :data="baseList" @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="55"/>
				<!--        <el-table-column label="主键" align="center" prop="id" v-if="true" />-->
				<el-table-column align="center" label="课程名称" prop="name"/>
				<!--        <el-table-column label="课程标签" align="center" prop="tags" />-->
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
							<el-button icon="View" link type="primary" @click="handleView(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip content="修改" placement="top">
							<el-button :disabled="scope.row.status==CourseStatusEnum.UNDER_REVIEW" icon="Edit" link type="primary"
									   @click="handleUpdate(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip content="发布" placement="top">
							<el-button :disabled="scope.row.status==CourseStatusEnum.UNDER_REVIEW" icon="Promotion" link type="success"
									   @click="handlePublish(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip content="下架" placement="top">
							<el-button :disabled="scope.row.status!=CourseStatusEnum.REVIEW_PASSED" icon="ArrowDownBold" link type="warning"
									   @click="handleOffShelf(scope.row)"></el-button>
						</el-tooltip>
						<el-tooltip content="删除" placement="top">
							<el-button :disabled="scope.row.status==CourseStatusEnum.UNDER_REVIEW || scope.row.status==CourseStatusEnum.REVIEW_PASSED" icon="Delete" link type="danger"
									   @click="handleDelete(scope.row)"></el-button>
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
		<!-- 添加或修改课程对话框 -->
		<el-dialog v-model="dialog.visible" :close-on-click-modal="false" :show-close="false" :title="dialog.title"
				   append-to-body width="80%">
			<el-steps :active="active" align-center finish-status="success" style="max-width: 100%">
				<el-step title="基本信息"/>
				<el-step title="详细章节"/>
				<el-step title="授课老师"/>
			</el-steps>

			<!--  阶段一    -->
			<el-form v-show="active==0" ref="CourseBaseFormRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="课程名称" prop="name">
					<el-input v-model="form.name" placeholder="请输入课程名称"/>
				</el-form-item>
				<el-form-item label="课程标签" prop="tags">
					<el-tag
						v-for="tag in form.tags"
						:key="tag"
						:disable-transitions="false"
						closable
						@close="handleClose(tag)"
					>
						{{ tag }}
					</el-tag>
					<el-input
						v-if="inputVisible"
						ref="InputRef"
						v-model="inputValue"
						class="w-20"
						size="small"
						@blur="handleInputConfirm"
						@keyup.enter="handleInputConfirm"
					/>
					<el-button v-else class="button-new-tag" size="small" @click="showInput">
						+ New Tag
					</el-button>
				</el-form-item>
				<el-form-item label="大分类" prop="mt">
					<el-select
						v-model="form.mt"
						placeholder="Select"
						style="width: 240px;"
						@change="selectLargeCategory"
					>
						<el-option
							v-for="item in categoryList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						>
							<span style="float: left;">{{ item.name }}</span>
							<span style="float: right;color: #909399;font-size: 13px;">
                {{ item.description }}
              </span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="小分类" prop="st">
					<el-select
						v-model="form.st"
						placeholder="Select"
						style="width: 240px;"
					>
						<el-option
							v-for="item in categorySmallList"
							:key="item.id"
							:label="item.name"
							:value="item.id"
						>
							<span style="float: left;">{{ item.name }}</span>
							<span style="float: right;color: #909399FF;font-size: 13px;">
                {{ item.description }}
              </span>
						</el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="课程介绍" prop="description">
					<el-input v-model="form.description" placeholder="请输入内容" type="textarea"/>
				</el-form-item>
				<el-form-item label="课程图片" prop="pic">
					<!--          <el-input v-model="form.pic" type="textarea" placeholder="请输入内容" />-->
					<el-upload
						v-model:file-list="fileList"
						:action="uploadImgUrl"
						:before-upload="beforeAvatarUpload"
						:disabled="readOnly"
						:headers="headers"
						:limit="1"
						:on-remove="handleRemove"
						:on-success="handleAvatarSuccess"
						class="avatar-uploader"
						list-type="picture-card"
					>
						<el-icon>
							<Plus/>
						</el-icon>
					</el-upload>
				</el-form-item>
				<el-form-item label="是否收费" prop="charge">
					<el-switch
						v-model="form.charge"
						active-text="是"
						inactive-text="否"
					/>
				</el-form-item>
				<el-form-item v-show="form.charge" label="现价" prop="price">
					<el-input-number v-model="form.price" :max="1000" :min="1" :precision="2"/>
				</el-form-item>
				<el-form-item v-show="form.charge" label="原价" prop="originalPrice">
					<el-input-number v-model="form.originalPrice" :max="10000" :min="1" :precision="2"/>
				</el-form-item>
				<el-form-item label="联系邮件" prop="email">
					<el-input v-model="form.email" placeholder="请输入内容"/>
				</el-form-item>
				<el-form-item label="联系QQ" prop="qq">
					<el-input v-model="form.qq" placeholder="请输入内容"/>
				</el-form-item>
				<el-form-item label="联系微信" prop="wechat">
					<el-input v-model="form.wechat" placeholder="请输入内容"/>
				</el-form-item>
				<el-form-item label="联系电话" prop="phone">
					<el-input v-model="form.phone" placeholder="请输入内容"/>
				</el-form-item>
			</el-form>

			<!--  阶段二    -->
			<el-card v-show="active==1">
				<el-button v-if="!readOnly" size="large" type="primary" @click="()=>{
          //清空大章节dialog
          form2LargeChapterName = '';
          form2LargeChapterDialogVisible = true;
          form2LargeChapterAddorUpdate = false;
        }">添加大节
				</el-button>
				<el-table :data="form2" :default-expand-all="true" size="large" style="width: 100%">
					<el-table-column type="expand">
						<template #default="props">
							<div m="4">
								<el-table :border="true" :data="props.row.chapter" size="small">
									<el-table-column label="名称" prop="pname"/>
									<el-table-column label="媒资名称" prop="mediaName"/>
									<el-table-column label="是否试学">
										<template #default="scope">
											<el-switch v-model="scope.row.isPreview" active-text="Yes"
													   inactive-text="No"/>
										</template>
									</el-table-column>
									<el-table-column v-if="!readOnly" label="操作" min-width="100%">
										<template #default="scope">
											<el-button plain type="success"
													   @click="form2UpdateSmallChapterOne(props.$index, scope.$index)">
												修改
											</el-button>
											<el-button :disabled="scope.$index<1"
													   @click="form2UpSmallChapter(props.$index, scope.$index)">上移
											</el-button>
											<el-button :disabled="scope.$index>=form2[props.$index].chapter.length-1"
													   @click="form2DownSmallChapter(props.$index, scope.$index)">下移
											</el-button>
											<el-button plain
													   type="danger" @click="form2RemoveSmallChapter(props.$index, scope.$index)">删除
											</el-button>
										</template>
									</el-table-column>
								</el-table>
							</div>
						</template>
					</el-table-column>
					<el-table-column label="名称" prop="pname"/>
					<el-table-column v-if="!readOnly" label="操作">
						<template #default="scope">
							<el-button plain type="success" @click="form2UpdateLargeChapter(scope.$index)">修改
							</el-button>
							<el-button plain type="primary" @click="form2AddSmallChapterOne(scope.$index)">添加小节
							</el-button>
							<el-button :disabled="scope.$index<1" @click="form2UpLargeChapter(scope.$index)">上移
							</el-button>
							<el-button :disabled="scope.$index>=form2.length-1"
									   @click="form2DownLargeChapter(scope.$index)">下移
							</el-button>
							<el-button plain type="danger" @click="form2RemoveLargeChapter(scope.$index)">删除
							</el-button>
						</template>
					</el-table-column>
				</el-table>
				<el-dialog
					v-model="form2LargeChapterDialogVisible"
					align-center
					title="添加大节"
					width="500"
				>
					<span>大节名称</span>
					<el-input v-model="form2LargeChapterName"></el-input>
					<template #footer>
						<div>
							<el-button type="primary" @click="form2AddLargeChapter()">
								确定
							</el-button>
						</div>
					</template>
				</el-dialog>
				<el-dialog
					v-model="form2SmallChapterDialogVisible"
					align-center
					title="添加小节"
					width="500"
				>
					<span>小节名称</span>
					<el-input v-model="form2SmallChapterData.name"></el-input>
					<span>指定媒资</span><br/>
					<MediaSelect v-model:media-id="form2SmallChapterData.mediaId"
								 v-model:media-name="form2SmallChapterData.mediaName"></MediaSelect>
					<!--          <el-input v-model="form2SmallChapterData.mediaId"></el-input>-->
					<template #footer>
						<div>
							<el-button type="primary" @click="form2AddSmallChapterTwo()">
								确定
							</el-button>
						</div>
					</template>
				</el-dialog>
			</el-card>

			<!--  阶段三    -->
			<el-card v-show="active==2">
				<el-autocomplete
					v-model="form3Autocomplete"
					:disabled="readOnly"
					:fetch-suggestions="form3QuerySearch"
					class="inline-input w-50"
					clearable
					placeholder="搜索教师（姓名）"
					@select="form3HandleSelect"
				/>
				<el-table :data="form3" style="width: 100%">
					<el-table-column v-if="true" align="center" label="教师ID" prop="id"/>
					<el-table-column align="center" label="教师姓名" prop="name"/>
					<el-table-column align="center" label="教师职位" prop="position"/>
					<el-table-column align="center" label="教师介绍" prop="introduction"/>
					<el-table-column align="center" label="教师头像" prop="photograph">
						<template #default="scope">
							<el-image :src="fileBaseUrl+scope.row.photograph" fit="fill"
									  style="width: 100px; height: 100px"/>
						</template>
					</el-table-column>
					<el-table-column v-if="!readOnly" align="center" class-name="small-padding fixed-width"
									 label="操作">
						<template #default="scope">
							<el-tooltip content="删除" placement="top">
								<el-button icon="Delete" link type="danger"
										   @click="form3HandleDelete(scope.$index)"></el-button>
							</el-tooltip>
						</template>
					</el-table-column>
				</el-table>
			</el-card>

			<template #footer>
				<div class="dialog-footer">
					<el-button v-show="active==0" :loading="buttonLoading" type="primary" @click="submitForm1">
						{{ readOnly ? "下一页" : "更新并跳转下一步" }}
					</el-button>
					<el-button v-show="active==1" :loading="buttonLoading" type="primary" @click="submitForm2">
						{{ readOnly ? "下一页" : "更新并跳转下一步" }}
					</el-button>
					<el-button v-show="active==2" :loading="buttonLoading" type="primary" @click="submitForm3">
						{{ readOnly ? "结束" : "更新并结束" }}
					</el-button>
					<!--          <el-button @click="last">上一步</el-button>-->
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="CourseManagement" setup>
import {
	delBase,
	getOne,
	getThree,
	getTwo,
	listBase,
	offShelfCourse,
	publishCourse,
	saveOrUpdateOne,
	saveOrUpdateThree,
	saveOrUpdateTwo,
} from '@/api/course/base';
import {CourseBaseVO} from '@/api/course/types';
import {HttpStatus} from "@/enums/RespEnum";
import {listTeacher} from "@/api/course/Teacher/";
import type {UploadProps} from 'element-plus'
import {globalHeaders} from "@/utils/request";
import MediaSelect from "@/views/organization/courseManagement/mediaSelect.vue";
import {CourseStatusEnum} from "@/enums/CourseStatusEnum";
import {getCategory, showCategoryById} from "@/utils/my";

const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const {course_status} = toRefs<any>(proxy?.useDict("course_status"));

const baseList = ref<CourseBaseVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);
const active = ref(0)
const inputValue = ref('')
const inputVisible = ref(false)
const InputRef = ref()


const queryFormRef = ref<ElFormInstance>();
const CourseBaseFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
	visible: false,
	title: ''
});

const queryParams = reactive({
	pageNum: 1,
	pageSize: 10,
	name: undefined,
	mt: undefined,
	st: undefined,
	status: undefined
});
//新增or更新课程
const readOnly = ref(false)//只读模式
//新增课程-阶段1
const form = reactive({
	id: undefined,
	name: undefined,
	tags: [],
	mt: undefined,
	st: undefined,
	description: undefined,
	pic: undefined,
	charge: false,
	price: <number>0.00,
	originalPrice: <number>0.00,
	email: undefined,
	qq: undefined,
	wechat: undefined,
	phone: undefined,
});
const rules = reactive({
	name: [
		{required: true, message: "课程名称不能为空", trigger: "blur"}
	],
	tags: [
		{required: true, message: "课程标签不能为空", trigger: "blur"}
	],
	mt: [
		{required: true, message: "大分类不能为空", trigger: "blur"}
	],
	st: [
		{required: true, message: "小分类不能为空", trigger: "blur"}
	],
	description: [
		{required: true, message: "课程介绍不能为空", trigger: "blur"}
	],
	pic: [
		{required: true, message: "课程图片不能为空", trigger: "blur"}
	],
	charge: [
		{required: true, message: "课程价格模式不能为空", trigger: "blur"}
	],
	email: [
		{required: true, message: "课程联系邮件不能为空", trigger: "blur"}
	]
});
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(baseUrl + "/media/media/image"); // 上传的图片服务器地址
const headers = ref(globalHeaders());
const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;
const fileList = ref([])
const categoryList = ref([])
const categorySmallList = ref([])


//新增课程-阶段二
const form2 = ref<any>([])

const form2LargeChapterDialogVisible = ref(false);
const form2LargeChapterName = ref("");
const form2LargeChapterAddorUpdate = ref(false);//false:add, true:update
const form2LargeChapterUpdateIndex = ref(0);//如果是更新大节，那么记录更新的大节index

const form2SmallChapterDialogVisible = ref(false);
const form2SmallChapterData = reactive({
	"parentid": <number>0,
	"name": <string>"",
	"mediaId": <string>"",
	"mediaName": <string>""
});
const form2SmallChapterAddorUpdate = ref(false);//false:add, true:update
const form2SmallChapterUpdateIndex = ref([0, 0]);//如果是更新小节，那么记录所属大节index和小节index

//新增课程-阶段三
const form3 = ref<any>([])//存放教师id
const form3Autocomplete = ref('')//自动补全框变量


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

/** 取消按钮 */
const cancel = () => {
	reset();
	dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
	//1
	CourseBaseFormRef.value?.resetFields();
	fileList.value = []
	form.id = undefined;
	console.log(form)
	//2
	form2.value = [];
	form2LargeChapterName.value = ''
	form2SmallChapterData.parentid = 0;
	form2SmallChapterData.name = "";
	form2SmallChapterData.mediaId = "";
	form2SmallChapterData.mediaName = "";
	//3
	form3.value = [];

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

/** 新增按钮操作 */
const handleAdd = () => {
	readOnly.value = false;
	dialog.visible = true;
	dialog.title = "添加新课程";
	nextTick(() => {
		reset();
	});
}

/** 查看按钮操作 */
const handleView = (row?: CourseBaseVO) => {
	readOnly.value = true;
	loading.value = true
	dialog.visible = true;
	dialog.title = "查看课程信息";
	nextTick(async () => {
		reset();
		const _id = row?.id || ids.value[0]
		//加载阶段1数据
		const resOne = await getOne(_id);
		Object.assign(form, resOne.data);
		fileList.value.push({})
		fileList.value[0]["url"] = fileBaseUrl + form.pic
		fileList.value[0]["filePath"] = form.pic
		selectLargeCategory(form.mt);
		//加载阶段2数据
		const resTwo = await getTwo(_id);
		Object.assign(form2.value, resTwo.data)
		//加载阶段3数据
		const resThree = await getThree(_id);
		Object.assign(form3.value, resThree.data)
	});
}

/** 修改按钮操作 */
const handleUpdate = (row?: CourseBaseVO) => {
	readOnly.value = false;
	loading.value = true
	dialog.visible = true;
	dialog.title = "修改课程信息";
	nextTick(async () => {
		reset();
		const _id = row?.id || ids.value[0]
		//加载阶段1数据
		const resOne = await getOne(_id);
		Object.assign(form, resOne.data);
		fileList.value.push({})
		fileList.value[0]["url"] = fileBaseUrl + form.pic
		fileList.value[0]["filePath"] = form.pic
		selectLargeCategory(form.mt);
		//加载阶段2数据
		const resTwo = await getTwo(_id);
		Object.assign(form2.value, resTwo.data)
		//加载阶段3数据
		const resThree = await getThree(_id);
		Object.assign(form3.value, resThree.data)
	});
}
/** 发布按钮操作 */
const handlePublish = async (row?: CourseBaseVO) => {
	console.log("handlePublish" + row)
	let rsp = await publishCourse(row?.id);
	getList();
}

/** 下架按钮操作 */
const handleOffShelf = async (row?: CourseBaseVO) => {
	console.log("handlePublish" + row)
	let rsp = await offShelfCourse(row?.id);
	getList();
}

/** 删除按钮操作 */
const handleDelete = async (row?: CourseBaseVO) => {
	const _ids = row?.id || ids.value;
	await proxy?.$modal.confirm('是否确认删除用户编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
	await delBase(_ids);
	proxy?.$modal.msgSuccess("删除成功");
	await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
	proxy?.download('course/CourseBase/export', {
		...queryParams
	}, `base_${new Date().getTime()}.xlsx`)
}
/**===========================================================================================添加课程操作*/
//上一步
const last = () => {
	if (active.value > 0) {
		active.value--;
	}
}

//删除标签tags
const handleClose = (tag: string) => {
	form.tags.splice(form.tags.indexOf(tag), 1)
}
//添加标签tags
const showInput = () => {
	inputVisible.value = true
	nextTick(() => {
		InputRef.value!.input!.focus()
	})
}
const handleInputConfirm = () => {
	if (!!inputValue.value) {
		form.tags.push(inputValue.value)
	}
	inputVisible.value = false
	inputValue.value = ''
}

/** 提交步骤一 */
const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
	if (rawFile.type !== 'image/png' || !rawFile.name.endsWith('.png')) {
		ElMessage.error('Avatar picture must be PNG format!')
		return false
	} else if (rawFile.size / 1024 / 1024 > 2) {
		ElMessage.error('Avatar picture size can not exceed 2MB!')
		return false
	}
	return true
}

const handleAvatarSuccess: UploadProps['onSuccess'] = (
	response,
	uploadFile
) => {
	console.log(response)
	//存入图片墙
	fileList.value[0]["url"] = fileBaseUrl + response.data["filePath"]
	fileList.value[0]["filePath"] = response.data["filePath"]
	fileList.value[0]["md5"] = response.data["md5"]
	//存入form表单
	form.pic = response.data["filePath"];
}

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
	console.log(uploadFile)
	let list = [{md5: uploadFile["md5"], filePath: uploadFile["filePath"]}];
	console.log(list)
	//移除课程图片时，不删除媒资文件。
	//后期定制x定时任务，清理垃圾媒资文件
	// deleteImage(list).then(rsp => {
	//
	// });
}

const selectLargeCategory = (value: any) => {
	//value是下拉框里面item的value
	for (let category of categoryList.value) {
		if (category['id'] == value) {
			categorySmallList.value = category['children'];
			break;
		}
	}
}

const submitForm1 = () => {
	if (readOnly.value) {
		if (active.value < 2) {
			active.value++;
		}
		return;
	}
	CourseBaseFormRef.value?.validate(async (valid: boolean) => {
		if (valid) {
			buttonLoading.value = true;
			form.tags = form.tags.join(",")
			saveOrUpdateOne(form).then(rsp => {
				console.log(rsp)
				if (rsp.code == HttpStatus.SUCCESS) {
					proxy?.$modal.msgSuccess(rsp.msg);
					form.id = rsp.data;
					if (active.value < 2) {
						active.value++;
					}
				} else {
					proxy?.$modal.msgError(rsp.msg);
				}
			}).finally(() => {
				form.tags = []
				buttonLoading.value = false
			})
		}
	});
}


/** 提交步骤二 */
/** 修改操作 */
const form2AddLargeChapter = () => {
	//更新大节
	if (form2LargeChapterAddorUpdate.value) {
		form2.value[form2LargeChapterUpdateIndex.value].pname = form2LargeChapterName.value;
		form2LargeChapterDialogVisible.value = false;
	} else {
		//新增大节
		form2.value.push({
			"pname": form2LargeChapterName.value,
			"parentid": "0",
			"grade": 1,
			"orderby": form2.value.length + 1,
			"courseId": form.id,
			"chapter": <any>[]
		});
		form2LargeChapterDialogVisible.value = false;
	}
}
const form2UpdateLargeChapter = (index: number) => {
	form2LargeChapterAddorUpdate.value = true;
	form2LargeChapterUpdateIndex.value = index;//记录index
	form2LargeChapterName.value = form2.value[index].pname;//复制数据
	form2LargeChapterDialogVisible.value = true;//打开对话框
}
const form2AddSmallChapterOne = (parentIndex: number) => {
	//清空小节dialog内容
	form2SmallChapterData.name = "";
	form2SmallChapterData.mediaId = "";
	form2SmallChapterData.mediaName = "";
	//
	form2SmallChapterAddorUpdate.value = false;
	form2SmallChapterData.parentid = parentIndex;
	console.log(form2SmallChapterData.parentid);
	form2SmallChapterDialogVisible.value = true;
}
const form2UpdateSmallChapterOne = (parentIndex: number, index: number) => {
	console.log(parentIndex, index);
	form2SmallChapterAddorUpdate.value = true;
	form2SmallChapterUpdateIndex.value[0] = parentIndex;//记录index
	form2SmallChapterUpdateIndex.value[1] = index;
	form2SmallChapterData.name = form2.value[parentIndex].chapter[index].pname;//复制数据
	form2SmallChapterData.mediaId = form2.value[parentIndex].chapter[index].mediaId;
	form2SmallChapterData.mediaName = form2.value[parentIndex].chapter[index].mediaName;
	form2SmallChapterDialogVisible.value = true;//打开对话框
}
const form2AddSmallChapterTwo = () => {
	//更新小节
	if (form2SmallChapterAddorUpdate.value) {
		form2.value[form2SmallChapterUpdateIndex.value[0]].chapter[form2SmallChapterUpdateIndex.value[1]].pname = form2SmallChapterData.name;
		form2.value[form2SmallChapterUpdateIndex.value[0]].chapter[form2SmallChapterUpdateIndex.value[1]].mediaId = form2SmallChapterData.mediaId;
		form2.value[form2SmallChapterUpdateIndex.value[0]].chapter[form2SmallChapterUpdateIndex.value[1]].mediaName = form2SmallChapterData.mediaName;
		form2SmallChapterDialogVisible.value = false;
	} else {
		//新增小节
		form2.value[form2SmallChapterData.parentid]["chapter"].push({
			"pname": form2SmallChapterData.name,
			//前端中，parentid指向父节点的orderby或者索引，在后端的意思是父节点的id，需更换
			"parentid": form2SmallChapterData.parentid,
			"grade": 2,
			"orderby": form2.value[form2SmallChapterData.parentid]["chapter"].length + 1,
			"courseId": form.id,
			"mediaId": form2SmallChapterData.mediaId,
			"mediaName": form2SmallChapterData.mediaName,
			"isPreview": true
		});
		form2SmallChapterDialogVisible.value = false;
	}
}

/** 移动删除操作 */
const form2UpLargeChapter = (index: number) => {
	//互换位置
	[form2.value[index - 1], form2.value[index]] = [form2.value[index], form2.value[index - 1]];
	//修正orderby
	form2.value[index - 1].orderby = index - 1;
	for (let j = 0; j < form2.value[index - 1].chapter.length; ++j) {
		form2.value[index - 1].chapter[j].parentid = index - 1;
	}
	form2.value[index].orderby = index;
	for (let j = 0; j < form2.value[index].chapter.length; ++j) {
		form2.value[index].chapter[j].parentid = index;
	}
}

const form2DownLargeChapter = (index: number) => {
	//互换位置
	[form2.value[index], form2.value[index + 1]] = [form2.value[index + 1], form2.value[index]];
	//修正orderby
	form2.value[index].orderby = index;
	for (let j = 0; j < form2.value[index].chapter.length; ++j) {
		form2.value[index].chapter[j].parentid = index;
	}
	form2.value[index + 1].orderby = index + 1;
	for (let j = 0; j < form2.value[index + 1].chapter.length; ++j) {
		form2.value[index + 1].chapter[j].parentid = index + 1;
	}
}
const form2RemoveLargeChapter = (index: number) => {
	//删除指定元素
	form2.value.splice(index, 1);
	//后续元素重新排序
	for (let i = index; i < form2.value.length; i++) {
		form2.value[i].orderby = i;
		for (let j = 0; j < form2.value[i].chapter.length; ++j) {
			form2.value[i].chapter[j].parentid = i;
		}
	}
}

const form2UpSmallChapter = (parentIndex: number, index: number) => {
	//互换位置
	[form2.value[parentIndex].chapter[index - 1], form2.value[parentIndex].chapter[index]] = [form2.value[parentIndex].chapter[index], form2.value[parentIndex].chapter[index - 1]];
	//修正orderby
	form2.value[parentIndex].chapter[index - 1].orderby = index - 1;
	form2.value[parentIndex].chapter[index].orderby = index;
}

const form2DownSmallChapter = (parentIndex: number, index: number) => {
	//互换位置
	[form2.value[parentIndex].chapter[index], form2.value[parentIndex].chapter[index + 1]] = [form2.value[parentIndex].chapter[index + 1], form2.value[parentIndex].chapter[index]];
	//修正orderby
	form2.value[parentIndex].chapter[index].orderby = index;
	form2.value[parentIndex].chapter[index + 1].orderby = index + 1;
}

const form2RemoveSmallChapter = (parentIndex: number, index: number) => {
	//删除指定元素
	form2.value[parentIndex].chapter.splice(index, 1);
	//后续元素重新排序
	for (let i = index; i < form2.value[parentIndex].chapter.length; i++) {
		form2.value[parentIndex].chapter[i].orderby = i;
	}
}

const submitForm2 = () => {
	if (readOnly.value) {
		if (active.value < 2) {
			active.value++;
		}
		return;
	}
	buttonLoading.value = true;
	saveOrUpdateTwo(form2.value).then(rsp => {
		proxy?.$modal.msgSuccess("修改成功");
		if (active.value < 2) {
			active.value++;
		}
	}).finally(() => {
		buttonLoading.value = false
	});
}
/** 提交步骤三 */
const form3QuerySearch = async (queryString: string, cb: any) => {
	let queryParams = {
		pageNum: 1,
		pageSize: 10,
		name: queryString,
		position: undefined,
		introduction: undefined,
		photograph: undefined,
		params: {}
	};
	const rsp = await listTeacher(queryParams);
	const results = rsp.rows.map(item => {
		return {...item, value: `${item.name} ${item.position}`,}
	});
	// call callback function to return suggestions
	// console.log(results)
	cb(results)
}

const form3HandleSelect = (item: {}) => {
	form3.value.push(item)
	form3Autocomplete.value = ""
}

const form3HandleDelete = (index: number) => {
	form3.value.splice(index, 1);
}

const submitForm3 = () => {
	if (readOnly.value) {
		readOnly.value = false;
		dialog.visible = false;
		active.value = 0;
		getList();
		return;
	}
	buttonLoading.value = true;
	let data = {courseId: form.id, teacher: form3.value.map(item => item.id).join(',')}

	saveOrUpdateThree(data).then(rsp => {
		proxy?.$modal.msgSuccess("修改成功");
		if (active.value < 2) {
			active.value++;
		}
	}).finally(() => {
		reset();
		readOnly.value = false;
		active.value = 0;
		buttonLoading.value = false
		dialog.visible = false;
		getList();
	});
}


onMounted(async () => {
	getList();
	await getCategory(proxy).then(rsp => {
		categoryList.value = rsp
	});
	fileList.value.push({})
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
