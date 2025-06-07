export default {
  feedback: {
    title: "Feedback",
    inputLabel: "Your feedback",
    send: "Submit",
    sending: "Sending...",
    delete: "Delete",
    deleting: "Deleting...",
    cancel: "Cancel",
    errorLoading: "Failed to load feedback",
    loginPrompt: "You must be logged in to leave feedback.",
    allFeedback: "All Feedback",
    myFeedback: "My Feedback",
    showMyFeedback: "Show my feedback",
    hideMyFeedback: "Hide my feedback",
    deleteConfirmTitle: "Confirm Deletion",
    deleteConfirmMessage: "Are you sure you want to delete this feedback?",
    loading: "Loading...",
  },
  home: {
    welcome: "Welcome",
    guest: "guest",
    subtitle:
      "Everything about safety at sports facilities — simple, clear, and effective.",
    getStarted: "How to start",
    step1: "Familiarize yourself with safety measures.",
    step2: "Complete training modules.",
    step3: "View stats and achievements.",
    quote: "We don't just teach. We build a culture of safety in sports.",
    quoteAuthor: "Head of Occupational Safety",
    contactUs: "Contact us",
  },
  resources: {
    title: "Useful Resources",
    description:
      "This page contains helpful materials and links that can assist you in various situations.",
    sections: [
      {
        title: "Regulatory Documents",
        icon: "📄",
        items: [
          { text: "Federal Laws", url: "#" },
          { text: "Regional Regulations", url: "#" },
          { text: "Technical Regulations", url: "#" },
        ],
      },
      {
        title: "Emergency Help",
        icon: "🆘",
        items: [
          { text: "Rescue Service: 112", url: "#" },
          { text: "Psychological Help", url: "#" },
          { text: "Nearby Medical Facilities", url: "#" },
        ],
      },
      {
        title: "Safety Recommendations",
        icon: "🔒",
        items: [
          { text: "Home Safety", url: "#" },
          { text: "Cybersecurity", url: "#" },
          { text: "First Aid", url: "#" },
        ],
      },
    ],
  },
  auth: {
    login: "Login",
    register: "Register",
  },
  login: {
    title: "Login",
    email: "Email",
    password: "Password",
    requiredField: "This field is required",
    invalidCredentials: "Invalid email or password",
    genericError: "An error occurred during login",
    submit: "Log In",
    loggingIn: "Logging in...",
    imageAlt: "Login illustration",
  },
  register: {
    title: "Registration",
    username: "Username",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    requiredField: "This field is required",
    invalidEmail: "Please enter a valid email address",
    passwordRequirements:
      "Password must be at least 8 characters long and contain letters and numbers",
    passwordsMismatch: "Passwords don't match",
    submit: "Register",
    loading: "Registering...",
    genericError: "Registration failed. Please try again.",
    success: "Registration successful!",
  },
  navbar: {
    home: "Home",
    safety: "Safety Measures",
    training: "Training",
    resources: "Resources",
    feedback: "Feedback",
    logout: "Logout",
    login: "Login",
    title: "Sports Facilities",
  },
  safetyMeasuresText: {
    title: "Safety Measures",
    description:
      "Our organization places special emphasis on safety at all levels. We strive to create a safe environment for our employees, clients, and the surrounding ecosystem. Below are the key measures we implement to ensure safety, along with additional initiatives and statistics demonstrating our achievements.",
    sections: [
      {
        title: "Physical Security",
        content: {
          description:
            "Physical security includes perimeter protection, access control, installation of surveillance systems, and regular security checks. We also implement innovative technologies to enhance protection levels.",
          list: [
            "24/7 premises security using modern monitoring systems.",
            "Access control using biometric data and electronic passes.",
            "Surveillance systems with facial recognition and real-time analytics.",
            "Regular emergency drills, including terrorist threat scenario training.",
            "Installation of metal detectors and scanners at building entrances.",
            "Collaboration with local law enforcement for rapid response.",
          ],
        },
      },
      {
        title: "Fire Safety",
        content: {
          description:
            "Fire safety is ensured through modern fire suppression systems, regular inspections, and staff training. We also conduct audits and implement new technologies to prevent fires.",
          list: [
            "Automatic fire suppression systems including sprinklers and gas-based systems.",
            "Evacuation plans on every floor with clearly marked exit routes.",
            "Regular evacuation drills with all employees participating.",
            "Fire extinguishers and hydrants in accessible locations, regularly inspected.",
            "Smoke and heat detectors installed in every room.",
            "Staff training in fire equipment usage.",
          ],
        },
      },
      {
        title: "Medical Safety",
        content: {
          description:
            "Medical safety includes having medical personnel on-site, first aid kits, and staff training. We also implement health maintenance and disease prevention programs.",
          list: [
            "Qualified medical personnel available on premises 24/7.",
            "First aid kits in every department, fully stocked with essential supplies.",
            "Staff training in first aid, including CPR (Cardiopulmonary Resuscitation).",
            "Contracts with nearby medical facilities for emergency hospitalization.",
            "Regular medical check-ups for employees.",
            "Vaccination programs and infectious disease prevention.",
          ],
        },
      },
      {
        title: "Information Security",
        content: {
          description:
            "Information protection is ensured through modern encryption technologies, regular staff training, and strict security policy compliance. We also conduct regular vulnerability testing.",
          list: [
            "Data encryption during transmission and storage using AES-256 algorithms.",
            "Regular software updates to patch vulnerabilities.",
            "Cybersecurity training for staff, including phishing attack recognition.",
            "Security audits and penetration testing.",
            "Multi-factor authentication for critical system access.",
            "Daily data backups stored in secure data centers.",
          ],
        },
      },
      {
        title: "Environmental Safety",
        content: {
          description:
            "We aim to minimize environmental impact by complying with all ecological standards. Our initiatives include using renewable energy sources and reducing carbon footprint.",
          list: [
            "Emission control using modern filters and purification systems.",
            "Waste disposal according to environmental standards, including recycling and composting.",
            "Energy-efficient technologies like LED lighting and solar panels.",
            "Environmental audits to assess ecological impact.",
            "Programs to reduce plastic use and transition to biodegradable materials.",
            "Collaboration with environmental organizations to support nature conservation initiatives.",
          ],
        },
      },
      {
        title: "Psychological Safety",
        content: {
          description:
            "We care about our employees' psychological well-being by creating a comfortable work atmosphere and providing support in challenging situations.",
          list: [
            "Stress management and burnout prevention training.",
            "Access to psychologist consultations for employees.",
            "Designated relaxation and break areas in the office.",
            "Work-life balance programs.",
            "Regular employee surveys to identify issues and improve working conditions.",
          ],
        },
      },
    ],
    tableData: {
      title: "Safety Statistics for the Past Year",
      columns: ["Metric", "Value", "Comment"],
      rows: [
        [
          "Number of incidents",
          "2",
          "Both incidents were successfully resolved without consequences.",
        ],
        [
          "Drills conducted",
          "12",
          "Including fire alarms, evacuations, and cybersecurity drills.",
        ],
        [
          "Employees trained",
          "150",
          "Training covered all company departments.",
        ],
        [
          "New security systems installed",
          "5",
          "Including surveillance systems and access control.",
        ],
        [
          "Medical check-ups conducted",
          "200",
          "All employees completed annual medical examinations.",
        ],
        [
          "CO2 emissions reduction",
          "15%",
          "Achieved through energy-efficient technologies.",
        ],
      ],
    },
    additionalInfo: {
      title: "Additional Initiatives",
      description:
        "We continuously work to improve our safety measures and implement new initiatives. Here are some of our recent projects:",
      initiatives: [
        "Implementing AI systems for incident prediction and prevention.",
        "Developing a mobile app for emergency employee alerts.",
        "Creating a workplace stress reduction program using mindfulness practices.",
        "Participating in international environmental safety and sustainability programs.",
      ],
    },
  },
  trainingSections: [
    {
      key: "physical",
      title: "Physical Security",
      description:
        "Programs aimed at preparing staff for physical threats and maintaining a safe environment.",
      list: [
        "Emergency evacuation drills and crisis response training",
        "Training on surveillance systems and access control",
        "Terrorist threat response simulations",
      ],
      resourceLink: "https://example.com/physical-safety-training",
    },
    {
      key: "fire",
      title: "Fire Safety",
      description: "Comprehensive training on fire prevention and response.",
      list: [
        "Hands-on fire extinguisher training",
        "Evacuation route briefings",
        "Regular fire drills for all staff",
      ],
      resourceLink: "https://example.com/fire-safety-guide",
    },
    {
      key: "medical",
      title: "Medical Safety",
      description: "First aid skills and employee health maintenance.",
      list: [
        "CPR (Cardiopulmonary Resuscitation) training",
        "First aid for injuries workshops",
        "Disease prevention and vaccination lectures",
      ],
      resourceLink: "https://example.com/medical-training",
    },
    {
      key: "information",
      title: "Information Security",
      description: "Data protection training and digital hygiene.",
      list: [
        "Cybersecurity courses and phishing recognition",
        "Corporate systems usage briefings",
        "Introduction to data security policies",
      ],
      resourceLink: "https://example.com/cybersecurity-basics",
      resourceLink1: "https://example.com/cybersecurity-basics",
    },
    {
      key: "environmental",
      title: "Environmental Safety",
      description: "Environmental impact awareness and sustainable practices.",
      list: [
        "Recycling and waste reduction seminars",
        "Energy-efficient equipment usage training",
        "Carbon footprint reduction program",
      ],
      resourceLink: "https://example.com/eco-safety",
    },
    {
      key: "psychological",
      title: "Psychological Safety",
      description: "Creating a comfortable atmosphere and mental health care.",
      list: [
        "Stress management and burnout prevention training",
        "Mindfulness and meditation group sessions",
        "Empathic communication training",
      ],
      resourceLink: "https://example.com/mental-health",
    },
  ],
  titlePageTraining: "Education and training",
};
