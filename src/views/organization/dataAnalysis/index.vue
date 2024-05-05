<template>
  <div class="p-2" style="font-family:CuHei;">
    <!--顶部四张分析卡片-->
    <el-row gutter="20" style="margin-top: 20px">
      <el-col :span="6">
        <el-card class="my-top-card">
          <el-row>
            <el-col :span="17" :offset="1">
              <div>订单数&nbsp;Orders</div>
              <div><span>{{ statisticsData.orderNum }}</span></div>
              <div><span style="color: #67C23A">{{ statisticsData.orderThisWeek }}&nbsp;new</span>&nbsp;本周新订单</div>
            </el-col>
            <el-col :span="6">
              <el-avatar shape="square" :size="40" style="background-color: #4076ff44;">
                <el-icon color="#4076ff" :size="28"><ShoppingCart /></el-icon>
              </el-avatar>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="my-top-card">
          <el-row>
            <el-col :span="17" :offset="1">
              <div>盈利&nbsp;Revenue</div>
              <div><span>￥{{ statisticsData.revenue.toLocaleString() }}</span></div>
              <div><span style="color: #E6A23C">{{ statisticsData.revenueGrowRate }}&nbsp;%</span>&nbsp;上周盈利增长率</div>
            </el-col>
            <el-col :span="6">
              <el-avatar shape="square" :size="40" style="background-color: #E6A23C44;">
                <el-icon color="#E6A23C" :size="28"><Coin /></el-icon>
              </el-avatar>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="my-top-card">
          <el-row>
            <el-col :span="17" :offset="1">
              <div>课程数&nbsp;Course</div>
              <div><span>{{ statisticsData.courseNum }}&nbsp;门</span></div>
              <div><span style="color: #67C23A">{{ statisticsData.teachplanNum }}&nbsp;</span>&nbsp;章节数量</div>
            </el-col>
            <el-col :span="6">
              <el-avatar shape="square" :size="40" style="background-color: #40c6ff44;">
                <el-icon color="#40c6ff" :size="28"><Reading /></el-icon>
              </el-avatar>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="my-top-card">
          <el-row>
            <el-col :span="17" :offset="1">
              <div>评论数&nbsp;Discuss</div>
              <div><span>{{ statisticsData.discussNum }}</span></div>
              <div><span style="color: #67C23A">{{ statisticsData.discussGood }}&nbsp;</span>&nbsp;高分评论</div>
            </el-col>
            <el-col :span="6">
              <el-avatar shape="square" :size="40" style="background-color: #821cc644;">
                <el-icon color="#821cc6" :size="28"><ShoppingCart /></el-icon>
              </el-avatar>
            </el-col>
          </el-row>
        </el-card>
      </el-col>
    </el-row>
    <!-- 中部数据-最近订单和近期盈利  -->
    <el-row gutter="20" style="margin-top: 20px;">
      <el-col :span="12">
        <el-card>
          <div style="margin-bottom: 10px"><span style="font-size: 20px">最近订单&nbsp;Recent Sales</span></div>
          <el-table :data="statisticsData.currentOrders" height="350" style="width: 100%">
            <el-table-column prop="pic" label="图片"/>
            <el-table-column prop="courseName" label="课程名称" sortable />
            <el-table-column prop="price" label="价格" sortable />
            <el-table-column label="操作">
              <template #default="scope">
                <el-tooltip content="查看" placement="top">
                  <el-button icon="Search" link type="primary"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div style="margin-bottom: 10px"><span style="font-size: 20px">销售预览&nbsp;Sales Overview</span></div>
          <div ref="myEchart" style="width: 100%; height: 350px"></div>
        </el-card>
      </el-col>
    </el-row>
    <!-- 底部数据-热门课程和公告 -->
    <el-row gutter="20" style="margin-top: 20px">
      <el-col :span="12">
        <el-card>
          <div style="margin-bottom: 10px"><span style="font-size: 20px">最受欢迎的课程&nbsp;Best Popular Course</span></div>
          <el-table :data="statisticsData.bestCourse" height="200" style="width: 100%" :show-header="false">
            <el-table-column prop="courseName" label="课程名称" />
            <el-table-column prop="hot" label="热度">
              <template #default="scope">
                <el-progress :stroke-width="12" :percentage="scope.row.hot" color="#F56C6C">
                  <template #default="{ percentage }">
                    <span style="color: #F56C6C;">&nbsp;{{ percentage }}%</span>
                  </template>
                </el-progress>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div style="margin-bottom: 10px"><span style="font-size: 20px">最近公告&nbsp;Notifications</span></div>
          <el-scrollbar height="200px">
            <notice/>
          </el-scrollbar>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import {DiscussStatusEnum} from "@/enums/DiscussStatusEnum";
