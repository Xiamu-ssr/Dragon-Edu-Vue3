<template>
	<div class="p-2">
		<transition :enter-active-class="proxy?.animate.searchAnimate.enter"
					:leave-active-class="proxy?.animate.searchAnimate.leave">
			<div v-show="showSearch" class="search">
				<el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="68px">
					<el-form-item label="文件名" prop="originalName">
						<el-input v-model="queryParams.originalName" clearable
								  placeholder="文件名" style="width: 240px" @keyup.enter="handleQuery"/>
					</el-form-item>
					<el-form-item label="文件后缀" prop="fileSuffix">
<!--						<el-input v-model="queryParams.fileSuffix" clearable placeholder="请输入文件后缀" style="width: 240px" @keyup.enter="handleQuery"/>-->
            <el-select v-model="queryParams.fileSuffix" placeholder="文件后缀" clearable>
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
					</el-form-item>
					<el-form-item label="审核状态" prop="auditMind">
            <el-select v-model="queryParams.auditStatus" placeholder="审核状态" clearable>
              <el-option
                v-for="dict in media_status"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              />

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
					<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
				</el-row>
			</template>

			<el-table v-loading="loading" :data="mediaList" @selection-change="handleSelectionChange">
				<el-table-column align="center" type="selection" width="55"/>
<!--				<el-table-column v-if="true" align="center" label="文件md5值" prop="id"/>-->
				<el-table-column align="center" label="文件名" prop="originalName"/>
				<el-table-column align="center" label="文件后缀" prop="fileSuffix"/>
				<el-table-column align="center" label="文件大小" prop="size">
          <template #default="scope">
            {{ (Math.ceil(scope.row.size*100/(1024*1024)) /100).toFixed(2) + 'MB' }}
          </template>
        </el-table-column>
				<el-table-column align="center" label="备注" prop="remark"/>
        <el-table-column align="center" label="审核状态" prop="auditStatus">
          <template #default="scope">
            <dict-tag :options="media_status" :value="scope.row.auditStatus" v-show="scope.row.fileSuffix=='.mp4'"/>
          </template>
        </el-table-column>
				<el-table-column align="center" label="审核意见" prop="auditMind"/>
				<el-table-column align="center" class-name="small-padding fixed-width" label="操作">
					<template #default="scope">
            <el-tooltip content="提交" placement="top">
              <el-button icon="Promotion" link type="success" @click="handlePublish(scope.row)"
                         :disabled="scope.row.auditStatus==MediaStatusEnum.UNDER_REVIEW"
                         v-show="scope.row.fileSuffix=='.mp4'"
              ></el-button>
            </el-tooltip>
						<el-tooltip content="修改" placement="top">
							<el-button icon="Edit" link type="primary" @click="handleUpdate(scope.row)" :disabled="scope.row.auditStatus==MediaStatusEnum.UNDER_REVIEW"></el-button>
						</el-tooltip>
						<el-tooltip content="删除" placement="top">
							<el-button icon="Delete" link type="primary" @click="handleDelete(scope.row)"></el-button>
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
		<!-- 添加或修改media对话框 -->
		<el-dialog v-model="dialog.visible" :title="dialog.title" append-to-body width="500px">
			<el-form ref="mediaFormRef" :model="form" :rules="rules" label-width="80px">
				<el-form-item label="上传视频" prop="originalName" v-show="dialog.title=='添加视频'">
					<el-upload
						ref="uploadRef"
						:http-request="onUpload"
						:before-upload="beforeUpload"
						:limit="1"
						action="#"
						class="upload-demo"
					>
						<template #trigger>
							<el-button type="primary">选择视频</el-button>
						</template>

						<!--            <el-button class="ml-3" type="success" @click="submitUpload">-->
						<!--              一键上传-->
						<!--            </el-button>-->
						<template #tip>
							<div class="el-upload__tip">
								支持分块上传、端点续传
							</div>
						</template>
					</el-upload>
				</el-form-item>
				<el-form-item v-show="percentageShow">
					<el-progress :percentage="percentage" style="width: 100%"/>
				</el-form-item>
        <el-form-item label="媒资名称" prop="name">
          <el-input v-model="form.originalName" placeholder="请输入媒资名称"/>
        </el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input v-model="form.remark" placeholder="请输入备注"/>
				</el-form-item>
			</el-form>
			<template #footer>
				<div class="dialog-footer">
					<el-button :loading="buttonLoading" type="primary" @click="submitForm">提交</el-button>
					<el-button @click="cancel">取 消</el-button>
				</div>
			</template>
		</el-dialog>
	</div>
