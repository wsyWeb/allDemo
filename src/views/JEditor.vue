<template>
  <div>
    <editor v-model="body" :init="init" :disabled="disabled" @onClick="onClick" />
  </div>
</template>

<script>
import tinymce from 'tinymce/tinymce'
import Editor from '@tinymce/tinymce-vue'

import 'tinymce/themes/silver'
import 'tinymce/icons/default'

import 'tinymce/plugins/image' //图片插件
import 'tinymce/plugins/media' //媒体插件
import 'tinymce/plugins/link'//插件
import 'tinymce/plugins/code'//插件
import 'tinymce/plugins/table'//表格插件
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/lists'//列表插件
import 'tinymce/plugins/contextmenu'
import 'tinymce/plugins/wordcount' //字数统计插件
import 'tinymce/plugins/colorpicker'
import 'tinymce/plugins/textcolor'
import 'tinymce/plugins/nonbreaking'
import 'tinymce/plugins/pagebreak'
import 'tinymce/plugins/preview'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/fullscreen'
import 'tinymce/plugins/imagetools'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/paste'
import 'tinymce/plugins/visualblocks'
import 'tinymce/plugins/charmap'

import 'tinymce/plugins/emoticons'
import 'tinymce/plugins/emoticons/js/emojis'

// import '../plugins/tinymce/lineheight/plugin'
// import '../plugins/tinymce/axupimgs/plugin'

export default {
  name: 'JEditor',
  components: {
    Editor
  },
  props: {
    bucketName: {
      type: String,
      default: 'static'
    },
    // 上传图片后处理方式, 支持 minio: 上传图片到 minio, base64: 图片转换为 base64.
    imgType: {
      type: String,
      default: 'base64'
    },
    value: {
      type: String,
      default: ''
    },
    height: {
      type: Number,
      default: 300
    },
    maxSize: {
      type: Number,
      default: 5 * 1024 * 1024 // 5M.
    },
    disabled: {
      type: Boolean,
      default: false
    },
    // 需要的工具栏
    toolbar: {
      type: [String, Array],
      default: () => {
        return `preview | undo redo | bold italic underline | fontselect fontsizeselect formatselect | forecolor backcolor | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | charmap emoticons link image axupimgs media table pagebreak nonbreaking | lineheight fullscreen removeformat`
      }
    },
    menubar: {
      type: [String, Boolean], //顶部显示菜单栏
      default: 'file edit view insert format tools table tc'
    },
    plugins: {
      type: [String, Array],
      default: `
        importcss
        image
        code
        table
        fullscreen
        link
        advlist
        lists
        hr
        preview
        wordcount
        lineheight
        nonbreaking
        emoticons
        pagebreak
        preview
        quickbars
        imagetools
        fullscreen
        axupimgs
        searchreplace
        paste
        visualblocks
        charmap
        media
      `
    }
  },
  data() {
    return {
      body: this.value,
      init: {
        language_url: '/tinymce/langs/zh_CN.js',
        language: 'zh_CN',
        skin_url: '/tinymce/skins/lightgray',
        a11y_advanced_options: true,
        branding: false, //隐藏右下角技术支持
        toolbar_sticky: true,
        lists_indent_on_tab: false,
        importcss_append: true,
        toolbar: this.toolbar,
        plugins: this.plugins,
        menubar: this.menubar,
        height: this.height,
        font_formats: //字体
          '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=SimSun,serif;黑体=SimHei;仿宋=FangSong;楷体=KaiTi;隶书=LiSu;幼圆=YouYuan;Arial=Arial;Courier New=courier new,courier,monospace; AkrutiKndPadmini=Akpdmi-n;',
        fontsize_formats: '8px 10px 11px 12px 14px 16px 18px 20px 24px 36px 48px',
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote quickimage quicktable', //在编辑器内容区，光标插入（回车）或选择时，在光标位置出现的快捷工具栏。
        toolbar_mode: 'sliding', //工具栏模式 floating / sliding / scrolling / wrap
        contextmenu: 'link image imagetools table', //上下文菜单
        images_upload_handler: (blobInfo, success) => {
          if (this.imgType === 'base64') {
            success(`data:image/jpeg;base64,${blobInfo.base64()}`)
          } else if (this.imgType === 'minio') {
            // this.uploadFile(blobInfo).then(res => {
            //   if (res.success) {
            //     success(res.data.presignedUrl)
            //   } else {
                // fail(`上传文件失败: ${res.message}`)
            //   }
            // })
          }
        }
      },
    }
  },
  methods: {
    onClick(e) {
      this.$emit('onClick', e, tinymce)
    },
    clear() {
      this.body = ''
    },
    // uploadFile(blobInfo) {
    //   const formData = new FormData()
    //   formData.append('file', blobInfo.blob())

    //   return new Promise(resolve => {
    //     request({
    //       ...this.api.upload,
    //       params: formData,
    //       urlReplacements: [{ substr: '{bucketName}', replacement: this.bucketName }]
    //     }).then(res => {
    //       if (res.success) {
    //         resolve(res)
    //       } else {
    //         this.$message.error(res.message)
    //       }
    //     })
    //   })
    // }
  },
  mounted() {
    tinymce.init({})
  },
  watch: {
    value(newValue) {
      this.body = newValue
    },
    body(newValue) {
      this.$emit('input', newValue)
    }
  },
  beforeUnmount() {
    tinymce.remove()
  }
}
</script>

<style scoped>
</style>
