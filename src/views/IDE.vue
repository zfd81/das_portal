<template>
  <el-container>
    <el-aside class="container-left" width="370px">
      <el-tabs tab-position="left" style="height: 100vh">
        <el-tab-pane>
          <span slot="label"><i class="el-icon-notebook-2"></i></span>
          <project-view :project-info="data" @create-catalog="createCatalog" @create-das="createDas" @open-page="openPage"></project-view>
        </el-tab-pane>
        <el-tab-pane style="height:100vh;overflow-y:auto;overflow-x:auto;">
          <span slot="label"><i class="el-icon-s-grid"></i></span>
          <project-list @create-project="createProject" @show-project="showProject"></project-list>
          <project-creator :visible="dialogVisible" @hidden="dialogVisible = false" @success="aaa" style="text-align: left"></project-creator>
        </el-tab-pane>
      </el-tabs>
      <i class="el-icon-setting icon-setting" @click="showSettingMenu"></i>
      <ul v-show="menuVisible" class="el-dropdown-menu el-popper" id="setting-menu" style="text-align: left;" @mouseleave="hiddenSettingMenu">
        <li tabindex="-1" class="el-dropdown-menu__item">系统设置</li>
        <li tabindex="-1" class="el-dropdown-menu__item el-dropdown-menu__item--divided">用户信息</li>
      </ul>
    </el-aside>
    <el-container>
      <el-main class="container-main">
        <el-tabs
          v-model="editableTabsValue"
          type="border-card"
          @tab-click="handleClick"
          @tab-remove="removeTab"
          closable
          style="height: calc(100vh - 270px);overflow-y:auto;"
        >
          <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :name="item.name">
            <span slot="label">
              <i v-if="item.type == 'ads'" class="iconfont icon-Code" style="color: #42b983"></i>
              <i v-if="item.type == 'page'" class="el-icon-document"></i>
              {{ item.title }}
            </span>
            <keep-alive>
              <component v-bind:is="item.content" :ref="item.name"></component>
            </keep-alive>
          </el-tab-pane>
        </el-tabs>
      </el-main>
      <el-footer class="container-footer">
        <el-tabs>
          <el-tab-pane name="first">
            <span slot="label" style="padding-left: 10px;padding-right: 10px">问题</span>
          </el-tab-pane>
          <el-tab-pane name="second">
            <span slot="label" style="padding-left: 10px;padding-right: 10px">结果</span>
          </el-tab-pane>
          <el-tab-pane name="third">
            <span slot="label" style="padding-left: 10px;padding-right: 10px">输出</span>
          </el-tab-pane>
        </el-tabs>
        <div class="toolbar">
          <i class="iconfont icon-bofang1 toolbar-button toolbar-button-run"></i>
          <i class="iconfont icon-tingzhi-shixin toolbar-button toolbar-button-stop"></i>
          <i class="iconfont icon-baocun toolbar-button toolbar-button-save"></i>
        </div>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import ProjectView from "./ProjectView";
import ProjectList from "./ProjectList";
import ProjectCreator from "./ProjectCreator";
import ProjectEditor from "./ProjectEditor";
import testData from "../data";
export default {
  name: "IDE",
  data() {
    return {
      menuVisible: false,
      tabIndex: 0,
      editableTabsValue: "2",
      editableTabs: [],
      dialogVisible: false,
      data: testData.proData
    };
  },
  methods: {
    aaa() {
      debugger;
      alert("aaa");
    },
    showSettingMenu(event) {
      let menu;
      menu = document.querySelector("#setting-menu");
      //设定位置
      menu.style.left = event.clientX + 8 + "px";
      menu.style.top = event.clientY - 115 + "px";
      this.menuVisible = true;
      // this.currentNode = node;
    },
    hiddenSettingMenu() {
      this.menuVisible = false;
    },
    createCatalog() {
      this.$prompt("请输入目录名", "创建目录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          this.$message({
            type: "success",
            message: "你的邮箱是: " + value
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消输入"
          });
        });
    },
    createDas() {
      this.dialogVisible = true;
    },
    openPage(type) {
      alert(type);
    },
    createProject() {
      this.dialogVisible = true;
    },
    showProject(item) {
      let tabName = "ProjectDetailsTab";
      let notExist = true;
      this.editableTabs.forEach((tab, index) => {
        if (tab.name === tabName) {
          tab.title = item.code + ":" + item.name;
          notExist = false;
          return;
        }
      });
      if (notExist) {
        this.editableTabs.push({
          title: item.code + ":" + item.name,
          name: tabName,
          type: "page",
          content: ProjectEditor
        });
      }
      this.editableTabsValue = tabName;
    },
    removeTab(targetName) {
      let tabs = this.editableTabs;
      let activeName = this.editableTabsValue;
      if (activeName === targetName) {
        tabs.forEach((tab, index) => {
          if (tab.name === targetName) {
            let nextTab = tabs[index + 1] || tabs[index - 1];
            if (nextTab) {
              activeName = nextTab.name;
            }
          }
        });
      }
      this.editableTabsValue = activeName;
      this.editableTabs = tabs.filter(tab => tab.name !== targetName);
    }
  },
  components: {
    ProjectView,
    ProjectList,
    ProjectCreator,
    ProjectEditor
  }
};
</script>

<style scoped></style>
