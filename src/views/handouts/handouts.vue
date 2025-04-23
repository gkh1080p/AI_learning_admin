<template>
    <div class="handouts-upload">
      <el-row :gutter="20">
        <!-- 左侧：上传区域 -->
        <el-col :span="12">
          <el-card class="upload-card">
            <h3>上传讲义</h3>
            <el-form label-width="80px">
              <el-form-item label="选择视频">
                <el-select v-model="selectedVideo" placeholder="请选择视频" @change="fetchUploadedList">
                  <el-option v-for="video in videos" :key="video.id" :label="video.name" :value="video.id" />
                </el-select>
              </el-form-item>
              <el-form-item label="上传文件">
                <el-upload
                  class="upload-demo"
                  action="/api/upload/handouts"
                  multiple
                  :limit="5"
                  :on-success="handleUploadSuccess"
                  :on-error="handleUploadError"
                  :file-list="fileList"
                  :data="{ videoId: selectedVideo }"
                  list-type="text"
                >
                  <el-button type="primary" :disabled="!selectedVideo">点击上传</el-button>
                  <div slot="tip" class="el-upload__tip">
                    请选择视频后上传，最多上传 5 个文件
                  </div>
                </el-upload>
              </el-form-item>
            </el-form>
          </el-card>
        </el-col>
  
        <!-- 右侧：已上传讲义列表 -->
        <el-col :span="12">
          <el-card class="list-card">
            <h3>已上传讲义</h3>
            <el-table :data="uploadedList" v-if="uploadedList.length > 0" style="width: 100%;">
              <el-table-column prop="fileName" label="文件名" />
              <el-table-column prop="uploadTime" label="上传时间" />
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button
                    type="danger"
                    size="mini"
                    @click="handleDelete(scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
            <div v-else class="empty-tip">请选择左侧视频查看讲义</div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </template>
  
  <script>
  export default {
    name: "HandoutsUpload",
    data() {
      return {
        selectedVideo: null,
        videos: [
          { id: 1, name: "第1章 视频课" },
          { id: 2, name: "第2章 视频课" },
          { id: 3, name: "第3章 视频课" },
        ],
        fileList: [],
        uploadedList: [],
      };
    },
    methods: {
      handleUploadSuccess(response, file, fileList) {
        this.fileList = fileList;
        this.$message.success(`${file.name} 上传成功`);
        this.fetchUploadedList(); // 更新右侧列表
      },
      handleUploadError(err, file) {
        this.$message.error(`${file.name} 上传失败`);
      },
      fetchUploadedList() {
        // 模拟不同视频对应的讲义文件
        if (this.selectedVideo === 1) {
          this.uploadedList = [
            { fileName: "第1章讲义.pdf", uploadTime: "2025-04-22 10:30" },
            { fileName: "第1章补充讲义.docx", uploadTime: "2025-04-22 10:35" },
          ];
        } else if (this.selectedVideo === 2) {
          this.uploadedList = [
            { fileName: "第2章讲义.pptx", uploadTime: "2025-04-22 11:00" },
          ];
        } else {
          this.uploadedList = [];
        }
      },
      handleDelete(file) {
        this.$confirm(`确认删除文件 "${file.fileName}" 吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }).then(() => {
          // 真实场景：调用后端 API 删除文件
          this.$message.success(`已删除 ${file.fileName}`);
          this.uploadedList = this.uploadedList.filter(f => f.fileName !== file.fileName);
        }).catch(() => {
          this.$message.info('取消删除');
        });
      },
    },
  };
  </script>
  
  <style scoped>
  .handouts-upload {
    padding: 20px;
  }
  
  .upload-card,
  .list-card {
    height: 100%;
    min-height: 300px;
  }
  
  h3 {
    margin-bottom: 15px;
    font-size: 18px;
    font-weight: bold;
  }
  
  .empty-tip {
    color: #999;
    font-size: 14px;
    text-align: center;
    padding: 40px 0;
  }
  </style>
  