</template>

<script lang="ts" name="MediaManagement" setup>
import {
  addChunk,
  addMedia,
  delMedia,
  getMedia,
  isChunkExist,
  listMedia,
  mergeChunks, publishMedia,
  updateMedia
} from '@/api/media/Media';
import {MediaForm, MediaQuery, MediaVO} from '@/api/media/Media/types';
import type {UploadInstance, UploadRawFile, UploadRequestOptions, UploadUserFile} from 'element-plus'
import SparkMD5 from "spark-md5";
import {HttpStatus} from "@/enums/RespEnum";
import {MediaStatusEnum} from "@/enums/MediaStatusEnum";

const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const mediaList = ref<MediaVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const mediaFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
	visible: false,
	title: ''
});

const initFormData: MediaForm = {
	id: undefined,
	companyId: undefined,
  originalName: undefined,
  fileSuffix: undefined,
  size: undefined,
	path: undefined,
	remark: undefined,
	auditStatus: undefined,
	auditMind: undefined
}
const data = reactive<PageData<MediaForm, MediaQuery>>({
	form: {...initFormData},
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		originalName: undefined,
		fileSuffix: undefined,
		auditStatus: undefined,
		auditMind: undefined,
	},
	rules: {}
});
//查询条件
const options = ref([
  {value:".mp4", label:".mp4"},
  {value:".png", label:".png"}
])
const { media_status } = toRefs<any>(proxy?.useDict("media_status"));

const {queryParams, form, rules} = toRefs(data);
//上传视频
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(baseUrl + "/media/media/image"); // 上传的图片服务器地址
const uploadRef = ref<UploadInstance>()
const needUpload = ref(true)
const chunkSize = 5*1024*1024;

const percentage = ref(0)
const percentageShow = ref(false)

/** 查询media列表 */
const getList = async () => {
	loading.value = true;
	const res = await listMedia(queryParams.value);
	mediaList.value = res.rows;
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
	form.value = {...initFormData};
	mediaFormRef.value?.resetFields();
  percentageShow.value = false;
}

/** 搜索按钮操作 */
const handleQuery = () => {
	queryParams.value.pageNum = 1;
	getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
	queryFormRef.value?.resetFields();
	handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: MediaVO[]) => {
	ids.value = selection.map(item => item.id);
	single.value = selection.length != 1;
	multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
	dialog.visible = true;
	dialog.title = "添加视频";
  uploadRef.value.clearFiles();
	nextTick(() => {
		reset();
	});
}

/** 提交审核按钮操作 */
const handlePublish = async (row?: MediaVO) => {
  await publishMedia([row?.id]);
  getList();
}

/** 修改按钮操作 */
const handleUpdate = (row?: MediaVO) => {
	loading.value = true
	dialog.visible = true;
	dialog.title = "修改视频";
	nextTick(async () => {
		reset();
		const _id = row?.id || ids.value[0]
		const res = await getMedia(_id);
		loading.value = false;
		Object.assign(form.value, res.data);
	});
}

/** 提交按钮 */
const submitForm = () => {
	mediaFormRef.value?.validate(async (valid: boolean) => {
		if (valid) {
			buttonLoading.value = true;
			if (form.value.id) {
				await updateMedia(form.value).finally(() => buttonLoading.value = false);
			} else {
				await addMedia(form.value).finally(() => buttonLoading.value = false);
			}
			proxy?.$modal.msgSuccess("修改成功");
			dialog.visible = false;
			await getList();
		}
	});
}

