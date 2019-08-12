<template>
  <div class="my-image">
    <!-- 图片按钮 -->
    <div @click="openDialog()" class="img-btn">
      <img :src="value||defaultImage" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="素材库" name="image">
          <el-radio-group @change="changeCollect" size="mini" v-model="reqParams.collect">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <div class="img-list">
            <div
              :class="{selected:selectedImageUrl===item.url}"
              :key="item.id"
              @click="selectedImageUrl=item.url"
              class="img-item"
              v-for="item in images"
            >
              <img :src="item.url" alt />
            </div>
            <el-pagination
              :current-page="reqParams.page"
              :page-size="reqParams.per_page"
              :total="total"
              @current-change="changePager"
              background
              layout="prev, pager, next"
              v-if="total > reqParams.per_page"
            ></el-pagination>
          </div>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload" style="text-align:center">
          <el-upload
            :headers="headers"
            :on-success="handleSuccess"
            :show-file-list="false"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            class="avatar-uploader"
          >
            <img :src="uploadImageUrl" class="avatar" v-if="uploadImageUrl" />
            <i class="el-icon-plus avatar-uploader-icon" v-else></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span class="dialog-footer" slot="footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button @click="confirmImage()" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import defaultImage from '../../assets/images/default.png'
import store from '@/store/index.js'
export default {
  props: ['value'],
  name: 'my-image',
  data () {
    return {
      // 控制对话框显示隐藏
      dialogVisible: false,
      // 控制tab选项卡到底激活谁
      activeName: 'image',
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      images: [],
      total: 0,
      selectedImageUrl: null,
      uploadImageUrl: null,
      headers: {
        Authorization: `Bearer ${store.getUser().token}`
      },
      defaultImage
    //   value: defaultImage
    }
  },
  methods: {
    openDialog () {
      this.dialogVisible = true
      this.getImages()
    },
    async getImages () {
      const { data: { data } } = await this.$http.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    changeCollect () {
      this.reqParams.page = 1
      this.getImages()
    },
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    handleSuccess (res) {
      // 预览即可
      this.uploadImageUrl = res.data.url
    },
    confirmImage () {
      if (this.activeName === 'image') {
        // this.value = this.selectedImageUrl
        this.$emit('input', this.selectedImageUrl)
      } else {
        // this.value = this.uploadImageUrl
        this.$emit('input', this.uploadImageUrl)
      }
      this.dialogVisible = false
    }
  }
}
</script>

<style scoped lang='less'>
.img-btn {
  width: 160px;
  height: 160px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.dialog-footer {
  text-align: center;
  width: 100%;
  display: block;
}
.img-list {
  margin-top: 10px;
  .img-item {
    width: 160px;
    height: 120px;
    border: 1px dashed #ddd;
    display: inline-block;
    margin-right: 15px;
    margin-bottom: 10px;
    position: relative;
    &.selected {
      &::after {
        content: '';
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.2) url(../../assets/images/selected.png)
          no-repeat center / 50px 50px;
      }
    }
    img {
      width: 100%;
      height: 100%;
      display: block;
      object-fit: contain;
    }
  }
}
</style>
