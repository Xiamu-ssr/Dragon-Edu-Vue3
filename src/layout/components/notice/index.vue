<template>
  <div class="layout-navbars-breadcrumb-user-news" v-loading="state.loading">
    <div class="head-box">
      <div class="head-box-title">通知公告</div>
      <!--<div class="head-box-btn" @click="readAll">全部已读</div>-->
    </div>
    <div class="content-box" v-loading="state.loading">
      <template v-if="newsList.length > 0">
        <div class="content-box-item" v-for="(v, k) in newsList" :key="k" @click="openNotice(k)">
          <!--原始的，被我修改了-->
          <!--<div class="item-conten">-->
          <!--  <div>{{ v.message }}</div>-->
          <!--  <div class="content-box-msg"></div>-->
          <!--  <div class="content-box-time">{{ v.time }}</div>-->
          <!--</div>-->
          <!--&lt;!&ndash; 已读/未读 &ndash;&gt;-->
          <!--<span v-if="v.read" class="el-tag el-tag&#45;&#45;success el-tag&#45;&#45;mini read">已读</span>-->
          <!--<span v-else class="el-tag el-tag&#45;&#45;danger el-tag&#45;&#45;mini read">未读</span>-->
          <div class="item-conten">
            <div>{{ v.noticeTitle }}</div>
            <div class="content-box-msg"></div>
            <div class="content-box-time">{{ v.createTime }}</div>
          </div>
          <!-- 公告类型 -->
          <dict-tag :options="sys_notice_type" :value="v.noticeType" />

        </div>
      </template>
      <el-empty :description="'消息为空'" v-else></el-empty>
    </div>
    <!-- 添加或修改公告对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="800px" :close-on-click-modal="false"  append-to-body>
      <el-form ref="noticeFormRef" :model="form" label-width="80px">
        <el-row>
            <span style="font-size: 20px;font-weight: bold">{{ form.noticeTitle }}</span>
            <dict-tag :options="sys_notice_type" :value="form.noticeType" />
        </el-row>
        <el-row style="margin-top: 40px;padding:20px;font-size: 16px;box-shadow:0px 0px 5px 2px rgba(0, 0, 0, 0.2);">
          <div v-html="form.noticeContent" style="width: 100%">
          </div>
          <div style="margin-top: 40px;width: 100%">
            <span style="float: right">
              ------create By {{ form.createByName }}
              <br/><br/>
              {{ form.createTime }}
            </span>
          </div>
        </el-row>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup lang="ts" name="layoutBreadcrumbUserNews">
import { ref } from "vue";
import { storeToRefs } from 'pinia'
import { nextTick, onMounted, reactive } from "vue";
import useNoticeStore from '@/store/modules/notice';
import {NoticeForm, NoticeQuery, NoticeVO} from "@/api/system/notice/types";
import {listNotice, listNoticeOrganization} from "@/api/system/notice";
import {values} from "video.js/dist/types/utils/obj";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
const { sys_notice_status, sys_notice_type } = toRefs<any>(proxy?.useDict("sys_notice_status", "sys_notice_type"));
const noticeStore = storeToRefs(useNoticeStore());

const {readAll} = useNoticeStore();
//消息详细
const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});
const initFormData: NoticeForm = {
  noticeId: undefined,
  noticeTitle: '',
  noticeType: '',
  noticeContent: '',
  status: "0",
  remark: '',
  createByName: ''
}
// 消息列表
const state = reactive({
  loading: false,
});
const newsList =ref<NoticeVO[]>([]);
const total = ref(0);
const data = reactive<PageData<NoticeForm, NoticeQuery>>({
  form: { ...initFormData },
  queryParams: {
    pageNum: 1,
    pageSize: 10,
    params: {
    }
  }
});

const { queryParams, form } = toRefs(data);


//初始化数据
const getTableData = async () => {
  state.loading = true;
  // newsList.value = noticeStore.state.value.notices;
  const res = await listNoticeOrganization(queryParams.value);
  newsList.value = res.rows;
  total.value = res.total;
  state.loading = false;
};

const openNotice=(index : number)=>{
  form.value = { ...initFormData };
  dialog.visible = true;
  dialog.title = "公告详情";
  form.value = {...newsList.value[index]}
}


onMounted(() => {
  nextTick(() => {
    getTableData();
  });
});
</script>

<style scoped lang="scss">
.layout-navbars-breadcrumb-user-news {
  .head-box {
    display: flex;
    border-bottom: 1px solid var(--el-border-color-lighter);
    box-sizing: border-box;
    color: var(--el-text-color-primary);
    justify-content: space-between;
    height: 35px;
    align-items: center;
    .head-box-btn {
      color: var(--el-color-primary);
      font-size: 13px;
      cursor: pointer;
      opacity: 0.8;
      &:hover {
        opacity: 1;
      }
    }
  }
  .content-box {
    height: 300px;
    overflow: auto;
    font-size: 13px;
    .content-box-item {
      padding-top: 12px;
      display: flex;
      &:last-of-type {
        padding-bottom: 12px;
      }
      .content-box-msg {
        color: var(--el-text-color-secondary);
        margin-top: 5px;
        margin-bottom: 5px;
      }
      .content-box-time {
        color: var(--el-text-color-secondary);
      }
      .item-conten {
        width: 100%;
        display: flex;
        flex-direction: column;
      }
    }
  }
  .foot-box {
    height: 35px;
    color: var(--el-color-primary);
    font-size: 13px;
    cursor: pointer;
    opacity: 0.8;
    display: flex;
    align-items: center;
    justify-content: center;
    border-top: 1px solid var(--el-border-color-lighter);
    &:hover {
      opacity: 1;
    }
  }
  :deep(.el-empty__description p) {
    font-size: 13px;
  }
}
</style>
