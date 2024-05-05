<template>
  <div class="p-2">
    <el-row justify="space-evenly">
      <el-col :span="10"
        v-for="statistics in discussStatisticsList"
      >
        <el-card @click="toTab(statistics.courseId)" shadow="hover">
          <el-row>
            <el-col :span="8">
              <el-image :src="fileBaseUrl+statistics.pic" fit="fill" style="width: 160px; height: 160px"/>
            </el-col>
            <el-col :span="16" style="display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;">
              <div>
                <span style="font-size: 20px">{{ statistics.courseName }}</span>
              </div>
              <div style="margin-top: 10px">
                <el-progress type="dashboard" :percentage="statistics.star*20" :color="colors" width="120" style="margin-right: 10px">
                  <template #default="{ percentage }">
                    <span class="percentage-value">{{ parseFloat(parseFloat(percentage.toString()).toFixed(1)) }}%</span>
                    <span class="percentage-label">好评率</span>
                  </template>
                </el-progress>
                <el-progress type="dashboard" :percentage="100" width="120" color="#409EFF" style="margin-left: 10px">
                  <template #default="{ percentage }">
                    <span class="percentage-value">{{ statistics.discussCount }}</span>
                    <span class="percentage-label">评论数</span>
                  </template>
                </el-progress>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts" setup>

import {getStatisticsByCompanyId} from "@/api/discuss/statistics";
import {StatisticsVO} from "@/api/discuss/statistics/types";

const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;
const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const discussStatisticsList = ref<StatisticsVO[]>([])
const colors = [
    { color: '#F56C6C', percentage: 20 },
    { color: '#ED8754', percentage: 40 },
    { color: '#E6A23C', percentage: 60 },
    { color: '#A6B23B', percentage: 80 },
    { color: '#67C23A', percentage: 100 },
]

const toTab =(courseId: number | string)=>{
  proxy?.$tab.openPage("/singleCourseDiscussMgt", "", {courseId: courseId})
}

onMounted(()=>{
  getStatisticsByCompanyId().then(rsp=>{
    console.log(rsp)
    discussStatisticsList.value = rsp.data
  })
})

</script>

<style scoped>
:deep(.percentage-value) {
  display: block;
  margin-top: 10px;
  font-size: 28px;
}
:deep(.percentage-label) {
  display: block;
  margin-top: 10px;
  font-size: 12px;
}
</style>
