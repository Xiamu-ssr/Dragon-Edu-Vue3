<template>
	<div class="p-2">
		<transition :enter-active-class="proxy?.animate.searchAnimate.enter"
					:leave-active-class="proxy?.animate.searchAnimate.leave">
			<div v-show="showSearch" class="search">
				<el-form ref="queryFormRef" :inline="true" :model="queryParams" label-width="68px">
					<el-form-item label="课程名称" prop="courseName">
						<el-input v-model="queryParams.courseName" clearable placeholder="请输入课程名称"
								  style="width: 240px" @keyup.enter="handleQuery"/>
					</el-form-item>
					<el-form-item label="订单状态" prop="status">
						<el-select v-model="queryParams.status" clearable placeholder="课程状态">
							<el-option v-for="dict in order_status" :key="dict.value" :label="dict.label"
									   :value="dict.value"/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button icon="Search" type="primary" @click="handleQuery">搜索</el-button>
						<el-button icon="Refresh" @click="resetQuery">重置</el-button>
					</el-form-item>
				</el-form>
			</div>
		</transition>

		<el-card shadow="never">
			<template #header>
				<el-row :gutter="10" class="mb8">
					<el-col :span="1.5">
						<el-button icon="Download" plain type="warning" @click="handleExport">导出</el-button>
					</el-col>
					<right-toolbar v-model:showSearch="showSearch" @queryTable="getList"></right-toolbar>
				</el-row>
			</template>

			<el-table v-loading="loading" :data="orderList">
				<el-table-column align="center" label="课程id" prop="courseId"/>
				<el-table-column align="center" label="课程名称" prop="courseName"/>
				<el-table-column align="center" label="金额" prop="price"/>
				<el-table-column align="center" label="订单状态" prop="status">
					<template #default="scope">
						<dict-tag :options="order_status" :value="scope.row.status"/>
					</template>
				</el-table-column>
				<el-table-column align="center" label="创建时间" prop="createTime"/>
				<el-table-column align="center" label="备注" prop="remarks"/>
			</el-table>

			<pagination
				v-show="total>0"
				v-model:limit="queryParams.pageSize"
				v-model:page="queryParams.pageNum"
				:total="total"
				@pagination="getList"
			/>
		</el-card>
	</div>
</template>

<script lang="ts" name="Order" setup>
import {listOrderCompany} from '@/api/order/order';
import {OrderForm, OrderQuery, OrderVO} from '@/api/order/order/types';

const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const {order_status} = toRefs<any>(proxy?.useDict("order_status"));

const orderList = ref<OrderVO[]>([]);
const buttonLoading = ref(false);
const loading = ref(true);
const showSearch = ref(true);
const ids = ref<Array<string | number>>([]);
const single = ref(true);
const multiple = ref(true);
const total = ref(0);

const queryFormRef = ref<ElFormInstance>();

const dialog = reactive<DialogOption>({
	visible: false,
	title: ''
});

const data = reactive<PageData<OrderForm, OrderQuery>>({
	queryParams: {
		pageNum: 1,
		pageSize: 10,
		courseId: undefined,
		courseName: undefined,
		companyId: undefined,
		userId: undefined,
		price: undefined,
		status: undefined,
		remarks: undefined,
		params: {}
	}
});

const {queryParams} = toRefs(data);

/** 查询订单表列表 */
const getList = async () => {
	loading.value = true;
	const res = await listOrderCompany(queryParams.value);
	orderList.value = res.rows;
	total.value = res.total;
	loading.value = false;
}

/** 搜索按钮操作 */
const handleQuery = () => {
	queryParams.value.pageNum = 1;
	getList();
}

/** 重置按钮操作 */
const resetQuery = () => {
	queryFormRef.value?.resetFields();
	handleQuery();
}

/** 导出按钮操作 */
const handleExport = () => {
	proxy?.download('order/order/export', {
		...queryParams.value
	}, `order_${new Date().getTime()}.xlsx`)
}

onMounted(() => {
	getList();
});
</script>
