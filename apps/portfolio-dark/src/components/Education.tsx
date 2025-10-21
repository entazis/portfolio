import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award } from "lucide-react";

const education = [
  {
    institution: "Budapest University of Technology and Economics",
    degree: "Master of Science (MSc)",
    field: "Electrical Engineering",
    specialization: "Computer-based Systems, Smart City",
    period: "2016 - 2018"
  },
  {
    institution: "Budapest University of Technology and Economics",
    degree: "Bachelor of Science (BSc)",
    field: "Electrical Engineering",
    specialization: "Computer-based Systems",
    period: "2012 - 2015"
  }
];

const certifications = [
  {
    title: "AWS Certified Solutions Architect – Associate",
    issuer: "Udemy",
    date: "Completed 2024",
    description: "Full preparation course covering AWS cloud infrastructure, deployment models, and architecture design",
    skills: ["AWS", "Cloud Architecture", "EC2", "S3", "RDS", "Lambda", "CloudFormation"]
  },
  {
    title: "Learn Ethical Hacking From Scratch",
    issuer: "zSecurity",
    date: "Issued Jan 2021",
    credential: "UC-93247c58-26b9-441c-8e99-aab40fd05cd3",
    skills: ["Ethical Hacking"]
  },
  {
    title: "Convolutional Neural Networks",
    issuer: "DeepLearning.AI",
    date: "Issued Jan 2018",
    credential: "PQR3G7RXKTQZ",
    skills: ["AI", "Machine Learning", "Deep Learning", "Computer Vision"]
  },
  {
    title: "Neural Networks and Deep Learning",
    issuer: "DeepLearning.AI",
    date: "Issued Jan 2018",
    credential: "RTTTM2G3S9YQ",
    skills: ["Machine Learning", "Deep Learning", "AI", "Python"]
  }
];

export const Education = () => {
  return (
    <section id="education" className="py-20">
      <div className="container px-4 mx-auto">
        <div className="max-w-6xl mx-auto space-y-12">
          {/* Education Section */}
          <div className="space-y-8">
            <div className="text-center space-y-4 animate-fade-in">
              <h2 className="text-4xl md:text-5xl font-bold">
                Education
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Strong academic foundation in electrical and computer engineering
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {education.map((edu, index) => (
                <Card 
                  key={index}
                  className="shadow-card hover:shadow-glow transition-smooth"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg gradient-accent">
                        <GraduationCap className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-lg">{edu.degree}</CardTitle>
                        <CardDescription className="text-sm font-semibold text-foreground mt-1">
                          {edu.institution}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm text-muted-foreground">{edu.field}</p>
                    <p className="text-sm text-muted-foreground italic">{edu.specialization}</p>
                    <p className="text-sm text-primary font-medium">{edu.period}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Certifications Section */}
          <div className="space-y-8 pt-8">
            <div className="text-center space-y-4">
              <h2 className="text-4xl md:text-5xl font-bold">
                Certifications
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Continuous learning in cloud architecture, security, and AI/ML
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mt-8">
              {certifications.map((cert, index) => (
                <Card 
                  key={index}
                  className="shadow-card hover:shadow-glow transition-smooth"
                >
                  <CardHeader>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg gradient-primary">
                        <Award className="h-5 w-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base leading-tight">{cert.title}</CardTitle>
                        <CardDescription className="text-sm mt-1">
                          {cert.issuer} • {cert.date}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {cert.description && (
                      <p className="text-sm text-muted-foreground">{cert.description}</p>
                    )}
                    {cert.credential && (
                      <p className="text-xs text-muted-foreground">
                        Credential: {cert.credential}
                      </p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {cert.skills.map((skill, i) => (
                        <Badge key={i} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
