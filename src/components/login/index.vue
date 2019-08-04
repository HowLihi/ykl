<template>
  <div class="container">
    <el-card class="my-card">
      <img alt src="../../assets/images/logo_index.png" />
      <el-form :model="form" :rules="loginRules" ref="form">
        <el-form-item>
          <el-input placeholder="请输入手机号" prop="mobile" v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            placeholder="请输入验证码"
            prop="code"
            style="width:236px; margin-right:10px"
            v-model="form.code"
          ></el-input>
          <el-button>发送验证码</el-button>
        </el-form-item>
        <el-form-item>
          <el-checkbox :value="true">我已同意并阅读用户协议和隐私条款</el-checkbox>
        </el-form-item>
        <el-form-item>
          <el-button @click="login()" style="width:100%" type="primary">登 录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import store from '@/store'
export default {
  data () {
    const checkMobile = (rule, value, callback) => {
      if (!/^1[3-9]\d{9}$/.test(value)) return callback(new Error('手机格式不对'))
      callback()
    }
    return {
      form: { mobile: '', code: '' },
      loginRules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { len: 6, message: '请输入6位验证码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login () {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$http.post('/authorizations', this.form).then(res => {
            store.setUser(res.data.data)
            this.$router.push('/')
          }).catch(() => {
            this.$message.error('手机号或验证码错误')
          })
        }
      })
    }
  }
}
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: 100%;
  position: absolute;
  background: url(../../assets/images/login_bg.jpg) no-repeat center/cover;
  .my-card {
    width: 400px;
    height: 350px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
    img {
      height: 50px;
      margin-bottom: 20px;
    }
  }
}
</style>
