<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="评论状态" prop="status">
            <el-select v-model="queryParams.status" clearable placeholder="评论状态">
              <el-option v-for="dict in discuss_status" :key="dict.value" :label="dict.label"
                         :value="dict.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="评分范围" prop="star">
            <el-slider style="width: 200px;" v-model="tmpStars" range show-stops :step="1" :max="5" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

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
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="申请屏蔽" placement="top">
              <el-button
                type="warning"
                icon="Remove"
                @click="applyForBlockLocal(scope.row.id)"
                plain
                :disabled="scope.row.status != DiscussStatusEnum.SUCCESS"
              >
                申请屏蔽
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
import {
  listDiscuss,
  getDiscuss,
  delDiscuss,
  addDiscuss,
  updateDiscuss,
  applyForBlock,
  listDiscussForCompany
} from '@/api/discuss/discuss';
import { DiscussVO, DiscussQuery, DiscussForm } from '@/api/discuss/discuss/types';
import {useRoute} from "vue-router";
import {DiscussStatusEnum} from "@/enums/DiscussStatusEnum";

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
      beginStar: undefined,
      endStar: undefined
    }
  }
});

const tmpStars = ref([0,5])

const { queryParams } = toRefs(data);

/** 查询课程评论列表 */
const getList = async () => {
  loading.value = true;
  //transform tmpStars to queryParmas
  queryParams.value['params'].beginStar = tmpStars.value[0]
  queryParams.value['params'].endStar = tmpStars.value[1]
  const res = await listDiscussForCompany(queryParams.value);
  discussList.value = res.rows;
  total.value = res.total;
  loading.value = false;
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.value.pageNum = 1;
  getList();
}

/** 申请屏蔽评论 */
const applyForBlockLocal =(id: number | string)=>{
  applyForBlock(id).then(rsp=>{

  }).finally(()=>{
    getList();
  })
}

onMounted(() => {
  queryParams.value.courseId = route.query.courseId;
  if (null == queryParams.value.courseId){
    proxy?.$modal.msgError("没有收到课程id，无法查询指定评论列表")
    proxy?.$tab.closePage();
  }
  getList();
});
</script>
