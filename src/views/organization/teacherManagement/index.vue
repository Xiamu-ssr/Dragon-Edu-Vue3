<template>
    <div class="p-2">
<!--        <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">-->
<!--            <div class="search" v-show="showSearch">-->
<!--                <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">-->
<!--                    <el-form-item label="所属机构id" prop="companyId">-->
<!--                        <el-input v-model="queryParams.companyId" placeholder="请输入所属机构id" clearable style="width: 240px" @keyup.enter="handleQuery" />-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="教师姓名" prop="name">-->
<!--                        <el-input v-model="queryParams.name" placeholder="请输入教师姓名" clearable style="width: 240px" @keyup.enter="handleQuery" />-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="教师职位" prop="position">-->
<!--                        <el-input v-model="queryParams.position" placeholder="请输入教师职位" clearable style="width: 240px" @keyup.enter="handleQuery" />-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="教师介绍" prop="introduction">-->
<!--                        <el-input v-model="queryParams.introduction" placeholder="请输入教师介绍" clearable style="width: 240px" @keyup.enter="handleQuery" />-->
<!--                    </el-form-item>-->
<!--                    <el-form-item label="教师头像" prop="photograph">-->
<!--                        <el-input v-model="queryParams.photograph" placeholder="请输入教师头像" clearable style="width: 240px" @keyup.enter="handleQuery" />-->
<!--                    </el-form-item>-->
<!--                    <el-form-item>-->
<!--                        <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>-->
<!--                        <el-button icon="Refresh" @click="resetQuery">重置</el-button>-->
<!--                    </el-form-item>-->
<!--                </el-form>-->
<!--            </div>-->
<!--        </transition>-->

        <el-card shadow="never">
            <template #header>
                <el-row :gutter="10" class="mb8">
                    <el-col :span="1.5">
                        <el-button type="primary" plain icon="Plus" @click="handleAdd">新增</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()">删除</el-button>
                    </el-col>
                    <el-col :span="1.5">
                        <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>
                    </el-col>
                    <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
                </el-row>
            </template>

            <el-table v-loading="loading" :data="TeacherList" @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="55" align="center" />
<!--                <el-table-column label="教师ID" align="center" prop="id" v-if="true" />-->
<!--                <el-table-column label="所属机构id" align="center" prop="companyId" />-->
                <el-table-column label="教师姓名" align="center" prop="name" />
                <el-table-column label="教师职位" align="center" prop="position" />
                <el-table-column label="教师介绍" align="center" prop="introduction" />
                <el-table-column label="教师头像" align="center" prop="photograph">
                  <template #default="scope">
                    <el-image style="width: 100px; height: 100px" :src="fileBaseUrl+scope.row.photograph" fit="fill" />
                  </template>
                </el-table-column>
                <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
                    <template #default="scope">
                        <el-tooltip content="修改" placement="top">
                            <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
                        </el-tooltip>
                        <el-tooltip content="删除" placement="top">
                            <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
                        </el-tooltip>
                    </template>
                </el-table-column>
            </el-table>

            <pagination
                    v-show="total>0"
                    :total="total"
                    v-model:page="queryParams.pageNum"
                    v-model:limit="queryParams.pageSize"
                    @pagination="getList"
            />
        </el-card>
        <!-- 添加或修改教师管理对话框 -->
        <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
            <el-form ref="TeacherFormRef" :model="form" :rules="rules" label-width="80px">
<!--                <el-form-item label="所属机构id" prop="companyId">-->
<!--                    <el-input v-model="form.companyId" placeholder="请输入所属机构id" />-->
<!--                </el-form-item>-->
                <el-form-item label="教师姓名" prop="name">
                    <el-input v-model="form.name" placeholder="请输入教师姓名" />
                </el-form-item>
                <el-form-item label="教师职位" prop="position">
                    <el-input v-model="form.position" placeholder="请输入教师职位" />
                </el-form-item>
                <el-form-item label="教师介绍" prop="introduction">
                    <el-input v-model="form.introduction" type="textarea" placeholder="请输入内容" />
                </el-form-item>
                <el-form-item label="教师头像" prop="photograph">
                  <el-upload
                    class="avatar-uploader"
                    :action="uploadImgUrl"
                    :headers="headers"
                    v-model:file-list="fileList"
                    list-type="picture-card"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    :on-remove="handleRemove"
                    :limit="1"
                    :disabled="readOnly"
                  >
                    <el-icon><Plus /></el-icon>
                  </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
                    <el-button @click="cancel">取 消</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup name="TeacherManagement" lang="ts">
