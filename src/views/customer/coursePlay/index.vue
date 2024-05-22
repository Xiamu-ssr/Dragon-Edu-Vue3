<template>
	<div style="width: 100%;display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;font-family:CuHei;">
		<div class="wave-blue-card" >
		</div>
		<div style="width: 1200px">
			<!--Menu-->
			<PageHeader v-model:input="input"/>
			<!--	面包屑		-->
			<el-breadcrumb :separator-icon="ArrowRight" style="float: left;margin-top: 40px">
				<el-breadcrumb-item :to="{ path: '/courseSearch' }">全部课程</el-breadcrumb-item>
				<el-breadcrumb-item v-if="courseAll">{{ showCategoryById(categoryList, courseAll.mt, undefined, 2)}}</el-breadcrumb-item>
				<el-breadcrumb-item v-if="courseAll">{{ showCategoryById(categoryList, courseAll.mt, courseAll.st, 3)}}</el-breadcrumb-item>
				<el-breadcrumb-item v-if="courseAll">{{ courseAll.name }}</el-breadcrumb-item>
			</el-breadcrumb>
			<!-- 播放器 -->
      <VideoPlay style="margin-top: 20px" v-model:video-src="videoSrc" />
			<!-- 简单信息 -->
			<div>
				<div style="float: left;font-size: 30px;margin-top: 10px">
					<div>{{ courseAll?.name }}</div>
					<el-tag v-if="courseAll?.charge" type="warning" size="large" effect="plain">
						<span style="font-size: 20px;font-weight: bold">￥{{ courseAll?.price }}</span>
						&nbsp;&nbsp;
						<span class="slash-deleted-text" style="font-size: 14px;color: #909399">{{ courseAll?.originalPrice }}</span>
					</el-tag>
					<el-tag v-else type="success" size="large" effect="plain"><span style="font-size: 20px">免费</span></el-tag>
				</div>
				<div style="float: right;margin-top: 10px">
					<el-button v-if="!ownCourseOrNot" type="primary" style="height: 50px; font-size: 26px;border-radius: 30px" @click="addCourse" round>
						&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<el-icon><Plus /></el-icon><span>加入课程表</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
					</el-button>
                    <el-button v-else type="info" style="height: 50px; font-size: 26px;border-radius: 30px" round disabled>
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span>已加入课程表</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    </el-button>
				</div>
			</div>
		</div>
		<!-- 详细信息 -->
		<div style="
		  width: 100%; background-color: #E5EAF3;
		  display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;
		  margin-top: 40px;
    ">
			<div style="width: 1200px">
				<el-row style="margin: 20px" gutter="10">
          <!-- 课程信息 -->
          <el-col :span="16">
            <el-card style="border-radius: 20px;" shadow="hover">
              <el-tabs v-model="activeName" class="demo-tabs">
                <el-tab-pane label="课程介绍" name="1">
                  <el-row style="margin-top: 20px">
                    <el-col :span="8">
                      <el-image
                        :src="fileBaseUrl+courseAll?.pic"
                        fit="fill"
                        style="width: 200px"
                      />
                    </el-col>
                    <el-col :span="16">
                      <el-tag
                        v-for="tag in courseAll?.tags.split(',')"
                        style="margin: 10px"
                      >
                        {{ tag }}
                      </el-tag>
                      <div style="margin: 10px">
                        <span>{{ courseAll?.description }}</span>
                      </div>

                    </el-col>
                  </el-row>
                  <el-descriptions
                    style="margin-top: 40px"
                    title="联系方式"
                    :column="2"
                    border
                  >
                    <el-descriptions-item v-if="courseAll?.email" label="email">{{ courseAll?.email }}</el-descriptions-item>
                    <el-descriptions-item v-if="courseAll?.qq" label="qq">{{ courseAll?.qq }}</el-descriptions-item>
                    <el-descriptions-item v-if="courseAll?.wechat" label="wechat">{{ courseAll?.wechat }}</el-descriptions-item>
                    <el-descriptions-item v-if="courseAll?.phone" label="phone">{{ courseAll?.phone }}</el-descriptions-item>

                  </el-descriptions>
                </el-tab-pane>
                <el-tab-pane label="课程目录" name="2">
                  <TeachplanCard :teachplan="courseAll?.teachplan" @my-event="clickSmallChapter"/>
                </el-tab-pane>
                <el-tab-pane label="用户评论" name="3">
                  <CommentCard
                    v-model:course-base="orderPayParams.courseBase"
                    v-model:own-course-or-not="ownCourseOrNot"
                  />
                </el-tab-pane>
              </el-tabs>
            </el-card>
          </el-col>
          <!-- 教师信息 -->
          <el-col :span="8">
            <TeacherCard
              v-for="t in courseAll?.teacherList"
              :teacher="t"
              style="margin-bottom: 10px"
            />
          </el-col>
        </el-row>
			</div>
		</div>
    <!-- 页脚 -->
    <PageFooter/>
    <!-- 支付 -->
    <CourseBuy
      v-model:dialog-visible="orderPayParams.dialogVisible"
      v-model:course-base="orderPayParams.courseBase"
    />
      <!--<el-button @click="queryMQTest" >testMQ</el-button>-->
  </div>
