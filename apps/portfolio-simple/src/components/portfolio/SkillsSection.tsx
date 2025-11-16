import React from 'react';
import { useSectionVisibility } from '@/hooks/useSectionVisibility';

interface Skill {
  name: string;
  level: 'Master' | 'Expert' | 'Advanced' | 'Intermediate';
}

interface SkillCategory {
  name: string;
  icon: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    name: 'Backend Development',
    icon: '🖥️',
    skills: [
      { name: 'Node.js', level: 'Master' },
      { name: 'TypeScript', level: 'Master' },
      { name: 'NestJS', level: 'Expert' },
      { name: 'API Development', level: 'Master' },
    ],
  },
  {
    name: 'Databases & Infrastructure',
    icon: '🗄️',
    skills: [
      { name: 'Redis', level: 'Expert' },
      { name: 'PostgreSQL', level: 'Expert' },
      { name: 'MongoDB', level: 'Expert' },
      { name: 'Prometheus', level: 'Advanced' },
      { name: 'Database Sharding', level: 'Expert' },
    ],
  },
  {
    name: 'Frontend Development',
    icon: '💻',
    skills: [
      { name: 'React', level: 'Expert' },
      { name: 'JavaScript', level: 'Master' },
      { name: 'Angular', level: 'Advanced' },
      { name: 'HTML5/CSS3', level: 'Expert' },
    ],
  },
  {
    name: 'DevOps & Architecture',
    icon: '⚙️',
    skills: [
      { name: 'Microservices', level: 'Expert' },
      { name: 'Nano-services', level: 'Master' },
      { name: 'Monorepo Management', level: 'Expert' },
      { name: 'AI Agents', level: 'Expert' },
      { name: 'MCP', level: 'Advanced' },
      { name: 'CI/CD', level: 'Expert' },
      { name: 'System Design', level: 'Expert' },
    ],
  },
  {
    name: 'Messaging & Communication',
    icon: '🔄',
    skills: [
      { name: 'MQTT', level: 'Expert' },
      { name: 'Message Queues', level: 'Expert' },
      { name: 'WebSocket', level: 'Expert' },
      { name: 'Load Balancing', level: 'Expert' },
    ],
  },
  {
    name: 'Data & Analytics',
    icon: '🧠',
    skills: [
      { name: 'Machine Learning', level: 'Advanced' },
      { name: 'Data Analysis', level: 'Expert' },
      { name: 'Google Analytics', level: 'Expert' },
      { name: 'Web Scraping', level: 'Expert' },
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
  const sectionRef = useSectionVisibility('skills');

  return (
    <section 
      id="skills" 
      ref={sectionRef as React.RefObject<HTMLElement>}
      className="section-padding bg-secondary/30"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="section-title">My Expertise</h2>
        <p className="section-subtitle">
          Technologies and methodologies I've mastered through 7+ years of professional experience.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            <h3 className="text-xl font-semibold text-primary mb-4">Additional Technologies & Tools</h3>
            <div className="flex flex-wrap justify-center gap-2">
                {[
                  'Jest', 'Git', 'GitHub', 'Docker', 'Python', 'R', 'Tailwind CSS', 'Next.js', 
                  'AWS', 'REST API', 'GraphQL', 'TypeORM', 'Tile38', 'GeoJSON', 'IoT', 
                  'Multi-Tenancy', 'JSON Schema', 'Open API', 'RediSearch', 'Integration Testing',
                  'Cursor', 'Schema Generation', 'Runtime Validation', 'Team Leadership'
                ].map(tech => (
                    <span key={tech} className="text-sm px-3 py-1 border border-primary text-primary bg-transparent rounded">{tech}</span>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
