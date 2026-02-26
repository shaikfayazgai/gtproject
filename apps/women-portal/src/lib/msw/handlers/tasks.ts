import { http, HttpResponse } from 'msw'
import { createMockTaskList, createMockTask } from '../factories/task'

const mockTasks = createMockTaskList()

export const taskHandlers = [
  http.get('/api/tasks', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const filtered =
      status && status !== 'all'
        ? mockTasks.filter((t) => t.status === status)
        : mockTasks
    return HttpResponse.json({
      data: filtered,
      meta: { page: 1, pageSize: 20, total: filtered.length, totalPages: 1 },
    })
  }),

  http.get('/api/tasks/:taskId', ({ params }) => {
    const task =
      mockTasks.find((t) => t.id === params.taskId) ||
      createMockTask({ id: params.taskId as string })
    return HttpResponse.json({ data: task })
  }),
]
