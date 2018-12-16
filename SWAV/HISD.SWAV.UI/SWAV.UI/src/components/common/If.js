export default ({ test, children, fallElse }) => {
    if (test && children) {
      return children;
    }
    return fallElse || false;
  };
  