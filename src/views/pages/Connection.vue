<template>
  <div>
    <page-header>
      <sapn slot="content">数据库连接</sapn>
      <span slot="btns">
        <el-button type="primary" size="mini" @click="dialogVisible = true">新 建</el-button>
      </span>
    </page-header>
    <el-table ref="multipleTable" :data="conns" max-height="700">
      <el-table-column type="index" width="48"> </el-table-column>
      <el-table-column prop="conn_name" label="连接名" width="150"></el-table-column>
      <el-table-column prop="driver" label="数据库驱动"></el-table-column>
      <el-table-column prop="address" label="数据库地址"></el-table-column>
      <el-table-column prop="port" label="数据库端口"></el-table-column>
      <el-table-column prop="user_name" label="用户名"></el-table-column>
      <el-table-column prop="db" label="数据库名"></el-table-column>
      <el-table-column label="创建日期" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: left">
      <el-dialog title="创建连接" :visible.sync="dialogVisible" @close="cancel('ruleForm')" :close-on-click-modal="false">
        <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" style="margin-right: 30px;">
          <el-form-item label="连接名" prop="name">
            <el-input ref="name" v-model="ruleForm.name" placeholder="请输入连接名" @keyup.enter.native="handleFocus('driver')"></el-input>
          </el-form-item>
          <el-form-item label="数据库" prop="driver">
            <el-select ref="driver" v-model="ruleForm.driver" placeholder="请选择数据库类型" @keyup.enter.native="handleFocus('address')">
              <el-option label="MySQL" value="mysql"></el-option>
              <el-option label="ORACLE" value="oracle"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="数据库地址" prop="address">
            <el-input ref="address" v-model="ruleForm.address" placeholder="请输入数据库地址" @keyup.enter.native="handleFocus('port')"></el-input>
          </el-form-item>
          <el-form-item label="数据库端口" prop="port">
            <el-input ref="port" v-model="ruleForm.port" placeholder="请输入数据库端口" @keyup.enter.native="handleFocus('user')"></el-input>
          </el-form-item>
          <el-form-item label="用户名" prop="user">
            <el-input ref="user" v-model="ruleForm.user" placeholder="请输入用户名" @keyup.enter.native="handleFocus('password')"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              ref="password"
              v-model="ruleForm.password"
              placeholder="请输入密码"
              show-password
              @keyup.enter.native="handleFocus('db')"
            ></el-input>
          </el-form-item>
          <el-form-item label="数据库名" prop="db">
            <el-input ref="db" v-model="ruleForm.db" placeholder="请输入数据库名"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <el-button @click="cancel('ruleForm')">取 消</el-button>
          <el-button type="success" @click="handleTest('ruleForm')">连接测试</el-button>
          <el-button type="primary" @click="handleSave('ruleForm')" :disabled="!successVisible">保存连接</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PageHeader from "../../components/PageHeader";
export default {
  name: "Connection",
  data() {
    return {
      conns: [],
      dialogVisible: false,
      successVisible: false,
      ruleForm: {
        name: "",
        driver: "",
        address: "",
        port: "",
        user: "",
        password: "",
        db: ""
      },
      rules: {
        name: [{ required: true, message: "请输入连接名", trigger: "blur" }],
        driver: [{ required: true, message: "请选择数据库类型", trigger: "blur" }],
        address: [{ required: true, message: "请输入数据库地址", trigger: "blur" }],
        port: [{ required: true, message: "请输入数据库端口", trigger: "blur" }],
        user: [{ required: true, message: "请输入用户名", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        db: [{ required: true, message: "请输入数据库名", trigger: "blur" }]
      }
    };
  },
  computed: {
    projectCode() {
      return this.$store.state.ide.projectInfo[0].id;
    }
  },
  methods: {
    load() {
      this.$axios
        .get("/auth/ide/conn/pro/".concat(this.projectCode))
        .then(response => {
          this.conns = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleFocus(name) {
      this.$refs[name].focus();
    },
    handleTest(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.project = this.projectCode;
          this.$axios
            .post("/auth/ide/conn_test", this.ruleForm)
            .then(response => {
              this.successVisible = true;
              this.$message({
                message: "连接测试成功",
                type: "success"
              });
            })
            .catch(error => {
              this.successVisible = false;
              this.$message.error(error.response.data.msg);
            });
        } else {
          console.log("error submit!!!");
          return false;
        }
      });
    },
    handleSave(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.ruleForm.project = this.projectCode;
          this.$axios
            .post("/auth/ide/conn", this.ruleForm)
            .then(response => {
              this.cancel(formName);
              this.load();
              this.successVisible = false;
            })
            .catch(error => {
              this.successVisible = false;
              this.$message.error(error.response.data.msg);
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
      this.dialogVisible = false;
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除选择内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete("/auth/ide/conn", {
              params: {
                id: row.conn_id
              }
            })
            .then(response => {
              this.load();
            })
            .catch(error => {
              this.$notify.error({
                title: "错误",
                message: error
              });
            });
        })
        .catch(() => {
          this.$notify({
            type: "info",
            message: "已取消删除"
          });
        });
    }
  },
  components: { PageHeader },
  mounted() {
    this.load();
  }
};
</script>

<style scoped></style>
