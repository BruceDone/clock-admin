import service from '@/libs/api.request'

export const getMessages = () => {
  return service.request({
    url: 'message',
    method: 'get'
  })
}
