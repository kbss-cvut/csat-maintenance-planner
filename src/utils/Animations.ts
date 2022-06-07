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
      x: "-20vw",
      transition: transition,
    },
    show: {
      x: 0,
      transition: transition,
    },
  },

  doubleArrowAnimation: {
    hide: {
      rotate: 180,
      x: "20.5vw",
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
