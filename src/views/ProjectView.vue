<template>
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item title="项目视图" name="pro">
      <div :style="{ height: projectTreeHeight + 'px' }">
        <el-scrollbar style="height:100%">
          <el-tree :data="projectInfo" node-key="id" :default-expanded-keys="[projectId]">
            <span class="custom-tree-node tree-item-div" slot-scope="{ node, data }" @dblclick="openPage(data.type)">
              <span>
                <i v-if="data.type == 'ads'" class="iconfont icon-Code" style="color: #42b983"></i>
                <i v-if="data.type == 'conn'" class="iconfont icon-links" style="color:#ffb108;"></i>
                <i v-if="data.type == 'user'" class="iconfont icon-user-group" style="color: #247df5"></i>
                <i v-if="data.type == 'cat'" class="iconfont icon-folder-fill" style="color: #ffd90e"></i>
                <i v-if="data.type == 'param'" class="iconfont icon-canshu1" style="color: #1b61ff;font-size: 12px"></i>
                {{ node.label }}
              </span>
              <div v-if="data.type == 'cat' || data.type == 'pro'">
                <i class="el-icon-folder-add" style="padding-right: 5px;" @click="createCatalog"></i>
                <i class="el-icon-document-add" style="padding-right: 5px;" @click="createDas"></i>
              </div>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
    </el-collapse-item>
    <el-collapse-item title="参数视图" name="param">
      <div :style="{ height: paramTreeHeight + 'px' }">
        <el-scrollbar style="height:100%">
          <el-tree :data="projectInfo" node-key="id" :default-expanded-keys="[projectId]"></el-tree>
        </el-scrollbar>
      </div>
    </el-collapse-item>
  </el-collapse>
</template>

<script>
export default {
  name: "ProjectView",
  props: {
    projectInfo: Array
  },
  data() {
    return {
      screenHeight: window.innerHeight,
      activeNames: ["pro", "param"],
      paramTreeHeight: 180
    };
  },
  computed: {
    projectTreeHeight: function() {
      return this.screenHeight - 320;
    },
    projectId: function() {
      return this.projectInfo[0].id;
    }
  },
  methods: {
    handleChange(val) {
      if (val.length == 1) {
        if (val[0] == "param") {
          this.paramTreeHeight = this.screenHeight - 120;
        }
      } else {
        this.paramTreeHeight = 180;
      }
    },
    createCatalog(event) {
      this.$emit("create-catalog");
      event.stopPropagation();
    },
    createDas(event) {
      this.$emit("create-das");
      event.stopPropagation();
    },
    openPage(type) {
      if (type != "cat") {
        this.$emit("open-page", type);
      }
    }
  },
  mounted() {
    let _this = this; //赋值vue的this
    window.onresize = () => {
      return (() => {
        _this.screenHeight = window.innerHeight;
      })();
    };
  }
};
</script>

<style scoped></style>
