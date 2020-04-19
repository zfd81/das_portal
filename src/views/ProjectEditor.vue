<template>
  <div>
    <page-header>
      <sapn slot="content">项目信息</sapn>
      <span slot="btns">
        <el-button type="primary" @click="save('ruleForm')" :disabled="failVisible">保 存</el-button>
      </span>
    </page-header>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="margin-right: 30px;">
      <el-row>
        <el-col :span="23">
          <el-form-item label="项目编号" prop="code"> <el-input v-model="ruleForm.code" @blur="check"></el-input> </el-form-item>
        </el-col>
        <el-col :span="1">
          <i v-if="successVisible" class="el-icon-check" style="margin: 10px; font-size: 23px;color:#15cb41; font-weight: bold"></i>
          <i v-if="failVisible" class="el-icon-close" style="margin: 10px; font-size: 23px;color:#ff1932; font-weight: bold"></i>
        </el-col>
      </el-row>
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="ruleForm.name"></el-input>
      </el-form-item>
      <el-form-item label="项目描述" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc" :rows="7"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer">
      <el-button @click="cancel('ruleForm')">取 消</el-button>
      <el-button type="primary" @click="save('ruleForm')" :disabled="failVisible">保 存</el-button>
    </span>
  </div>
</template>

<script>
import PageHeader from "../components/PageHeader";
export default {
  name: "ProjectCreator",
  components: { PageHeader },
  props: ["visible"],
  data() {
    return {
      ruleForm: {
        code: "",
        name: "",
        desc: ""
      },
      rules: {
        code: [{ required: true, message: "请输入项目编号", trigger: "blur" }],
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      successVisible: false,
      failVisible: false
    };
  },
  methods: {
    check() {
      this.$axios
        .get("/auth/ide/project/code/".concat(this.ruleForm.code))
        .then(response => {
          if (response.data.exist) {
            this.successVisible = false;
            this.failVisible = true;
          } else {
            this.successVisible = true;
            this.failVisible = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .post("/auth/ide/project", this.ruleForm)
            .then(response => {
              if (response.status == 200) {
                this.cancel(formName);
                this.$emit("success");
              } else {
                this.$message.error(response.data.msg);
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
    cancel(formName) {
      this.$refs[formName].resetFields();
      this.hidden();
    },
    hidden() {
      this.successVisible = false;
      this.failVisible = false;
      this.$emit("hidden");
    }
  }
};
</script>

<style scoped></style>
