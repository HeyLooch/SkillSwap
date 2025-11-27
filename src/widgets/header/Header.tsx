// src\widgets\header\Header.tsx

import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "@store";
import { RootState } from "@store";
import { getTheme, toggleTheme } from "../../services/theme/theme-slice";
import { getRandomUsers } from "../../services/randomUsers/random-users-slice";
import { setTextForSearch } from "../../services/filters/filters-slice";
import { reloadFilteredUsers } from "../../services/filteredUsers/actions";
import { getCurrentUser, setCurrentUser } from "../../services/user/user-slice";
import useDebounced from "../../shared/hooks/useDebounced";
import { NotificationWidget } from "../notification-widget/NotificationWidget";
import { Logo } from "../../shared/ui/logo/Logo";
import { Button } from "../../shared/ui/button/Button";
import { Icon } from "../../shared/ui/icon/Icon";
import { getImageUrl } from "../../shared/lib/helpers";
import { SearchBar } from "../../shared/ui/search-bar/SearchBar";
import { ProfilePopup } from "../profile-popup/ProfilePopup";
import { SkillMenu } from "../SkillMenu/SkillMenu";
import { Popup } from "../popup/Popup";
import clsx from "clsx";
import styles from "./Header.module.css";

export const POPUP_TYPES = {
  SKILLS: "skills",
  PROFILE: "profile",
  NOTIFICATIONS: "notifications",
} as const;

export type PopupType = (typeof POPUP_TYPES)[keyof typeof POPUP_TYPES] | null;

export const Header: FC = () => {
  const dispatch = useDispatch();
  const [isOpenPopup, setOpenPopup] = useState<PopupType>(null);

  const theme = useSelector(getTheme);
  const currentUser = useSelector(getCurrentUser);
  const randomUsers = useSelector(getRandomUsers);
  const currentTextForSearch = useSelector((rs: RootState) => rs.filters.text_for_search);
  const [query, setQuery] = useState(currentTextForSearch || '');

  const debounced = useDebounced(query, 1000);

  useEffect(() => {
    dispatch(setTextForSearch(debounced));
    reloadFilteredUsers(1);
  }, [debounced]);

  const togglePopup = (popup: PopupType) => {
    setOpenPopup(prev => (prev === popup ? null : popup));
  };

  const closePopup = () => setOpenPopup(null);

  const handleLogin = () => {
    if (randomUsers.length === 0) {
      console.log('Нет загруженных пользователей для входа');
      return;
    }
    const randomIndex = Math.floor(Math.random() * randomUsers.length);
    const randomUser = randomUsers[randomIndex];
    dispatch(setCurrentUser(randomUser));
  };

  return (
    <header
      className={styles.header}
    >
      <Link to="/">
        <Logo />
      </Link>

      <nav>
        <ul className={styles.navList}>
          <li className={styles.li}>
            <Link
              to="/about"
              className={styles.link}
            >
              О проекте
            </Link>
          </li>
          <li className={styles.li}>
            <button
              data-popup-trigger
              className={clsx(styles.link, styles.dropButton)}
              onClick={(e) => {togglePopup(POPUP_TYPES.SKILLS)}}
            >
              Все навыки
              <Icon
                name={
                  isOpenPopup === POPUP_TYPES.SKILLS
                    ? "chevronUp"
                    : "chevronDown"
                }
                size="s"
                className={styles.iconChevron}
              />
            </button>
          </li>
        </ul>
      </nav>

      {/* Используем компонент SearchBar с разной шириной */}
      <SearchBar
        maxWidth={currentUser ? 648 : 527}
        value={query}
        onChange={setQuery}
      />

      {!currentUser && (
        <button 
          className={styles.moonButton}
          onClick={() => dispatch(toggleTheme())}
        >
          {theme === 'light' ? (
            <Icon name="moon" size="s" />
          ) : (
            <Icon name="sun" size="s" />
          )}
        </button>
      )}

      <div className={styles.rightSection}>
        {/* Иконки уведомлений и лайков только для авторизованных */}
        {currentUser && (
          <>
            <button 
              className={styles.moonButton}
              onClick={() => dispatch(toggleTheme())}
            >
              {theme === 'light' ? (
                <Icon name="moon" size="s" />
              ) : (
                <Icon name="sun" size="s" />
              )}
            </button>
            <button
              data-popup-trigger
              className={styles.notificationButton}
              onClick={() => togglePopup(POPUP_TYPES.NOTIFICATIONS)}
            >
              <div className={styles.iconWrapper}>
                <Icon name="notification" size={20} strokeWidth={5} />
              </div>
            </button>
            <button className={styles.likeButton}>
              <Icon name="like" size="s" />
            </button>
          </>
        )}

        {/* Блок пользователя или кнопки входа */}
        {currentUser ? (
          <div
            data-popup-trigger
            className={styles.userAuthWrapper}
            onClick={() => togglePopup(POPUP_TYPES.PROFILE)}
          >
            <span className={styles.userName}>{currentUser.name}</span>
            <img
              src={getImageUrl(currentUser.photo)}
              alt={currentUser.name}
              className={styles.userAvatar}
            />
            <div className="popupWrapper">
            <Popup
              isOpen={isOpenPopup === POPUP_TYPES.NOTIFICATIONS}
              onClose={closePopup}
            >
              <NotificationWidget />
            </Popup>
            <Popup
              isOpen={isOpenPopup === POPUP_TYPES.PROFILE}
              onClose={closePopup}
            >
              <ProfilePopup onClose={closePopup} />
            </Popup>
            </div>
          </div>
        ) : (
          <div className={styles.buttonsWrapper}>
            <Button size={92} onClick={handleLogin}>
              Войти
            </Button>
            <Link to='/auth/register'>
              <Button size={208} colored>
                Зарегистрироваться
              </Button>
            </Link>
          </div>
        )}
      </div>

      <Popup
        isOpen={isOpenPopup === POPUP_TYPES.SKILLS}
        onClose={closePopup}
      >
        <SkillMenu />
      </Popup>

    </header>
  );
};