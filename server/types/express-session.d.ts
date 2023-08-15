// Augment express-session with a custom SessionData object
declare module "express-session" {
  interface SessionData {
    authenticated: boolean;
  }
}
export {};
