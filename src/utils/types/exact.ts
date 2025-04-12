export type Exact<T, U extends T> = U & { [K in Exclude<keyof U, keyof T>]: never }
