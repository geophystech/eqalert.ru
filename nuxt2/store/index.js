import axiosAuthorizationHeaders from '@/plugins/axios'
import userActivity from '@/plugins/user_activity'

export const plugins = [
  axiosAuthorizationHeaders,
  userActivity,
]
