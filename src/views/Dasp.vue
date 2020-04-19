<template>
  <div>
    <el-container>
      <el-aside width="320px" class="container-left">
        <project-window :project-info="data" :height="screenHeight" v-on:add-pro="tt"></project-window>
      </el-aside>
      <el-container>
        <el-main class="container-main">
          <div class="grid-content bg-purple">
            <el-tabs
              v-model="editableTabsValue"
              type="border-card"
              @tab-click="handleClick"
              @tab-remove="removeTab"
              closable
              :style="{ height: screenHeight - 272 + 'px' }"
            >
              <el-tab-pane :key="item.name" v-for="(item, index) in editableTabs" :name="item.name">
                <span slot="label">
                  <i v-if="item.type == 'ads'" class="iconfont icon-Code" style="color: #42b983"></i>
                  <i v-if="item.type == 'page'" class="el-icon-edit" style="color: #42b983"></i>
                  {{ item.title }}
                </span>
                <keep-alive>
                  <component v-bind:is="item.content" :ref="item.name"></component>
                </keep-alive>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-main>
        <el-footer class="container-footer" height="270px">
          <el-tabs>
            <el-tab-pane name="first">
              <span slot="label" style="padding-left: 10px;padding-right: 10px">
                问题
              </span>
              aaaa
            </el-tab-pane>
            <el-tab-pane name="second">
              <span slot="label" style="padding-left: 10px;padding-right: 10px">
                结果
              </span>
              配置管理
            </el-tab-pane>
            <el-tab-pane name="third">
              <span slot="label" style="padding-left: 10px;padding-right: 10px">
                输出
              </span>
              角色管理
            </el-tab-pane>
          </el-tabs>
          <div class="toolbar">
            <i class="iconfont icon-bofang1 toolbar-button toolbar-button-run"></i>
            <i class="iconfont icon-tingzhi-shixin toolbar-button toolbar-button-stop"></i>
            <i class="iconfont icon-baocun toolbar-button toolbar-button-save" @click="ss"></i>
          </div>
        </el-footer>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import ProjectWindow from "./ProjectWindow";

import "codemirror/mode/sql/sql.js";
// theme css
import "codemirror/theme/solarized.css";
// require active-line.js
import "codemirror/addon/selection/active-line.js";
// closebrackets
import "codemirror/addon/edit/closebrackets.js";
// keyMap
import "codemirror/mode/clike/clike.js";
import "codemirror/addon/edit/matchbrackets.js";
import "codemirror/addon/comment/comment.js";
import "codemirror/addon/dialog/dialog.js";
import "codemirror/addon/dialog/dialog.css";
import "codemirror/addon/search/searchcursor.js";
import "codemirror/addon/search/search.js";
import "codemirror/keymap/emacs.js";

export default {
  name: "Dasp",
  data() {
    return {
      screenHeight: window.innerHeight,
      curCode: "",
      saveFunction: {},
      cmOptions: {
        value: "",
        mode: "text/x-sql",
        theme: "default",
        lineNumbers: true,
        line: true
      },
      editableTabsValue: "2",
      editableTabs: [
        {
          title: "Tab 1",
          name: "t1",
          type: "ads",
          content: "CreateProject"
        }
      ],
      tabIndex: 2,
      data: [
        {
          label: "project",
          id: "aa",
          children: [
            {
              label: "一级 1",
              type: "cat",
              children: [
                {
                  label: "二级 1-1",
                  type: "cat",
                  children: [
                    {
                      label: "三级 1-1-1",
                      type: "ads"
                    },
                    {
                      label: "三级 1-1-1",
                      type: "ads"
                    },
                    {
                      label: "三级 1-1-1",
                      type: "ads"
                    },
                    {
                      label: "三级 1-1-1",
                      type: "ads"
                    }
                  ]
                }
              ]
            },
            {
              label: "一级 2",
              type: "cat",
              children: [
                {
                  label: "二级 2-1",
                  children: [
                    {
                      label: "三级 2-1-1",
                      type: "ads"
                    },
                    {
                      label: "三级 1-1-1",
                      type: "ads"
                    },
                    {
                      label: "三级 1-1-1",
                      type: "ads"
                    }
                  ]
                },
                {
                  label: "二级 2-2",
                  type: "cat",
                  children: [
                    {
                      label: "三级 2-2-1",
                      type: "ads"
                    }
                  ]
                }
              ]
            },
            {
              label: "一级 3",
              type: "cat",
              children: [
                {
                  label: "二级 3-1",
                  type: "cat",
                  children: [
                    {
                      label: "三级 3-1-1"
                    }
                  ]
                },
                {
                  label: "二级 3-2",
                  type: "cat",
                  children: [
                    {
                      label: "aaa",
                      type: "param"
                    },
                    {
                      label: "bbb",
                      type: "param"
                    },
                    {
                      label: "ccc",
                      type: "param"
                    },
                    {
                      label: "ddd",
                      type: "param"
                    }
                  ]
                }
              ]
            },
            {
              label: "数据库链接",
              type: "conn"
            },
            {
              label: "用户管理",
              type: "user"
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  computed: {
    codemirror() {
      return this.$refs.sqlEditor.codemirror;
    }
  },
  methods: {
    onCmReady(cm) {
      console.log("the editor is readied!", cm);
    },
    onCmFocus(cm) {
      console.log("the editor is focused!", cm);
    },
    onCmCodeChange(newCode) {
      console.log("this is new code", newCode);
      this.code = newCode;
    },
    tt() {
      debugger;
      let newTabName = ++this.tabIndex + "";
      this.editableTabs.push({
        title: "新建工程",
        name: newTabName,
        type: "page",
        content: CreateProject
      });
      this.editableTabsValue = newTabName;
    },
    handleClick(tab) {
      this.saveFunction = this.$refs.t1[0].save;
    },
    ss() {
      this.saveFunction("dddd");
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
    ProjectWindow,
    CreateProject
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
