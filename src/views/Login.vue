<template>
  <div>
    <div id="u2560">
      <img id="u2561_img" src="../assets/login_bj.jpg" />
      <div id="u2563_div" class=""></div>
      <div id="u2567" class="ax_default _一级标题">
        <div id="u2568" class="text" style="visibility: visible;">
          <p><span>门户系统</span></p>
        </div>
      </div>
    </div>
    <div class="form_div">
      <div style="text-align: center;  font-size: 18px;">用户登录</div>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-position="top">
        <el-form-item label="输入用户名" prop="name">
          <el-input ref="name" placeholder="用户名" size="9" v-model="ruleForm.name" @keyup.enter.native="focusPwd"> </el-input>
        </el-form-item>
        <el-form-item label="输入密码" prop="password">
          <el-input
            ref="password"
            type="password"
            placeholder="密码"
            size="9"
            v-model="ruleForm.password"
            @keyup.enter.native="login('ruleForm')"
          ></el-input>
        </el-form-item>
        <el-form-item style="text-align: right;">
          <el-button type="primary" @click="login('ruleForm')">登 陆</el-button>
          <el-button type="danger" @click="resetForm('ruleForm')">重 置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div id="u2569">
      <div id="u2569_div"></div>
      <div id="u2570" style="visibility: visible;">
        <p>
          <span>建议使用：火狐，谷歌 浏览器&nbsp; &nbsp;&nbsp;电脑分辨率：1366*768&nbsp;&nbsp; 效果最佳</span>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      ruleForm: {},
      rules: {
        name: [
          {
            required: true,
            message: "请输入用户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          }
        ]
      }
    };
  },
  methods: {
    login(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/login", this.ruleForm)
            .then(response => {
              if (response.status == 200) {
                this.$store.commit("login", {
                  headers: response.headers,
                  user: {
                    name: response.data.name,
                    fullName: response.data.full_name
                  }
                });
                this.$router.push("/ide");
              } else if ((response.status = 204)) {
                this.$message.error("用户名或密码错误！");
              }
            })
            .catch(error => {
              this.$notify.error({
                title: "错误",
                message: error
              });
            });
        } else {
          console.log("error submit!!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.ruleForm = {};
      this.$refs[formName].resetFields();
      this.$refs.name.focus();
    },
    focusPwd() {
      this.$refs.password.focus();
    }
  },
  mounted: function() {
    this.$refs.name.focus();
  }
};
</script>

<style scoped>
#u2560 {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
}

#u2561_img {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
}

#u2563_div {
  position: absolute;
  left: 0px;
  top: 0px;
  width: 100%;
  height: 100%;
  background: inherit;
  background-color: rgba(0, 0, 0, 0.498039215686275);
  border: none;
  border-radius: 0px;
  -moz-box-shadow: none;
  -webkit-box-shadow: none;
  box-shadow: none;
}

#u2567 {
  position: absolute;
  left: 100px;
  top: 55px;
  width: 201px;
  height: 26px;
  font-family: "MicrosoftYaHei", "Microsoft YaHei";
  font-weight: 400;
  font-style: normal;
  font-size: 23px;
  color: #f2f2f2;
}

#u2569 {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 30px;
  font-family: "MicrosoftYaHei", "Microsoft YaHei";
  font-weight: 400;
  font-style: normal;
  font-size: 12px;
  color: #cccccc;
}

#u2569_div {
  position: absolute;
  left: 0px;
  bottom: 0px;
  width: 100%;
  height: 30px;
  background-color: rgba(0, 0, 0, 0.705);
  border: none;
}

#u2570 {
  position: absolute;
  width: 100%;
  top: -4px;
  text-align: center;
  word-wrap: break-word;
}

.form_div {
  position: absolute;
  background: rgb(255, 255, 255);
  display: block;
  top: 40%;
  left: 50%;
  margin-top: -150px;
  margin-left: -195px;
  padding-top: 30px;
  padding-right: 30px;
  padding-bottom: 30px;
  padding-left: 30px;
  width: 360px;
  height: 280px;
  border-width: 1px;
  border-style: solid;
  border-color: rgb(128, 129, 127);
  border-radius: 4px;
  z-index: 10;
}
</style>
