<template>
  <el-container>
    <el-aside class="container-left" width="370px">
      <el-tabs tab-position="left" v-model="ccd" style="height: 100vh">
        <el-tab-pane name="first">
          <span slot="label"><i class="el-icon-notebook-2"></i></span>
          <project-view
            :project-info="projectInfo"
            @create-catalog="createCatalog"
            @create-das="createDas"
            @open-conn="openPage"
            @open-user="openUserPage"
          ></project-view>
        </el-tab-pane>
        <el-tab-pane style="height:100vh;overflow-y:auto;overflow-x:auto;">
          <span slot="label"><i class="el-icon-s-grid"></i></span>
          <navigator-view ref="ProjectList" @query="query" @create="createProject" @show="showProject" @open="open"></navigator-view>
          <project-creator :visible="dialogVisible" @hidden="dialogVisible = false" @success="success" style="text-align: left"></project-creator>
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
        <el-tabs v-model="editableTabsValue" type="border-card" @tab-remove="removeTab" closable style="height: calc(100vh - 270px);overflow-y:auto;">
          <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :name="item.name" style="padding: 0px">
            <span slot="label">
              <i v-if="item.type == 'ads'" class="iconfont icon-Code" style="color: #42b983"></i>
              <i v-if="item.type == 'page'" class="el-icon-document"></i>
              {{ item.title }}
            </span>
            <keep-alive>
              <component v-bind:is="item.content" :ref="item.name" @success="success"></component>
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
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
import ProjectView from "./ProjectView";
import NavigatorView from "./NavigatorView";
import ProjectCreator from "./pages/ProjectCreator";
import ProjectEditor from "./pages/ProjectEditor";
import Connection from "./pages/Connection";
import UserProject from "./pages/UserProject";
import ServEditor from "./pages/ServEditor";
export default {
  name: "IDE",
  data() {
    return {
      ccd: "",
      menuVisible: false,
      tabIndex: 0,
      editableTabsValue: "2",
      editableTabs: [],
      dialogVisible: false
    };
  },
  computed: {
    projectInfo() {
      return this.$store.state.ide.projectInfo;
    }
  },
  methods: {
    dateFormat(fmt, date) {
      let ret;
      const opt = {
        "Y+": date.getFullYear().toString(), // 年
        "m+": (date.getMonth() + 1).toString(), // 月
        "d+": date.getDate().toString(), // 日
        "H+": date.getHours().toString(), // 时
        "M+": date.getMinutes().toString(), // 分
        "S+": date.getSeconds().toString() // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
      };
      for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
          fmt = fmt.replace(ret[1], ret[1].length == 1 ? opt[k] : opt[k].padStart(ret[1].length, "0"));
        }
      }
      return fmt;
    },
    query(val) {
      this.$axios
        .get("/auth/ide/project/user/", {
          params: {
            codeOrName: val
          },
          paramsSerializer: params => {
            return this.$qs.stringify(params, {
              arrayFormat: "repeat"
            });
          }
        })
        .then(response => {
          this.$store.commit("setProjects", response.data);
        })
        .catch(error => {
          console.log(error);
        });
    },
    open(item) {
      this.loadProject(item.code);
      this.ccd = "first";
    },
    loadProject(code) {
      this.$axios
        .get("/auth/ide/project_view/".concat(code))
        .then(response => {
          this.$store.commit("loadProject", response.data);
        })
        .catch(error => {
          console.log(error);
        });
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
    createCatalog(data) {
      this.$prompt("请输入目录名", "创建目录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(({ value }) => {
          if (value != null && value.trim() != "") {
            let form = {
              name: value,
              parent: data.id,
              project: this.projectInfo[0].id
            };
            this.$axios
              .post("/auth/ide/catalog", form)
              .then(response => {
                if (response.status == 200) {
                  this.loadProject(this.projectInfo[0].id);
                  this.$message({
                    type: "success",
                    message: value + "目录创建成功"
                  });
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
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "取消创建目录"
          });
        });
    },
    createDas() {
      // let tabName = "_ServEditorTab";
      let date = new Date();
      let tabName = this.dateFormat("YYYYmmddHHMMSS", date);
      this.editableTabs.push({
        title: "DAS",
        name: tabName,
        type: "page",
        content: ServEditor
      });
      this.editableTabsValue = tabName;
    },
    openPage(id) {
      debugger;
      let tabName = "_ConnectionTab";
      let notExist = true;
      this.editableTabs.forEach((tab, index) => {
        if (tab.name === tabName) {
          notExist = false;
          return;
        }
      });
      if (notExist) {
        this.editableTabs.push({
          title: "数据库连接",
          name: tabName,
          type: "page",
          content: Connection
        });
      }
      this.editableTabsValue = tabName;
      //this.$refs.ProjectDetailsTab[0].init(item.code, item.identity);
    },
    openUserPage() {
      let tabName = "_UserProjectTab";
      let notExist = true;
      this.editableTabs.forEach((tab, index) => {
        if (tab.name === tabName) {
          notExist = false;
          return;
        }
      });
      if (notExist) {
        this.editableTabs.push({
          title: "项目开发者",
          name: tabName,
          type: "page",
          content: UserProject
        });
      }
      this.editableTabsValue = tabName;
      this.$refs[tabName][0].load();
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
      this.$refs.ProjectDetailsTab[0].init(item.code, item.identity);
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
    },
    success(pageType) {
      if (pageType == "ProjectEditor") {
        this.$refs.ProjectList.refresh();
      }
    }
  },
  components: {
    ProjectView,
    NavigatorView,
    ProjectCreator,
    ProjectEditor,
    Connection,
    UserProject,
    ServEditor
  },
  mounted() {
    this.query();
  }
};
</script>

<style scoped></style>
