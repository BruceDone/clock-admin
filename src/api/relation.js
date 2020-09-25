import service from '@/libs/api.request'

export const getRelations = (data) => {
  return service.request({
    url: 'relation',
    method: 'get',
    params: { cid: data }
  })
}

export const addRelation = (data) => {
  return service.request({
    url: 'relation',
    method: 'post',
    data: data
  })
}

export const deleteRelation = (data) => {
  return service.request({
    url: 'relation/' + data,
    method: 'delete'
  })
}
