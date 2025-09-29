const skills = [
  {
    id: 1,
    title: "Python Programming",
    description: "Learn Python fundamentals from scratch",
    teacher: "kikii",
    price: 500,
    category: 'Programming'
  },
  {
    id: 2,
    title: "Guitar Lessons",
    description: "Beginner to intermediate guitar lessons",
    teacher: "molly",
    price: 800,
    category: 'Music'
  },
  {
    id: 3,
    title: "Web Design",
    description: "HTML, CSS & responsive design",
    teacher: "dominique",
    price: 700,
    category: 'Design'
  },
  {
    id: 4,
    title: "Spanish Language",
    description: "Conversational Spanish for beginners",
    teacher: "maureen",
    price: 600,
    category: 'Language'
  },
  {
    id: 5,
    title: "Photography",
    description: "Digital photography and editing",
    teacher: "carl",
    price: 750,
    category: 'Art'
  },
  {
    id: 6,
    title: "Yoga & Meditation",
    description: "Beginner yoga and mindfulness",
    teacher: "vanessa",
    price: 400,
    category: 'Fitness'
  }
];

const demoAccounts = {
  teacher: { email: "teacher@demo.com", password: "demo123", name: "Molly", role: "teacher" },
  student: { email: "student@demo.com", password: "demo123", name: "John", role: "student" }
};

export { skills, demoAccounts };