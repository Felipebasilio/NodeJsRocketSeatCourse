export function extractQueryParams(query: string): { [key: string]: string } {
  return query.substr(1).split('&').reduce((queryParams: { [key: string]: string }, param: string) => {
    const [key, value] = param.split('=')

    queryParams[key] = value

    return queryParams
  }, {})
} 