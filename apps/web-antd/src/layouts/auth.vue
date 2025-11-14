<script lang="ts" setup>
import { AuthPageLayout } from '@vben/layouts';

import { $t } from '#/locales';

// 导入本地图片
import logoImage from '../assets/imgs/logo.png';
// 或者相对路径
const appName = import.meta.env.VITE_APP_NAME || '智慧校园';
// const appName = computed(() => preferences.app.name);
// const logo = computed(() => preferences.logo.source);
</script>

<template>
  <AuthPageLayout
    :app-name="appName"
    :logo="logoImage"
    :page-description="$t('authentication.pageDesc')"
    :page-title="$t('authentication.pageTitle')"
  >
    <!-- 自定义工具栏 -->
    <!-- <template #toolbar></template> -->
  </AuthPageLayout>
</template>
