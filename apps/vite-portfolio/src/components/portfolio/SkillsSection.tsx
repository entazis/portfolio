import React from 'react';

interface Skill {
  name: string;
  level: 'Master' | 'Expert' | 'Advanced' | 'Intermediate';
}

interface SkillCategory {
  name: string;
  icon: string; // Changed to string for HTML entity
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Frontend Development',
    icon: '💻', // Code icon replacement
    skills: [
      { name: 'TypeScript', level: 'Master' },
      { name: 'JavaScript', level: 'Master' },
      { name: 'React', level: 'Expert' },
      { name: 'HTML5/CSS3', level: 'Expert' },
    ],
  },
  {
    name: 'Backend Development',
    icon: '🖥️', // Server icon replacement
    skills: [
      { name: 'Node.js', level: 'Master' },
      { name: 'PostgreSQL', level: 'Expert' },
      { name: 'Redis', level: 'Expert' },
      { name: 'API Design', level: 'Master' },
    ],
  },
  {
    name: 'DevOps & Architecture',
    icon: '🗄️', // Database icon replacement
    skills: [
      { name: 'Microservices', level: 'Expert' },
      { name: 'CI/CD', level: 'Expert' },
      { name: 'System Design', level: 'Expert' },
    ],
  },
   {
    name: 'Data & Analytics',
    icon: '🧠', // Brain icon replacement
    skills: [
      { name: 'Data Analysis', level: 'Expert' },
      { name: 'Web Scraping', level: 'Expert' },
      { name: 'Google Analytics', level: 'Expert' },
    ],
  },
];

const getBadgeStyle = (level: Skill['level']) => {
  switch (level) {
    case 'Master': 
      return 'bg-primary text-primary-foreground';
    case 'Expert': 
      return 'bg-secondary text-secondary-foreground';
    case 'Advanced': 
      return 'border border-primary text-primary bg-transparent';
    default: 
      return 'bg-muted text-muted-foreground';
  }
};

const SkillsSection: React.FC = () => {
  return (
    <section id="skills" className="section-padding bg-secondary/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">My Expertise</h2>
        <p className="section-subtitle">
          A snapshot of the technologies and methodologies I excel in.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {skillCategories.map((category, index) => (
            <div 
              key={category.name} 
              className="bg-card p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 animate-fade-in-up"
              style={{animationDelay: `${0.2 + index * 0.1}s`}}
            >
              <div className="flex items-center mb-4">
                <span className="text-2xl mr-3">{category.icon}</span>
                <h3 className="text-xl font-semibold text-primary">{category.name}</h3>
              </div>
              <ul className="space-y-2">
                {category.skills.map(skill => (
                  <li key={skill.name} className="flex justify-between items-center">
                    <span className="text-foreground">{skill.name}</span>
                    <span className={`text-xs px-2 py-1 rounded ${getBadgeStyle(skill.level)}`}>
                      {skill.level}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
         <div className="mt-12 text-center animate-fade-in-up" style={{animationDelay: '0.8s'}}>
            <h3 className="text-xl font-semibold text-primary mb-4">Additional Technologies</h3>
            <div className="flex flex-wrap justify-center gap-2">
                {['Jest', 'Git', 'GitHub', 'Docker', 'MongoDB', 'Python', 'Tailwind CSS', 'Next.js', 'AWS', 'REST API', 'Agile/Scrum'].map(tech => (
                    <span key={tech} className="text-sm px-3 py-1 border border-primary text-primary bg-transparent rounded">{tech}</span>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
