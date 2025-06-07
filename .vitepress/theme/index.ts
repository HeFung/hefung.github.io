import { h } from 'vue'

import DefaultTheme from 'vitepress/theme'
import { type Theme } from 'vitepress'

import ShareButton from './components/ShareButton.vue'
import notice from './components/notice.vue'
import confetti from './components/confetti.vue' //五彩纸屑
import TeamMembers from './components/TeamMembers.vue'
import googleAnalytics from './composables/googleAnalytics'
import './styles/vars.css'

export default {
  extends: DefaultTheme,

  enhanceApp: ({ app, router, siteData }) => {
    googleAnalytics({ id: 'G-6QN23XNMXB' })
    app.component('confetti', confetti) // 五彩纸屑
    app.component('TeamMembers', TeamMembers)
    // 路由守卫


  },

  Layout() {
    return h(DefaultTheme.Layout, null, {
      'aside-outline-before': () => h(ShareButton),
      'layout-top': () => h(notice),
    })
  },

  setup() {

  }

} satisfies Theme