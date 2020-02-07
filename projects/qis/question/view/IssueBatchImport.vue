<template>
  <a-modal
    :title="$t('issue_import.title')"
    :ok-text="$t('issue_import.ok')"
    :cancel-text="$t('issue_import.cancel')"
    :visible="visible"
    wrap-class-name="issue-batch-import"
    :ok-button-props="okButtonProps"
    :z-index="6001"
    :mask-closable="false"
    @ok="ok"
    @cancel="cancel"
  >
    <a-form
      :label-col="{ span: 7 }"
      :wrapper-col="{ span: 17 }"
    >
      <a-form-item :label="$t('issue_import.template_download')">
        <a-tooltip placement="right">
          <template slot="title">
            {{ $t('issue_import.click_download') }}
          </template>
          <a-button
            icon="download"
            type="link"
            @click="templateDownload"
          >
            {{ $t('issue_import.template_name') }}
          </a-button>
        </a-tooltip>
      </a-form-item>
      <a-form-item :label="$t('issue_import.batch_import')">
        <a-upload
          style="margin-left: 12px;"
          accept=".xlsx"
          :file-list="fileList"
          :headers="headers"
          :before-upload="beforeUpload"
          :remove="removeFile"
        >
          <a-button
            icon="upload"
            type="primary"
            ghost
          >
            <!-- 批量导入按钮 -->
            {{ $t('issue_action.upload') }}
          </a-button>
          {{ $t('issue_import.import_prompt') }}
        </a-upload>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script>
import { createNamespacedHelpers } from 'vuex';
// import download from '@http/download.js';
import attachmentMix from '~~/issue-attachment.js';
import moduleDynamicCache from '~~/module-dynamic-cache.js';

const { mapActions } = createNamespacedHelpers('question');
export default {
  mixins: [attachmentMix, moduleDynamicCache('question')],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      showModal: false,
      file: null,
      fileList: [],
      okButtonProps: {
        props: {
          disabled: true,
          loading: false,
        },
      },
    };
  },
  watch: {
    file (value) {
      this.okButtonProps.props.disabled = !value;
    },
  },
  methods: {
    ...mapActions([
      'getTemplateDownload',
      'issueImport',
    ]),
    removeFile () {
      this.fileList = [];
      return false;
    },
    templateDownload () {
      this.getTemplateDownload({ rec_type: 20021001 }).then((res = {}) => {
        const url = res.path;
        const name = res.originalFilename;
        if (!url || !name) {
          this.$message.show({ content: this.$t('file_download.failure'), type: 'error', duration: 3 });
        } else {
          this.$message.loading(this.$t('status.downloading'), 3);
          // download(this.getDownloadURL(url, name), name, true);
          import('@http').then((res2) => {
            const $ = res2.default;
            $.get('/oss/ossFile/download', {
              path: url,
              originalFilename: name,
            }, { responseType: 'blob' });
          });
        }
      });
    },
    beforeUpload (file) {
      this.file = file;
      this.$set(this.fileList, 0, file);
      return false;
    },
    close () {
      this.$emit('update:visible', false);
      this.file = null;
      this.fileList = [];
      this.okButtonProps.props.loading = false;
      this.okButtonProps.props.disabled = true;
    },
    ok () {
      const formData = new FormData();
      formData.append('file', this.file);
      this.okButtonProps.props.loading = true;
      this.issueImport(formData).then(() => {
        this.$message.show({ content: this.$t('file_upload.success'), duration: 3 });
        this.close();
        this.changeAdvancePageConfig({
          _t: new Date(),
          selectTabKey: '0',
          draftPageData: { current: 1, pageSize: 10 },
        });
      }).catch((err) => {
        this.$message.show({ content: this.$t(err || 'file_upload.failure'), type: 'error', duration: 3 });
      }).finally(() => {
        this.okButtonProps.props.loading = false;
      });
    },
    cancel () {
      this.close();
    },
  },
};
</script>

<style lang="less" scoped>
  /deep/ .ant-upload-list {
    margin-left: 12px;
  }
</style>
<style lang="less">
  .issue-batch-import .ant-modal-title {
    font-weight: bold;
  }
</style>
