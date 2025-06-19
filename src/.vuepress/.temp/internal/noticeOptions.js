export const NOTICE_OPTIONS = JSON.parse("[{\"content\":\"优化了导航栏、侧边栏、个人档案主页\",\"path\":\"/\",\"showOnce\":true,\"title\":\"更新通知\",\"actions\":[{\"text\":\"已了解\"}],\"confirm\":true,\"noticeKey\":\"update-notice\"}]")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateNoticeOptions) {
    __VUE_HMR_RUNTIME__.updateNoticeOptions(NOTICE_OPTIONS)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ NOTICE_OPTIONS }) => {
    __VUE_HMR_RUNTIME__.updateNoticeOptions(NOTICE_OPTIONS)
  })
}
