import { useEffect } from "react";

const useDarkmode = () => {
  const isDark = false;

  const setDarkMode = () => {};

  useEffect(() => {
    const body = window.document.body;
    const classNames = {
      dark: "dark",
      light: "light",
    };
    body.classList.add(classNames.light);
    body.classList.remove(classNames.dark);
  }, []);

  return [isDark, setDarkMode];
};

export default useDarkmode;
