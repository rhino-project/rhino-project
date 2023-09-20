export const getRootPath = () => '/';

export const getAuthenticatedAppPath = () => '/main';
export const getNonAuthenticatedAppPath = () => '/auth';

export const getSessionCreatePath = () => 'signin';

export const getUserCreatePath = () => 'signup';

export const getForgotPasswordPath = () => 'forgot-password';

export const getSettingsPath = () => 'settings';

export const getAccountSettingsPath = () => 'account/settings';

export const getModelIndexPath = (model) => `${model.pluralName}`;

export const getModelShowPath = (model, id) => `${model.pluralName}/${id}`;

export const getModelCreatePath = (model) => `${model.pluralName}/new`;

export const getModelEditPath = (model, id) => `${model.pluralName}/${id}/edit`;
