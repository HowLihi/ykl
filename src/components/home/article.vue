<template>
  <div>
    <el-card>
      <div class="clearfix" slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <el-form label-width="80px" ref="form" size="small">
        <el-form-item label="状态: ">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道：">
          <el-select clearable placeholder="请选择" v-model="reqParams.channel_id">
            <el-option
              :key="item.id"
              :label="item.name"
              :value="item.id"
              v-for="item in channelOptions"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            @change="changeDate"
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            v-model="dateArr"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="select">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">根据筛选条件共查询到 {{total}} 条结果：</div>
      <!-- 表格组件 -->
      <el-table :data="articles">
        <el-table-column label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" fit="cover" style="width:120px;height:80px">
              <div slot="error">
                <img alt src="../../assets/images/error.gif" style="width:120px;height:80px" />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.status === 2">审核通过</el-tag>
            <el-tag v-if="scope.row.status === 1">待审核</el-tag>
            <el-tag type="info" v-if="scope.row.status === 0">草稿</el-tag>
            <el-tag type="warning" v-if="scope.row.status === 3">审核失败</el-tag>
            <el-tag type="danger" v-if="scope.row.status === 4">已删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="发布时间" prop="pubdate"></el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row.id)" circle icon="el-icon-edit" plain type="primary"></el-button>
            <el-button @click="del(scope.row.id)" circle icon="el-icon-delete" plain type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div style="text-align:center;margin-top:30px;">
        <el-pagination
          :current-page="reqParams.page"
          :page-size="reqParams.per_page"
          :total="total"
          @current-change="changePager"
          background
          layout="prev, pager, next, total"
        ></el-pagination>
      </div>
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
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pubdate: null
      },
      channelOptions: [],
      dateArr: [],
      articles: [],
      total: 0
    }
  },
  created () {
    this.getChannelOptions()
    this.getArticles()
  },
  methods: {
    async getChannelOptions () {
      const { data: { data } } = await this.$http.get('channels')
      this.channelOptions = data.channels
    },
    async getArticles () {
      const { data: { data } } = await this.$http.get('articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    },
    // 组件内部的方法,参数为当前页
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getArticles()
    },
    changeDate (dateArr) {
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    },
    select () {
      this.reqParams.page = 1
      this.getArticles()
    },
    del (id) {
      // 1. 弹出一个确认框
      // 2. 点击确认  发起删除请求
      // 3. 删除成功   提示   更新列表
      this.$confirm('亲，此操作将永久删除该文章, 是否继续?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        await this.$http.delete(`articles/${id}`)
        // 上面的请求确实成功了，响应的时候来到前端报错了，阻止下面程序的执行。
        // 提示 更新列表
        this.$message.success('删除文章成功')
        this.getArticles()
      }).catch(() => {})
    },
    edit (id) {
      this.$router.push('/publish?id=' + id)
    }
  },
  watch: {
    'reqParams.channel_id': function (newVal, oldVal) {
      if (newVal === '') {
        this.reqParams.channel_id = null
      }
    }
  }
}
</script>

<style>
</style>
