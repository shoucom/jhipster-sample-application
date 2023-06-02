export interface IVisitor {
  id: number;
  name?: string | null;
  email?: string | null;
  phone?: number | null;
}

export type NewVisitor = Omit<IVisitor, 'id'> & { id: null };
