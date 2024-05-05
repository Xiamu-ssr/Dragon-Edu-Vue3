<template>
  <el-row style="width: 100%;">
    <el-col :span="2">
      <el-avatar
        :src="discuss?.avatar"
        fit="cover"
        :size="50"
      />
    </el-col>
    <el-col :span="22">
      <div>
        <span style="font-size: 16px">{{ discuss.userName }}</span>
      </div>
      <div>
        <span style="font-size: 12px;color: #909399">已学习{{ discuss.learnTime }}分钟时评论</span>
        <el-divider direction="vertical"></el-divider>
        <el-rate
          :model-value="discuss?.star"
          disabled

          :void-icon="ChatRound"
          :icons="[ChatRound, ChatLineRound, ChatDotRound]"
          :colors="['#F56C6C', '#E6A23C', '#67C23A']"
          allow-half
          size="small"
        />
      </div>
      <div style="margin-top: 5px">
        <span>{{ discuss.content }}</span>
      </div>
    </el-col>
  </el-row>
</template>
<script setup lang="ts">
import {PropType} from "vue";
import {StatisticsVO} from "@/api/discuss/statistics/types";
import {DiscussVO} from "@/api/discuss/discuss/types";
import {ChatDotRound, ChatLineRound, ChatRound} from "@element-plus/icons-vue";

const props = defineProps({
  discuss: Object as PropType<DiscussVO>
})
const emit = defineEmits(['update:discuss'])
//本地变量
const localValue = reactive({
  discuss: computed({
    get: () => props.discuss,
    set: (value) => emit('update:discuss', value)
  })
})
</script>
<style scoped lang="scss">

</style>
