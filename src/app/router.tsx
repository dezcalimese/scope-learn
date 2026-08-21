import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/AppShell.tsx'
import { LibraryPage } from '../features/videos/LibraryPage.tsx'
import { NotFoundPage } from '../features/videos/NotFoundPage.tsx'
import { WatchPage } from '../features/videos/WatchPage.tsx'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <LibraryPage />,
      },
      {
        path: 'watch/:videoId',
        element: <WatchPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
