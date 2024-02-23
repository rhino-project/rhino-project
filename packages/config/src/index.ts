export * from './config';

// @ts-expect-error - We expect the file to exist in the project
export { default as CustomPrimaryNavigation } from 'components/app/CustomPrimaryNavigation';
// @ts-expect-error - We expect the file to exist in the project
export { default as CustomSecondaryNavigation } from 'components/app/CustomSecondaryNavigation';
