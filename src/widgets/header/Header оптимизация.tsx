// // ; Отлично! Давай перепишем твой Header и Layout так, чтобы мемоизация реально работала, минимизируя лишние ререндеры при изменении App. Основная идея:
// // ; Разделяем Header на логические части:
// // ; NavMenu (меню и ссылки)
// // ; RightSection (профиль, кнопки, уведомления)
// // ; SearchBar (можно оставить отдельно)
// // ; Меморизируем эти части через React.memo.
// // ; Колбэки оборачиваем в useCallback.
// // ; Используем useSelector с селекторами, возвращающими стабильные ссылки (или мемоизированные через reselect).

// // ; Пример переписанного header

// import { FC, useState, memo, useCallback, useEffect } from "react";
// import { Link } from "react-router-dom";
// import { useDispatch, useSelector } from "@store";
// import clsx from "clsx";

// import { Logo } from "../../shared/ui/logo/Logo";
// import { Button } from "../../shared/ui/button/Button";
// import { Icon } from "../../shared/ui/icon/Icon";
// import { getImageUrl } from "../../shared/lib/helpers";
// import { SearchBar } from "../../shared/ui/search-bar/SearchBar";
// import { Popup } from "../popup/Popup";
// import { SkillMenu } from "../SkillMenu/SkillMenu";
// import { NotificationWidget } from "../notification-widget/NotificationWidget";
// import { ProfilePopup } from "../profile-popup/ProfilePopup";

// import { getCurrentUser, setCurrentUser } from "../../services/user/user-slice";
// import { getRandomUsers } from "../../services/randomUsers/random-users-slice";
// import { setTextForSearch } from "../../services/filters/filters-slice";
// import { reloadFilteredUsers } from "../../services/filteredUsers/actions";

// import useDebounced from "../../shared/hooks/useDebounced";
// import styles from "./Header.module.css";

// export const POPUP_TYPES = {
//   SKILLS: "skills",
//   PROFILE: "profile",
//   NOTIFICATIONS: "notifications",
// } as const;

// export type PopupType = (typeof POPUP_TYPES)[keyof typeof POPUP_TYPES] | null;

// // ======================= NavMenu =========================
// interface NavMenuProps {
//   openPopup: PopupType;
//   togglePopup: (popup: PopupType) => void;
// }

// const NavMenu: FC<NavMenuProps> = memo(({ openPopup, togglePopup }) => (
//   <nav>
//     <ul className={styles.navList}>
//       <li className={styles.li}>
//         <Link to="/about" className={styles.link}>
//           О проекте
//         </Link>
//       </li>
//       <li className={styles.li}>
//         <button
//           className={clsx(styles.link, styles.dropButton)}
//           onClick={() => togglePopup(POPUP_TYPES.SKILLS)}
//         >
//           Все навыки
//           <Icon
//             name={openPopup === POPUP_TYPES.SKILLS ? "chevronUp" : "chevronDown"}
//             size="s"
//             className={styles.iconChevron}
//           />
//         </button>
//       </li>
//     </ul>
//   </nav>
// ));

// // ======================= RightSection =====================
// interface RightSectionProps {
//   currentUser: any;
//   randomUsers: any[];
//   openPopup: PopupType;
//   togglePopup: (popup: PopupType) => void;
//   handleLogin: () => void;
// }

// const RightSection: FC<RightSectionProps> = memo(
//   ({ currentUser, randomUsers, openPopup, togglePopup, handleLogin }) => {
//     const closePopup = useCallback(() => togglePopup(null), [togglePopup]);

//     if (!currentUser) {
//       return (
//         <div className={styles.buttonsWrapper}>
//           <Button size={92} onClick={handleLogin}>
//             Войти
//           </Button>
//           <Link to="/auth/register">
//             <Button size={208} colored>
//               Зарегистрироваться
//             </Button>
//           </Link>
//         </div>
//       );
//     }

//     return (
//       <div className={styles.rightSection}>
//         <button className={styles.moonButton}>
//           <Icon name="moon" size="s" />
//         </button>

//         <button
//           className={styles.notificationButton}
//           onClick={() => togglePopup(POPUP_TYPES.NOTIFICATIONS)}
//         >
//           <div className={styles.iconWrapper}>
//             <Icon name="notification" size={20} strokeWidth={5} />
//           </div>
//         </button>

//         <button className={styles.likeButton}>
//           <Icon name="like" size="s" />
//         </button>

//         <div
//           className={styles.userAuthWrapper}
//           onClick={() => togglePopup(POPUP_TYPES.PROFILE)}
//         >
//           <span className={styles.userName}>{currentUser.name}</span>
//           <img
//             src={getImageUrl(currentUser.photo)}
//             alt={currentUser.name}
//             className={styles.userAvatar}
//           />

//           <div className="popupWrapper">
//             <Popup
//               isOpen={openPopup === POPUP_TYPES.NOTIFICATIONS}
//               onClose={closePopup}
//             >
//               <NotificationWidget />
//             </Popup>
//             <Popup isOpen={openPopup === POPUP_TYPES.PROFILE} onClose={closePopup}>
//               <ProfilePopup onClose={closePopup} />
//             </Popup>
//           </div>
//         </div>
//       </div>
//     );
//   }
// );

// // ======================= Header ===========================
// export const Header: FC = memo(() => {
//   const dispatch = useDispatch();
//   const currentUser = useSelector(getCurrentUser);
//   const randomUsers = useSelector(getRandomUsers);
//   const currentTextForSearch = useSelector((state: any) => state.filters.text_for_search);

//   const [query, setQuery] = useState(currentTextForSearch || "");
//   const debounced = useDebounced(query, 1000);

//   const [openPopup, setOpenPopup] = useState<PopupType>(null);

//   const togglePopup = useCallback((popup: PopupType) => {
//     setOpenPopup(prev => (prev === popup ? null : popup));
//   }, []);

//   const handleLogin = useCallback(() => {
//     if (!randomUsers.length) return;
//     const randomUser = randomUsers[Math.floor(Math.random() * randomUsers.length)];
//     dispatch(setCurrentUser(randomUser));
//   }, [dispatch, randomUsers]);

//   // Дебаунс эффект поиска
//   useEffect(() => {
//     dispatch(setTextForSearch(debounced));
//     reloadFilteredUsers(1);
//   }, [debounced]);

//   return (
//     <header className={styles.header}>
//       <Link to="/">
//         <Logo />
//       </Link>

//       <NavMenu openPopup={openPopup} togglePopup={togglePopup} />

//       <SearchBar maxWidth={currentUser ? 648 : 527} value={query} onChange={setQuery} />

//       <RightSection
//         currentUser={currentUser}
//         randomUsers={randomUsers}
//         openPopup={openPopup}
//         togglePopup={togglePopup}
//         handleLogin={handleLogin}
//       />

//       <Popup isOpen={openPopup === POPUP_TYPES.SKILLS} onClose={() => setOpenPopup(null)}>
//         <SkillMenu />
//       </Popup>
//     </header>
//   );
// });

// // ; Преимущества этой структуры

// // ; Header сам теперь мемоизирован, но ререндеры зависят только от props (NavMenu, RightSection) и локального state.

// // ; NavMenu и RightSection мемоизированы отдельно → ререндерятся только при изменении конкретных props, а не всего Header.

// // ; Колбэки обёрнуты в useCallback → их ссылка стабильна, мемоизация работает.

// // ; Redux-селекторы уже возвращают стабильные объекты → лишние ререндеры минимизированы.