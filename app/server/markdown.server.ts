import { LRUCache } from 'lru-cache'
import {marked} from 'marked'
const options =
    {
  ttl: 1000 * 60,
  maxSize: 1024,
  sizeCalculation: (value:number) =>
    Buffer.byteLength(JSON.stringify(value)),
}

const cache = new LRUCache(options)
function cachify<TArgs, TReturn>(
  fn: (args: TArgs) => TReturn,
) {
  return function (args: TArgs): TReturn {
    if (cache.has(args)) {
      return cache.get(args) as TReturn
    }
    const result = fn(args)
    cache.set(args, result)
    return result
  }
}
export const processMarkdownToHtml = cachify(

  (markdown: string) => marked(markdown),
)
