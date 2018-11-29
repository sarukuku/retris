interface Response {
  text(): Promise<string | undefined>
}

export async function parseJSONResponse(res: Response): Promise<any> {
  const text = await res.text()
  if (!text) {
    return undefined
  }

  let json: any
  try {
    json = JSON.parse(text)
  } catch (err) {
    return undefined
  }

  return json
}
