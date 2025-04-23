/**
 * 将时间格式化为字符串（支持多种时间格式）
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string | null}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0 || !time) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string')) {
      if ((/^[0-9]+$/.test(time))) {
        // support "1548221490638"
        time = parseInt(time)
      } else {
        // support safari
        time = time.replace(new RegExp(/-/gm), '/')
      }
    }

    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key]
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value]
    }
    return value.toString().padStart(2, '0')
  })
  return time_str
}

/**
 * 将时间格式化为相对时间（如：几分钟前、几小时前等）或指定格式
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * 将 URL 中的参数解析为对象（如：?id=1&name=xx -> { id: '1', name: 'xx' }）
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      obj[name] = v.substring(index + 1, v.length)
    }
  })
  return obj
}

/**
 * 将 JSON 对象转换为 FormData（用于表单上传等场景）
 * @param jsonObj
 * @returns {FormData}
 */
export function jsonObj2FormData(jsonObj) {
  const formData = new FormData()
  Object.keys(jsonObj).forEach((key) => {
    formData.append(key, jsonObj[key])
  })
  return formData
}

/**
 * 生成一个随机的 RGB 颜色字符串（例如：rgb(123, 45, 67)）
 * @returns {string}
 */
export function randomColor() {
  return 'rgb(' +
    Math.round(Math.random() * 255) + ',' +
    Math.round(Math.random() * 255) + ',' +
    Math.round(Math.random() * 255) + ')'
}

/**
 * 获取一个随机的 Element Plus 标签类型（tag 样式）
 * @returns {string}
 */
export function randomTagType() {
  const tagType = ['', 'info', 'success', 'warning', 'danger']
  return tagType[Math.floor(Math.random() * tagType.length)]
}

/**
 * 阻塞主线程实现的延迟函数（慎用，不推荐用于实际开发）
 * @param {number} delay
 */
export function sleep(delay) {
  const start = new Date().getTime()
  while (new Date().getTime() < start + delay);
}

/**
 * 判断一个或多个参数是否为空（undefined、null、空字符串）
 * @param str         不定参数
 * @return {boolean}  若为空值，返回true，否则返回false
 */
export function isEmpty(...str) {
  return str.some(i => i === undefined || i === null || i === '')
}

/**
 * 获取文件路径中的文件后缀名（如：'image.jpg' -> 'jpg'）
 * @param filePath
 * @returns {string}
 */
export function getFileType(filePath) {
  const startIndex = filePath.lastIndexOf('.')
  if (startIndex !== -1) {
    return filePath.substring(startIndex + 1, filePath.length).toLowerCase()
  }
  return ''
}

/**
 * 对 OSS 文件路径中的文件名部分进行编码（防止中文/特殊字符出错）
 * @param ossUri
 * @returns {string}
 */
export function encodeOssFileUri(ossUri = '') {
  const i = ossUri.lastIndexOf('/')
  const prefix = ossUri.substring(0, i + 1)
  const suffix = ossUri.substring(i + 1)
  return prefix + encodeURIComponent(suffix)
}
