import { ref, onMounted } from "vue"
import $ from "jquery"
import rawLinks from "./links.config.js"

export function useLinkNavigator() {
    // 网址数据
    const allLinks = ref(rawLinks)

    // 自动生成唯一分类列表
    const categories = ['全部', ...new Set(allLinks.value.map(link => link.category))]
    const activeCategory = ref('全部')
    const searchText = ref("")
    let filteredLinks = []

    /**
   * 渲染链接卡片到DOM
   * @param {Array} links - 需要渲染的链接数据数组
   */
    function renderLinks(links) {
        const container = $(".links-container")
        container.empty()
        if (links.length === 0) {
          container.append(`<p class="no-result">没有匹配的结果</p>`)
          return
        }
        links.forEach(({ name, url, icon, description }) => {
          const card = $(`
            <div class="link-card" tabindex="0" role="link" aria-label="${name}">
              <a href="${url}" target="_blank" rel="noopener noreferrer" class="card-content">
                <img src="${icon}" alt="${name} 图标" class="link-icon"/>
                <div class="link-info">
                  <span class="link-name">${name}</span>
                  <span class="link-desc">${description}</span>
                </div>
              </a>
            </div>
          `)
          container.append(card)
        })
    }

    /**
   * 组合过滤条件：
   * 1. 匹配当前激活分类
   * 2. 名称包含搜索关键词（不区分大小写）
   */
    function filterLinks() {
        const keyword = searchText.value.trim().toLowerCase()
        filteredLinks = allLinks.value.filter(link => {
          const categoryMatch = activeCategory.value === '全部' 
            || link.category === activeCategory.value
          return categoryMatch && link.name.toLowerCase().includes(keyword)
        })
        renderLinks(filteredLinks)
    }

    /**
   * 切换分类时：
   * 1. 更新激活分类
   * 2. 清空搜索框
   * 3. 触发重新过滤
   */
    function switchCategory(category) {
        activeCategory.value = category
        searchText.value = "" // 切换分类清空搜索
        filterLinks()
    }

    // 组件挂载时初始化渲染
    onMounted(() => {
        filterLinks()
    })

    return {
        categories,
        activeCategory,
        searchText,
        switchCategory,
        filterLinks,
    }
}
