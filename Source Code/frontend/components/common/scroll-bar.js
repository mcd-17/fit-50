import React, { useEffect, useState } from 'react';
import { MdOutlineKeyboardArrowUp } from 'react-icons/md';
import { motion } from 'framer-motion';

const Scroll = () => {
    const [isVisible, setIsVisible] = useState(false);

    const toggleVisibility = () => {
        if (window.scrollY > 300) {
            setIsVisible(true);
        } else {
            setIsVisible(false);
        }
    };

    useEffect(() => {
        window.addEventListener('scroll', toggleVisibility);
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        const duration = 3000;
        const start = window.scrollY;
        const startTime = performance.now();

        const easeInOutQuad = (t, b, c, d) => {
            t /= d / 2;
            if (t < 1) return (c / 2) * t * t + b;
            t--;
            return (-c / 2) * (t * (t - 2) - 1) + b;
        };

        const scroll = (currentTime) => {
            const timeElapsed = currentTime - startTime;
            const run = easeInOutQuad(timeElapsed, start, -start, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) {
                requestAnimationFrame(scroll);
            }
        };

        requestAnimationFrame(scroll);
    };

    return (
        <div>
            {isVisible && (
                <motion.button
                    onClick={scrollToTop}
                    className='fixed p-1 rounded-full bottom-5 right-5 bg-primary shadow-lg text-white'
                    initial={{ opacity: 1, y: 50 }}
                    animate={{ opacity: 1, y: [0, -10, 0] }}
                    transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut'
                    }}
                    whileHover={{ scale: 1.25 }}
                    whileTap={{ scale: 0.9 }}
                >
                    <MdOutlineKeyboardArrowUp size={30} />
                </motion.button>
            )}
        </div>
    );
};

export default Scroll;
