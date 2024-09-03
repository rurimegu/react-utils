import { ValueError } from '@rurino/core';

export class Registry<T> {
  private readonly map = new Map<string, T>();

  public constructor(public readonly name: string) {}

  public register(key: string, value: T): void {
    if (this.map.has(key)) {
      throw new ValueError(
        `Key "${key}" already exists in registry ${this.name}.`,
      );
    }
    this.map.set(key, value);
  }

  public get(key: string): T | undefined {
    if (!this.map.has(key)) {
      throw new ValueError(
        `Key "${key}" does not exist in registry ${this.name}.`,
      );
    }
    return this.map.get(key);
  }

  public has(key: string): boolean {
    return this.map.has(key);
  }

  public keys(): IterableIterator<string> {
    return this.map.keys();
  }

  public values(): IterableIterator<T> {
    return this.map.values();
  }

  public entries(): IterableIterator<[string, T]> {
    return this.map.entries();
  }

  public clear(): void {
    this.map.clear();
  }
}
