<template>
  <div>
    <page-header>
      <sapn slot="content">项目信息</sapn>
      <span v-if="isOwner" slot="btns">
        <el-button v-if="editVisible" type="primary" size="mini" @click="edit">编 辑</el-button>
        <el-button v-if="cancelVisible" size="mini" @click="cancel">取 消</el-button>
        <el-button v-if="saveVisible" type="primary" size="mini" @click="save('ruleForm')">保 存</el-button>
      </span>
    </page-header>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="margin-right: 30px;width: 90%">
      <el-form-item label="项目编号" prop="code">
        <el-input v-model="ruleForm.code" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="name">
        <el-input v-model="ruleForm.name" :disabled="inputVisible"></el-input>
      </el-form-item>
      <el-form-item label="项目描述" prop="desc">
        <el-input type="textarea" v-model="ruleForm.desc" :rows="7" :disabled="inputVisible"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import PageHeader from "../../components/PageHeader";
export default {
  name: "ProjectCreator",
  props: ["visible"],
  data() {
    return {
      ruleForm: {
        code: "",
        name: "",
        desc: ""
      },
      rules: {
        name: [{ required: true, message: "请输入项目名称", trigger: "blur" }],
        desc: [{ required: true, message: "请填写活动形式", trigger: "blur" }]
      },
      isOwner: false,
      editVisible: true,
      cancelVisible: false,
      saveVisible: false,
      inputVisible: true
    };
  },
  methods: {
    init(code, identity) {
      this.$axios
        .get("/auth/ide/project/code/".concat(code))
        .then(response => {
          this.ruleForm.code = code;
          this.ruleForm.name = response.data.Name;
          this.ruleForm.desc = response.data.Description;
          this.isOwner = this.$store.state.user.id == response.data.Creator;
          this.cancel();
          if (identity != "owner") {
            this.editVisible = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    edit() {
      this.editVisible = false;
      this.cancelVisible = true;
      this.saveVisible = true;
      this.inputVisible = false;
    },
    cancel() {
      this.editVisible = true;
      this.cancelVisible = false;
      this.saveVisible = false;
      this.inputVisible = true;
    },
    save(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .put("/auth/ide/project", this.ruleForm)
            .then(response => {
              if (response.status == 200) {
                this.cancel();
                this.$emit("success", "ProjectEditor");
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
    }
  },
  components: { PageHeader }
};
</script>

<style scoped></style>
