<template>
  <div style="width: 100%;display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;font-family:CuHei;">
    <!-- 首页顶部  -->
    <div class="wave-blue-card" >
    </div>
    <div style="width: 1200px">
      <!--  菜单    -->
      <el-menu
        class="el-menu-demo"
        mode="horizontal"
        :ellipsis="false"
        style="background-color: white;display: flex;align-items: center; border-radius: 20px;height: 70px"
      >
        <el-menu-item index="0">
          <img
            style="height: 50px;"
            src="@/assets/images/logo.png"
            alt="龙腾四海，智行天下"
          />
        </el-menu-item>
        <el-menu-item>
          <el-input
            v-model="input"
            style="width: 400px"
            placeholder="搜索课程"
          >
            <template #append>
              <el-button type="primary"  :icon="Search" />
            </template>
          </el-input>
        </el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="1">个人中心</el-menu-item>
      </el-menu>
      <!-- 顶部卡片 -->
      <el-row style="margin-top: 20px;" :gutter="20">
        <el-col :span="16">
          <el-tabs
            class = "el-tabs-bg"
            v-model="activeTab"
            tab-position="left"
            :before-leave="beforeLeave"
            @tab-click="tabClick"
            style="border-bottom-left-radius: 20px; border-top-left-radius: 20px;box-shadow: 0 2px 12px -6px black;">
            <el-tab-pane v-for="(cs,i) in categoryList" :label="cs.name" >
              <el-card v-for="(c, j) in cs.children" style="width: 100%">
                {{ c.name }}
              </el-card>
            </el-tab-pane>
          </el-tabs>
        </el-col>
        <el-col :span="8">
          <el-card style="
            display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;
            border-radius: 20px;box-shadow: 0 2px 12px -6px black;
          ">
            <el-image
              :src="homePageImg01"
              fit="fill"
              style="height: 310px"
            />
          </el-card>
        </el-col>
      </el-row>
    </div>
    <!-- 为你推荐 -->
    <el-divider style="margin-top: 100px;">
      <el-tag style="font-size: 30px;height: 50px;display: flex;justify-content: center;align-items: center;" type="primary" effect="light">
        <el-icon style="width: 20px;" size="20"><Star /></el-icon>
        <span >&nbsp;为你推荐&nbsp;</span>
        <el-icon style="width: 20px;" size="20"><Star /></el-icon>
      </el-tag>
    </el-divider>
    <!-- 热门课程 -->
    <div class="flex flex-wrap" style="width: 1200px;margin-top: 20px">
      <CourseCard
        v-for="(course, index) in hotList"
        :course-base="course"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {Search} from "@element-plus/icons-vue";
import {listCategory} from "@/api/course/Open";
import {getESCourseData} from  "@/api/es/Open"
import {TabsPaneContext} from "element-plus";
import {CourseQueryBo} from "@/api/course/Hot/types";
import {CourseBaseVO} from "@/api/course/types";
import CourseCard from "@/views/customer/homePage/course-card.vue"

const input = ref("");
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const categoryList = ref([])

//首页顶部左侧类别选择
const oldTab = ref("")
const activeTab = ref("")
//首页顶部右侧
const homePageImg01 = ref("")
const homePageImg02 = ref("")
//热门课程
const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;
interface CourseBaseExtraHotVo extends CourseBaseVO {
  isHot: boolean;
}
const loadingHot = ref(false)
const hotPage = reactive<CourseQueryBo>({
  pageNum: 0,
  pageSize: 6,
  total: 0,
  name: undefined,
  mt: undefined,
  st: undefined,
  charge: undefined,
  isHot: true,
  orderByParam: {
    order: undefined,
    sort: undefined
  }
});
const hotList = ref<CourseBaseExtraHotVo[]>([]);


/** 分类 */
const getCategory = async () => {
  //获取分类列表
  const resCategory = await listCategory();
  categoryList.value = proxy?.handleTree(resCategory, 'id', 'parentid');
  console.log(categoryList.value)
}
const beforeLeave = (activeName:string, oldActiveName:string)=>{
  console.log(activeName, oldActiveName)
}
const tabClick = (pane: TabsPaneContext, ev: Event) =>{
  if (pane.index == oldTab.value){
    console.log(activeTab.value)
    activeTab.value = ""
  }else {
    oldTab.value = pane.index
  }
}

/** 热门课程 */
const getCourseHotNextPage = async () => {
  loadingHot.value = true;
  if (hotPage.pageNum == 0) {
    hotPage.pageNum = 1
  } else if (hotPage.pageNum < Math.ceil(hotPage.total / hotPage.pageSize)) {
    hotPage.pageNum++;
  } else {
    proxy?.$modal.msgWarning("已经翻到底啦！")
    loadingHot.value = false;
    return;
  }
  getESCourseData(hotPage).then(rsp => {
    console.log("getESCourseData", rsp);
    hotList.value.push(...rsp.list);
    hotPage.total = rsp.total;
  }).finally(() => {
    loadingHot.value = false;
  })
}



onMounted(()=>{
  getCategory();
  import("@/assets/images/homePage01.png").then(module=>{
    homePageImg01.value = module.default;
  })
  import("@/assets/images/homePage02.png").then(module=>{
    homePageImg02.value = module.default;
  })
  getCourseHotNextPage();
})

</script>

<style scoped>
:deep(.wave-blue-card){
  background-image: url("src/assets/svg/wave_blue_static.svg");
  background-repeat: no-repeat;
  background-size: cover; /* 或使用 100% 100% 来确保完全覆盖 */
  background-position: center; /* 根据需要调整 */
  overflow: hidden; /* 避免内容溢出 */
  position: absolute; /* 固定定位，不随滚动条移动 */
  top: 0;
  left: 0;
  width: 100%;
  height: 400px !important; /* 固定高度 */
  z-index: -1; /* 设置层级在最底下 */
}
:deep(.el-input-group__append){
  background-color: transparent !important;
}

:deep(.el-tabs--left .el-tabs__header.is-left ){
  width: 200px !important;

  background-color: white !important;
}
:deep(.el-tabs--left .el-tabs__item.is-left ){
  height: 50px !important;
  font-size: 20px !important;
}
:deep(.el-tabs-bg){
  background-image: url("src/assets/images/homePage02.png");
  background-repeat: no-repeat;
  background-size: 600px 100%; /* 或使用 100% 100% 来确保完全覆盖 */
  background-position: 200px; /* 根据需要调整 */
}

</style>
