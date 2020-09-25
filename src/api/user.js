import service from '@/libs/api.request'

export const login = ({ userName, password }) => {
  const data = {
    'user_name': userName,
    'user_pwd': password
  }
  return service.request({
    url: 'login',
    data: data,
    method: 'post'
  })
}
