export class LocalStorageRepository<T extends { id: string }> {
  private key: string;

  constructor(key: string, initialData?: T[]) {
    this.key = key;
    if (initialData && !localStorage.getItem(this.key)) {
      this.saveItems(initialData);
    }
  }

  private getItems(): T[] {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }

  private saveItems(items: T[]): void {
    localStorage.setItem(this.key, JSON.stringify(items));
  }

  public getAll(): T[] {
    return this.getItems();
  }

  public getById(id: string): T | null {
    return this.getItems().find((item) => item.id === id) || null;
  }

  public create(item: T): T {
    const items = this.getItems();
    items.push(item);
    this.saveItems(items);
    return item;
  }

  public update(id: string, updates: Partial<T>): T | null {
    const items = this.getItems();
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return null;

    const updatedItem = { ...items[index], ...updates };
    items[index] = updatedItem;
    this.saveItems(items);
    return updatedItem;
  }

  public delete(id: string): boolean {
    const items = this.getItems();
    const filtered = items.filter((item) => item.id !== id);
    if (filtered.length === items.length) return false;
    this.saveItems(filtered);
    return true;
  }
}
