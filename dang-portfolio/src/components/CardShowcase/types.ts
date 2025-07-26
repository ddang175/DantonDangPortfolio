export interface CardData {
  id: string;
  title: string;
  company?: string;
  description: string;
  shortDescription: string;
  imageUrl?: string;
  previewImageUrl?: string;
  modalImageUrl?: string;
  technologies?: string[];
  date?: string;
  link?: string;
} 