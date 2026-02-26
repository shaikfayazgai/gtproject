import { authHandlers } from './auth'
import { taskHandlers } from './tasks'
import { evidenceHandlers } from './evidence'
import { credentialHandlers } from './credentials'
import { teamHandlers } from './team'
import { skillHandlers } from './skills'
import { apgHandlers } from './apg'
import { alumniHandlers } from './alumni'
import { governorHandlers } from './governor'

export const handlers = [
  ...authHandlers,
  ...taskHandlers,
  ...evidenceHandlers,
  ...credentialHandlers,
  ...teamHandlers,
  ...skillHandlers,
  ...apgHandlers,
  ...alumniHandlers,
  ...governorHandlers,
]
