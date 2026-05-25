/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, MessageSquare, Plane, Sunrise } from 'lucide-react';

export const SERVICES = [
  "Hospitals & Medical Centers",
  "Air Ambulance & Medical Transport",
  "Ground Ambulance Services",
  "Homecare & Long-Term Care",
  "Diagnostic & Laboratory Services",
  "Pharmaceutical & Medical Supplies",
  "Medical Equipment & Devices",
  "Medical Tourism & Facilitation",
  "Doctors & Specialists",
  "Telemedicine & Digital Health",
  "Health Insurance & TPA",
  "Rehabilitation & Wellness",
  "Emergency & Critical Care",
  "Senior Care & Assisted Living",
  "Dental & Oral Health",
  "Women & Child Health",
  "Cosmetic & Aesthetic Healthcare",
  "Fitness & Preventive Healthcare",
  "Mortal Remains & Funeral Services",
  "Healthcare Education & Training",
  "Healthcare IT & Technology",
  "Clinical Research & CRO",
  "Healthcare HR & Staffing",
  "Corporate & Industrial Healthcare",
  "Government & NGO Healthcare",
  "Travel & Aviation Medical Services",
  "Sports Medicine",
  "Alternative & Complementary Medicine",
  "AI & Future Healthcare"
];

export const HEALTHCARE_CATEGORIES = [
  {
    id: 1,
    title: "Hospitals & Medical Centers",
    subcategories: ["Multi-Speciality Hospitals", "Super Speciality Hospitals", "General Hospitals", "Teaching Hospitals", "University Hospitals", "Private Hospitals", "Government Hospitals", "International Hospitals", "Daycare Hospitals", "Specialty Clinics", "Trauma Centers", "Emergency Hospitals"],
    specialized: ["Cardiology Hospitals", "Oncology Hospitals", "Neurology Hospitals", "Orthopedic Hospitals", "IVF & Fertility Centers", "Pediatric Hospitals", "Cosmetic Surgery Hospitals", "Bariatric Centers", "Organ Transplant Centers", "Rehabilitation Hospitals", "Psychiatric Hospitals", "Spine Centers"]
  },
  {
    id: 2,
    title: "Air Ambulance & Medical Transport",
    subcategories: ["Fixed Wing Air Ambulance", "Helicopter Ambulance", "Commercial Medical Escort", "Stretcher Airline Transfer", "ICU Air Ambulance", "Neonatal Air Ambulance", "ECMO Transfer Services", "Organ Transport Services"]
  },
  {
    id: 3,
    title: "Ground Ambulance Services",
    subcategories: ["Basic Life Support (BLS)", "Advanced Life Support (ALS)", "ICU Ambulance", "Neonatal Ambulance", "Cardiac Ambulance", "Emergency Ambulance", "Event Medical Ambulance", "Mortuary Ambulance"]
  },
  {
    id: 4,
    title: "Homecare & Long-Term Care",
    subcategories: ["Nursing Care", "Doctor Visit at Home", "Physiotherapy at Home", "Elderly Care", "Palliative Care", "ICU Setup at Home", "Ventilator Care", "Mother & Baby Care", "Nanny Services", "Caretakers", "Post-Surgical Care", "Chronic Disease Management"]
  },
  {
    id: 5,
    title: "Diagnostic & Laboratory Services",
    subcategories: ["Imaging Centers", "MRI Centers", "CT Scan Centers", "PET Scan Centers", "Pathology Labs", "Blood Testing Labs", "Genetic Testing Labs", "Preventive Health Checkup Centers", "Mobile Diagnostics", "Radiology Centers"]
  },
  {
    id: 6,
    title: "Pharmaceutical & Medical Supplies",
    subcategories: ["Pharmaceutical Companies", "Generic Medicine Suppliers", "Specialty Pharma", "Vaccine Manufacturers", "Biotechnology Companies", "Medical Distributors", "Wholesale Medicine Suppliers", "Medical Consumables", "Surgical Supplies"]
  },
  {
    id: 7,
    title: "Medical Equipment & Devices",
    subcategories: ["ICU Equipment", "Ventilator Suppliers", "Imaging Equipment", "Surgical Equipment", "Hospital Furniture", "Rehabilitation Equipment", "Homecare Medical Devices", "Diagnostic Equipment", "Wearable Health Devices", "Remote Monitoring Devices"]
  },
  {
    id: 8,
    title: "Medical Tourism & Facilitation",
    subcategories: ["Medical Tourism Agencies", "International Patient Coordinators", "Treatment Packages", "Visa Assistance", "Accommodation Support", "Interpreter Services", "Medical Concierge Services", "International Patient Management"]
  },
  {
    id: 9,
    title: "Doctors & Specialists",
    subcategories: ["General Physicians", "Cardiologists", "Neurologists", "Oncologists", "Orthopedic Surgeons", "Pediatricians", "Dermatologists", "Plastic Surgeons", "Gastroenterologists", "ENT Specialists", "Psychiatrists", "Fertility Specialists"]
  },
  {
    id: 10,
    title: "Telemedicine & Digital Health",
    subcategories: ["Online Consultation Platforms", "Telehealth Providers", "Remote Monitoring", "AI Healthcare Platforms", "Digital Clinics", "ePharmacy Platforms", "Healthcare Apps", "Virtual Hospitals"]
  },
  {
    id: 11,
    title: "Health Insurance & TPA",
    subcategories: ["Health Insurance Companies", "Travel Insurance", "International Insurance", "TPA Companies", "Assistance Companies", "Medical Claims Management", "Cashless Network Providers"]
  },
  {
    id: 12,
    title: "Rehabilitation & Wellness",
    subcategories: ["Physiotherapy Centers", "Rehabilitation Centers", "Wellness Clinics", "Mental Health Centers", "Addiction Recovery Centers", "Sports Rehabilitation", "Yoga & Holistic Centers", "Alternative Medicine"]
  },
  {
    id: 13,
    title: "Emergency & Critical Care",
    subcategories: ["Emergency Response Services", "Disaster Medical Services", "ICU Care Providers", "Trauma Response Teams", "Emergency Coordination Centers", "Rescue Services"]
  },
  {
    id: 14,
    title: "Senior Care & Assisted Living",
    subcategories: ["Assisted Living", "Retirement Homes", "Dementia Care", "Elderly Rehabilitation", "Hospice Care", "Long-Term Care Facilities"]
  },
  {
    id: 15,
    title: "Dental & Oral Health",
    subcategories: ["Dental Clinics", "Cosmetic Dentistry", "Dental Implants", "Orthodontics", "Pediatric Dentistry", "Oral Surgery Centers"]
  },
  {
    id: 16,
    title: "Women & Child Health",
    subcategories: ["Fertility Clinics", "IVF Centers", "Gynecology Hospitals", "Maternity Hospitals", "Neonatal Care", "Pediatric Care", "Women Wellness Clinics"]
  },
  {
    id: 17,
    title: "Cosmetic & Aesthetic Healthcare",
    subcategories: ["Plastic Surgery Clinics", "Hair Transplant Centers", "Dermatology Clinics", "Aesthetic Wellness", "Anti-Aging Clinics", "Cosmetic Dentistry"]
  },
  {
    id: 18,
    title: "Fitness & Preventive Healthcare",
    subcategories: ["Preventive Healthcare", "Fitness Centers", "Corporate Wellness", "Nutrition Clinics", "Lifestyle Management", "Health Coaching"]
  },
  {
    id: 19,
    title: "Mortal Remains & Funeral Services",
    subcategories: ["International Mortal Remains Transfer", "Cremation Services", "Burial Services", "Funeral Management", "Embalming Services", "Repatriation Services"]
  },
  {
    id: 20,
    title: "Healthcare Education & Training",
    subcategories: ["Medical Universities", "Nursing Colleges", "Healthcare Training Institutes", "EMS Training", "Simulation Centers", "Medical Workshops"]
  },
  {
    id: 21,
    title: "Healthcare IT & Technology",
    subcategories: ["Hospital Information Systems", "EMR/EHR Providers", "Healthcare CRM", "AI Healthcare Solutions", "Healthcare Cybersecurity", "Health Data Analytics", "Telehealth Software", "Medical Billing Software"]
  },
  {
    id: 22,
    title: "Clinical Research & CRO",
    subcategories: ["Clinical Research Organizations", "Medical Trials", "Research Labs", "Biotechnology Research", "Pharmaceutical Research"]
  },
  {
    id: 23,
    title: "Healthcare HR & Staffing",
    subcategories: ["Medical Staffing Agencies", "Nurse Recruitment", "Doctor Recruitment", "International Healthcare Staffing", "Temporary Medical Staffing"]
  },
  {
    id: 24,
    title: "Corporate & Industrial Healthcare",
    subcategories: ["Occupational Health", "Corporate Medical Rooms", "Industrial Ambulance", "Employee Wellness Programs", "Offshore Medical Services"]
  },
  {
    id: 25,
    title: "Government & NGO Healthcare",
    subcategories: ["Public Health Programs", "NGO Healthcare Services", "International Aid Organizations", "Community Health Services"]
  },
  {
    id: 26,
    title: "Travel & Aviation Medical Services",
    subcategories: ["Airport Medical Services", "Travel Clinics", "Aviation Medicine", "Maritime Medical Services", "Offshore Medical Support"]
  },
  {
    id: 27,
    title: "Sports Medicine",
    subcategories: ["Sports Injury Clinics", "Athletic Rehabilitation", "Performance Medicine", "Orthopedic Sports Centers"]
  },
  {
    id: 28,
    title: "Alternative & Complementary Medicine",
    subcategories: ["Ayurveda", "Homeopathy", "Acupuncture", "Naturopathy", "Chiropractic Care", "Holistic Healing"]
  },
  {
    id: 29,
    title: "AI & Future Healthcare",
    subcategories: ["AI Diagnostics", "Robotics in Healthcare", "Smart Hospitals", "Healthcare Automation", "Predictive Healthcare", "Genomics & Precision Medicine"]
  }
];

export const REGIONS = [
  "Global",
  "Southeast Asia",
  "Middle East",
  "Europe",
  "North America",
  "India",
  "Africa"
];

export const TIMELINE_STEPS = [
  {
    title: "Find Your Specialist",
    description: "Search our trusted network of world-class doctors and hospitals to find the perfect match for your needs.",
    icon: Search,
    image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Peace of Mind",
    description: "We help you communicate with specialized medical teams to plan your treatment and get all your questions answered.",
    icon: MessageSquare,
    image: "https://images.unsplash.com/photo-1576091160550-2173bdd99625?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "We Handle the Details",
    description: "From travel arrangements to hospital admission, our team manages every step so you can focus on getting better.",
    icon: Plane,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d590e?auto=format&fit=crop&q=80&w=800"
  },
  {
    title: "Recover with Support",
    description: "Our care doesn't stop after treatment. We're here to support you throughout your recovery and long-term health journey.",
    icon: Sunrise,
    image: "https://images.unsplash.com/photo-1544124499-58912cbddada?auto=format&fit=crop&q=80&w=800"
  }
];