import {MediaStatusEnum} from "@/enums/MediaStatusEnum";
import notice from '@/layout/components/notice/index.vue';

const statisticsData = ref({
  orderNum : 152, // 订单总数量
  orderThisWeek : 24, //本周新订单数
  revenue : 2100, // 总盈利额
  revenueGrowRate: 54, // 上周整周盈利额增长率
  courseNum : 24, //课程数量
  teachplanNum : 245, //章节数量
  discussNum : 245, // 评论总数
  discussGood : 45, //高于等于4.0分的高分推荐
  currentOrders: [ // 最新的10个订单,
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0},
    {pic:"", courseName:"Java开发", price:52.0}
  ],
  saleData: {//7周销售统计-不算本周
    xAxis: ['03.01-03.07', '03.01-03.07', '03.01-03.07', '03.01-03.07', '03.01-03.07', '03.01-03.07', '03.01-03.07'],
    saleNum: [20, 92, 91, 94, 1290, 130, 120],
    saleMoney: [820, 932, 901, 934, 1290, 1330, 1320],
    saleSingle: [20, 192,41, 93, 129, 130, 60],
    saleGrowRate: [10, 1, -2, 14, -10, 0, 10],
  },
  bestCourse: [
    {courseName: "Java开发", hot: 90},
    {courseName: "Java开发", hot: 90},
    {courseName: "Java开发", hot: 90},
    {courseName: "Java开发", hot: 90},
    {courseName: "Java开发", hot: 90},
  ], //本周最收欢迎的5门课程
})

const { proxy } = getCurrentInstance()//获取Vue3全局配置
const myEchart = ref();//用来获取对应标签组件

const loadMyEchart=()=>{
  var infoEl = myEchart.value;//获取ref="info"的标签组件
  var userEc = proxy.$echarts.init(infoEl, "light");//proxy.$echarts是在获取全局配置中的echarts，这样就不需要在每个vue中import echarts了

  let option = {
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: statisticsData.value.saleData.xAxis
    },
    yAxis: [
      {
        type: 'value',
        name: '销售量/销售额',
        position: 'left',
        axisLabel: {
          formatter: '{value}'
        }
      },
      {
        type: 'value',
        name: '增长率',
        position: 'right',
        axisLabel: {
          formatter: '{value} %'
        },
        splitLine: {
          show: false  // 可以选择是否显示网格线
        }
      }
    ],
    tooltip: {
      trigger: 'axis',  // 配置提示工具，激活坐标轴触发
      axisPointer: {
        type: 'cross'   // 使用十字准线指示器
      }
    },
    legend: {
      data: ['销售量', '销售额', '每单收入', '增长率'],
      selected: {
        '销售量': true,
        '销售额': true,
        '每单收入': false,
        '增长率': false
      }
    },
    series: [
      {
        name: "销售量",
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#303133'
        }
      },
      {
        name: "销售额",
        data: [20, 92, 91, 94, 1290, 130, 120],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#67C23A'
        }
      },
      {
        name: "每单收入",
        data: [22, 90, 10, 40, 190, 130, 20],
        type: 'line',
        smooth: true,
        lineStyle: {
          color: '#909399'
        },
      },
      {
        name: '增长率',
        yAxisIndex: 1, // 指定使用第二个 Y 轴（右侧）
        data: [10, 1, -2, 14, -10, 0, 10],
        type: 'line',
        smooth: false,
        lineStyle: {
          color: '#E6A23C',
          type: 'dashed'  // 设置线型为虚线
        }
      }
    ]
  };
  userEc.setOption(option);//将图标挂载到标签组件
}

onMounted(()=>{
  loadMyEchart();
})

</script>
<style scoped lang="scss">
.my-top-card{
  :deep(.el-col:first-child > div ){
    margin-top: 10px;
  }

  :deep(.el-col:first-child > div:nth-child(1) ){
    font-size: 16px !important;
    font-weight: bold;
    color: #636466 !important;
  }

  :deep(.el-col:first-child > div:nth-child(2) ){
    font-size: 22px;
    font-weight: bold;
  }

  :deep(.el-col:first-child > div:nth-child(3) ){
    font-size: 12px;
  }

  :deep(.el-col:nth-child(2) ){
    display: flex;justify-content: center;align-items: center;

    :deep(.el-avatar){
      display: flex;justify-content: center;align-items: center;
    }
  }

}

</style>
