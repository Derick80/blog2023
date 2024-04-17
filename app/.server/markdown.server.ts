import pkg from '@markdoc/markdoc';
const { parse, transform, } = pkg;
import { RenderableTreeNodes } from '@markdoc/markdoc/dist/'

 function markdown(markdown: string): RenderableTreeNodes {
  return transform(parse(markdown));
}

export  { markdown };