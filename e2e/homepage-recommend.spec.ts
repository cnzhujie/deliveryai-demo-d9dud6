import { test, expect } from '@playwright/test'

/** 首页推荐菜区域菜品（与 src/data/menu.ts 中带 badge 的菜品一致） */
const RECOMMEND_DISHES = [
  { name: '鎏金番茄鸳鸯锅', price: '¥68', badge: '人气 No.1' },
  { name: '牛油麻辣锅', price: '¥59', badge: '招牌' },
  { name: '琥珀嫩牛肉', price: '¥42', badge: '主厨推荐' },
  { name: '鲜虾滑', price: '¥39', badge: '新品' },
]

test.describe('首页推荐菜区域 - E2E 验收测试', () => {
  test('REQ-001: 首页展示推荐菜区域标题和副标题', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('今日推荐')).toBeVisible()
    await expect(page.getByText('人气菜品，先睹为快')).toBeVisible()
  })

  test('REQ-001: 首页展示 4 道带徽章的推荐菜卡片', async ({ page }) => {
    await page.goto('/')
    for (const dish of RECOMMEND_DISHES) {
      await expect(page.getByRole('heading', { name: dish.name })).toBeVisible()
      await expect(page.getByText(dish.badge).first()).toBeVisible()
    }
  })

  test('REQ-002: 推荐菜价格正确显示为 ¥ 格式', async ({ page }) => {
    await page.goto('/')
    for (const dish of RECOMMEND_DISHES) {
      const card = page.locator('button', { has: page.getByRole('heading', { name: dish.name }) })
      await expect(card.getByText(dish.price)).toBeVisible()
    }
  })

  test('REQ-003: 点击推荐菜卡片弹出详情弹窗', async ({ page }) => {
    await page.goto('/')
    // 点击第一道推荐菜（鎏金番茄鸳鸯锅）
    await page.getByRole('heading', { name: '鎏金番茄鸳鸯锅' }).click()
    // 弹窗出现，断言限定到 dialog 作用域以避免匹配到卡片上的重复文案
    const dialog = page.getByRole('dialog')
    // 弹窗包含徽章
    await expect(dialog.getByText('人气 No.1')).toBeVisible()
    // 弹窗包含价格
    await expect(dialog.getByText('¥68')).toBeVisible()
    // 弹窗包含描述
    await expect(dialog.getByText('慢熬番茄与醇香牛油，一锅双味')).toBeVisible()
    // 弹窗包含"选桌进入点餐"按钮
    await expect(dialog.getByRole('button', { name: '选桌进入点餐' })).toBeVisible()
  })

  test('REQ-003: 弹窗内"选桌进入点餐"按钮触发绑桌并进入 welcome', async ({ page }) => {
    await page.goto('/')
    // 点击推荐菜卡片
    await page.getByRole('heading', { name: '鲜虾滑' }).click()
    // 弹窗出现后点击"选桌进入点餐"
    await page.getByRole('button', { name: '选桌进入点餐' }).click()
    // 进入 welcome 视图
    await expect(page).toHaveURL(/#\/welcome$/)
  })

  test('REQ-003: 弹窗可通过关闭按钮关闭', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { name: '鎏金番茄鸳鸯锅' }).click()
    // 弹窗可见
    await expect(page.getByText('慢熬番茄与醇香牛油，一锅双味')).toBeVisible()
    // 点击关闭按钮（aria-label="关闭"）
    await page.getByRole('button', { name: '关闭' }).click()
    // 弹窗关闭
    await expect(page.getByText('慢熬番茄与醇香牛油，一锅双味')).not.toBeVisible()
    // 仍在首页
    await expect(page).toHaveURL(/#\/home$/)
  })

  test('REQ-003: 弹窗可通过 Esc 键关闭', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('heading', { name: '鎏金番茄鸳鸯锅' }).click()
    await expect(page.getByText('慢熬番茄与醇香牛油，一锅双味')).toBeVisible()
    await page.keyboard.press('Escape')
    await expect(page.getByText('慢熬番茄与醇香牛油，一锅双味')).not.toBeVisible()
    await expect(page).toHaveURL(/#\/home$/)
  })

  test('REQ-004: 切换英文后推荐菜区域文案正确', async ({ page }) => {
    // 通过 localStorage 设置英文
    await page.addInitScript(() => {
      localStorage.setItem('i18nextLng', 'en')
    })
    await page.goto('/')
    // 英文标题和副标题
    await expect(page.getByText("Today's Picks")).toBeVisible()
    await expect(page.getByText('Popular dishes at a glance')).toBeVisible()
    // 英文按钮文案
    const dish = page.getByRole('heading', { name: 'Golden Tomato Dual-Flavor Pot' })
    await dish.click()
    await expect(page.getByRole('button', { name: 'Select Table to Order' })).toBeVisible()
  })

  test('REQ-005: 老人模式下推荐菜区域可见且无溢出', async ({ page }) => {
    // 通过 localStorage 开启老人模式
    await page.addInitScript(() => {
      localStorage.setItem('elderly-mode', 'true')
    })
    await page.goto('/')
    // 推荐菜区域标题可见
    await expect(page.getByText('今日推荐')).toBeVisible()
    // 4 道菜品均可见
    for (const dish of RECOMMEND_DISHES) {
      await expect(page.getByRole('heading', { name: dish.name })).toBeVisible()
    }
    // 点击弹窗正常工作
    await page.getByRole('heading', { name: '牛油麻辣锅' }).click()
    await expect(page.getByText('醇厚牛油，花椒与辣椒层层释香')).toBeVisible()
    // 弹窗按钮可见
    await expect(page.getByRole('button', { name: '选桌进入点餐' })).toBeVisible()
  })

  test('REQ-001: 推荐菜不遮挡桌台绑定区域', async ({ page }) => {
    await page.goto('/')
    // 桌台绑定区域的快速进入按钮仍可见
    await expect(page.getByRole('button', { name: '快速进入 A08 桌' })).toBeVisible()
    // 推荐菜区域标题可见
    await expect(page.getByText('今日推荐')).toBeVisible()
  })
})