</template>

<script lang="ts" setup>
import PageHeader from "@/views/customer/homePage/page-header.vue";
import {ArrowRight} from "@element-plus/icons-vue";
import {getCourseAll, listCategory} from "@/api/course/Open";
import {getCategory, showCategoryById, sleep} from "@/utils/my";
import {useRoute} from "vue-router";
import {CourseAllVO} from "@/api/course/Open/type";
import CourseCard from "@/views/customer/homePage/course-card.vue";
import TeacherCard from "@/views/customer/coursePlay/teacher-card.vue";
import PageFooter from "@/views/customer/homePage/page-footer.vue";
import TeachplanCard from "@/views/customer/coursePlay/teachplan-card.vue";
import CommentCard from "@/views/customer/coursePlay/comment-card.vue";
import VideoPlay from "@/views/customer/coursePlay/video-play.vue";
import {getChapterVideo} from "@/api/media/Open";
import {bool} from "vue-types";
import CourseBuy from "@/views/customer/coursePlay/course-buy.vue";
import {addFreeCourse, addLearnTime, isOwnCourse} from "@/api/learn/schedule";
import {HttpStatus} from "@/enums/RespEnum";
import {CourseBaseVO} from "@/api/course/types";
import {queryMQTest} from "@/api/order/pay";

const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;
const route = useRoute();
//搜索
const input = ref("")
// 分类数据
const categoryList = ref([])
const categorySmallList = ref([])
//课程数据
const courseAll = ref<CourseAllVO>()
const activeName = ref('1')
const videoSrc = ref("")
// const videoSrc = ref("0/9/092882c28b3835e5b49d1559a79ef5ae.mp4")
//支付
const orderPayParams = reactive({
  dialogVisible: false,
  courseBase: computed(()=>{
    const base:CourseBaseVO = {...courseAll.value}
    return base;
  }),
});
//课程表
const ownCourseOrNot = ref(false);
// 用于存储进入页面的时间戳
const startTime = ref(0);
// 用于存储离开页面的时间戳
const endTime = ref(0);


//点击小章节
const clickSmallChapter = (teachplanId: string | number | undefined | null) =>{
  getChapterVideo(courseAll.value?.id+"", teachplanId+"").then(rsp=>{
    const data = rsp.data;
    console.log(data)
    if(data['code'] == 1){
      videoSrc.value = rsp.data['path']
    }else if (data['code'] == 2){
      //need buy
      proxy?.$modal.msgWarning(data['msg'])
    }else if(data['code'] == 3){
      proxy?.$modal.msgWarning(data['msg'])
    }
  })
}

//取到第一个视频播放地址
const getFirstVideo = () =>{
  if (!courseAll.value?.charge){
    for (const largeC of courseAll.value?.teachplan || []) {
      for (const smallC of largeC.chapter) {
        if (smallC.mediaId != null && smallC.mediaId.toString().trim() != "") {
          clickSmallChapter(smallC.id);
          return;
        }
      }
    }
  }else {
    for (const largeC of courseAll.value?.teachplan || []) {
      for (const smallC of largeC.chapter) {
        if (smallC.mediaId != null && smallC.mediaId.toString().trim() != "" && smallC.isPreview) {
          clickSmallChapter(smallC.id);
          return;
        }
      }
    }
  }
  proxy?.$modal.msgWarning("此课程没有可免费试看视频~");
}

//加入课程表
const addCourse = ()=>{
  if (!courseAll.value?.charge){
    addFreeCourse(courseAll.value?.id).then(rsp=>{
      if (rsp.code != HttpStatus.SUCCESS){
        proxy?.$modal.msgSuccess("请先购买课程");
        orderPayParams.dialogVisible = true;
      }
    }).finally(()=>{
      sleep(1000).then(rsp=>{
        window.location.reload();
      });
    })
  }else {
    proxy?.$modal.msgSuccess("请先购买课程");
    orderPayParams.dialogVisible = true;
  }
}

onMounted(async () => {
  getCategory(proxy).then(rsp=>{
    categoryList.value = rsp
  });
  await getCourseAll(route.query.courseId).then(rsp=>{
    courseAll.value = rsp.data
    getFirstVideo();
  });
  await isOwnCourse(courseAll.value?.id).then(rsp=>{
    ownCourseOrNot.value = rsp['data']
  });
  if (ownCourseOrNot.value){
	  startTime.value = Date.now();
  }
})

onBeforeUnmount(async () => {
	// 记录用户离开页面的时间
	if (ownCourseOrNot.value) {
		endTime.value = Date.now();
		const duration = (endTime.value - startTime.value) / (1000*60); // 分钟
		console.log("Duration spent on page: ", duration, "mins");
    if (duration >= 1){
      await addLearnTime(courseAll.value?.id, duration);
    }
	}
});

</script>

<style scoped>

</style>
