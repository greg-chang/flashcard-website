export interface Flashcard {
  id: string; // uuid
  parent_deck: string; // uuid
  starred: boolean | null;
  front: string;
  back: string;
}
