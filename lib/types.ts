export interface Produit {
  id: number;
  name: string;
  description?: string;            
  price: number;                   
  image?: string;                  
  images?: string[];               
  imagesByColor?: Record<string, string[]>; 
  videos?: string[];               
  quantity?: number;               
  category?: string;               
  subCategory?: string;           
  colors?: string[];              
  taille?: string[];    
  size?: string[];           
  marque?: string;                 
}
