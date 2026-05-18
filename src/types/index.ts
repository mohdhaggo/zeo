export interface Product {
  name: string;
  shortDesc: string;
  specs: string;
  warranty: string;
  imgUrl: string;
  longDesc: string;
  category: 'ppf' | 'tint' | 'windshield';
  color: string;
  detailUrl: string;
}

export interface Category {
  id: 'ppf' | 'tint' | 'windshield';
  title: string;
  color: string;
  imageUrl: string;
  description: string;
  isComingSoon?: boolean;
  navUrl: string;
}

export interface NavLink {
  name: string;
  path: string;
}