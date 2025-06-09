export interface Deck {
  id: string; // uuid
  owner_id: string; // uuid
  labels: string[];
  title: string;
  description: string;
}
