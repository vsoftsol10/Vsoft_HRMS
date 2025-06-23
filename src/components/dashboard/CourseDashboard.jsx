import React, { useState } from 'react';
import { ChevronRight, Clock, Users, Award, X } from 'lucide-react';
import "./CourseDashboard1.css"
import logo from "../../assets/logo1.png"

const CourseDashboard = () => {
  const [selectedCourse, setSelectedCourse] = useState(null);

  const courses = [
    {
      id: 1,
      title: "Cloud Computing",
      icon: "☁️",
      platforms: ["AWS", "Azure", "Google Cloud Platform"],
      description: "Master cloud technologies with hands-on experience across major platforms",
      duration: "12 weeks",
      students: "500+",
      level: "Intermediate",
      topics: [
        "AWS EC2, S3, Lambda",
        "Azure Virtual Machines & Storage",
        "Google Cloud Compute Engine",
        "Cloud Security & Best Practices",
        "DevOps & CI/CD",
        "Serverless Architecture"
      ],
      features: [
        "Real-time project experience",
        "Industry certification preparation",
        "Placement support for top performers"
      ]
    },
    {
      id: 2,
      title: "SAP BASIS Administration",
      icon: "🔧",
      platforms: ["SAP HANA", "Complete BASIS Training"],
      description: "Comprehensive SAP BASIS administration with HANA DB expertise",
      duration: "10 weeks",
      students: "200+",
      level: "Advanced",
      topics: [
        "Understanding SAP & Cloud",
        "Complete BASIS training",
        "Introduction to HANA DB Administration",
        "System Administration",
        "Performance Tuning",
        "Security Management"
      ],
      features: [
        "Hands-on SAP environment",
        "Real-world scenarios",
        "Expert instructor guidance"
      ]
    },
    {
      id: 3,
      title: "Mobile App Development",
      icon: "📱",
      platforms: ["Java", "Firebase", "React Native", "Android & iOS"],
      description: "Build cross-platform mobile applications from scratch",
      duration: "14 weeks",
      students: "800+",
      level: "Beginner to Advanced",
      topics: [
        "Java Programming Fundamentals",
        "Firebase Backend Services",
        "React Native Development",
        "Native Android Development",
        "iOS Development Basics",
        "App Store Deployment"
      ],
      features: [
        "Build 3+ complete apps",
        "App store publication guidance",
        "Industry mentorship"
      ]
    },
    {
      id: 4,
      title: "Full Stack Web Development",
      icon: "🌐",
      platforms: ["HTML & CSS", "JavaScript", "React", "Node.js"],
      description: "Complete web development from frontend to backend",
      duration: "16 weeks",
      students: "1000+",
      level: "Beginner to Advanced",
      topics: [
        "HTML5 & CSS3 Fundamentals",
        "Modern JavaScript (ES6+)",
        "React.js & Component Architecture",
        "Node.js & Express.js",
        "Database Integration",
        "API Development & Testing"
      ],
      features: [
        "Build complete web applications",
        "Version control with Git",
        "Deployment strategies"
      ]
    },
    {
      id: 5,
      title: "Digital Marketing",
      icon: "📈",
      platforms: ["Social Media", "Google Ads", "WhatsApp Marketing"],
      description: "Master digital marketing strategies and tools",
      duration: "8 weeks",
      students: "600+",
      level: "Beginner",
      topics: [
        "Social Media Marketing",
        "Google Ads & PPC Campaigns",
        "WhatsApp Business Marketing",
        "Content Strategy",
        "Analytics & Reporting",
        "SEO Fundamentals"
      ],
      features: [
        "Live campaign management",
        "Industry case studies",
        "Certification preparation"
      ]
    },
    {
      id: 6,
      title: "Graphic Designing",
      icon: "🎨",
      platforms: ["Canva Premium", "Figma"],
      description: "Create professional designs for all industries",
      duration: "6 weeks",
      students: "400+",
      level: "Beginner to Intermediate",
      topics: [
        "Canva Premium Features",
        "Figma Design Principles",
        "Typography & Color Theory",
        "Brand Identity Design",
        "Social Media Graphics",
        "Print Design Basics"
      ],
      features: [
        "Portfolio development",
        "Industry-specific templates",
        "Creative project assignments"
      ]
    }
  ];

  const openCourseDetails = (course) => {
    setSelectedCourse(course);
  };

  const closeCourseDetails = () => {
    setSelectedCourse(null);
  };

  return (
    <div className="course-dashboard">
      {/* Header */}
     <header className="dashboard-header">         
  <div className="logo-section">           
    <div className="company-logo">             
      <span><img src={logo} alt="Logo" style={{width:'100%'}} /></span>           
    </div>         
  </div>           
  {/* <h1 className='header'>Course Dashboard</h1> */}
  <div className="spacer"></div>       
</header>

      {/* Courses Section */}
      <main className="dashboard-main">
        <div className="courses-header">
          <h2>Courses We Offer</h2>
          <p>Choose from our comprehensive range of technology courses</p>
        </div>

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card" onClick={() => openCourseDetails(course)}>
              <div className="course-icon">
                {course.icon}
              </div>
              <h3 className="course-title">{course.title}</h3>
              <div className="course-platforms">
                {course.platforms.map((platform, index) => (
                  <span key={index} className="platform-tag">{platform}</span>
                ))}
              </div>
              <p className="course-description">{course.description}</p>
              <div className="course-meta">
                <div className="meta-item">
                  <Clock size={16} />
                  <span>{course.duration}</span>
                </div>
                <div className="meta-item">
                  <Users size={16} />
                  <span>{course.students}</span>
                </div>
              </div>
              <div className="course-cta">
                <span>View Details</span>
                <ChevronRight size={16} />
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="modal-overlay" onClick={closeCourseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedCourse.title}</h2>
              <button className="close-btn" onClick={closeCourseDetails}>
                <X size={24} />
              </button>
            </div>
            
            <div className="modal-body">
              <div className="course-overview">
                <div className="overview-stats">
                  <div className="stat-item">
                    <Clock size={20} />
                    <div>
                      <span className="stat-label">Duration</span>
                      <span className="stat-value">{selectedCourse.duration}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Users size={20} />
                    <div>
                      <span className="stat-label">Students</span>
                      <span className="stat-value">{selectedCourse.students}</span>
                    </div>
                  </div>
                  <div className="stat-item">
                    <Award size={20} />
                    <div>
                      <span className="stat-label">Level</span>
                      <span className="stat-value">{selectedCourse.level}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="course-details">
                <div className="detail-section">
                  <h3>Course Topics</h3>
                  <ul className="topics-list">
                    {selectedCourse.topics.map((topic, index) => (
                      <li key={index}>{topic}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h3>Key Features</h3>
                  <ul className="features-list">
                    {selectedCourse.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h3>Technologies</h3>
                  <div className="tech-tags">
                    {selectedCourse.platforms.map((platform, index) => (
                      <span key={index} className="tech-tag">{platform}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="enroll-btn">Enroll Now</button>
              <button className="contact-btn">Contact Us</button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="dashboard-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Why Choose Us?</h4>
            <ul>
              <li>✓ Placement Support for Top Performers</li>
              <li>✓ Internship Certificate</li>
              <li>✓ Real-Time Project Experience</li>
            </ul>
          </div>
          <div className="footer-section">
            <h4>Contact Info</h4>
            <p>📞 9095422237</p>
            <p>🌐 thevsoft.com</p>
            <p>📍 Vamanapatrai, Tirunelveli</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CourseDashboard;