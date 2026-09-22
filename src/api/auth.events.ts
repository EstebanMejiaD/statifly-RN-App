type UnauthorizedHandler = () => void;

let unauthorizedHandler: UnauthorizedHandler | null = null;

export const authEvents = {
  setUnauthorizedHandler(handler: UnauthorizedHandler) {
    unauthorizedHandler = handler;
  },

  emitUnauthorized() {
    unauthorizedHandler?.();
  },
};