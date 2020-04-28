<template>
  <div class="list">
    <el-row style="margin-top: 10px">
      <el-col :span="20">
        <el-input placeholder="请输入项目编码/名称" prefix-icon="el-icon-search" size="small" v-model="text" @change="query"> </el-input>
      </el-col>
      <el-col :span="4" style="text-align: right">
        <el-button type="primary" icon="el-icon-plus" size="small" v-on:click="create"></el-button>
      </el-col>
    </el-row>
    <el-divider class="list-divider-title"></el-divider>
    <div :key="item.code" v-for="(item, index) in projects" :class="{ 'list-div-active': item.code == isActive }" @click="show(item)">
      <el-row>
        <el-col :span="18" class="list-title"> {{ item.code }} </el-col>
        <el-col :span="6">
          <el-button v-if="item.identity == 'owner'" type="success" size="mini" icon="el-icon-user-solid" @click.stop="open(item)">打开</el-button>
          <el-button v-if="item.identity == 'user'" type="success" size="mini" icon="el-icon-star-on" @click.stop="open(item)">打开</el-button>
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
  props: {
    text: String
  },
  data() {
    return {
      isActive: ""
    };
  },
  computed: {
    projects() {
      return this.$store.state.ide.projects;
    }
  },
  methods: {
    query(event) {
      this.$emit("query", this.text);
    },
    create(event) {
      this.$emit("create");
      event.stopPropagation();
    },
    show: function(item) {
      this.isActive = item.code;
      this.$emit("show", item);
    },
    open: function(item) {
      this.$emit("open", item);
    }
  }
};
</script>

<style scoped></style>
