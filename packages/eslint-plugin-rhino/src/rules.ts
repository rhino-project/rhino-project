import * as noHooksGetModel from './rules/no-hooks-get-model/no-hooks-get-model.rule'

export const rules = {
  [noHooksGetModel.name]: noHooksGetModel.rule,
}
