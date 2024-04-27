<template>
  <el-row style="width: 100%;border-radius: 20px;display: flex;align-items: center;padding: 0px;background-color: white">
      <el-col :span="8" style="padding: 10px">
        <el-image
          v-if="!loadError"
          :src="fileBaseUrl+teacher?.photograph"
          fit="fill"
          style="width: 100px; border-radius: 10px"
          @error="errorT"
        />
        <el-icon
          v-else
          style="height: 100px;width: 100px;border-radius: 10px;background-color: #909399"
          :size="30"
        >
          <Picture />
        </el-icon>
      </el-col>
      <el-col :span="16">
        <span style="font-size: 30px">{{ teacher?.name }}</span>
        &nbsp;&nbsp;|&nbsp;&nbsp;
        <span style="font-size: 18px">{{ teacher?.position }}</span>
        <div style="bottom: 0">
          <span style="font-size: 14px">{{ teacher?.introduction }}</span>
        </div>
      </el-col>
  </el-row>
</template>
<script setup lang="ts">
import {PropType} from "vue";
import {TeacherVO} from "@/api/course/Open/type";
const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;
const loadError = ref(false)

const props = defineProps({
  teacher: Object as PropType<TeacherVO>,
});
const emit = defineEmits(['update:teacher'])

const errorT = () =>{
  loadError.value = true;
}
console.log("test")
</script>

<style scoped lang="scss">
:deep(.image-slot) {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background: var(--el-fill-color-light);
  color: var(--el-text-color-secondary);
  font-size: 30px;
}
:deep(.image-slot .el-icon) {
  font-size: 30px;
}
</style>
