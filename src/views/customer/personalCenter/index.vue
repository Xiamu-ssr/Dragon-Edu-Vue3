<template>
  <div style="
    width: 100%;
    display: flex;flex-direction: column; /* 设置子元素垂直排列 */justify-content: center;align-items: center;
    font-family:CuHei;
  ">
    <div style="background-color: #2b2f3a;height: 100px;position: absolute" >
    </div>
    <div style="width: 1200px">
      <!--Menu-->
      <PageHeader/>
      <!--个人中心-->
      <el-row style="margin-top: 40px">
        <el-col :span="5">
          <el-menu
            active-text-color="#409EFF"
            background-color="#E5EAF3"
            default-active="1"
            text-color="black"
          >
            <el-menu-item index="1" @click="()=>{currentComponent=ClassSchedule}">
              <el-icon :size="20"><DataLine /></el-icon>
              <span style="font-size: 20px">课程表</span>
            </el-menu-item>
            <el-menu-item index="2" @click="()=>{currentComponent=MyOrder}">
              <el-icon :size="20"><Tickets /></el-icon>
              <span style="font-size: 20px">我的订单</span>
            </el-menu-item>
            <el-menu-item index="3" @click="()=>{currentComponent=Profile}">
              <el-icon :size="20"><Setting /></el-icon>
              <span style="font-size: 20px">个人信息</span>
            </el-menu-item>
          </el-menu>
        </el-col>
        <el-col :span="1"></el-col>
        <el-col :span="18">
          <el-card shadow="hover" style="background-color: #E5EAF3">
            <currentComponent />
          </el-card>

        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup lang="ts">
import PageHeader from "@/views/customer/homePage/page-header.vue";
import Profile from '@/views/system/user/profile/index.vue';
import ClassSchedule from "@/views/customer/personalCenter/class-schedule.vue";
import MyOrder from "@/views/customer/personalCenter/my-order.vue";

const currentComponent = ref(ClassSchedule)

</script>

<style scoped lang="scss">

</style>