/** 删除按钮操作 */
const handleDelete = async (row?: MediaVO) => {
	const _ids = row?.id || ids.value;
	await proxy?.$modal.confirm('是否确认删除media编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
	await delMedia(_ids);
	proxy?.$modal.msgSuccess("删除成功");
	await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
	proxy?.download('media/media/export', {
		...queryParams.value
	}, `media_${new Date().getTime()}.xlsx`)
}

//=========================================================================================================分块上传
//在上传之前，使用视频md5判断视频是否已经存在
const beforeUpload = async (rawFile: UploadRawFile) => {
  needUpload.value = true;
  const fileMd5 = await getFileMd5(rawFile);
  form.value.id = fileMd5;
  const rsp = await getMedia(fileMd5);
  if(!!rsp.data && rsp.data['id'] == fileMd5){
    needUpload.value = false;
    proxy?.$modal.msgWarning("视频文件已存在，请勿重复上传。文件名为"+rsp.data['originalName'])
  }
}
const onUpload = async (options: UploadRequestOptions) => {
	if(!needUpload.value){
    //秒传
    percentageShow.value = true;
    percentage.value = 100;
    dialog.visible = false;
		return;
	}
  percentageShow.value = true;
	const file = options.file
	const totalChunks = Math.ceil(file.size / chunkSize);
  let isUploadSuccess = true;//记录分块文件是否上传成功
  //合并文件参数
  let mergeVo = {
    "chunksMd5": [] as string[],
    "videoMd5": undefined as string | undefined,
    "videoName": file.name,
    "videoSize": file.size,
    "remark": undefined as string | undefined
  }
  //循环切分文件，并上传分块文件
	for(let i=0; i<totalChunks; ++i){
		const start = i * chunkSize;
		const end = Math.min(start + chunkSize, file.size);
		const chunk = file.slice(start, end);
		//计算 chunk md5
		const md5 = await getFileMd5(chunk);
    mergeVo.chunksMd5.push(md5);
		// 准备FormData
		const formData = new FormData();
		formData.append('file', chunk);
		formData.append('filename', file.name);
		formData.append('chunkIndex', i.toString());
		formData.append('totalChunks', totalChunks.toString());
		formData.append('md5', md5);
		//上传当前分块
		try {
      // for (let [key, value] of formData.entries()) {
      //   console.log(key, value);
      // }
      //先判断这个分块是否已经存在
      const isExistRsp = await isChunkExist({"md5": formData.get("md5")});
      const isExist = isExistRsp.data;
      //不存在则上传
      if (!isExist){
        const rsp = await addChunk(formData);
        console.log(`Chunk ${i + 1}/${totalChunks} uploaded`, rsp.data);
      }else {
        console.log(`Chunk ${i + 1}/${totalChunks} is exist`);
      }
      percentage.value = (i)*100 / totalChunks;
		} catch (error) {
      isUploadSuccess = false;
			console.error(`Error uploading chunk ${i + 1}`, error);
			proxy?.$modal.msgError(`上传分块${i + 1}出错`);
			break;
		}
	}
  //合并分块文件
  if(isUploadSuccess){
    proxy?.$modal.msgSuccess("分块文件上传成功")
    mergeVo.videoMd5 = form.value.id;//beforeUpload已经计算过视频文件的md5
    //合并文件
    const rsp = await mergeChunks(mergeVo);
    if (rsp.code == HttpStatus.SUCCESS){
      //合并文件后，实际上媒资已经插入数据库。
      //赋值form.id，为了让表单走update
      percentage.value = 100;
      proxy?.$modal.msgSuccess("文件合并成功")
      proxy?.$modal.msgSuccess("视频上传成功")
    }else{
      proxy?.$modal.msgSuccess("文件合并异常")
    }
  }else {
    proxy?.$modal.msgSuccess("文件未上传成功，请重试或联系管理员")
  }
}

//获取文件的MD5
const getFileMd5 = (file:any) => {
	return new Promise((resolve, reject) => {
			let fileReader = new FileReader()
			fileReader.onload = function (event) {
				let fileMd5 = SparkMD5.ArrayBuffer.hash(event.target.result)
				resolve(fileMd5)
			}
			fileReader.readAsArrayBuffer(file)
		}
	)
}

onMounted(() => {
	getList();
});
</script>

<style scoped>

</style>
