<template>
  <el-tree
    style="max-width: 600px"
    :data="teachplan"
    :props="{label:'pname', children: 'chapter', class: customNodeClass}"
  >
    <template #default="{ node, data }">
      <el-card v-if="data.grade == 1" style="width: 100%; border-radius: 20px">
        <span>{{ node.label }}</span>
      </el-card>
      <el-row v-else style="font-size: 20px;width: 100%" @click="clickSmallChapter(data)">
        <el-col :span="8">{{ node.label }}</el-col>
        <el-col :span="8">
          <el-icon v-if="data.mediaId.trim() != ''" color="#409EFF" :size="20"><VideoCamera /></el-icon>
        </el-col>
        <el-col :span="8">
          <el-tag v-if="data.isPreview">试看</el-tag>
        </el-col>
      </el-row>
    </template>
  </el-tree>
</template>

<script lang="ts" setup>
import {PropType} from "vue";
import {TeachplanVO} from "@/api/course/Open/type";
const {proxy} = getCurrentInstance() as ComponentInternalInstance;

const props = defineProps({
  teachplan: Object as PropType<TeachplanVO[]>,
});
const emit = defineEmits(['update:teachplan', 'myEvent'])

const customNodeClass = (data: TeachplanVO, node: Node) => {
  if (data.grade == 1) {
    return 'large-chapter'
  }else if (data.grade == 2){
    return 'small-chapter'
  }
  return null
}
const clickSmallChapter = (teachplan: TeachplanVO)=>{
  if (teachplan.mediaId == undefined || (teachplan.mediaId+"").trim() == ""){
    proxy?.$modal.msgWarning("此章节貌似没有视频诶~")
    return
  }
  emit('myEvent',teachplan.id);
}

</script>

<style scoped>
:deep(.large-chapter > .el-tree-node__content) {
  font-size: 20px;
  height: 40px;
  margin-top: 20px;
  margin-bottom: 40px;
}

:deep(.small-chapter > .el-tree-node__content) {
  height: 30px;
  margin-top: 10px;
  margin-bottom: 20px;
}

</style>
