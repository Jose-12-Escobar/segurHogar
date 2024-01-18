import { HttpContext, HttpContextToken } from "@angular/common/http";

export const NO_API_KEY = new HttpContextToken<boolean>(() => false);

export function skipApiKey() {
    return new HttpContext().set(NO_API_KEY, true);
}
