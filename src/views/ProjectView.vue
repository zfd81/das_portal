<template>
  <el-collapse v-model="activeNames" @change="handleChange">
    <el-collapse-item title="项目视图" name="pro">
      <div :style="{ height: projectTreeHeight + 'px' }">
        <el-scrollbar style="height:100%">
          <el-tree :data="projectInfo" node-key="id" @node-contextmenu="rightClick" :default-expanded-keys="[projectId]">
            <span class="custom-tree-node tree-item-div" slot-scope="{ node, data }" @dblclick="openPage(data)">
              <span>
                <i v-if="data.type == 'das'" class="iconfont icon-Code" style="color: #42b983"></i>
                <i v-if="data.type == 'conn'" class="iconfont icon-links" style="color:#ffb108;"></i>
                <i v-if="data.type == 'user'" class="iconfont icon-user-group" style="color: #247df5"></i>
                <i v-if="data.type == 'cat'" class="iconfont icon-folder-fill" style="color: #ffd90e"></i>
                <i v-if="data.type == 'param'" class="iconfont icon-canshu1" style="color: #1b61ff;font-size: 12px"></i>
                {{ node.label }}
              </span>
              <div>
                <i v-if="data.type == 'pro'" class="el-icon-folder-add" style="padding-right: 5px;" @click.stop="createCatalog($event, data)"></i>
                <i v-if="data.type == 'cat'" class="el-icon-document-add" style="padding-right: 5px;" @click.stop="createDas"></i>
              </div>
            </span>
          </el-tree>
        </el-scrollbar>
      </div>
      <ul v-show="menuVisible" class="el-dropdown-menu el-popper" id="context-menu" style="text-align: left;" @mouseleave="hiddenRight">
        <li tabindex="-1" class="el-dropdown-menu__item" @click="showDialog(0)">创建目录</li>
        <li tabindex="-1" class="el-dropdown-menu__item" @click="showDialog(1)">创建功能</li>
        <li tabindex="-1" class="el-dropdown-menu__item el-dropdown-menu__item--divided">移动到...</li>
        <li tabindex="-1" class="el-dropdown-menu__item">删除</li>
        <div x-arrow="" class="popper__arrow" style="left: 40px;"></div>
      </ul>
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
      paramTreeHeight: 180,
      currentNode: {},
      menuVisible: false
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
    renderContent(h, { node, data, store }) {
      //   return (
      //           <span class="custom-tree-node tree-item-div">
      //           <span>
      //           {this.showOrEdit(data)}
      //           </span>
      //   {this.nodeToolBar(node,data,store)}
      // </span>);
    },
    handleChange(val) {
      if (val.length == 1) {
        if (val[0] == "param") {
          this.paramTreeHeight = this.screenHeight - 120;
        }
      } else {
        this.paramTreeHeight = 180;
      }
    },
    hiddenRight() {
      this.menuVisible = false;
    },
    rightClick(event, data, node, element) {
      if (data.type == "pro" || data.type == "cat" || data.type == "das") {
        let menu;
        menu = document.querySelector("#context-menu");
        //设定位置
        let x = event.clientX;
        if (x < 270) {
          x = x - 50;
        } else {
          x = x - 150;
        }
        menu.style.left = x - 7 + "px";
        menu.style.top = event.clientY - 10 + "px";
        this.menuVisible = true;
        this.currentNode = node;
      }
      event.stopPropagation();
    },
    createCatalog(event, data) {
      this.$emit("create-catalog", data);
    },
    createDas(event) {
      this.$emit("create-das");
    },
    openPage(data) {
      if (data.type == "das") {
        this.$emit("open-das", data.id);
      } else if (data.type == "conn") {
        this.$emit("open-conn", data.id);
      } else if (data.type == "user") {
        this.$emit("open-user");
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
