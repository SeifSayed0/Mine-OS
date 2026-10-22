import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => indexedDB.deleteDatabase('personal-life-os'))
  await page.reload()
})

test('Arabic home and local inbox capture work', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /صباح هادئ|أهلًا بيك/ })).toBeVisible()
  await page.getByPlaceholder('اكتبها هنا…').fill('فكرة لا أريد أن أفقدها')
  await page.getByRole('button', { name: 'حفظ في الوارد' }).click()
  await expect(page.getByText('اتحفظت في الوارد')).toBeVisible()
  await page.getByRole('button', { name: 'الوارد' }).first().click()
  await expect(page.getByText('فكرة لا أريد أن أفقدها')).toBeVisible()
})

test('task creation and editing persist in IndexedDB', async ({ page }) => {
  await page.getByRole('button', { name: 'اليوم' }).first().click()
  await page.getByPlaceholder('مهمة جديدة…').fill('مهمة اختبار محلية')
  await page.getByRole('button', { name: 'إضافة' }).click()
  await expect(page.getByText('مهمة اختبار محلية')).toBeVisible()
  await page.getByRole('button', { name: 'مهمة اختبار محلية' }).click()
  await expect(page.getByRole('dialog', { name: 'تفاصيل المهمة' })).toBeVisible()
  await page.getByLabel('الوصف').fill('وصف محفوظ من اختبار المتصفح')
  await page.getByRole('button', { name: 'حفظ التعديلات' }).click()
  await expect(page.getByText('اتحفظت التعديلات')).toBeVisible()
  await page.reload()
  await expect(page.getByText('مهمة اختبار محلية')).toBeVisible()
})

test('projects and library are real local flows', async ({ page }) => {
  await page.getByRole('button', { name: 'المشاريع' }).first().click()
  await page.getByPlaceholder('اسم المشروع').fill('مشروع اختبار')
  await page.getByRole('button', { name: 'مشروع جديد' }).click()
  await expect(page.getByText('مشروع اختبار')).toBeVisible()
  await page.getByRole('button', { name: 'المكتبة' }).first().click()
  await page.getByPlaceholder('عنوان صغير').fill('ملاحظة اختبار')
  await page.getByPlaceholder('اكتب ما تريد الاحتفاظ به…').fill('نص محفوظ في المكتبة المحلية')
  await page.getByRole('button', { name: 'حفظ الملاحظة' }).click()
  await expect(page.getByText('ملاحظة اختبار')).toBeVisible()
})

test('theme preference changes and survives reload', async ({ page }) => {
  await page.getByRole('button', { name: 'الإعدادات' }).first().click()
  await page.getByRole('button', { name: 'داكن' }).click()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
})

test('people commitments and Gemini missing-key handling are explicit', async ({ page }) => {
  await page.getByRole('button', { name: 'الأشخاص' }).click()
  await page.getByPlaceholder('اسم الشخص').fill('سارة')
  await page.getByPlaceholder('طريقة التواصل (اختياري)').fill('رسالة')
  await page.getByRole('button', { name: 'إضافة شخص' }).click()
  await expect(page.getByRole('heading', { name: 'سارة' })).toBeVisible()
  await page.getByPlaceholder('التزام أو متابعة جديدة…').fill('أرسل المتابعة يوم الخميس')
  await page.getByRole('button', { name: 'حفظ المتابعة' }).click()
  await expect(page.getByText('أرسل المتابعة يوم الخميس')).toBeVisible()
  await page.getByRole('button', { name: 'المساعد' }).click()
  await page.getByLabel('سؤال المساعد').fill('ساعدني في البدء')
  await page.getByRole('button', { name: 'اسأل Gemini' }).click()
  await expect(page.getByRole('alert')).toContainText('أضف مفتاح Gemini')
})
