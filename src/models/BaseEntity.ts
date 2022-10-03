export class BaseEntity {
  static build<T>(this: new () => T, params: Partial<T>): T {
    return Object.assign(new this(), params);
  }
}
