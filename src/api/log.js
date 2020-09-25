import service from '@/libs/api.request'

export const getLogs = (data) => {
  return service.request({
    url: 'log',
    method: 'get',
    params: data
  })
}

export const deleteLogs = (data) => {
  return service.request({
    url: 'log',
    method: 'delete',
    params: data
  })
}
