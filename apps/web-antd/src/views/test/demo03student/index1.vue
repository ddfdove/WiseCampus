<script setup lang="ts">
import { onMounted, ref } from 'vue';

// import { ArrowRight, Lock } from '@element-plus/icons-vue';

// ------------------------------
// 状态变量
// ------------------------------
const code = ref<null | string>(null); // OAuth2 授权成功返回的 code
const state = ref<null | string>(null); // OAuth2 返回的 state，用于防 CSRF
const error = ref<null | string>(null); // OAuth2 返回的 error
const errorDescription = ref<null | string>(null); // OAuth2 返回的 error_description

// ------------------------------
// 配置 SSO 授权信息
// ------------------------------
const clientId = 'yundin-sso-by-code'; // 注册在 B 系统的客户端 ID
const responseType = 'code'; // 授权码模式

// ------------------------------
// URL 配置
// ------------------------------
// const redirectUri = 'http://192.168.0.15:5173'; // 授权回调页面也就是当前页面地址
const redirectUri = 'http://192.168.0.12:5666/'; // 授权回调页面也就是当前页面地址

// const bSystemBaseUrl = 'http://8.137.122.130:30000'; // B 系统前端地址
const bSystemBaseUrl = 'http://192.168.0.12:3338'; // B 系统前端地址

const bSystemSsoLoginUrl = `${bSystemBaseUrl}/#/sso`; // B 系统授权页面
const bSystemTokenUrl = '/admin-api/system/oauth2/token'; // 通过 Vite 代理转发到 B 系统后端

// ------------------------------
// 生成随机 state，防止 CSRF
// ------------------------------
const oauthState =
  sessionStorage.getItem('oauthState') ||
  Math.random().toString(36).slice(2, 18);
sessionStorage.setItem('oauthState', oauthState);

// 构建跳转到 B 系统授权页面的 URL
// const oauthUrl = `${bSystemSsoLoginUrl}?client_id=${clientId}&response_type=${responseType}&redirect_uri=${encodeURIComponent(redirectUri)}&state=${oauthState}`;
const encodeuUrl = `client_id=${clientId}&response_type=${responseType}&redirect_uri=${redirectUri}&state=${oauthState}`;

const oauthUrl = `${bSystemSsoLoginUrl}?${encodeURIComponent(encodeuUrl)}`;
// ------------------------------
// 用 code 换 access_token 的函数
// ------------------------------
async function postAccessToken(params: {
  client_id: string;
  client_secret: string;
  code: string;
  grant_type: 'authorization_code';
  redirect_uri: string;
  state: string;
}) {
  // 构建 x-www-form-urlencoded 请求体
  const formBody = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    formBody.append(key, value as string);
  });

  // 发送请求获取 access_token
  const res = await fetch(bSystemTokenUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: formBody.toString(),
  });

  // HTTP 请求失败
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`请求 token 失败: ${res.status} ${text}`);
  }

  // 解析 JSON 返回
  const data = await res.json();

  // 后端返回非成功状态
  if (data.code && data.code !== 0) {
    throw new Error(`获取 token 失败: ${data.msg}`);
  }

  return data.data;
}

// ------------------------------
// 页面挂载时处理 OAuth2 授权回调
// ------------------------------
onMounted(async () => {
  const url = new URL(window.location.href);

  // 从 URL 获取 OAuth2 回调参数
  code.value = url.searchParams.get('code'); // 授权成功返回的 code
  state.value = url.searchParams.get('state'); // 返回的 state
  error.value = url.searchParams.get('error'); // 授权失败返回的 error
  errorDescription.value = url.searchParams.get('error_description'); // 授权失败描述

  // ------------------------------
  // 校验 state 防止 CSRF
  // ------------------------------
  if (state.value && state.value !== oauthState) {
    alert('state 验证失败，请重试授权');
    return;
  }

  // ------------------------------
  // 用户拒绝授权
  // ------------------------------
  if (error.value) {
    console.warn('授权失败', error.value, errorDescription.value);
    return;
  }

  // ------------------------------
  // 用户同意授权，code 可用
  // ------------------------------
  if (code.value) {
    try {
      const res = await postAccessToken({
        grant_type: 'authorization_code',
        code: code.value,
        redirect_uri: redirectUri, // 原始回调 URL
        client_id: clientId,
        client_secret: 'f3URDuAH', // 建议安全放后端
        state: oauthState,
      });

      const accessToken = res.access_token;
      const refreshToken = res.refresh_token;

      // ------------------------------
      // 将 access_token 和 refresh_token 存储在 localStorage 中
      // ------------------------------
      localStorage.setItem('yingji-sso-access_token', accessToken);
      localStorage.setItem('yingji-sso-refresh_token', refreshToken);

      // ------------------------------
      // 登录成功后跳转到 B 系统
      // ------------------------------
      window.location.href = bSystemBaseUrl;
    } catch (error_) {
      console.error('获取 access_token 失败', error_);
      alert('获取 access_token 失败，请重试');
    }
  }
});

