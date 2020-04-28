<template>
  <div>
    <page-header>
      <sapn slot="content">项目开发者</sapn>
      <span slot="btns">
        <el-button v-if="isOwner" type="primary" size="mini" @click="openSelection">选择开发者</el-button>
      </span>
    </page-header>
    <el-table :data="users" max-height="700">
      <el-table-column type="index" width="48"> </el-table-column>
      <el-table-column prop="full_name" label="姓名"></el-table-column>
      <el-table-column prop="phone_number" label="联系电话"></el-table-column>
      <el-table-column prop="email" label="电子邮件"></el-table-column>
      <el-table-column label="加入项目时间">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span style="margin-left: 10px">{{ scope.row.created_time }}</span>
        </template>
      </el-table-column>
      <el-table-column v-if="isOwner" label="操作" width="200">
        <template slot-scope="scope">
          <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="text-align: left">
      <el-dialog title="选择开发者" :visible.sync="dialogVisible" @close="hidden" :close-on-click-modal="false">
        <el-table ref="multipleTable" :data="selection" @selection-change="selectionEvent">
          <el-table-column type="selection" align="center" width="50"></el-table-column>
          <el-table-column prop="full_name" label="姓名"></el-table-column>
          <el-table-column prop="phone_number" label="联系电话"></el-table-column>
          <el-table-column prop="email" label="电子邮件"></el-table-column>
        </el-table>
        <span slot="footer">
          <el-button @click="hidden">取 消</el-button>
          <el-button type="primary" @click="handleSave('ruleForm')">保存选择</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import PageHeader from "../../components/PageHeader";
export default {
  name: "UserProject",
  data() {
    return {
      users: [],
      selection: [],
      multipleSelection: [],
      dialogVisible: false
    };
  },
  computed: {
    projectCode() {
      return this.$store.state.ide.projectInfo[0].id;
    },
    isOwner() {
      return this.$store.state.ide.projectInfo[0].creator == this.$store.state.user.id;
    }
  },
  methods: {
    load() {
      this.$axios
        .get("/auth/ide/user/pro/".concat(this.projectCode))
        .then(response => {
          this.users = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    openSelection() {
      this.dialogVisible = true;
      this.$axios
        .get("/auth/ide/user/nipro/".concat(this.projectCode))
        .then(response => {
          this.selection = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    selectionEvent(selection) {
      this.multipleSelection = selection;
    },
    hidden() {
      this.dialogVisible = false;
    },
    handleSave() {
      if (this.multipleSelection.length < 1) {
        this.$message({
          message: "请选择要添加的开发者！",
          type: "warning"
        });
      } else {
        this.$axios
          .post("/auth/ide/user_pro", {
            code: this.projectCode,
            ids: this.extractArray(this.multipleSelection, "user_id")
          })
          .then(response => {
            this.hidden();
            this.load();
            this.$message({
              message: "添加成功",
              type: "success"
            });
          })
          .catch(error => {
            this.$message.error(error.response.data.msg);
          });
      }
    },
    handleDelete(index, row) {
      this.$confirm("此操作将永久删除选择内容, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.$axios
            .delete("/auth/ide/user_pro", {
              data: {
                code: this.projectCode,
                ids: [row.user_id]
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
