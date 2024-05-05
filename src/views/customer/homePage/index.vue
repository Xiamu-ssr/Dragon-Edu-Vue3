<template>
	<div
		style="width: 100%;display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;font-family:CuHei;">
		<!-- 首页顶部  -->
		<div class="wave-blue-card">
		</div>
		<div style="width: 1200px">
			<!--  菜单    -->
			<PageHeader v-model:input="input"/>
			<!-- 顶部卡片 -->
			<el-row :gutter="20" style="margin-top: 20px;">
				<el-col :span="16">
					<el-tabs
						v-model="activeTab"
						:before-leave="beforeLeave"
						class="el-tabs-bg"
						style="border-bottom-left-radius: 20px; border-top-left-radius: 20px;box-shadow: 0 2px 12px -6px black;"
						tab-position="left"
						@tab-click="tabClick">
						<el-tab-pane v-for="(cs,i) in categoryList" :label="cs.name">
							<el-scrollbar height="350px">
								<el-card v-for="(c, j) in cs.children" class="my-card" style="width: 95%; margin:10px">
									<span>{{ c.name }}</span>
									<span style="font-size: 14px;color: #909399;float: right">{{ c.description }}</span>
								</el-card>
							</el-scrollbar>
						</el-tab-pane>
					</el-tabs>
				</el-col>
				<el-col :span="8">
					<el-card
            v-if="userStore.roles.length != 0"
            style="
              display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;
              border-radius: 20px;box-shadow: 0 2px 12px -6px black;
            "
          >
						<el-row style="width: 100%">
              <span style="float: left;font-size: 28px">欢迎登录，{{ userStore.nickname }}</span>
            </el-row>
            <el-row style="margin-top: 40px;display: flex;justify-content: center;align-items: center;">
              <el-progress type="dashboard" :percentage="100" width="140" style="margin-right: 20px" color="#67C23A">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ userSimpleStatistics.courseCount }}门</span>
                  <span class="percentage-label">拥有课程</span>
                </template>
              </el-progress>
              <el-progress type="dashboard" :percentage="customPercentage.percentageShow" width="140" style="margin-left: 20px">
                <template #default="{ percentage }">
                  <span class="percentage-value">{{ customPercentage.percentageLast }}分钟</span>
                  <span class="percentage-label">学习时长</span>
                </template>
              </el-progress>
            </el-row>
            <el-row style="margin-top:40px;margin-bottom: 20px;display: flex;justify-content: center;align-items: center;">
              <el-button type="primary" style="height: 40px;width: 200px" round @click="toPersonalCenter">个人中心</el-button>
            </el-row>
					</el-card>
          <el-card
            v-else
            @click="()=>{router.push({path: '/login'});}"
            class="my-card"
            style="
              display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;
              border-radius: 20px;box-shadow: 0 2px 12px -6px black;
            "
          >
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
			<el-tag effect="light"
					style="font-size: 30px;height: 50px;display: flex;justify-content: center;align-items: center;" type="primary">
				<el-icon size="20" style="width: 20px;">
					<Star/>
				</el-icon>
				<span>&nbsp;为你推荐&nbsp;</span>
				<el-icon size="20" style="width: 20px;">
					<Star/>
				</el-icon>
			</el-tag>
		</el-divider>
		<!-- 热门课程 -->
		<div class="flex flex-wrap" style="width: 1200px;margin-top: 80px">
			<CourseCard
				v-for="(course, index) in hotList"
				:course-base="course"
			/>
		</div>
		<!-- 查看更多 -->
		<el-button round size="large" type="primary" @click="getCourseHotNextPage">
			<el-icon>
				<Download/>
			</el-icon>&nbsp;查看更多&nbsp;<el-icon>
			<Download/>
		</el-icon>
		</el-button>
		<!-- 回到顶部 -->
		<el-backtop :bottom="100" :right="100"/>
		<!-- 页脚 -->
		<PageFooter/>
	</div>
</template>

