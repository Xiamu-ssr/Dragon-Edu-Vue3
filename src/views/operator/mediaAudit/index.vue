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
          <el-form-item>
            <el-button icon="Search" type="primary" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <el-table v-loading="loading" :data="mediaList" @selection-change="handleSelectionChange">
<!--        <el-table-column align="center" type="selection" width="55"/>-->
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
            <dict-tag :options="media_status" :value="scope.row.auditStatus" />
          </template>
        </el-table-column>
        <el-table-column align="center" label="审核意见" prop="auditMind"/>
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
                         @click="()=>{rejectBo.auditMind='';rejectBo.id=scope.row.id;dialog.visible=true;}"
              ></el-button>
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
      width="500"
      align-center
    >
      <el-input
        v-model="rejectBo.auditMind"
        style="width: 340px"
        :rows="4"
        type="textarea"
        placeholder="请输入审核意见"
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

<script lang="ts" name="MediaAudit" setup>
import {
  listMedia, passMedia, rejectMedia,
} from '@/api/media/Audit';
import {MediaForm, MediaQuery, MediaVO} from '@/api/media/Media/types';
import type {UploadInstance, UploadRawFile, UploadRequestOptions, UploadUserFile} from 'element-plus'
import SparkMD5 from "spark-md5";
import {HttpStatus} from "@/enums/RespEnum";
import {courseReject} from "@/api/course/Audit";

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

//审核不通过
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const rejectBo = reactive({
  "id":undefined,
  "auditMind":""
});


/** 查询media列表 */
const getList = async () => {
  loading.value = true;
  const res = await listMedia(queryParams.value);
  mediaList.value = res.rows;
  total.value = res.total;
  loading.value = false;
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

/** 通过审核 */
const handlePass = async (row?: MediaVO) => {
  await passMedia(row?.id);
  getList()
}

const handleReject = async () => {
  await rejectMedia(rejectBo);
  getList();
  dialog.visible = false;
}


onMounted(() => {
  getList();
});
</script>

<style scoped>

</style>
