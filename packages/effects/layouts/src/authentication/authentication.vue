<script setup lang="ts">
import type { ToolbarType } from './types';

import { preferences, usePreferences } from '@vben/preferences';

import { Copyright } from '../basic/copyright';
import AuthenticationFormView from './form.vue';
import Toolbar from './toolbar.vue';

interface Props {
  appName?: string;
  logo?: string;
  pageTitle?: string;
  pageDescription?: string;
  sloganImage?: string;
  toolbar?: boolean;
  copyright?: boolean;
  toolbarList?: ToolbarType[];
  clickLogo?: () => void;
}

withDefaults(defineProps<Props>(), {
  appName: '',
  copyright: true,
  logo: '',
  pageDescription: '',
  pageTitle: '',
  sloganImage: '',
  toolbar: true,
  toolbarList: () => ['color', 'language', 'layout', 'theme'],
  clickLogo: () => {},
});

const { authPanelCenter, authPanelLeft, authPanelRight, isDark } =
  usePreferences();
</script>

<template>
  <div
    :class="[isDark ? 'dark' : '']"
    class="flex min-h-full flex-1 select-none overflow-x-hidden"
  >
    <template v-if="toolbar">
      <slot name="toolbar">
        <Toolbar :toolbar-list="toolbarList" />
      </slot>
    </template>
    <!-- 左侧认证面板 -->
    <div
      v-if="authPanelLeft"
      class="relative flex w-full items-center justify-start pl-36"
    >
      <div class="login-background absolute left-0 top-0 size-full"></div>
      <AuthenticationFormView
        class="bg-background/80 shadow-primary/5 shadow-float w-full rounded-3xl py-20 backdrop-blur transition-transform duration-500 ease-out hover:-translate-y-12 sm:w-[80%] md:w-[clamp(450px,40%,600px)]"
        transition-name="slide-left"
      >
        <template v-if="copyright" #copyright>
          <slot name="copyright">
            <Copyright
              v-if="preferences.copyright.enable"
              v-bind="preferences.copyright"
            />
          </slot>
        </template>
      </AuthenticationFormView>
    </div>

    <slot name="logo">
      <!-- 头部 Logo 和应用名称 -->
      <div
        v-if="logo || appName"
        class="absolute left-0 top-0 z-10 flex flex-1"
        @click="clickLogo"
      >
        <div
          class="text-foreground lg:text-foreground ml-16 mt-12 flex flex-1 items-center sm:left-6 sm:top-6"
        >
          <img
            v-if="logo"
            :alt="appName"
            :src="logo"
            class="mr-2 w-10 lg:w-24"
          />
          <p v-if="appName" class="m-0 text-4xl font-medium lg:text-8xl">
            {{ appName }}
          </p>
        </div>
      </div>
    </slot>

    <!-- 系统介绍 -->
    <!-- <div v-if="!authPanelCenter" class="relative hidden w-0 flex-1 lg:block">
      <div
        class="bg-background-deep absolute inset-0 h-full w-full dark:bg-[#070709]"
      >
        <div class="login-background absolute left-0 top-0 size-full"></div>
        <div class="flex-col-center -enter-x mr-20 h-full">
          <template v-if="sloganImage">
            <img
              :alt="appName"
              :src="sloganImage"
              class="animate-float h-64 w-2/5"
            />
          </template>
          <SloganIcon v-else :alt="appName" class="animate-float h-64 w-2/5" />
          <div class="text-1xl text-foreground mt-6 font-sans lg:text-2xl">
            {{ pageTitle }}
          </div>
          <div class="dark:text-muted-foreground mt-2">
            {{ pageDescription }}
          </div>
        </div>
      </div>
    </div> -->

    <!-- 中心认证面板 -->
    <div v-if="authPanelCenter" class="flex-center relative w-full">
      <div class="login-background absolute left-0 top-0 size-full"></div>
      <AuthenticationFormView
        class="bg-background/80 shadow-primary/5 shadow-float w-full rounded-3xl py-20 backdrop-blur transition-transform duration-500 ease-out hover:-translate-y-12 sm:w-[80%] md:w-[clamp(450px,40%,600px)]"
      >
        <template v-if="copyright" #copyright>
          <slot name="copyright">
            <Copyright
              v-if="preferences.copyright.enable"
              v-bind="preferences.copyright"
            />
          </slot>
        </template>
      </AuthenticationFormView>
    </div>

    <!-- 右侧认证面板 -->
    <div
      v-if="authPanelRight"
      class="relative flex w-full items-center justify-end pr-36"
    >
      <div class="login-background absolute left-0 top-0 size-full"></div>
      <AuthenticationFormView
        class="bg-background/80 shadow-primary/5 shadow-float w-full rounded-3xl py-20 backdrop-blur transition-transform duration-500 ease-out hover:-translate-y-12 sm:w-[80%] md:w-[clamp(450px,40%,600px)]"
      >
        <template v-if="copyright" #copyright>
          <slot name="copyright">
            <Copyright
              v-if="preferences.copyright.enable"
              v-bind="preferences.copyright"
            />
          </slot>
        </template>
      </AuthenticationFormView>
    </div>
  </div>
</template>

<style scoped>
.login-background {
  /* background: linear-gradient(
    154deg,
    #07070915 30%,
    hsl(var(--primary) / 30%) 48%,
    #07070915 64%
  );
  filter: blur(100px); */
  overflow: auto;
  background-image: url('../assets/loginBG.png');
  background-size: cover;
}

.dark {
  .login-background {
    background: linear-gradient(
      154deg,
      #07070915 30%,
      hsl(var(--primary) / 20%) 48%,
      #07070915 64%
    );
    filter: blur(100px);
  }
}
</style>
