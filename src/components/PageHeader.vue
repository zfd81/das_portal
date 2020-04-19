<template>
  <div style="margin: 0px;">
    <el-row>
      <el-col :span="12" class="page-header-title">
        <slot name="content"></slot>
      </el-col>
      <el-col :span="12" class="page-header-btn">
        <slot name="btns"></slot>
      </el-col>
    </el-row>
    <el-divider class="page-header-divider"></el-divider>
  </div>
</template>

<script>
export default {
  name: "PageHeader"
};
</script>

<style scoped></style>
