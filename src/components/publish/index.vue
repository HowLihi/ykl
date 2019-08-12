<template>
  <div class="article-container">
    <el-card>
      <div slot="header">
        <my-bread>{{articleId?'修改':'发布'}}文章</my-bread>
      </div>
      <el-form label-width="100px">
        <el-form-item label="标题：">
          <el-input style="width:400px" v-model="articleForm.title"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <quill-editor :options="editorOption" v-model="articleForm.content"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group @change="changeType" v-model="articleForm.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div v-if="articleForm.cover.type === 1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div style="display:flex" v-if="articleForm.cover.type === 3">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
            <my-image v-model="articleForm.cover.images[1]"></my-image>
            <my-image v-model="articleForm.cover.images[2]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="!articleId">
          <el-button @click="submit(false)" type="primary">发表</el-button>
          <el-button @click="submit(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button @click="update(false)" type="success">修改</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import MyBread from '@/components/slots/my-bread.vue'
import myChannel from '@/components/slots/channel.vue'
import myImage from '@/components/slots/my-image.vue'

import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor,
    myBread: MyBread,
    myChannel,
    myImage
  },
  data () {
    return {
      articleForm: {
        title: null,
        cover: {
          type: 1,
          images: []
        },
        content: null,
        channel_id: null
      },
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ 'header': 1 }, { 'header': 2 }],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            [{ 'indent': '-1' }, { 'indent': '+1' }],
            ['image']
          ]
        }
      },
      articleId: null
    }
  },
  methods: {
    changeType () {
      this.articleForm.cover.images = []
    },
    async submit (draft) {
      // 发请求
      await this.$http.post(`articles?draft=${draft}`, this.articleForm)
      // 提示
      this.$message.success(draft ? '存入草稿成功' : '发表成功')
      // 跳转内容管理
      this.$router.push('/article')
    },
    async update (draft) {
      // 发请求
      await this.$http.put(`articles/${this.articleId}?draft=${draft}`, this.articleForm)
      // 提示
      this.$message.success(draft ? '修改，存入草稿成功' : '修改成功')
      // 跳转内容管理
      this.$router.push('/article')
    },
    async getArticle () {
      const { data: { data } } = await this.$http.get('articles/' + this.articleId)
      this.articleForm = data
    }
  },
  created () {
    this.articleId = this.$route.query.id
    // 如果ID在地址栏存储  代表是修改逻辑  才有必要去获取文章数据
    if (this.articleId) {
      this.getArticle()
    }
  },
  watch: {
    // 注意：监听data中的数据变化，this.$route 属于响应式数据
    $route () {
      if (!this.$route.query.id) {
        this.articleId = null
        this.articleForm = {
          title: null,
          content: null,
          cover: {
            type: 1,
            images: []
          },
          channel_id: null
        }
      }
    }
  }
}
</script>

<style lang="less">
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
.my-image {
  margin-right: 10px;
}
</style>
