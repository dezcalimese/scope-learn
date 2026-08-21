import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type PropsWithChildren } from 'react'
import { LearnerProfileProvider } from '../features/profile/LearnerProfileProvider.tsx'

export function AppProviders({ children }: PropsWithChildren) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            staleTime: 30_000,
            refetchOnWindowFocus: false,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <LearnerProfileProvider>{children}</LearnerProfileProvider>
    </QueryClientProvider>
  )
}
