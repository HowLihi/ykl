<template>
  <el-select clearable placeholder="请选择" :value="value" @change="fn">
    <el-option :key="item.id" :label="item.name" :value="item.id" v-for="item in channelOptions"></el-option>
  </el-select>
</template>

<script>
export default {
  props: ['value'],
  data () {
    return {
      channelOptions: []
    }
  },
  created () {
    this.getChannelOptions()
  },
  methods: {
    fn (val) {
      if (val === '') val = null
      this.$emit('input', val)
    },
    async getChannelOptions () {
      const { data: { data } } = await this.$http.get('channels')
      this.channelOptions = data.channels
    }
  }
}
</script>

<style>
</style>
