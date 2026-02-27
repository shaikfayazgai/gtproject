import { http, HttpResponse, delay } from 'msw'
import {
  createMockProject,
  createMockProjectsList,
  createMockCompletedProjects,
  createMockProjectMilestones,
  createMockTeamMembers,
  createMockAPGActivity,
} from '../factories/project'

export const projectHandlers = [
  http.get('/api/enterprise/projects/completed', async () => {
    await delay(300)
    return HttpResponse.json(createMockCompletedProjects())
  }),

  http.get('/api/enterprise/projects', async () => {
    await delay(400)
    return HttpResponse.json(createMockProjectsList())
  }),

  http.get('/api/enterprise/projects/:id', async ({ params }) => {
    await delay(300)
    const id = params.id as string
    return HttpResponse.json(createMockProject(id))
  }),

  http.get('/api/enterprise/projects/:id/timeline', async ({ params }) => {
    await delay(300)
    const id = params.id as string
    return HttpResponse.json(createMockProjectMilestones(id))
  }),

  http.get('/api/enterprise/projects/:id/apg-activity', async ({ params }) => {
    await delay(300)
    const id = params.id as string
    return HttpResponse.json(createMockAPGActivity(id))
  }),

  http.get('/api/enterprise/projects/:id/team', async () => {
    await delay(300)
    return HttpResponse.json(createMockTeamMembers())
  }),

  http.patch('/api/enterprise/projects/:id/hold', async () => {
    await delay(200)
    return HttpResponse.json({ status: 'paused' })
  }),
]
