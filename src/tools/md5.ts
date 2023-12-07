import {createHash} from 'crypto'

/**
 * @param {string} algorithm
 * @param {any} content
 *  @return {string}
 */
export const encrypt = (algorithm:string, content:string) => {
    let hash = createHash(algorithm)
    hash.update(content)
    return hash.digest('hex')
}

/**
 * @param {any} content
 *  @return {string}
 */
export const sha1 = (content:string) => encrypt('sha1', content)

/**
 * @param {any} content
 *  @return {string}
 */
export const md5 = (content:string) => encrypt('md5', content)

export default encrypt
