import service from '@/libs/api.request'

export const putNodes = (data) => {
  return service.request({
    url: 'node',
    method: 'put',
    data: data
  })
}
