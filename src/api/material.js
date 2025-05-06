import request from '@/utils/request'

const api_prefix = '/api/admin/material'

// 列出章节讲义
export function listMeterial(chapterId) {
    return request({
      url: `${api_prefix}/list/${chapterId}`,
      method: 'get'
    })
  }