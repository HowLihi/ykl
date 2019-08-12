<template>
  <div>
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div class="btn-box">
        <el-radio-group @change="changeCollect" size="small" v-model="reqParams.collect">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button
          @click="openDialog"
          size="small"
          style="float:right"
          type="success"
        >添加素材</el-button>
      </div>
      <div class="img-list">
        <div :key="item.id" class="img-item" v-for="item in images">
          <img :src="item.url" alt />
          <div class="footer" v-show="!reqParams.collect">
            <span
              :class="{selected:item.is_collected}"
              @click="toggleCollect(item)"
              class="el-icon-star-off"
            ></span>
            <span class="el-icon-delete" @click="deleteImage(item.id)"></span>
          </div>
        </div>
      </div>
      <el-pagination
        :current-page="reqParams.page"
        :page-size="reqParams.per_page"
        :total="total"
        @current-change="changePager"
        background
        layout="prev, pager, next, total"
        v-if="total > reqParams.per_page"
      ></el-pagination>
      <el-dialog :visible.sync="dialogVisible" title="提示" width="30%" style = "text-align: center">
        <el-upload
          :on-success="handleSuccess"
          :show-file-list="false"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          class="avatar-uploader"
          :headers="headers"
          name="image"
        >
          <img :src="imageUrl" class="avatar" v-if="imageUrl" />
          <i class="el-icon-plus avatar-uploader-icon" v-else></i>
        </el-upload>
        <span class="dialog-footer" slot="footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
import MyBread from '@/components/slots/my-bread.vue'
import store from '@/store/index.js'
export default {
  components: { MyBread },
  data () {
    return {
      reqParams: {
        collect: false,
        page: 1,
        per_page: 10
      },
      images: [],
      total: 0,
      dialogVisible: false,
      headers: {
        Authorization: `Bearer ${store.getUser().token}`
      },
      imageUrl: null
    }
  },
  methods: {
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
      this.imageUrl = res.data.url
      this.$message.success('上传成功')
      window.setTimeout(() => {
        this.dialogVisible = false
        this.reqParams.page = 1
        this.getImages()
      }, 2000)
    },
    openDialog () {
      this.imageUrl = null
      this.dialogVisible = true
    },
    async toggleCollect (item) {
      const {
        data: { data }
      } = await this.$http.put(`user/images/${item.id}`, {
        collect: !item.is_collected
      })
      this.$message.success(data.collect ? '添加收藏成功' : '取消收藏成功')
      // 更新当前图片的状态即可
      item.is_collected = data.collect
    },
    deleteImage (id) {
      // 加个确认框
      this.$confirm('此操作将永久删除该图片, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete('user/images/' + id)
        this.$message.success('删除成功')
        this.getImages()
      }).catch(() => {})
    }
  },
  created () {
    this.getImages()
  }

}
</script>

<style scoped lang="less">
.img-list {
  margin-top: 20px;
}
.img-item {
  width: 160px;
  height: 160px;
  border: 1px dashed #ddd;
  position: relative;
  display: inline-block;
  margin-right: 50px;
  margin-bottom: 20px;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
  .footer {
    position: absolute;
    left: 0;
    bottom: 0;
    height: 30px;
    line-height: 30px;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    text-align: center;
    width: 100%;
    span {
      margin: 0 20px;
      &.selected {
        color: red;
      }
    }
  }
}
</style>
