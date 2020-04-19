<template>
  <div>
    <el-tabs tab-position="left" style="height: 100vh">
      <el-tab-pane>
        <span slot="label">
          <i class="el-icon-notebook-2"></i>
        </span>
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="项目视图" name="pro">
            <div :style="{ height: projectTreeHeight + 'px' }">
              <el-scrollbar style="height:100%">
                <el-tree :data="projectInfo" node-key="id" :default-expanded-keys="[projectId]">
                  <span class="custom-tree-node" slot-scope="{ node, data }">
                    <span>
                      <i v-if="data.type == 'ads'" class="iconfont icon-Code" style="color: #42b983"></i>
                      <i v-if="data.type == 'conn'" class="iconfont icon-links" style="color:#ffb108;"></i>
                      <i v-if="data.type == 'user'" class="iconfont icon-user-group" style="color: #247df5"></i>
                      <i v-if="data.type == 'cat'" class="iconfont icon-folder-fill" style="color: #ffd90e"></i>
                      <i v-if="data.type == 'param'" class="iconfont icon-canshu1" style="color: #1b61ff;font-size: 12px"></i>
                      {{ node.label }}
                    </span>
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
      </el-tab-pane>
      <el-tab-pane style="height:100vh;overflow-y:auto;overflow-x:auto;">
        <span slot="label"><i class="el-icon-s-grid"></i></span>
        <div style="margin-right: 5px;font-size: 12px;text-align: left;">
          <el-row style="margin-top: 10px">
            <el-col :span="19">
              <el-input placeholder="请输入项目名称" prefix-icon="el-icon-search" size="small" v-model="input2"> </el-input>
            </el-col>
            <el-col :span="5" style="text-align: right">
              <el-button type="primary" icon="el-icon-plus" size="small" v-on:click="create"></el-button>
            </el-col>
          </el-row>
          <el-divider class="el-divider-title"></el-divider>
          <h3 style="margin-bottom: 0px">项目标题</h3>
          <el-row>
            <el-col :span="18"
              ><span style="text-align: left;">创建人：张凤达 <br />创建时间：2020-03-04</span></el-col
            >
            <el-col :span="6"><el-button type="success" size="mini">打开</el-button></el-col>
          </el-row>

          <el-divider class="el-divider-pro"></el-divider>

          <el-row>
            <el-col :span="17" style="font-size: 16px;font-weight: bolder;margin-top: 1px;margin-bottom: 2px;">项目标题啊啊啊多</el-col>
            <el-col :span="7"><el-button type="success" size="mini" icon="el-icon-user-solid">打开</el-button></el-col>
          </el-row>
          创建人：张凤达 <br />创建时间：2020-03-04
          <el-divider class="el-divider-pro"></el-divider>
          <el-row>
            <el-col :span="17" style="font-size: 16px;font-weight: bolder;margin-bottom: 2px;">项目标题</el-col>
            <el-col :span="7"><el-button type="primary" size="mini" icon="el-icon-user-solid">打开</el-button></el-col>
          </el-row>
          创建人：张凤达 <br />创建时间：2020-03-04
          <el-divider class="el-divider-pro"></el-divider>
          <el-row style="margin-top: 0px">
            <el-col :span="17" style="font-size: 16px;font-weight: bolder;margin-bottom: 2px;">项目标题</el-col>
            <el-col :span="7"><el-button type="success" size="mini" icon="el-icon-star-on">打开</el-button></el-col>
          </el-row>
          创建人：张凤达 <br />创建时间：2020-03-04
        </div>
      </el-tab-pane>
    </el-tabs>
    <i class="el-icon-setting icon-setting" @click="showMenu"></i>
    <ul v-show="menuVisible" class="el-dropdown-menu el-popper" id="setting-menu" style="text-align: left;" @mouseleave="hiddenMenu">
      <li tabindex="-1" class="el-dropdown-menu__item">系统设置</li>
      <li tabindex="-1" class="el-dropdown-menu__item el-dropdown-menu__item--divided">用户信息</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "ProjectWindow",
  props: {
    projectInfo: Array,
    height: Number
  },
  data() {
    return {
      menuVisible: false,
      activeNames: ["pro", "param"],
      paramTreeHeight: 170
    };
  },
  computed: {
    projectTreeHeight: function() {
      return this.height - 320;
    },
    projectId: function() {
      return this.projectInfo[0].id;
    }
  },
  methods: {
    showMenu(event) {
      let menu;
      menu = document.querySelector("#setting-menu");
      //设定位置
      menu.style.left = event.clientX + 8 + "px";
      menu.style.top = event.clientY - 115 + "px";
      this.menuVisible = true;
      // this.currentNode = node;
    },
    hiddenMenu() {
      this.menuVisible = false;
    },
    handleChange(val) {
      if (val.length == 1 && val[0] == "param") {
        this.paramTreeHeight = this.height - 120;
      } else {
        this.paramTreeHeight = 170;
      }
    },
    create() {
      this.$emit("add-pro");
    }
  }
};
</script>

<style scoped>
.el-scrollbar__wrap {
  overflow-x: hidden;
}
.icon-setting {
  position: absolute;
  left: 16px;
  bottom: 20px;
  font-size: 23px;
}
.icon-setting:hover {
  color: #409eff;
}
.aaa {
  height: 300px;
  overflow-y: auto;
  overflow-x: auto;
}
</style>
