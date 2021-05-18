export interface Authentication {
  auth (email: string, passowrd: string): Promise<string>
}
