// Sample hospital data (5 entries)
const hospitals = [
  {
    name: "City General Hospital",
    address: "123 Main Street, New Delhi",
    location: "New Delhi, India",
    about:
      "A leading multi-specialty hospital providing comprehensive healthcare services.With state-of-the-art infrastructure and specialized departments, We offers services in cardiology, neurology, oncology, orthopedics, and diagnostics",
    bannerImage: "https://images.unsplash.com/photo-1586773860418-d37222d8fce3",
    services: ["Cardiology", "Neurology", "X-Ray", "Blood Test"],
  },
  {
    name: "Medanta Medical Center",
    address: "456 Oak Avenue, Noida",
    location: "Noida, India",
    about:
      "State-of-the-art facilities and experienced medical professionals. Our expert doctors and cutting-edge diagnostic facilities make it a trusted name for complex surgeries and personalized patient treatment",
    bannerImage:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?q=80&w=2053&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    services: ["MRI", "CT Scan", "Ultrasound", "Neurology"],
  },
  {
    name: "Fortis Health Center",
    address: "789 Pine Road, Bengaluru",
    location: "Bengaluru, India",
    about:
      "Your friendly neighborhood Hospital for general and specialized care.Known for its excellence in cardiac sciences, organ transplants, and minimally invasive surgeries, Max ensures holistic treatment with patient comfort as its top priority.",
    bannerImage:
      "https://plus.unsplash.com/premium_photo-1730500169149-f505e3d0b792?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    services: ["General Checkup", "Vaccination", "Pediatrics", "Dermatology"],
  },
  {
    name: "Eastside Emergency Care",
    address: "321 Lajpat Nagar, Chandigarh",
    location: "Chandigarh, India",
    about:
      "24/7 emergency services and urgent care for all your needs. With a legacy of trust and ethical medical practices, it delivers world-class treatment across specialties including oncology, cardiology, and critical care.",
    bannerImage: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d",
    services: ["Emergency Care", "Trauma", "X-Ray", "CT Scan"],
  },
  {
    name: "Northside Diagnostic Center",
    address: "555 Maple Boulevard, Patiala",
    location: "Patiala, India",
    about:
      "Specializing in advanced diagnostic imaging and lab tests.It offers affordable and advanced treatment across all major disciplines, serving millions of patients from across the country.",
    bannerImage:
      "https://plus.unsplash.com/premium_photo-1681843129112-f7d11a2f17e3?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    services: ["MRI", "Ultrasound", "Blood Test", "Pathology"],
  },
];

// Sample doctor data (5 entries)
const doctors = [
  {
    name: "Dr. Sahil Manchanda",
    specialty: "Cardiologist",
    profileImage:
      "https://plus.unsplash.com/premium_photo-1658506671316-0b293df7c72b?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hospitalName: "City General Hospital",
  },
  {
    name: "Dr. Sandeep Goel",
    specialty: "Neurologist",
    profileImage:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d",
    hospitalName: "Advanced Medical Center",
  },
  {
    name: "Dr. Ravi Seth",
    specialty: "General Physician",
    profileImage:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
    hospitalName: "Serenity Health Clinic",
  },
  {
    name: "Dr. Neeraj Kumar",
    specialty: "Pediatrician",
    profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2",
    hospitalName: "Serenity Health Clinic",
  },
  {
    name: "Dr. Anjali Mehta",
    specialty: "Radiologist",
    profileImage:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    hospitalName: "Northside Diagnostic Center",
  },
];

module.exports = { hospitals, doctors };
