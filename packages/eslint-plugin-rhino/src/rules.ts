import * as noHooksGetModel from './rules/no-hooks-get-model/no-hooks-get-model.rule';
import * as noEmptyActions from './rules/no-empty-actions/no-empty-actions.rule';

export const rules = {
  [noHooksGetModel.name]: noHooksGetModel.rule,
  ['no-empty-actions']: noEmptyActions.rule as any
};