<script lang="ts" name="HomePage" setup>
import {getESCourseData} from "@/api/es/Open"
import {TabsPaneContext} from "element-plus";
import {CourseQueryBo} from "@/api/course/Hot/types";
import {CourseBaseExtraHotVo} from "@/api/course/types";
import CourseCard from "@/views/customer/homePage/course-card.vue"
import PageHeader from "@/views/customer/homePage/page-header.vue";
import PageFooter from "@/views/customer/homePage/page-footer.vue"
import {getCategory} from "@/utils/my";
import useUserStore from "@/store/modules/user";
import {simpleStatistics} from "@/api/learn/schedule";
import {SimpleStatisticsVo} from "@/api/learn/schedule/types";
const router = useRouter();

const input = ref("");
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const categoryList = ref([])

//个人信息
const userStore = useUserStore();
const userSimpleStatistics = ref<SimpleStatisticsVo>({
  courseCount: 0,
  learnTimeCount: 0
})
const customPercentage = reactive({
  percentageLast: 0,//最终的学习时长，显示文字
  percentageReal: 0,//真实学习时长，备份用
  percentageShow: 0,//动画动态时长，显示动画
})

//首页顶部左侧类别选择
const oldTab = ref("")
const activeTab = ref("")
//首页顶部右侧
const homePageImg01 = ref("")
const homePageImg02 = ref("")
//热门课程
const fileBaseUrl = import.meta.env.VITE_APP_MINIO_FILE_URL;

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
const beforeLeave = (activeName: string, oldActiveName: string) => {
	console.log(activeName, oldActiveName)
}
const tabClick = (pane: TabsPaneContext, ev: Event) => {
	if (pane.index == oldTab.value) {
		console.log(activeTab.value)
		activeTab.value = ""
	} else {
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

//进入个人中心
const toPersonalCenter = () =>{
  proxy?.$tab.openPage("/personalCenter");
}


onMounted(async () => {
	await getCategory(proxy).then(rsp => {
		categoryList.value = rsp
	});
	import("@/assets/images/homePage01.png").then(module => {
		homePageImg01.value = module.default;
	})
	import("@/assets/images/homePage02.png").then(module => {
		homePageImg02.value = module.default;
	})
	getCourseHotNextPage();
  if (userStore.roles.length != 0){
    simpleStatistics().then(rsp=>{
      userSimpleStatistics.value = rsp['data'];
      customPercentage.percentageReal = userSimpleStatistics.value.learnTimeCount

      let interval = setInterval(() => {
        if (customPercentage.percentageReal == null){
          customPercentage.percentageShow = 0;
          clearInterval(interval);
        }else if (customPercentage.percentageShow >= 100){
          customPercentage.percentageShow -= 100;
          customPercentage.percentageReal -= 100;
        } else if (customPercentage.percentageShow < customPercentage.percentageReal){
          const step = (customPercentage.percentageShow+10) < customPercentage.percentageReal ? 10 : (customPercentage.percentageReal-customPercentage.percentageShow)
          customPercentage.percentageShow = customPercentage.percentageShow + step
          customPercentage.percentageLast = customPercentage.percentageLast + step;
        }else {
          clearInterval(interval);
        }
      }, 300);

    })
  }
})

</script>

<style scoped>
:deep(.wave-blue-card) {
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

:deep(.el-input-group__append) {
	background-color: transparent !important;
}

:deep(.el-tabs--left .el-tabs__header.is-left ) {
	width: 200px !important;
	background-color: white !important;
}

:deep(.el-tabs--left .el-tabs__item.is-left ) {
	height: 50px !important;
	font-size: 20px !important;
}

:deep(.el-tabs-bg) {
	background-image: url("src/assets/images/homePage02.png");
	background-repeat: no-repeat;
	background-size: 600px 100%; /* 或使用 100% 100% 来确保完全覆盖 */
	background-position: 200px; /* 根据需要调整 */
}

:deep(.my-card) {
	cursor: pointer;
	transition: transform 0.3s ease; /* 设置放大动画的过渡效果为2秒 */
}

:deep(.my-card:hover) {
	transform: scale(1.02); /* 鼠标悬浮时放大到1.1倍 */
}
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
