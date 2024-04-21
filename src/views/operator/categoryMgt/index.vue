<template>
  <div class="p-2">
    <transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
      <div class="search" v-show="showSearch">
        <el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
          <el-form-item label="分类名称" prop="name">
            <el-input v-model="queryParams.name" placeholder="请输入分类名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
            <el-button icon="Refresh" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </transition>

    <el-card shadow="never">
      <template #header>
        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button type="primary" plain icon="Plus" @click="()=>{addSmall=false;handleAdd();}">新增</el-button>
          </el-col>
<!--          <el-col :span="1.5">-->
<!--            <el-button type="success" plain icon="Edit" :disabled="single" @click="handleUpdate()">修改</el-button>-->
<!--          </el-col>-->
          <el-col :span="1.5">
            <el-button type="danger" plain icon="Delete" :disabled="multiple" @click="handleDelete()">删除</el-button>
          </el-col>
<!--          <el-col :span="1.5">-->
<!--            <el-button type="warning" plain icon="Download" @click="handleExport">导出</el-button>-->
<!--          </el-col>-->
          <right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>
      </template>

      <el-table v-loading="loading" :data="categoryList" @selection-change="handleSelectionChange" row-key="id" default-expand-all>
<!--        <el-table-column label="主键" align="center" prop="id" v-if="true" />-->
        <el-table-column label="分类名称" align="center" prop="name" />
<!--        <el-table-column label="父结点id" align="center" prop="parentid" />-->
        <el-table-column label="排序" align="center" prop="orderby" />
<!--        <el-table-column label="是否叶子" align="center" prop="isLeaf" />-->
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
          <template #default="scope">
            <el-tooltip content="添加小类" placement="top" v-if="!scope.row['isLeaf']">
              <el-button link type="primary" icon="Plus" @click="()=>{addSmall=true;handleAdd();}"></el-button>
            </el-tooltip>
            <el-tooltip content="修改" placement="top">
              <el-button link type="primary" icon="Edit" @click="handleUpdate(scope.row)"></el-button>
            </el-tooltip>
            <el-tooltip content="删除" placement="top">
              <el-button link type="primary" icon="Delete" @click="handleDelete(scope.row)"></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

    </el-card>
    <!-- 添加或修改分类管理对话框 -->
    <el-dialog :title="dialog.title" v-model="dialog.visible" width="500px" append-to-body>
      <el-form ref="categoryFormRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="父结点" prop="parentid" v-show="addSmall">
          <el-select
            v-model="form.parentid"
            placeholder="Select"
          >
            <el-option
              v-for="item in categoryList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序字段" prop="orderby">
          <el-input-number v-model="form.orderby" controls-position="right" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button :loading="buttonLoading" type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup name="CategoryMgt" lang="ts">
import { listCategory, getCategory, delCategory, addCategory, updateCategory } from '@/api/course/Category';
import { CategoryVO, CategoryQuery, CategoryForm } from '@/api/course/Category/types';

const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const categoryList = ref<CategoryVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);

const queryFormRef = ref<ElFormInstance>();
const categoryFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
  visible: false,
  title: ''
});

const initFormData: CategoryForm = {
  id: undefined,
  name: undefined,
  parentid: undefined,
  orderby: undefined,
  isLeaf: undefined
}
const queryParams = ref({
  name: undefined,
  parentid: undefined,
  orderby: undefined,
  isLeaf: undefined,
})

const form = ref({
  id: undefined,
  name: undefined,
  parentid: undefined,
  orderby: undefined,
  isLeaf: false
})
const rules = ref({
  name: [
    { required: true, message: "分类名称不能为空", trigger: "blur" }
  ],
  orderby: [
    { required: true, message: "排序字段不能为空", trigger: "blur" }
  ]
})
//添加小类or大类
const addSmall = ref(true);


/** 查询分类管理列表 */
const getList = async () => {
  loading.value = true;
  const res = await listCategory(queryParams.value);
  const data = proxy?.handleTree(res, 'id', 'parentid');
  // categoryList.value = res.rows;
  // console.log(data)
  categoryList.value = data;
  loading.value = false;
}

/** 取消按钮 */
const cancel = () => {
  reset();
  dialog.visible = false;
}

/** 表单重置 */
const reset = () => {
  form.value = {...initFormData};
  categoryFormRef.value?.resetFields();
}

/** 搜索按钮操作 */
const handleQuery = () => {
  getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value?.resetFields();
  handleQuery();
}

/** 多选框选中数据 */
const handleSelectionChange = (selection: CategoryVO[]) => {
  ids.value = selection.map(item => item.id);
  single.value = selection.length != 1;
  multiple.value = !selection.length;
}

/** 新增按钮操作 */
const handleAdd = () => {
  dialog.visible = true;
  dialog.title = "添加分类管理";
  nextTick(() => {
    reset();
  });
}

/** 修改按钮操作 */
const handleUpdate = (row?: CategoryVO) => {
  if(row?.isLeaf){
    addSmall.value = true;
  }else {
    addSmall.value = false;
  }
  loading.value = true
  dialog.visible = true;
  dialog.title = "修改类别";
  nextTick(async () => {
    reset();
    const _id = row?.id || ids.value[0]
    const res = await getCategory(_id);
    loading.value = false;
    Object.assign(form.value, res.data);
  });
}

/** 提交按钮 */
const submitForm = () => {
  categoryFormRef.value?.validate(async (valid: boolean) => {
    if (valid) {
      buttonLoading.value = true;
      //如果是新增小类别，那么为叶子结点
      if(addSmall.value){
        form.value.isLeaf = true;
      }else{
        form.value.isLeaf = false;
      }
      if (form.value.id) {
        await updateCategory(form.value).finally(() =>  buttonLoading.value = false);
      } else {
        await addCategory(form.value).finally(() =>  buttonLoading.value = false);
      }
      proxy?.$modal.msgSuccess("修改成功");
      dialog.visible = false;
      await getList();
    }
  });
}

/** 删除按钮操作 */
const handleDelete = async (row?: CategoryVO) => {
  const _ids = row?.id || ids.value;
  await proxy?.$modal.confirm('是否确认删除分类名称为"' + row?.name + '"的数据项？').finally(() => loading.value = false);
  await delCategory(_ids);
  proxy?.$modal.msgSuccess("删除成功");
  await getList();
}

/** 导出按钮操作 */
const handleExport = () => {
  proxy?.download('course/category/export', {
    ...queryParams.value
  }, `category_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
  getList();
});
</script>
