import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/AppShell.tsx'
import { LibraryPage } from '../features/videos/LibraryPage.tsx'
import { NotFoundPage } from '../features/videos/NotFoundPage.tsx'

export const router = createBrowserRouter([
  {
    element: <AppShell />,
    children: [
      {
        index: true,
        element: <LibraryPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
])
