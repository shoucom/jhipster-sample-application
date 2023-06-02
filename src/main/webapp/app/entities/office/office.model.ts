export interface IOffice {
  id: number;
  name?: string | null;
  address?: string | null;
  timeZone?: string | null;
  wifiPassword?: string | null;
}

export type NewOffice = Omit<IOffice, 'id'> & { id: null };