// ------------------------------
// 重新授权按钮处理
// ------------------------------
function retryLogin() {
  window.location.href = oauthUrl;
}

function startLogin() {
  // 跳转到登录页面，登录后会自动跳转到授权页面
  // OAuth 参数已保存到 sessionStorage，即使登录页面在跳转时丢失了参数，
  // 授权页面也应该能够从 sessionStorage 中恢复这些参数

  window.location.href = oauthUrl;
}
</script>

<template>
  <el-container class="page">
    <el-card class="login-card" shadow="hover">
      <header class="card-header">
        <span class="badge">SSO</span>
        <div class="card-title">
          <!-- <el-icon size="26">
            <Lock />
          </el-icon> -->
          <div>
            <h1>第三方账号登录</h1>
            <p>使用单点登录快速进入仓储管理系统</p>
          </div>
        </div>
      </header>

      <section class="card-body">
        <template v-if="error">
          <el-alert
            :closable="false"
            type="error"
            title="授权失败"
            :description="errorDescription || error"
            show-icon
          />
          <el-button class="action-btn ghost-btn" round @click="retryLogin">
            重新授权
          </el-button>
        </template>

        <template v-else>
          <el-alert
            :closable="false"
            type="info"
            title="准备授权"
            description="点击下方按钮跳转至仓储管理系统完成授权流程。"
            show-icon
          />
          <el-button
            class="action-btn gradient-btn"
            size="large"
            round
            @click="startLogin"
          >
            <span>使用第三方系统登录</span>
            <!-- <el-icon>
              <ArrowRight />
            </el-icon> -->
          </el-button>
          <p class="action-note">可信通道 · 加密传输 · 自动跳转</p>
        </template>
      </section>
    </el-card>
  </el-container>
</template>

<style scoped>
.page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 24px;
  font-family:
    'Segoe UI',
    -apple-system,
    BlinkMacSystemFont,
    'PingFang SC',
    'Microsoft YaHei',
    sans-serif;
  background: radial-gradient(circle at top, #eef2ff, #f7f9fc 65%);
}

.login-card {
  width: min(420px, 100%);
  padding: 12px 4px 28px;
  background: linear-gradient(
    145deg,
    rgb(255 255 255 / 95%),
    rgb(249 251 255 / 90%)
  );
  border: 1px solid rgb(147 167 255 / 25%);
  border-radius: 26px;
  box-shadow: 0 30px 80px rgb(42 68 126 / 18%);
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 6px 24px 24px;
  border-bottom: 1px solid rgb(226 232 255 / 80%);
}

.badge {
  align-self: flex-start;
  padding: 4px 12px;
  font-size: 12px;
  font-weight: 600;
  color: #4c5bff;
  letter-spacing: 0.1em;
  background: rgb(76 91 255 / 12%);
  border-radius: 999px;
}

.card-title {
  display: flex;
  gap: 12px;
  align-items: center;
  color: #1f2a37;
}

.card-title h1 {
  margin: 0;
  font-size: 22px;
}

.card-title p {
  margin: 6px 0 0;
  font-size: 14px;
  color: #6b7280;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 28px 24px 0;
}

.action-btn {
  display: inline-flex;
  gap: 8px;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-size: 16px;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.gradient-btn {
  color: #fff;
  background: linear-gradient(120deg, #5a7bff, #34c3ff);
  border: none;
  box-shadow: 0 10px 30px rgb(74 144 255 / 35%);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.gradient-btn:hover {
  box-shadow: 0 18px 35px rgb(74 144 255 / 45%);
  transform: translateY(-2px);
}

.ghost-btn {
  color: #4a90ff;
  border: 1px solid rgb(74 144 255 / 30%);
}

.action-note {
  margin: -6px 0 0;
  font-size: 13px;
  color: #8a8fb2;
  text-align: center;
}
</style>
