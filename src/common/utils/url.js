export function buildQuery(query) {
  const keys = Object.keys(query)
  return keys
    .reduce((arr, key) => {
      arr.push(`${key}=${encodeURIComponent(query[key])}`)
      return arr
    }, []).sort()
    .join('&')
}

export function buildURL(URL, query) {
  let url = URL
  const search = buildQuery(query)
  if (!search) {
    return url
  }
  if (url.indexOf('?') === -1) {
    url += '?'
  } else {
    url += '&'
  }
  return url + search;
}