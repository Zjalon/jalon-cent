<script setup lang="ts">
import { showToast } from "vant";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/use-auth";

const router = useRouter();
const { login } = useAuth();

const token = ref("");
const loading = ref(false);

const onSubmit = async () => {
    if (!token.value.trim()) {
        showToast("请输入 Gitee Token");
        return;
    }
    loading.value = true;
    try {
        const user = await login(token.value.trim());
        showToast(`欢迎，${user.name}`);
        router.replace("/");
    } catch {
        showToast("Token 无效，请检查后重试");
    } finally {
        loading.value = false;
    }
};
</script>

<template>
    <div class="login-page">
        <van-nav-bar title="登录" />
        <div class="login-content">
            <div class="login-header">
                <div class="login-title">Cent</div>
                <div class="login-subtitle">使用 Gitee Token 登录</div>
            </div>
            <van-form @submit="onSubmit">
                <van-cell-group inset>
                    <van-field
                        v-model="token"
                        type="textarea"
                        rows="3"
                        label="Token"
                        placeholder="请输入 Gitee 个人访问令牌"
                        :rules="[{ required: true, message: '请输入 Token' }]"
                    />
                </van-cell-group>
                <div class="login-actions">
                    <van-button
                        round
                        block
                        type="primary"
                        native-type="submit"
                        :loading="loading"
                        loading-text="验证中..."
                    >
                        登录
                    </van-button>
                </div>
            </van-form>
            <div class="login-help">
                <p>如何获取 Token：</p>
                <ol>
                    <li>登录 <a href="https://gitee.com" target="_blank">gitee.com</a></li>
                    <li>进入「设置」→「私人令牌」</li>
                    <li>生成新令牌，勾选 user_info 和 projects 权限</li>
                    <li>复制令牌粘贴到上方输入框</li>
                </ol>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-page {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    background: #f7f8fa;
}

.login-content {
    flex: 1;
    padding: 24px 16px;
    overflow-y: auto;
}

.login-header {
    text-align: center;
    margin-bottom: 32px;
}

.login-title {
    font-size: 32px;
    font-weight: 700;
    color: #323233;
}

.login-subtitle {
    font-size: 14px;
    color: #969799;
    margin-top: 8px;
}

.login-actions {
    margin: 24px 16px 0;
}

.login-help {
    margin-top: 32px;
    padding: 16px;
    background: #fff;
    border-radius: 8px;
    font-size: 13px;
    color: #969799;
    line-height: 1.8;
}

.login-help p {
    margin-bottom: 4px;
    color: #646566;
    font-weight: 500;
}

.login-help ol {
    padding-left: 20px;
    margin: 0;
}

.login-help a {
    color: #1989fa;
}
</style>
