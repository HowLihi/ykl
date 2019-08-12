<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>粉丝管理</my-bread>
      </div>
      <el-tabs v-model="activeName" type="card">
        <el-tab-pane label="粉丝列表" name="list">
          <div class="fans-list">
            <div class="fans-item" v-for="item in fansList" :key="item.id.toString()">
              <el-avatar style="width:80px;height:80px" :src="item.photo"></el-avatar>
              <p style="font-size:12px">{{item.name}}</p>
              <el-button plain type="primary" size="mini">+关注</el-button>
            </div>
          </div>
          <el-pagination
            style="margin-top:20px"
            v-if="total > reqParams.per_page"
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="changePager"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="粉丝画像" name="photo" >
          <div ref="photo" style="width: 600px;height:400px;"></div>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script>
import MyBread from '@/components/slots/my-bread.vue'
import echarts from 'echarts'
export default {
  components: {
    myBread: MyBread
  },
  data () {
    return {
      activeName: 'list',
      reqParams: {
        page: 1,
        per_page: 24
      },
      fansList: [],
      total: 0
    }
  },
  methods: {
    // 分页
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getFansList()
    },
    async getFansList () {
      const { data: { data } } = await this.$http.get('followers', { params: this.reqParams })
      this.fansList = data.results
      this.total = data.total_count
    },
    drawLine () {
      let photo = this.$refs.photo
      let myChart = echarts.init(photo)
      // 指定图表的配置项和数据
      let option = {
        title: {
          text: 'ECharts 入门示例'
        },
        tooltip: {},
        legend: {
          data: ['销量']
        },
        xAxis: {
          data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
        },
        yAxis: {},
        series: [{
          name: '销量',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }]
      }

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option)
    }
  },
  created () {
    this.getFansList()
    this.$nextTick(function () {
      this.drawLine()
    })
  }
}
</script>

<style scoped lang='less'>
.fans-item{
  text-align: center;
  width: 120px;
  height: 170px;
  border: 1px dashed #ddd;
  padding-top: 15px;
  display: inline-block;
  margin-right: 50px;
  margin-bottom: 20px;
}
</style>
