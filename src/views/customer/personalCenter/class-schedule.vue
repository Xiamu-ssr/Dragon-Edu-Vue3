<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch" style="margin: 20px">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="课程名称" prop="courseName">
            <el-input v-model="queryParams.courseName" placeholder="请输入" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never" style="background-color: transparent">
      <ClassScheduleCard
              style="margin-top: 20px;padding:5px;background-color: white"
        v-for="schedule in scheduleList"
        :course-info="schedule"
      />
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

<script setup name="Schedule" lang="ts">
import { listSchedule, getSchedule, delSchedule, addSchedule, updateSchedule } from '@/api/learn/schedule';
import { ScheduleVO, ScheduleQuery, ScheduleForm } from '@/api/learn/schedule/types';
import ClassScheduleCard from "@/views/customer/personalCenter/class-schedule-card.vue";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const scheduleList = ref<ScheduleVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();


const data = reactive<PageData<ScheduleForm, ScheduleQuery>>({
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    userId: undefined,
    courseId: undefined,
    courseName: undefined,
    learningTime: undefined,
    params: {
    }
  }
});

const { queryParams, form } = toRefs(data);

/** 查询课程列表 */
const getList = async () => {
  loading.value = true;
  const res = await listSchedule(queryParams.value);
  scheduleList.value = res.rows;
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
