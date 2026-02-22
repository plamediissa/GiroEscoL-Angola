export interface Association {
  id: number;
  internal_number: string;
  name: string;
  school: string;
  province: string;
  municipality: string;
  neighborhood: string;
  created_at?: string;
}

export interface Member {
  id: number;
  association_id: number;
  name: string;
  grade: string;
  course?: string;
}

export interface Department {
  id: number;
  association_id: number;
  name: string;
  coordinator_id?: number;
  deputy_id?: number;
  secretary_id?: number;
  other_members?: string;
}

export interface Leadership {
  id: number;
  association_id: number;
  role: string;
  name: string;
  grade: string;
  course?: string;
  photo?: string;
}

export interface Event {
  id: number;
  association_id: number;
  description: string;
  photo?: string;
  date: string;
  time: string;
  location: string;
}

export interface GalleryItem {
  id: number;
  association_id: number;
  description: string;
  photo: string;
  created_at: string;
}

export interface Documents {
  id: number;
  association_id: number;
  statute?: string;
  terms?: string;
  contract?: string;
  school_logo?: string;
  association_logo?: string;
}

export interface Complaint {
  id: number;
  association_id: number;
  student_name: string;
  student_grade: string;
  description: string;
  satisfied: number;
  created_at: string;
}
