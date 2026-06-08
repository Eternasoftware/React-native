import "firebase/auth";

export {};

declare module "firebase/auth" {
  type FirebaseAuthPersistence = NonNullable<
    NonNullable<Parameters<typeof import("firebase/auth").initializeAuth>[1]>["persistence"]
  >;

  export function getReactNativePersistence(storage: {
    getItem(key: string): Promise<string | null>;
    setItem(key: string, value: string): Promise<void>;
    removeItem(key: string): Promise<void>;
  }): FirebaseAuthPersistence;
}
