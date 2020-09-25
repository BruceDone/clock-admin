import service from '@/libs/api.request'

export const getSystem = (path) => {
  return service.request({
    url: 'system/' + path,
    method: 'get'
  })
}
