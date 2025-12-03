import { motion } from 'framer-motion';
import type { GithubRepo } from '../hooks/useGithubProjects';
import '../styles/ProjectCard.css';

interface ProjectCardProps {
  project: GithubRepo;
}

export const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <motion.a
      href={project.html_url}
      target="_blank"
      rel="noopener noreferrer"
      className="project-card"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
    >
      <div className="card-header">
        <h3>{project.name}</h3>
        <span className="stars">★ {project.stargazers_count}</span>
      </div>
      <p className="description">{project.description || "No description available."}</p>
      <div className="card-footer">
        {project.language && <span className="language-tag">{project.language}</span>}
        {project.topics && project.topics.slice(0, 3).map(topic => (
            <span key={topic} className="topic-tag">{topic}</span>
        ))}
      </div>
    </motion.a>
  );
};
