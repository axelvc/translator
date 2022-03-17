interface Dictionary {
  pos: string
  terms: string[]
}

export interface Response {
  trans: string
  dict?: Dictionary[]
}

export async function detectLang(text: string): Promise<string> {
  const URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&dj=1&q=${encodeURIComponent(
    text,
  )}`

  const res = await fetch(URL)
  const json = await res.json()

  return json.ld_result.srclangs[0]
}

export function translate(text: string, from: string, to: string): Promise<Response> {
  const TRANSLATE_URL = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&dt=bd&dj=1&q=${encodeURIComponent(
    text,
  )}`

  return fetch(TRANSLATE_URL)
    .then(r => r.json())
    .then(r => ({
      dict: r.dict,
      trans: r.sentences[0].trans,
    }))
}
