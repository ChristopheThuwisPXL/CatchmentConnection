import { motion } from "framer-motion";
import { FaLinkedin, FaGithub } from "react-icons/fa";
import DefaultuserImage from '../assets/Images/default-user-image.png';

const teamMembers = [
  {
    name: "Christophe Thuwis",
    title: "AI Engineer",
    imageUrl: DefaultuserImage,
    linkedIn: "https://www.linkedin.com/in/christophe-thuwis/",
    github: "https://github.com/ChristopheThuwisPXL",
  },
  {
    name: "Calvin Nijenhuis",
    title: "Software Engineer",
    imageUrl: DefaultuserImage,
    linkedIn: "https://www.linkedin.com/in/calvinnijenhuis/",
    github: "https://github.com/FreeYungHammy",
  },
  {
    name: "Trent Evans",
    title: "Software Engineer",
    imageUrl: DefaultuserImage,
    linkedIn: "https://www.linkedin.com/in/trent-evans/",
    github: "https://github.com/trenti6",
  }
];

const TeamLayout = () => {
  return (
    <div className="relative w-full min-h-screen flex flex-col items-center justify-center py-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Heading */}
      <div className="text-center max-w-xl mx-auto">
        <h2 className="mt-3 text-4xl sm:text-5xl font-bold tracking-tight">
          Meet Our Team
        </h2>
        <p className="mt-4 text-base sm:text-lg">
          We are a passionate team dedicated to harnessing technology for environmental monitoring.<br />
          Our diverse skills come together to drive innovation, ensuring a better future for our communities and ecosystems.
        </p>
      </div>

      {/* Team Members */}
      <motion.div
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.2 }},
        }}
        initial="hidden"
        animate="show"
        className="mt-20 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-12 max-w-screen-lg mx-auto justify-center"
      >
        {teamMembers.map((member) => (
          <motion.div
            key={member.name}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
            }}
            whileHover={{ y: -8 }}
            className="text-center transform transition-transform duration-300 hover:shadow-lg p-4 rounded-xl"
          >
            {member.imageUrl ? (
              <img
                src={member.imageUrl}
                alt={member.name}
                className="h-24 w-24 rounded-full object-cover mx-auto bg-secondary"
                width={160}
                height={160}
              />
            ) : (
              <div className="h-24 w-24 rounded-full bg-secondary mx-auto"></div>
            )}
            <h3 className="mt-4 text-lg font-semibold">{member.name}</h3>
            <p className="text-muted-foreground">{member.title}</p>

            <div className="mt-4 flex justify-center gap-4">
              {member.linkedIn && (
                <a
                  href={member.linkedIn}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 font-medium py-1 px-3 rounded-full text-sm transition transform hover:scale-105"
                >
                  <FaLinkedin size={16} />
                  LinkedIn
                </a>
              )}
              {member.github && (
                <a
                  href={member.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 font-medium py-1 px-3 rounded-full text-sm transition transform hover:scale-105"
                >
                  <FaGithub size={16} />
                  GitHub
                </a>
              )}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default TeamLayout;
