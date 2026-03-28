import { Transition } from "framer-motion";

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const slideUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

export const transition: Transition = {
  duration: 0.5,
  ease: "easeOut",
};