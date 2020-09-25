import service from '@/libs/api.request'

export const getTableData = () => {
  return service.request({
    url: 'get_table_data',
    method: 'get'
  })
}

export const getDragList = () => {
  return service.request({
    url: 'get_drag_list',
    method: 'get'
  })
}

export const errorReq = () => {
  return service.request({
    url: 'error_url',
    method: 'post'
  })
}

export const saveErrorLogger = info => {
  return service.request({
    url: 'save_error_logger',
    data: info,
    method: 'post'
  })
}

export const uploadImg = formData => {
  return service.request({
    url: 'image/upload',
    data: formData
  })
}

export const getOrgData = () => {
  return service.request({
    url: 'get_org_data',
    method: 'get'
  })
}

export const getTreeSelectData = () => {
  return service.request({
    url: 'get_tree_select_data',
    method: 'get'
  })
}
