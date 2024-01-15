import { describe, expect, it } from 'vitest'
import { configs } from '../configs'

describe('configs', () => {
  it('should match snapshot', () => {
    expect(configs).toMatchInlineSnapshot(`
      {
        "recommended": {
          "plugins": [
            "@rhino-project/eslint-plugin-rhino-project",
          ],
          "rules": {
            "@rhino-project/rhino-project/no-hooks-get-model": "warn",
          },
        },
      }
    `)
  })
})
