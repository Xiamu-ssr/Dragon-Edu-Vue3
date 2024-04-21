<template>
  <el-autocomplete
    v-model="localValue.mediaName"
    :fetch-suggestions="querySearch"
    placeholder="搜索媒资"
    @select="handleSelect"
  >
    <template #suffix>
      <el-icon>
        <search />
      </el-icon>
    </template>
    <template #default="{ item }">
      <el-descriptions :title="item.originalName" :column="2" border style="margin-bottom: 10px">
        <el-descriptions-item label="文件大小">{{ (Math.ceil(item.size*100/(1024*1024)) /100).toFixed(2) + 'MB' }}</el-descriptions-item>
        <el-descriptions-item label="创建时间">{{ item.createTime }}</el-descriptions-item>
        <el-descriptions-item label="备注">
          <el-tag size="small">{{ item.remark }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </template>
  </el-autocomplete>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { Edit } from '@element-plus/icons-vue'
import {listMedia} from "@/api/media/Media";
import Search from "@/layout/components/TopBar/search.vue";
import {MediaStatusEnum} from "@/enums/MediaStatusEnum";

// const props = defineProps(['mediaId', 'mediaName']);

const props = defineProps({
  mediaId: String,
  mediaName: String
});
const emit = defineEmits(['update:mediaId', 'update:mediaName'])

const localValue = reactive({
  'mediaName': props.mediaName
})

const querySearch = async (mediaNameQuery: string, cb) => {
  if(!mediaNameQuery){
    cb([])
    return;
  }
  let queryParams = {
    pageNum: 1,
    pageSize: 10,
    originalName: mediaNameQuery,
    fileSuffix: '.mp4',
    auditStatus: MediaStatusEnum.REVIEW_PASSED
  }
  const results = await listMedia(queryParams);
  console.log(results)
  cb(results.rows)
}

const handleSelect = (item: any) => {
  console.log(item)
  localValue.mediaName = item['originalName']
  emit('update:mediaId', item['id']);
  emit('update:mediaName', item['originalName']);
}

onMounted(() => {
})

watch(() => props.mediaName, (newName) => {
  localValue.mediaName = newName;
});
</script>

<style scoped lang="scss">
:deep(.el-descriptions__body) {
  background-color: transparent !important;
}



</style>
