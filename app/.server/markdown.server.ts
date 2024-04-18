import pkg from '@markdoc/markdoc'
const { parse, transform } = pkg
import { RenderableTreeNodes } from '@markdoc/markdoc/dist/'
import fs from 'fs'
import nodepath from 'path'


function markdown(markdown: string): RenderableTreeNodes {
    return transform(parse(markdown))
}

export { markdown }




async function isDirectory (d: string) {
    try {
        return (await fs.lstat(d)).isDirectory()
    } catch {
        return false
    }
}
async function isFile (d: string) {
    try {
        return (await fs.lstat(d)).isFile()
    } catch {
        return false
    }
}

function isString (value: any): value is string {
    return typeof value === 'string'
}
export const getFile = async (slug: string) => {
    const relativePath = 'app/content/blog/'
    const contentPath = nodepath.resolve(process.cwd(),relativePath, slug + '.mdx')
    console.log(contentPath, 'contentPath');

    const content = fs.readFileSync(contentPath, { encoding: 'utf-8' })
    console.log(content, 'content');
    const isAFile = await isFile(contentPath)
    console.log(isAFile, 'isFile');
    const test1 = isString(content)
    console.log(test1, 'test1');
    // return the frontmatter and the content
    const frontmatter = content.split('---')[1]
    console.log(frontmatter, 'frontmatter');
    const content1 = content.split('---')[2]
    console.log(content1, 'content1');

    return { frontmatter, content: content1}
}