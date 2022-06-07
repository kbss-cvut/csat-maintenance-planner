const transition = {
  duration: 0.8,
  ease: "easeInOut",
};

const Animations = {
  workPackageListAnimation: {
    hide: {
      x: "-40vw",
      transition: transition,
    },
    show: {
      x: 0,
      transition: transition,
    },
  },

  planEditorAnimation: {
    hide: {
      x: "-18vw",
      clipPath: "inset(0% 0% 0% 0%)",
      transition: transition,
    },
    show: {
      scale: 1,
      y: 0,
      x: 0,
      clipPath: "inset(0% 25% 0% 0%)",
      transition: transition,
    },
  },

  doubleArrowAnimation: {
    hide: {
      rotate: 180,
      x: "21vw",
      transition: transition,
    },
    show: {
      rotate: 0,
      x: 0,
      transition: transition,
    },
  },
};

export default Animations;
