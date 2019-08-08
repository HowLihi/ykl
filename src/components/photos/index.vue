<template>
  <div>
    <el-card>
      <div slot="header">
        <my-bread>素材管理</my-bread>
      </div>
      <div class="btn-box">
        <el-radio-group size="small" v-model="reqParams.collect" @change="changeCollect">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
        <el-button size="small" style="float:right" type="success">添加素材</el-button>
      </div>
      <div class="img-list">
        <div :key="item.id" class="img-item" v-for="item in images">
          <img :src="item.url" alt />
          <div class="footer" v-show="!reqParams.collect">
            <span :class="{selected:item.is_collected}" class="el-icon-star-off"></span>
            <span class="el-icon-delete"></span>
          </div>
        </div>
      </div>
      <el-pagination v-if="total > reqParams.per_page" :total="total" background layout="prev, pager, next" :page-size="reqParams.per_page"
        :current-page="reqParams.page" @current-change="changePager"></el-pagination>
    </el-card>
  </div>
</template>

<script>
import MyBread from '@/components/slots/my-bread.vue'
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
      total: 0
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
    changePaper (newpage) {
      this.reqParams.page = newpage
      this.getImages()
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
