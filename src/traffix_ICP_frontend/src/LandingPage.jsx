import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCamera, FaEdit, FaPaperPlane, FaEye } from 'react-icons/fa';
import './LandingPage.css';


const LandingPage = () => {
  const navigate = useNavigate();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleStart = () => {
    navigate('/form');
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: 'spring',
        duration: 1,
        delay: 0.2,
        when: "beforeChildren",
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <motion.div 
      className="container"
      initial="hidden"
      animate={isLoaded ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <motion.img 
        src="/logo2.svg" 
        alt="DFINITY logo" 
        className="logo" 
        variants={itemVariants}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      />
      <motion.h1 className="title" variants={itemVariants}>
        Traffix - Road Safety Reporting DApp
      </motion.h1>
      <motion.p className="overview" variants={itemVariants}>
        Traffix is a decentralized application (DApp) that allows users to
        <strong> report road safety issues anonymously</strong>. Built using React and Internet Computer Protocol, 
        it leverages the blockchain to securely store reports, ensuring transparency and trustlessness.
      </motion.p>

      <motion.section className="features" variants={itemVariants}>
        <h2>Key Features</h2>
        <ul>
          <motion.li variants={itemVariants} whileHover={{ scale: 1.05, originX: 0 }}>
            <FaCamera className="icon" /> <strong>Capture Image:</strong> Take photos of road safety issues directly via webcam.
          </motion.li>
          <motion.li variants={itemVariants} whileHover={{ scale: 1.05, originX: 0 }}>
            <FaEdit className="icon" /> <strong>Add Details:</strong> Provide additional information using a simple form.
          </motion.li>
          <motion.li variants={itemVariants} whileHover={{ scale: 1.05, originX: 0 }}>
            <FaPaperPlane className="icon" /> <strong>Submit Report:</strong> Store reports securely and anonymously on the blockchain.
          </motion.li>
          <motion.li variants={itemVariants} whileHover={{ scale: 1.05, originX: 0 }}>
            <FaEye className="icon" /> <strong>View Reports:</strong> Track ongoing issues reported by the community.
          </motion.li>
        </ul>
      </motion.section>

      <motion.section className="technologies" variants={itemVariants}>
        <h2>Technologies Used</h2>
        <ul>
          <motion.li variants={itemVariants} whileHover={{ scale: 1.05, originX: 0 }}>
            <strong>React:</strong> For building the user interface.
          </motion.li>
          <motion.li variants={itemVariants} whileHover={{ scale: 1.05, originX: 0 }}>
            <strong>IPFS:</strong> For decentralized image storage.
          </motion.li>
          <motion.li variants={itemVariants} whileHover={{ scale: 1.05, originX: 0 }}>
            <strong>Pinata:</strong> For managing IPFS files efficiently.
          </motion.li>
        </ul>
      </motion.section>

      <motion.button 
        onClick={handleStart} 
        className="start-button"
        variants={itemVariants}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        Let's Get Started
      </motion.button>
    </motion.div>
  );
};

export default LandingPage;