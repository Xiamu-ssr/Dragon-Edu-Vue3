<template>
  <div style="display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;">
    <el-row style="width: 100%;margin-top: 20px" justify="space-evenly">
      <el-col :span="6">
        <el-rate
          :model-value="localValue.discussStatistics.star"
          disabled
          show-score
          :void-icon="ChatRound"
          :icons="[ChatRound, ChatLineRound, ChatDotRound]"
          :colors="['#F56C6C', '#E6A23C', '#67C23A']"
          score-template="评分 {value} points"
          allow-half
          size="large"
        />
      </el-col>
      <el-divider direction="vertical" style="border-width: 2px;height: 30px;background-color: black"/>
      <el-col :span="6">
        <el-statistic title="评论数量" :value="localValue.discussStatistics.discussCount">
          <template #suffix>
            <el-icon style="vertical-align: -0.125em">
              <ChatLineRound />
            </el-icon>
          </template>
        </el-statistic>
      </el-col>
    </el-row>
    <el-row v-if="localValue.ownCourseOrNot" style="width: 100%;margin-top: 40px">
      <el-card style="width: 100%;border-radius: 10px" shadow="hover">
        <el-input
          v-model="localValue.form.content"
          rows="3"
          maxlength="100"
          style="width: 100%;font-size: 20px"
          placeholder="写下你的想法吧~"
          show-word-limit
          type="textarea"
        />
        <div style="width: 100%;margin: 10px">
          评分 &nbsp;
          <el-rate
            v-model="localValue.form.star"
            show-score
            :void-icon="ChatRound"
            :icons="[ChatRound, ChatLineRound, ChatDotRound]"
            :colors="['#F56C6C', '#E6A23C', '#67C23A']"
            score-template="{value}"
            allow-half
            size="large"
          />
          <el-button @click="addOneDiscuss" type="primary" plain style="float: right;">发表评论</el-button>
        </div>
      </el-card>

    </el-row>
    <el-divider>
      最新评论
    </el-divider>
    <el-row style="width: 100%;margin-top: 20px">
      <SingleDiscussCard
        v-for="(discuss,index) in localValue.discussList"
        v-model:discuss="localValue.discussList[index]"
        style="margin-bottom: 20px"
      />
    </el-row>

  </div>
</template>

<script setup lang="ts">

import {PropType} from "vue";
import {TeachplanVO} from "@/api/course/Open/type";
import {StatisticsVO} from "@/api/discuss/statistics/types";
import {ChatDotRound, ChatLineRound, ChatRound} from "@element-plus/icons-vue";
import {DiscussForm, DiscussQuery, DiscussVO} from "@/api/discuss/discuss/types";
import {addDiscuss, listDiscuss} from "@/api/discuss/discuss";
import {CourseBaseVO} from "@/api/course/types";
import useUserStore from "@/store/modules/user";
import {HttpStatus} from "@/enums/RespEnum";
import {getStatisticsByCourseId} from "@/api/discuss/statistics";
import SingleDiscussCard from "@/views/customer/coursePlay/single-discuss-card.vue";

//对外变量
const props = defineProps({
  courseBase: Object as PropType<CourseBaseVO>,
  ownCourseOrNot: Object as PropType<Boolean>
})
const emit = defineEmits(['update:courseBase','update:ownCourseOrNot'])
//本地变量
const localValue = reactive({
  courseBase: computed({
    get: () => props.courseBase,
    set: (value) => {}
  }),
  ownCourseOrNot: computed({
    get: () => props.ownCourseOrNot,
    set: (value) => {}
  }),
  discussStatistics: <StatisticsVO> {
    discussCount: 0,
    star: 5.0
  },
  discussList: <DiscussVO[]>[],
  loading: false,
  //默认按时间新旧顺序
  total: 0,
  queryParams: <DiscussQuery>{
    courseId: undefined,
    pageNum: 1,
    pageSize: 10
  },
  initFormData: <DiscussForm> {
    courseId: undefined,
    courseName: undefined,
    companyId: undefined,
    avatar: undefined,
    content: undefined,
    star: undefined,
  },
  form: <DiscussForm> {
    courseId: undefined,
    courseName: undefined,
    companyId: undefined,
    avatar: undefined,
    content: undefined,
    star: undefined,
  }
})
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const userStore = useUserStore();


/** 查询课程评论列表 */
const getList = async () => {
  localValue.loading = true;
  localValue.queryParams.courseId = localValue.courseBase.id;
  const res = await listDiscuss(localValue.queryParams);
  localValue.discussList = res.rows;
  localValue.total = res.total;
  localValue.loading = false;
}

/** 查询评论统计数据 */
const getStatistics = ()=>{
  getStatisticsByCourseId(localValue.courseBase.id).then(rsp=>{
    localValue.discussStatistics.discussCount = rsp.data.discussCount
    localValue.discussStatistics.star = parseFloat(parseFloat(rsp.data.star.toString()).toFixed(1));
  })
}


/** 新增评论 */
const addOneDiscuss = () =>{
  localValue.form.courseId = localValue.courseBase.id;
  localValue.form.courseName = localValue.courseBase.name;
  localValue.form.companyId = localValue.courseBase.companyId;
  localValue.form.avatar = userStore.avatar;
  for (const key in localValue.form) {
    if (localValue.form[key] == null){
      proxy?.$modal.msgWarning("评论发表存在未填写字段,请检查后再次发表");
      return;
    }
  }
  if (localValue.form.content?.trim() == ""){
    proxy?.$modal.msgWarning("评论内容不能为空");
    return;
  }
  if (localValue.form.star == null || localValue.form.star == 0.0){
    proxy?.$modal.msgWarning("评分不能为空或者0");
    return;
  }
  addDiscuss(localValue.form).then(rsp=>{
    // console.log(rsp)
  }).finally(()=>{
    reset();
    getList();
    getStatistics();
  })
}

const reset = ()=>{
  localValue.form = {...localValue.initFormData}
}


onMounted(()=>{
})

// 使用 watch 监听主组件传递过来的 courseBaseVO 的变化
watch(() => props.courseBase, (newValue: CourseBaseVO | undefined) => {
  if (newValue == null || Object.keys(newValue).length === 0){
    console.log("courseBase暂时没有数据，不会获取课程评论信息")
  }else {
    getList();
    getStatistics();
  }
});

</script>

<style scoped lang="scss">

</style>