import { listTeacher, getTeacher, delTeacher, addTeacher, updateTeacher } from '@/api/course/Teacher';
import { TeacherVO, TeacherQuery, TeacherForm } from '@/api/course/Teacher/types';
import {globalHeaders} from "@/utils/request";
import {UploadProps} from "element-plus";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const TeacherList = ref<TeacherVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const TeacherFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
    visible: false,
    title: ''
});

const initFormData: TeacherForm = {
    id: undefined,
    companyId: undefined,
    name: undefined,
    position: undefined,
    introduction: undefined,
    photograph: undefined
}
const data = reactive<PageData<TeacherForm, TeacherQuery>>({
    form: {...initFormData},
    queryParams: {
        pageNum: 1,
        pageSize: 10,
        companyId: undefined,
        name: undefined,
        position: undefined,
        introduction: undefined,
        photograph: undefined,
        // params: {
        // }
    },
    rules: {
        name: [
            { required: true, message: "教师姓名不能为空", trigger: "blur" }
        ],
        position: [
            { required: true, message: "教师职位不能为空", trigger: "blur" }
        ],
        introduction: [
            { required: true, message: "教师介绍不能为空", trigger: "blur" }
        ],
        photograph: [
            { required: true, message: "教师头像不能为空", trigger: "blur" }
        ]
    }
});

const { queryParams, form, rules } = toRefs(data);

//图片
const baseUrl = import.meta.env.VITE_APP_BASE_API;
const uploadImgUrl = ref(baseUrl + "/media/media/image"); // 上传的图片服务器地址
const headers = ref(globalHeaders());
const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;
const imgFile = reactive({
  "url": undefined,
  "filePath": undefined,
  "md5": undefined
})
const fileList = ref([imgFile])
const readOnly = ref(false)//只读模式

/** 查询教师管理列表 */
const getList = async () => {
    loading.value = true;
    const res = await listTeacher(queryParams.value);
    TeacherList.value = res.rows;
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
    imgFile.url = undefined;
    imgFile.filePath = undefined;
    imgFile.md5 = undefined;
    form.value = {...initFormData};
    TeacherFormRef.value?.resetFields();
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
const handleSelectionChange = (selection: TeacherVO[]) => {
    ids.value = selection.map(item => item.id);
    single.value = selection.length != 1;
    multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
    readOnly.value = false;
    dialog.visible = true;
    dialog.title = "添加教师管理";
    nextTick(() => {
        reset();
    });
}

/** 修改按钮操作 */
const handleUpdate = (row?: TeacherVO) => {
    readOnly.value = false;
    loading.value = true
    dialog.visible = true;
    dialog.title = "修改教师管理";
    nextTick(async () => {
        reset();
        const _id = row?.id || ids.value[0]
        const res = await getTeacher(_id);
        loading.value = false;
        Object.assign(form.value, res.data);
      imgFile.url=  fileBaseUrl + form.value.photograph
      imgFile.filePath =  form.value.photograph
    });
}

/** 提交按钮 */
const submitForm = () => {
    TeacherFormRef.value?.validate(async (valid: boolean) => {
        if (valid) {
            buttonLoading.value = true;
            if (form.value.id) {
                await updateTeacher(form.value).finally(() =>  buttonLoading.value = false);
            } else {
                await addTeacher(form.value).finally(() =>  buttonLoading.value = false);
            }
            proxy?.$modal.msgSuccess("修改成功");
            dialog.visible = false;
            await getList();
        }
    });
}

/** 删除按钮操作 */
const handleDelete = async (row?: TeacherVO) => {
    const _ids = row?.id || ids.value;
    await proxy?.$modal.confirm('是否确认删除教师管理编号为"' + _ids + '"的数据项？').finally(() => loading.value = false);
    await delTeacher(_ids);
    proxy?.$modal.msgSuccess("删除成功");
    await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
    proxy?.download('course/Teacher/export', {
        ...queryParams.value
    }, `Teacher_${new Date().getTime()}.xlsx`)
}

/** 图片上传 */
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
  imgFile.url =  fileBaseUrl + response.data["filePath"]
  imgFile.filePath =  response.data["filePath"]
  imgFile.md5 =  response.data["md5"]
  //存入form表单
  form.value.photograph = response.data["filePath"];
}

const handleRemove: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
}


onMounted(() => {
    getList();
});
</script>
