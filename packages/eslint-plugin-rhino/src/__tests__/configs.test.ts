import { describe, expect, it } from 'vitest'
import { configs } from '../configs'

describe('configs', () => {
  it('should match snapshot', () => {
    expect(configs).toMatchInlineSnapshot(`
      {
        "recommended": {
          "plugins": [
            "@rhino-project/eslint-plugin-rhino",
          ],
          "rules": {
            "@rhino-project/rhino/no-hooks-get-model": "warn",
          },
        },
      }
    `)
  })
})
