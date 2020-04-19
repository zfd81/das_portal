<template>
  <div class="list">
    <el-row style="margin-top: 10px">
      <el-col :span="20">
        <el-input placeholder="请输入项目编码/名称" prefix-icon="el-icon-search" size="small" v-model="input" @change="refresh"> </el-input>
      </el-col>
      <el-col :span="4" style="text-align: right">
        <el-button type="primary" icon="el-icon-plus" size="small" v-on:click="createProject"></el-button>
      </el-col>
    </el-row>
    <el-divider class="list-divider-title"></el-divider>
    <div :key="item.code" v-for="(item, index) in projects" :class="{ 'list-div-active': item.code == isActive }" @click="selected(item)">
      <el-row>
        <el-col :span="18" class="list-title"> {{ item.code }} </el-col>
        <el-col :span="6">
          <el-button v-if="item.identity == 'owner'" type="success" size="mini" icon="el-icon-user-solid">打开</el-button>
          <el-button v-if="item.identity == 'user'" type="success" size="mini" icon="el-icon-star-on">打开</el-button>
        </el-col>
      </el-row>
      {{ item.name }} <br />
      创建人：{{ item.creator }} <br />
      创建时间：{{ item.created_time }} <br />
      <el-divider class="el-divider-pro"></el-divider>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProjectList",
  data() {
    return {
      input: "",
      projects: [],
      active1: "list-div",
      isActive: ""
    };
  },
  methods: {
    createProject(event) {
      this.$emit("create-project");
      event.stopPropagation();
    },
    refresh() {
      this.$axios
        .get("/auth/ide/project/user/", {
          params: {
            codeOrName: this.input
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, {
              arrayFormat: "repeat"
            });
          }
        })
        .then(response => {
          this.projects = response.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    selected: function(item) {
      this.isActive = item.code;
      this.$emit("show-project", item);
    }
  },
  mounted: function() {
    this.refresh();
  }
};
</script>

<style scoped></style>
