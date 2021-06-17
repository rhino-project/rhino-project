export function storeStateWithValidSession() {
  return {
    api: {
      session: {
        validate: {
          failed: false,
          response: { success: true }
        }
      }
    }
  };
}

export function storeStateWithInvalidSession() {
  return {
    api: {
      session: {
        validate: {
          failed: true,
          response: { success: false }
        }
      }
    }
  };
}
