export interface Renter {
  id: string
  first_name: string
  last_name: string
  age: number
  occupation: string
  address: string
  email: string
  phone: string
  profile_picture: string
  rating: number
  member_since: string
  created_at?: string
  updated_at?: string
}

export interface Review {
  id: string
  renter_id: string
  host_id: string
  host_name: string
  host_picture: string
  rating: number
  comment: string
  created_at: string
  date?: string 
}

export interface RentalHistory {
  id: string
  renter_id: string
  car_model: string
  start_date: string
  end_date: string
  status: string
  created_at?: string
  dates?: string 
}

export interface RenterDetailsType {
  id: string
  firstName: string
  lastName: string
  age: number
  occupation: string
  address: string
  email: string
  phone: string
  profilePicture: string
  rating: number
  reviewCount: number
  memberSince: string
  completedRentals: number
  reviews: Review[]
  rentalHistory: RentalHistory[]
}

export interface NewReview {
  renter_id: string
  host_id: string
  host_name: string
  host_picture: string
  rating: number
  comment: string
}


export interface ReportData {
  reason: string
  additionalInfo: string
}

export interface Report {
  id: string
  renter_id: string
  reporter_id: string
  reason: string
  additional_info: string
  status: "pending" | "reviewed" | "resolved" | "dismissed"
  created_at: string
}
