<template functional>
  <div
    :class="`${data.prefixCls}-custom-content${data.type ? ` ${data.prefixCls}-${data.type}` : ''}`"
    style="max-width: 480px; text-align: left; position: relative; white-space: nowrap; text-overflow:ellipsis; overflow:hidden;"
  >
    <!-- 图标 -->
    <component
      :is="data.AIcon"
      v-if="data.type"
      :type="data.iconType"
      :theme="data.isLoadingMode ? 'outlined' : 'filled'"
    />
    <!-- 消息内容 -->
    <span :style="{'margin-right': data.close ? '24px' : ''}">{{ data.content }}</span>
    <!-- 结尾展示 -->
    <!-- info模式下，展示读秒，loading，也可自行关闭 -->
    <template v-if="data.duration && !data.isLoadingMode">
      <component
        :is="data.AIcon"
        v-if="data.duration >= 0"
        style="margin-left: 24px;"
        type="loading"
        theme="outlined"
      />
      <span
        style="color: rgb(153, 153, 153);"
      >
        {{ data.duration }}s
      </span>
    </template>
    <!-- 只要设置durnation=null，即可展示关闭按钮 -->
    <component
      :is="data.AIcon"
      v-if="data.close"
      type="close"
      style="font-size: 12px; color: rgba(0, 0, 0, 0.45); transition: color 0.3s; cursor: pointer; position: absolute; right: -2px; top: 5px; margin: 0;"
      @click="data.closeHandler"
    />
  </div>
</template>
