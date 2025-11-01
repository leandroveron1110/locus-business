export interface IGlobalImage {
  id: string;
  name: string;
  altText: string | null;
  description: string | null;
  tags: string[];
  url: string;
}
