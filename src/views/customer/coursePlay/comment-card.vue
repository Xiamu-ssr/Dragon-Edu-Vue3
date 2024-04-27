<template>
  <div>
    <el-rate
      :model-value="star"
      disabled
      show-score
      text-color="#ff9900"
      score-template="{value} points"
    />
  </div>
</template>

<script setup lang="ts">

import {PropType} from "vue";
import {TeachplanVO} from "@/api/course/Open/type";

const props = defineProps({
  star: Object as PropType<number>,
});
const emit = defineEmits(['update:star'])

</script>

<style scoped lang="scss">

</style>
