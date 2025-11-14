<script setup lang="ts">
import {
  SvgDingDingIcon,
  SvgGithubIcon,
  SvgQQChatIcon,
  SvgWeChatIcon,
} from '@vben/icons';
import { $t } from '@vben/locales';

import { VbenIconButton } from '@vben-core/shadcn-ui';

defineOptions({
  name: 'ThirdPartyLogin',
});

const emit = defineEmits<{
  thirdLogin: [type: number];
}>();

/**
 * 处理第三方登录点击
 *
 * @param type 第三方平台类型
 */
function handleThirdLogin(type: number) {
  emit('thirdLogin', type);
}
</script>

<template>
  <div class="w-full sm:mx-auto md:max-w-md">
    <div class="my-6 flex items-center justify-between">
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
      <span class="text-muted-foreground text-center text-xl uppercase">
        {{ $t('authentication.thirdPartyLogin') }}
      </span>
      <span class="border-input w-[35%] border-b dark:border-gray-600"></span>
    </div>

    <div class="flex flex-wrap justify-center">
      <VbenIconButton class="mx-6 mb-3 h-16 w-16" @click="handleThirdLogin(30)">
        <SvgWeChatIcon class="text-5xl" />
      </VbenIconButton>
      <VbenIconButton class="mx-6 mb-3 h-16 w-16" @click="handleThirdLogin(20)">
        <SvgDingDingIcon class="text-5xl" />
      </VbenIconButton>
      <VbenIconButton class="mx-6 mb-3 h-16 w-16" @click="handleThirdLogin(0)">
        <SvgQQChatIcon class="text-5xl" />
      </VbenIconButton>
      <VbenIconButton class="mx-6 mb-3 h-16 w-16" @click="handleThirdLogin(0)">
        <SvgGithubIcon class="text-5xl" />
      </VbenIconButton>
    </div>
  </div>
</template>
