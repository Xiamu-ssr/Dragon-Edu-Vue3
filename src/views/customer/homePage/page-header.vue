<template>
	<el-menu
		class="el-menu-demo"
		mode="horizontal"
		:ellipsis="false"
		style="
			width: 100%;
			background-color: white;
			display: flex;
			align-items: center;
			border-radius: 20px;
			height: 70px;
			box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
			padding-left: 20px;
			padding-right: 20px;
		"
	>
		<el-menu-item index="0" @click="()=>{proxy?.$tab.openPage('/homePage');}">
			<img
				style="height: 50px;"
				src="@/assets/images/logo.png"
				alt="龙腾四海，智行天下"
			/>
		</el-menu-item>
		<el-menu-item>
			<el-input
				v-model="props.input"
        @input="emit('update:input', $event)"
				style="width: 400px"
				placeholder="搜索课程"
        @keyup.enter="searchTo"
			>
				<template #append>
					<el-button type="primary" @click="searchTo" :icon="Search" />
				</template>
			</el-input>
		</el-menu-item>
		<div class="flex-grow" />
		<el-menu-item index="1">
      <div class="avatar-container" v-if="userStore.roles.length != 0">
        <el-dropdown @command="handleCommand" class="right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="userStore.avatar" class="user-avatar" />
            <el-icon><caret-bottom /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>{{ $t('navbar.personalCenter') }}</el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <span>{{ $t('navbar.logout') }}</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div v-else @click="()=>{router.push({path: '/login'});}">登录</div>
    </el-menu-item>
	</el-menu>
</template>
<script setup lang="ts">
import {Search} from "@element-plus/icons-vue";
import useUserStore from "@/store/modules/user";
const {proxy} = getCurrentInstance() as ComponentInternalInstance;
const router = useRouter();
// const input = ref("")

const props = defineProps(['input'])
const emit = defineEmits(['update:input','searchEvent'])


//个人中心
const userStore = useUserStore();
const logout = async () => {
  await ElMessageBox.confirm('确定注销并退出系统吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
  await userStore.logout()
  location.href = import.meta.env.VITE_APP_CONTEXT_PATH + 'index';
}
const commandMap: {[key: string]: any} = {
  logout
};
const handleCommand = (command: string) => {
  // 判断是否存在该方法
  if (commandMap[command]) {
    commandMap[command]();
  }
}

//点击跳转
const searchTo = () =>{
	proxy?.$tab.openPage("/courseSearch", "", {name:props.input});
  emit('searchEvent');
}
const ClickTo2 = () =>{
  proxy?.$tab.openPage("/personalCenter");
}
</script>

<style scoped>
:deep(.avatar-container) {
  margin-right: 40px;

  .avatar-wrapper {
    margin-top: 5px;
    position: relative;

    .user-avatar {
      cursor: pointer;
      width: 40px;
      height: 40px;
      border-radius: 10px;
      margin-top: 10px;
    }

    i {
      cursor: pointer;
      position: absolute;
      right: -20px;
      top: 25px;
      font-size: 12px;
    }
  }
}
</style>
