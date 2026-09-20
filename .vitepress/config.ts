import { defineConfig } from 'vitepress'

export default defineConfig({
  lang: 'zh-CN',
  title: '何丰的知识库',
  description: '个人技术知识库',
  metaChunk: true,
  markdown: {
    theme: { light: 'one-light', dark: 'dracula-soft' },
    container: {
      tipLabel: '提示',
      warningLabel: '警告',
      dangerLabel: '危险',
      infoLabel: '信息',
      detailsLabel: '详细信息'
    },
    config: (md) => {


    }
  },
  sitemap: {
    hostname: 'https://hefung.github.io',
    transformItems(items) {
      return items.filter((item) => !item.url.includes('bing'))
    }
  },
  head: [
    ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.ico' }],
    ['link', { rel: 'icon', type: 'image/png', href: '/logo.png' }],
    ['meta', { name: 'theme-color', content: '#5f67ee' }],
    ['meta', { name: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://hefung.github.io/' }],
    ['meta', { name: 'og:locale', content: 'zh-CN' }],
    ['meta', { name: 'og:site_name', content: '何丰' }],
    ['meta', { name: 'og:image', content: '/logo.svg' }],
    ['meta', { name: 'og:description', content: '何丰 - 收集精选文档博客' }],
  ],

  base: '/',
  srcDir: 'docs',
  lastUpdated: true,
  cleanUrls: true,
  locales: {
    root: {
      label: '简体中文',
      lang: 'Zh_CN',
      dir: 'ltr',
      title: '何丰的知识库',
      description: '记录和分享个人技术知识',
      themeConfig: {
        docFooter: { prev: '上一页', next: '下一页' },
        returnToTopLabel: '返回顶部',
        sidebarMenuLabel: '目录',
        lightModeSwitchTitle: '切换到浅色模式',
        darkModeSwitchTitle: '切换到深色模式',
        darkModeSwitchLabel: '主题模式',
        footer: {
          message: '收集精选文档博客 | MIT Licensed',
          copyright: 'Copyright © 2019 - Present Mr.HeFung'
        }
        }
    },
    en: {
      label: 'English',
      lang: 'en',
      dir: 'ltr',
      title: "HeFung's Knowledge Base",
      description: 'Personal technical knowledge base',

      // 英文页面的访问路径是 /en/xxx
      link: '/en/',

      themeConfig: {
        // 英文导航栏
        nav: [ /* 英文导航栏 */ ],

        // 英文侧边栏（如果有）
        sidebar: { /* 英文侧边栏 */ },

        // 英文界面文案
        docFooter: { prev: 'Previous', next: 'Next' },
        returnToTopLabel: 'Back to top',
        sidebarMenuLabel: 'Menu',
        lightModeSwitchTitle: 'Switch to light mode',
        darkModeSwitchTitle: 'Switch to dark mode',
        darkModeSwitchLabel: 'Theme',

        footer: {
          message: 'Collecting curated docs & blogs | MIT Licensed',
          copyright: 'Copyright © 2019 - Present Mr.HeFung'
        }
      }
    }
  },

  themeConfig: {
    logo: { src: '/logo.svg', width: 24, height: 24 },  
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Hefung/hefung.github.io' }
    ],    
  }
})
