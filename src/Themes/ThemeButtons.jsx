// src/components/ThemeButtons.jsx
import { useTheme } from '../Themes/ThemeContext';

const ThemeButtons = () => {
  const { currentTheme, changeTheme } = useTheme();

  return (
    <div className="fixed top-4 right-4 z-50 flex gap-2">

       <button
        className={`btn btn-sm btn-warning ${currentTheme === 'hacker' ? 'ring-2 ring-warning' : ''}`}
        onClick={() => changeTheme('hacker')}
      >
        Hacker
      </button>
      <button
        className={`btn btn-sm btn-primary ${currentTheme === 'leet' ? 'ring-2 ring-primary' : ''}`}
        onClick={() => {changeTheme('leet')}
      }
      >
        Leet
      </button>
     
      <button
        className={`btn btn-sm btn-success ${currentTheme === 'midnight' ? 'ring-2 ring-success' : ''}`}
        onClick={() => changeTheme('midnight')}
      >
        Midnight
      </button>
    </div>
  );
};

export default ThemeButtons;