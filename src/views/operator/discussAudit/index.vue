<template>
  <div class="p-2">
    <el-card shadow="never">

      <el-table v-loading="loading" :data="discussList">
        <el-table-column label="评论时用户学习时长/分钟" align="center" prop="learnTime" />
        <el-table-column label="评论内容" width="600" align="center" prop="content" />
        <el-table-column label="评分" align="center" prop="star" />
        <el-table-column label="评论状态" align="center" prop="status">
          <template #default="scope">
            <dict-tag :options="discuss_status" :value="scope.row.status"/>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="400" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="允许屏蔽" placement="top">
              <el-button
                type="danger"
                icon="Remove"
                @click="()=>{
                  allowForBlock(scope.row.id, true).then().finally(()=>{getList();})
                }"
                plain
              >
                允许
              </el-button>
            </el-tooltip>
            <el-tooltip content="取消屏蔽" placement="top">
              <el-button
                type="success"
                icon="RefreshRight"
                @click="()=>{
                  allowForBlock(scope.row.id, false).then().finally(()=>{getList();})
                }"
                plain
              >
                取消
              </el-button>
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
  </div>
</template>

<script setup name="Discuss" lang="ts">
import { DiscussVO, DiscussQuery, DiscussForm } from '@/api/discuss/discuss/types';
import {useRoute} from "vue-router";
import {DiscussStatusEnum} from "@/enums/DiscussStatusEnum";
import {allowForBlock, listAuditDiscuss} from "@/api/discuss/audit";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const route = useRoute();
const {discuss_status} = toRefs<any>(proxy?.useDict("discuss_status"));

const discussList = ref<DiscussVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();
const discussFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const data = reactive<PageData<DiscussForm, DiscussQuery>>({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    courseId: undefined,
    courseName: undefined,
    companyId: undefined,
    userId: undefined,
    userName: undefined,
    avatar: undefined,
    learnTime: undefined,
    content: undefined,
    star: undefined,
    status: undefined,
    params: {
    }
  }
});

const { queryParams } = toRefs(data);

/** 查询课程评论列表 */
const getList = async () => {
  loading.value = true;
  const res = await listAuditDiscuss(queryParams.value);
  discussList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

onMounted(() => {
  getList();
});
</script>
