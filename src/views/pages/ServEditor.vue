<template>
  <el-row :gutter="3" style="background-color: #c1c4ca">
    <el-col :span="18">
      <div class="editor">
        <div class="toolbar">
          <i class="iconfont icon-bofang1 toolbar-button toolbar-button-run"></i>
          <i class="iconfont icon-tingzhi-shixin toolbar-button toolbar-button-stop" @click="ms"></i>
          <i class="iconfont icon-baocun toolbar-button toolbar-button-save" @click="replaceSelection"></i>
          <span class="toolbar-button divider">|</span>
          <el-select v-model="value" placeholder="选择字体大小" size="mini">
            <el-option v-for="item in fontOptions" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <i class="iconfont icon-format toolbar-button toolbar-button-save" @click="format"></i>
          <i class="iconfont icon-701bianjiqi_chexiao toolbar-button toolbar-button-save" @click="undo"></i>
          <i class="iconfont icon-701bianjiqi_chongzuo-copy toolbar-button toolbar-button-save" @click="redo"></i>
        </div>
        <div>
          <textarea ref="textarea" v-model="content"></textarea>
        </div>
      </div>
    </el-col>
    <el-col :span="6">
      <el-tabs type="border-card">
        <el-tab-pane label="参数视图">
          <div :style="{ height: 600 + 'px' }">
            <el-scrollbar style="height:100%">
              <el-tree :data="params" node-key="id">
                <span class="custom-tree-node tree-item-div" slot-scope="{ node, data }" @dblclick="openPage(data)">
                  <span>
                    <i v-if="data.type == 'cat'" class="iconfont icon-parameter" style="color: #ffd90e"></i>
                    <i v-if="data.type == 'param'" class="iconfont icon-canshu1" style="color: #ff730b;font-size: 12px"></i>
                    {{ node.label }}
                  </span>
                </span>
              </el-tree>
            </el-scrollbar>
          </div>
        </el-tab-pane>
      </el-tabs>
    </el-col>
  </el-row>
</template>

<script>
import _CodeMirror from "codemirror";
import "codemirror/theme/cobalt.css";
import "codemirror/mode/sql/sql.js";
import sqlFormatter from "sql-formatter";

// 尝试获取全局实例
const CodeMirror = window.CodeMirror || _CodeMirror;

export default {
  name: "ServEditor",
  props: {
    value: String
  },
  data() {
    return {
      content: "", // 内部真实的内容
      coder: null, // 编辑器实例
      height: window.innerHeight,
      cmOptions: {
        tabSize: 4,
        mode: "text/x-mysql",
        lineNumbers: true,
        line: true
      },
      fontOptions: [
        {
          value: "12px",
          label: "12px"
        },
        {
          value: "14px",
          label: "14px"
        },
        {
          value: "16px",
          label: "16px"
        },
        {
          value: "18px",
          label: "18px"
        },
        {
          value: "20px",
          label: "20px"
        }
      ],
      params: []
    };
  },
  methods: {
    _initialize() {
      // 初始化编辑器实例，传入需要被实例化的文本域对象和默认配置
      this.coder = CodeMirror.fromTextArea(this.$refs.textarea, this.cmOptions);

      // 编辑器赋值
      this.coder.setValue(this.value || this.content);

      // 设置编辑器宽度和高度
      this.coder.setSize("auto", this.height - 350);

      // 支持双向绑定
      this.coder.on("change", coder => {
        this.content = coder.getValue();
        this.$axios
          .post("/auth/ide/serv/param/parsing", { sql: this.content })
          .then(response => {
            this.params = response.data;
          })
          .catch(error => {
            console.log(error);
          });
      });
    },
    format() {
      /*获取文本编辑器内容*/
      let sqlContent = "";
      sqlContent = this.coder.getValue();
      /*将sql内容进行格式后放入编辑器中*/
      this.coder.setValue(sqlFormatter.format(sqlContent));
    },
    undo() {
      this.coder.undo(); //撤销
    },
    redo() {
      this.coder.redo(); //回退
    },
    replaceSelection() {
      this.coder.replaceSelection("ok");
    },
    ms() {
      alert(this.content);
    }
  },
  mounted() {
    this._initialize();
  }
};
</script>

<style scoped>
/*.CodeMirror {*/
/*  !* Set height, width, borders, and global font properties here *!*/
/*  font-family: monospace;*/
/*  height: 600px;*/
/*  color: black;*/
/*  direction: ltr;*/
/*}*/
/*.CodeMirror-scroll {*/
/*  height: auto;*/
/*  overflow-y: hidden;*/
/*  overflow-x: auto;*/
/*}*/
</style>
