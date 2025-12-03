import { useState, useEffect, useRef } from "react";
import { motion, useScroll, useSpring, useTransform, type Variants } from "framer-motion";
import confetti from "canvas-confetti";
import { useGithubProjects } from "../hooks/useGithubProjects";
import { ProjectCard } from "../components/ProjectCard";
import pfp from "../assets/pfp.png";
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

  // Calculate items per page based on screen size and grid layout
  const calculateItemsPerPage = () => {
    if (window.innerWidth < 768) {
      return 8; // Mobile: 1 column * 8 rows
    }

    // Desktop: Calculate columns based on container width (max 1200px - 4rem padding)
    // Grid item min-width: 340px, Gap: 2rem (32px)
    const containerWidth = Math.min(window.innerWidth, 1200) - 64;
    const gap = 32;
    const minCardWidth = 340;
    const columns = Math.floor((containerWidth + gap) / (minCardWidth + gap));
    
    return Math.max(1, columns) * 4; // Desktop: n columns * 4 rows
  };

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(calculateItemsPerPage());
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleResize = () => {
      setItemsPerPage(calculateItemsPerPage());
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Reset page when projects change or itemsPerPage changes
  useEffect(() => {
    setCurrentPage(1);
  }, [projects.length, itemsPerPage]);

  const totalPages = Math.ceil(projects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProjects = projects.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll logic moved to useEffect to ensure it runs after render
  };

  // Scroll to top of projects section when page changes
  useEffect(() => {
    if (projectsRef.current) {
      const yOffset = -100;
      const element = projectsRef.current;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
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
        <motion.div className="hero-background" style={{ y: backgroundY }} />
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

        <section className="contact-section">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="section-header"
          >
            <h3>Let's Connect</h3>
            <p>Feel free to reach out for collaborations or just a friendly hello.</p>
          </motion.div>

          <div className="contact-grid">
            {[
              {
                name: "GitHub",
                url: "https://github.com/yantavares",
                label: "Check my code",
                color: "#fff"
              },
              {
                name: "LinkedIn",
                url: "https://linkedin.com/in/yantavares01",
                label: "Connect with me",
                color: "#0077b5"
              },
              {
                name: "Email",
                url: "mailto:yantdo1@gmail.com",
                label: "Get in touch",
                color: "#38bdf8"
              }
            ].map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="contact-card"
                initial={{ opacity: 0, scale: 0.8, y: 50 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  type: "spring",
                  stiffness: 100,
                  damping: 15,
                  delay: index * 0.15 
                }}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  borderColor: "var(--accent-color)"
                }}
              >
                <span className="contact-label">{link.label}</span>
                <span className="contact-name" style={{ color: link.color }}>{link.name}</span>
              </motion.a>
            ))}
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; {new Date().getFullYear()} Yan Tavares.</p>
          <p className="tech-stack">Built with React, TypeScript & Framer Motion</p>
        </div>
      </footer>
    </div>
  );
};
