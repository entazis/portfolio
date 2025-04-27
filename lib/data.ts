export const projectsData = [
  {
    id: 1,
    title: "E-commerce Platform",
    shortDescription: "A modern e-commerce platform with cart and payment functionality.",
    description: "A full-featured e-commerce platform built with Next.js and Node.js. Includes product browsing, cart management, user authentication, and Stripe payment integration. The platform is fully responsive and optimized for all devices.",
    image: "https://images.pexels.com/photos/5082579/pexels-photo-5082579.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "web",
    technologies: ["Next.js", "React", "Node.js", "Express", "MongoDB", "Stripe", "Tailwind CSS"],
    features: [
      "User authentication and profile management",
      "Product search and filtering",
      "Shopping cart and wishlist functionality",
      "Stripe payment integration",
      "Order history and tracking",
      "Admin dashboard for product management"
    ],
    demoUrl: "https://example.com/ecommerce",
    githubUrl: "https://github.com/example/ecommerce"
  },
  {
    id: 2,
    title: "Task Management App",
    shortDescription: "A collaborative task management application for teams.",
    description: "A task management application designed for team collaboration. Features include task creation, assignment, due dates, comments, and real-time updates. The app uses a drag-and-drop interface for easy task management across different status columns.",
    image: "https://images.pexels.com/photos/3182773/pexels-photo-3182773.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "web",
    technologies: ["React", "TypeScript", "Firebase", "Tailwind CSS", "React DnD"],
    features: [
      "Real-time collaboration",
      "Task assignment and due dates",
      "Drag-and-drop task management",
      "Comments and attachments",
      "Email notifications",
      "Calendar integration"
    ],
    demoUrl: "https://example.com/taskapp",
    githubUrl: "https://github.com/example/taskapp"
  },
  {
    id: 3,
    title: "Fitness Tracking Mobile App",
    shortDescription: "A mobile app for tracking workouts and fitness progress.",
    description: "A React Native mobile application for tracking fitness activities, workouts, and progress. Users can create custom workout routines, track their exercise history, set goals, and view progress statistics. The app also includes social features for sharing achievements.",
    image: "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "mobile",
    technologies: ["React Native", "TypeScript", "Redux", "Node.js", "GraphQL", "MongoDB"],
    features: [
      "Custom workout creation",
      "Exercise tracking with history",
      "Progress statistics and charts",
      "Goal setting and achievements",
      "Social sharing capabilities",
      "Offline functionality"
    ],
    demoUrl: null,
    githubUrl: "https://github.com/example/fitnessapp"
  },
  {
    id: 4,
    title: "API Gateway Service",
    shortDescription: "A scalable API gateway service for microservices architecture.",
    description: "A high-performance API gateway service built to connect multiple microservices. Includes features like request routing, load balancing, authentication, rate limiting, and logging. Designed to handle high traffic and provide reliable service.",
    image: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "backend",
    technologies: ["Node.js", "Express", "Docker", "Kubernetes", "Redis", "PostgreSQL", "JWT"],
    features: [
      "Intelligent request routing",
      "Load balancing across services",
      "Authentication and authorization",
      "Rate limiting and throttling",
      "Comprehensive logging and monitoring",
      "Caching for performance optimization"
    ],
    demoUrl: null,
    githubUrl: "https://github.com/example/apigateway"
  },
  {
    id: 5,
    title: "Real-time Chat Application",
    shortDescription: "A real-time messaging platform with multimedia support.",
    description: "A feature-rich chat application supporting text, image, and video messaging. Built with a modern tech stack including React, Node.js, and Socket.IO for real-time communication. Includes features like read receipts, online status, and message encryption.",
    image: "https://images.pexels.com/photos/4126743/pexels-photo-4126743.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "web",
    technologies: ["React", "Node.js", "Socket.IO", "MongoDB", "AWS S3", "Tailwind CSS"],
    features: [
      "Real-time messaging",
      "Group chat capabilities",
      "Media sharing (images, videos)",
      "Read receipts and typing indicators",
      "Message encryption",
      "User presence indicators"
    ],
    demoUrl: "https://example.com/chatapp",
    githubUrl: "https://github.com/example/chatapp"
  },
  {
    id: 6,
    title: "ML-Powered Recommendation API",
    shortDescription: "A machine learning API for personalized content recommendations.",
    description: "A recommendation API built with Python and machine learning algorithms to provide personalized content suggestions. The system analyzes user behavior and preferences to deliver relevant recommendations, improving engagement and user experience.",
    image: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    category: "backend",
    technologies: ["Python", "Flask", "TensorFlow", "PostgreSQL", "Docker", "AWS Lambda"],
    features: [
      "Collaborative filtering algorithms",
      "Content-based recommendation",
      "User behavior analysis",
      "A/B testing framework",
      "Performance monitoring",
      "Scalable API endpoints"
    ],
    demoUrl: null,
    githubUrl: "https://github.com/example/recommendation-api"
  }
];

export const experienceData = [
  {
    role: "Senior Software Engineer",
    company: "Tech Innovations Inc.",
    period: "Jan 2021 - Present",
    descriptions: [
      "Lead a team of 5 developers building a next-generation SaaS platform",
      "Architected and implemented a microservices infrastructure using Node.js and Docker",
      "Reduced API response times by 40% through performance optimizations",
      "Mentored junior developers and established coding standards and best practices"
    ]
  },
  {
    role: "Frontend Developer",
    company: "Digital Solutions LLC",
    period: "Jun 2018 - Dec 2020",
    descriptions: [
      "Developed responsive web applications using React and Redux",
      "Collaborated with UX designers to implement pixel-perfect interfaces",
      "Implemented state management patterns that improved application stability",
      "Led the transition from legacy codebase to modern React architecture"
    ]
  },
  {
    role: "Software Developer Intern",
    company: "StartUp Ventures",
    period: "Jan 2018 - May 2018",
    descriptions: [
      "Assisted in developing new features for a mobile application",
      "Participated in code reviews and contributed to improving code quality",
      "Gained experience with agile development methodologies",
      "Developed an internal tool that improved team productivity"
    ]
  }
];

export const educationData = [
  {
    degree: "Master of Science in Computer Science",
    institution: "Stanford University",
    period: "2016 - 2018",
    description: "Specialized in Software Engineering and Machine Learning. Thesis on efficient algorithms for distributed systems."
  },
  {
    degree: "Bachelor of Science in Computer Engineering",
    institution: "Massachusetts Institute of Technology",
    period: "2012 - 2016",
    description: "Graduated with honors. Active member of the Robotics Club and Web Development Association."
  },
  {
    degree: "Advanced Certification in Cloud Architecture",
    institution: "AWS Training and Certification",
    period: "2020",
    description: "Professional certification focusing on cloud infrastructure design, deployment, and management."
  }
];