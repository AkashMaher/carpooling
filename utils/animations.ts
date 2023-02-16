export const fromTopAnimation = {
  initial: {
    transform: "translateY(-100%)",
    opacity: 0,
  },
  final: {
    transform: "translateY(0%)",
    opacity: 1,
  },
};

export const fromBottomAnimation = {
  initial: {
    transform: "translateY(100%)",
    opacity: 0,
  },
  final: {
    transform: "translateY(0%)",
    opacity: 1,
  },
};

export const fromLeftAnimation = {
  initial: {
    transform: "translateX(-100%)",
    opacity: 0,
  },
  final: {
    transform: "translateX(0%)",
    opacity: 1,
  },
};

export const fromRightAnimation = {
  initial: {
    opacity: 0,
    transform: "translateX(100%)",
  },
  final: {
    opacity: 1,
    transform: "translateX(0%)",
  },
};

export const opacityAnimation = {
  initial: {
    opacity: 0,
  },
  final: {
    opacity: 1,
  },
};
