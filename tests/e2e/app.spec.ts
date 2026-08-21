import { expect, test, type Page } from '@playwright/test'

const video = {
  video_id: 'video-1',
  user_id: 'dez_calimese',
  title: 'How Flowers Bloom',
  description:
    'A short visual lesson that shows a flower moving through its bloom cycle.',
  video_url:
    'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
  created_at: '2026-08-21T20:04:02.008093+00:00',
}

async function installApiMocks(page: Page) {
  let commentPosted = false

  await page.route(/^http:\/\/127\.0\.0\.1:4173\/api\//, async (route) => {
    const request = route.request()
    const url = new URL(request.url())

    if (url.pathname === '/api/videos/single') {
      await route.fulfill({ json: video })
      return
    }

    if (
      url.pathname === '/api/videos/comments' &&
      request.method() === 'POST'
    ) {
      commentPosted = true
      await route.fulfill({ json: { success: 'POST /videos/comments' } })
      return
    }

    if (url.pathname === '/api/videos/comments') {
      await route.fulfill({
        json: {
          comments: commentPosted
            ? [
                {
                  id: 'comment-1',
                  video_id: 'video-1',
                  user_id: 'alex_student',
                  content: 'This made the idea clear.',
                },
              ]
            : [],
        },
      })
      return
    }

    if (url.pathname === '/api/videos' && request.method() === 'POST') {
      await route.fulfill({ json: { success: 'POST /videos' } })
      return
    }

    if (url.pathname === '/api/videos') {
      await route.fulfill({ json: { videos: [video] } })
      return
    }

    await route.abort()
  })
}

test.beforeEach(async ({ page }) => {
  await installApiMocks(page)
})

test('opens a lesson from the library and exposes player controls', async ({
  page,
}) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'Watch How Flowers Bloom' }).click()

  await expect(
    page.getByRole('heading', { name: 'How Flowers Bloom' }),
  ).toBeVisible()
  await expect(page.getByRole('button', { name: 'Play video' })).toBeVisible()
  await page.getByLabel('Playback speed').selectOption('1.5')
  await expect(page.getByLabel('Playback speed')).toHaveValue('1.5')
  await expect(page.getByText('No comments yet.')).toBeVisible()
})

test('creates a local profile and posts a comment', async ({ page }) => {
  await page.goto('/watch/video-1')
  await page.getByRole('button', { name: 'Set display name' }).click()
  await page.getByLabel('Display name').fill('Alex Student')
  await page.getByRole('button', { name: 'Save profile' }).click()

  await page
    .getByLabel('Add to the discussion')
    .fill('This made the idea clear.')
  await page.getByRole('button', { name: 'Post comment' }).click()

  await expect(page.getByText('This made the idea clear.')).toBeVisible()
  await expect(page.getByText('Alex Student').last()).toBeVisible()
})

test('validates and creates a video URL', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Add video' }).click()
  await page.getByRole('button', { name: 'Add video' }).last().click()
  await expect(page.getByText(/title with at least 3/)).toBeVisible()

  await page.getByLabel('Title').fill('A focused lesson')
  await page
    .getByLabel('Description')
    .fill('A useful description for a focused educational video.')
  await page
    .getByLabel('Video URL')
    .fill('https://example.com/focused-lesson.mp4')
  await page.getByRole('button', { name: 'Add video' }).last().click()

  await expect(page.getByRole('status')).toHaveText(
    'Video added to your library.',
  )
})
