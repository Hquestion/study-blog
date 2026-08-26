import { defineConfig } from 'vitepress'
import fs from 'node:fs'
import path from 'node:path'

const docsDir = path.resolve(__dirname, '../posts')

function getTitle(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8')

  const match = content.match(/^#\s+(.+)$/m)
  if (match) return match[1].trim()

  return path.basename(filePath, '.md')
}

function generateSidebar() {
  const categories = fs
    .readdirSync(docsDir, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .filter(item => {
      return !item.name.startsWith('.') && item.name !== "public";
    }) // 排除以 . 开头的隐藏文件夹和 public 文件夹

  return categories.map(category => {
    const categoryDir = path.join(docsDir, category.name)

    const items = fs
      .readdirSync(categoryDir, { withFileTypes: true })
      .filter(item => item.isFile())
      .filter(item => item.name.endsWith('.md'))
      .filter(item => item.name !== 'index.md')
      .sort()
      .map(item => {
        const filePath = path.join(categoryDir, item.name)
        const slug = item.name.replace(/\.md$/, '')

        return {
          text: getTitle(filePath),
          link: `/${category.name}/${slug}`
        }
      })

    return {
      text: category.name,
      collapsed: false,
      items
    }
  })
}

// https://vitepress.dev/reference/site-config
export default defineConfig({
  srcDir: "posts",
  assetsDir: "static",
  base: "/study-blog/",
  
  title: "Learn and Share",
  description: "记录与分享学习过程",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: 'Home', link: '/' },
    ],

    sidebar: generateSidebar(),

    socialLinks: [
      { icon: 'github', link: 'https://github.com/hquestion' }
    ]
  }
})
