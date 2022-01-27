export function isSessionValid(session) {
  return session !== undefined && Object.keys(session).length === 3;
}
