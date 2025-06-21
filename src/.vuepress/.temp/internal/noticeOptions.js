export const NOTICE_OPTIONS = JSON.parse("[{\"content\":\"发布了计算方法笔记，在随笔中。\",\"path\":\"/\",\"showOnce\":true,\"title\":\"更新通知\",\"actions\":[{\"text\":\"已了解\"}],\"confirm\":true,\"noticeKey\":\"计算方法笔记更新\"}]")

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
