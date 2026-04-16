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
  colors?: string;              
  taille?: string[];    
  size?: string[];           
  marque?: string;    
  categorieId?: string;             
}
export interface Commande {
  clientName: string;
  clientPrenom: string;
  clientEmail: string;
  shippingAddresse: string;
  clientNumero: string;
  quartier: string;
  fraisLivraison: number;
  total: number;
  produits: {
    nom_produit: string;
    quantite: number;
    prix: number;
  }[];
  paymentStatus: string;
  dateCommande: string;
}