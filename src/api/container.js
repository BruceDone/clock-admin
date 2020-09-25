import service from '@/libs/api.request'

export const getContainers = (data) => {
  return service.request({
    url: 'container',
    method: 'get',
    params: data
  })
}

export const putContainer = (data) => {
  return service.request({
    url: 'container',
    method: 'put',
    data: data
  })
}

export const deleteContainer = (data) => {
  let url = 'container/' + data
  return service.request({
    url: url,
    method: 'delete'
  })
}

export const runContainer = (data) => {
  return service.request({
    url: 'container/run',
    method: 'get',
    params: { cid: data.cid }
  })
}
