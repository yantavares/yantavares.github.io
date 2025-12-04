import confetti from "canvas-confetti";
import { motion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FaEnvelope, FaGithub, FaLinkedin } from "react-icons/fa";
import pfp from "../assets/pfp.png";
import { ProjectCard } from "../components/ProjectCard";
import { certifications, contributions, papers } from "../data/achievements";
import { useGithubProjects } from "../hooks/useGithubProjects";
import "../styles/Home.css";

export const Home = () => {
  const { projects, loading, error } = useGithubProjects("yantavares");
  const { scrollY, scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  
  const backgroundY = useTransform(scrollY, [0, 500], [0, 350]);

  const calculateItemsPerPage = () => {
    if (window.innerWidth < 768) {
      return 8; // Mobile: 1 column * 8 rows
    }

    const containerWidth = Math.min(window.innerWidth, 1200) - 64;
    const gap = 32;
    const minCardWidth = 340;
    const columns = Math.floor((containerWidth + gap) / (minCardWidth + gap));
    
    return Math.max(1, columns) * 4; // Desktop: n columns * 4 rows
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(calculateItemsPerPage());
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const projectsRef = useRef<HTMLDivElement>(null);
  const userTriggeredRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(calculateItemsPerPage());
      setIsMobile(window.innerWidth < 768);
      setCurrentPage(1);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset page when projects change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage(1);
  }, [projects.length, itemsPerPage]);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    userTriggeredRef.current = true;
  };

  // Scroll to top of projects section when page changes
  useEffect(() => {
    if (userTriggeredRef.current && projectsRef.current) {
      const yOffset = -100;
      const element = projectsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
      userTriggeredRef.current = false;
    }
  }, [currentPage]);

  const handleHeroClick = (e: React.MouseEvent<HTMLElement>) => {
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    confetti({
      particleCount: 100,
      spread: 70,
      origin: { x, y },
      colors: ['#38bdf8', '#818cf8', '#c084fc', '#ffffff']
    });
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <div className="home-container">
      <motion.div className="progress-bar" style={{ scaleX }} />
      <header className="hero" onClick={handleHeroClick} style={{ cursor: 'pointer' }}>
        <motion.div className="hero-background" style={{ y: isMobile ? 0 : backgroundY }} />
        <motion.div
          className="hero-content"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="profile-img-container">
            <img src={pfp} alt="Yan Tavares" className="profile-img" />
          </motion.div>
          <motion.h1 variants={itemVariants}>
            Yan Tavares
          </motion.h1>
          <motion.h2 variants={itemVariants}>
            Computer Engineer & <br />
            <span className="highlight">AI/ML Researcher</span>
          </motion.h2>
        </motion.div>

        <motion.div
          className="scroll-indicator"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 1.5 }}
        >
          <span>Scroll to Explore Projects</span>
          <motion.div
            className="arrow"
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            ↓
          </motion.div>
        </motion.div>
      </header>

      <main className="main-content" id="projects">
        <section className="projects-section" ref={projectsRef}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h3>My Projects</h3>
            <p>A showcase of my personal projects.</p>
          </motion.div>
          
          {loading && (
            <div className="loading-container">
              <div className="loader"></div>
              <p>Syncing with GitHub...</p>
            </div>
          )}
          
          {error && <p className="error">Error loading projects: {error}</p>}
          
          <div className="projects-grid">
            {currentProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard project={project} />
              </motion.div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="pagination-btn"
              >
                Previous
              </button>

              <span className="pagination-info">
                Page {currentPage} of {totalPages}
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="pagination-btn"
              >
                Next
              </button>
            </div>
          )}
        </section>

        <section className="achievements-section">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h3>Contributions & Achievements</h3>
            <p>Some of my impact.</p>
          </motion.div>

          <motion.div 
            className="achievements-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {/* Open Source */}
            <div className="achievement-row">
              <div className="row-header">
                <h4>Open Source & Hackathons</h4>
                <p>Open source community</p>
              </div>
              <div className="card-list">
                {contributions.map((item, i) => (
                  item.link ? (
                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="achievement-item">
                      <h5>{item.repo}</h5>
                      <p>{item.description}</p>
                    </a>
                  ) : (
                    <div key={i} className="achievement-item">
                      <h5>{item.repo}</h5>
                      <p>{item.description}</p>
                    </div>
                  )
                ))}
              </div>
            </div>

            <div className="achievement-divider" />
            {/* Certifications */}
            <div className="achievement-row">
              <div className="row-header">
                <h4>Certifications</h4>
                <p>Professional Licenses</p>
              </div>
              <div className="card-list">
                {certifications.map((item, i) => (
                  <div key={i} className="achievement-item">
                    <h5>{item.name}</h5>
                    <p>{item.issuer} • {item.date}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="achievement-divider" />
            {/* Scientific Papers */}
            <div className="achievement-row">
              <div className="row-header">
                <h4>Research</h4>
                <p>Scientific Papers & Publications</p>
              </div>
              <div className="card-list">
                {papers.map((item, i) => (
                  item.link ? (
                    <a key={i} href={item.link} target="_blank" rel="noopener noreferrer" className="achievement-item">
                      <h5>{item.title}</h5>
                      <span className="platform-tag">{item.platform}</span>
                    </a>
                  ) : (
                    <div key={i} className="achievement-item">
                      <h5>{item.title}</h5>
                      <span className="platform-tag">{item.platform}</span>
                    </div>
                  )
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section className="contact-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h3>Socials</h3>
            <p>Feel free to reach out!</p>
          </motion.div>

          <div className="contact-grid">
            {[
              {
                name: "GitHub",
                url: "https://github.com/yantavares",
                label: "Check my code",
                color: "#fff",
                icon: FaGithub
              },
              {
                name: "LinkedIn",
                url: "https://linkedin.com/in/yantavares01",
                label: "Connect with me",
                color: "#0077b5",
                icon: FaLinkedin
              },
              {
                name: "Email",
                url: "mailto:yantdo1@gmail.com",
                label: "Get in touch",
                color: "#38bdf8",
                icon: FaEnvelope
              }
            ].map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                variants={{
                  hidden: { opacity: 0, scale: 0.8, y: 50 },
                  visible: { 
                    opacity: 1, 
                    scale: 1, 
                    y: 0,
                    transition: { 
                      type: "spring",
                      stiffness: 100,
                      damping: 15,
                      delay: index * 0.15 
                    }
                  },
                  hover: { 
                    y: -5, 
                    scale: 1.05,
                    backgroundColor: "rgba(255, 255, 255, 0.08)",
                    borderColor: "var(--accent-color)",
                    transition: { duration: 0.2 }
                  }
                }}
              >
                <span className="contact-label">{link.label}</span>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
                  <span className="contact-name" style={{ color: link.color }}>{link.name}</span>
                  <motion.div
                    style={{ overflow: 'hidden', display: 'flex' }}
                    variants={{
                      visible: isMobile 
                        ? { opacity: 1, scale: 1, x: 0, width: 'auto' } 
                        : { opacity: 0, scale: 0, x: -10, width: 0 },
                      hover: { opacity: 1, scale: 1, x: 0, width: 'auto' }
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    <link.icon size={22} color={link.color} />
                  </motion.div>
                </div>
              </motion.a>
            ))}
          </div>
        </section>
      </main>

            <footer className="footer">
        <div className="footer-content">
          <p>“We can only see a short distance ahead, but we can see plenty there that needs to be done.” - Alan Turing</p>
        </div>
      </footer>
    </div>
  );
};
