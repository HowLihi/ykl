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
          <el-select placeholder="请选择" v-model="reqParams.channel_id">
            <el-option
              :key="item.value"
              :label="item.label"
              :value="item.value"
              v-for="item in channelOptions"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="日期：">
          <el-date-picker
            end-placeholder="结束日期"
            range-separator="至"
            start-placeholder="开始日期"
            type="daterange"
            v-model="dateArr"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
      <div slot="header">根据筛选条件共查询到 0 条结果：</div>
      <!-- 表格组件 -->
      <el-table :data="articles">
        <el-table-column label="编号" prop="id"></el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <div style="text-align:center;margin-top:30px;">
        <el-pagination :total="1000" background layout="prev, pager, next, total"></el-pagination>
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
      channelOptions: [{ label: 'js', value: '1000' }],
      dateArr: [],
      articles: [{ date: '2019-10-10' }]
    }
  }
}
</script>

<style>
</style>
