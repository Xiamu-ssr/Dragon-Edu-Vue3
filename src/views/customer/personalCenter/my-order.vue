<template>
	<div class="p-2">
		<transition :enter-active-class="proxy?.animate.searchAnimate.enter" :leave-active-class="proxy?.animate.searchAnimate.leave">
			<div class="search" v-show="showSearch">
				<el-form :model="queryParams" ref="queryFormRef" :inline="true" label-width="68px">
					<el-form-item label="课程名称" prop="courseName">
						<el-input v-model="queryParams.courseName" placeholder="请输入课程名称" clearable style="width: 240px" @keyup.enter="handleQuery" />
					</el-form-item>
					<el-form-item label="订单状态" prop="status">
						<el-select v-model="queryParams.status" clearable placeholder="课程状态">
							<el-option v-for="dict in order_status" :key="dict.value" :label="dict.label"
									   :value="dict.value"/>
						</el-select>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" icon="Search" @click="handleQuery">搜索</el-button>
					</el-form-item>
				</el-form>
			</div>
		</transition>

		<el-card shadow="never">
			<el-table v-loading="loading" :data="orderList">
				<el-table-column label="课程名称" align="center" prop="courseName" />
				<el-table-column label="金额" align="center" prop="price" />
				<el-table-column label="订单状态" align="center" prop="status">
					<template #default="scope">
						<dict-tag :options="order_status" :value="scope.row.status"/>
					</template>
				</el-table-column>
				<el-table-column label="备注" align="center" prop="remarks" />
				<el-table-column label="创建时间" align="center" prop="createTime" />
				<el-table-column label="操作" align="center">
					<template #default="scope">
						<el-tooltip content="再次查询支付结果" placement="top" v-if="isWithin24Hours(scope.row.createTime) && scope.row.status != OrderStatusEnum.PAID_SUCCESS">
							<el-button type="primary" icon="Aim" @click="getPayResult(scope.row.id)" plain>再次查询</el-button>
						</el-tooltip>
					</template>
				</el-table-column>
			</el-table>

			<pagination
				v-show="total>0"
				:total="total"
				v-model:page="queryParams.pageNum"
				v-model:limit="queryParams.pageSize"
				@pagination="getList"
			/>
		</el-card>
	</div>
</template>

<script setup name="Order" lang="ts">
import { listOrder, getOrder, delOrder, addOrder, updateOrder } from '@/api/order/order';
import { OrderVO, OrderQuery, OrderForm } from '@/api/order/order/types';
import {OrderStatusEnum} from "@/enums/OrderStatusEnum";
import {queryPayResult} from "@/api/order/pay";
import {sleep} from "@/utils/my";

const { proxy } = getCurrentInstance() as ComponentInternalInstance;
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
const orderFormRef = ref<ElFormInstance>();

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
		params: {
		}
	}
});

const { queryParams } = toRefs(data);

/** 查询订单表列表 */
const getList = async () => {
	loading.value = true;
	const res = await listOrder(queryParams.value);
	orderList.value = res.rows;
	total.value = res.total;
	loading.value = false;
}

/** 搜索按钮操作 */
const handleQuery = () => {
	queryParams.value.pageNum = 1;
	getList();
}

// 用来计算时间差的函数
const isWithin24Hours = (createTime: string) => {
	const orderTime = new Date(createTime);
	const currentTime = new Date();

	if (isNaN(orderTime.getTime())) {
		console.error('Invalid date provided:', createTime);
		return false;  // 如果日期无效，直接返回false
	}
	const timeDifference = currentTime.getTime() - orderTime.getTime();  // 确保使用getTime()获取毫秒值
	// 将时间差转换为小时
	const hoursDifference = timeDifference / (1000 * 60 * 60);
	return hoursDifference < 4;
};

// 查询支付结果
const getPayResult = (payNo: string | number) =>{
	loading.value = true;
	queryPayResult(payNo).then(rsp=>{
		if (rsp['data'] == true){
			//订单已支付成功
			proxy?.$modal.msgSuccess("订单支付成功");
		}else {
			//支付失败
			proxy?.$modal.msgError("订单支付失败");
		}

	}).finally(()=>{
		getList();
		loading.value = false;
	})
}


onMounted(() => {
	getList();
});
</script>
