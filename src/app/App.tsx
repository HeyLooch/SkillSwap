// src/app/App.tsx

import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import {
  DropdownDemo,
  DropdownGroupedDemo,
  Footer,
  GridList,
  Header,
  SkillForm,
} from "@widgets";

import { ServerErrorPage } from "../pages/server-error-page/ServerErrorPage";
import { NotFoundPage } from "../pages/not-found-page/NotFoundPage";

//То, что есть
import { HomePage } from "../pages/HomePage";
import { ProfilePage } from "../pages/profile/ProfilePage";

// Страницы регистрации
import { RegistrationStep1 } from "../pages/registration/RegistrationStep1";
import { RegistrationStep2 } from "../pages/registration/RegistrationStep2";
import { RegistrationStep3 } from "../pages/registration/RegistrationStep3";

//Данные/типы/стор (для каталога)
import { RootState, useDispatch } from "@store";
import { useSelector } from "@store";
import { AuthForm, FilterSection } from "@features";

import { getPlacesThunk } from "../services/places/actions";
import { getCategoriesThunk } from "../services/categories/actions";
import { getUserLikesThunk } from "../services/user/actions";

import { OfferPage } from "../pages/Offer/OfferPage";
import { getPopularUsersThunk } from "../services/popularUsers/actions";

import { ScrollToTop } from "../features/scrollToTop/ScrollToTop";

import { getCreatedAtUsersThunk } from "../services/createdAtUsers/actions";
import { getRandomUsersThunk } from "../services/randomUsers/actions";

import { About } from "../pages/about/About";
// import { getFilteredUsersThunk } from "../services/filteredUsers/actions";
import { GENDERS, TGender } from "@api/types";
import { getOffersThunk } from "../services/offers/actions";
import { getOffers } from "../services/offers/offers-slice";
import { getUsersThunk } from "../services/users/actions";
import { RegistrationFlow } from "../features/registration/RegistrationFlow";

import styles from "./App.module.css";

export const App: React.FC = () => {
  const dispatch = useDispatch();
  // const API_USER_ID = Number(import.meta.env.VITE_AUTH_USER_ID);

  // Подгружаем данные при старте
    useEffect(() => {
    dispatch(getOffersThunk()); //подгружаем все офферы

    dispatch(getUsersThunk(1));
    dispatch(getPopularUsersThunk(1));
    dispatch(getCreatedAtUsersThunk(1));
    dispatch(getRandomUsersThunk(1));

    dispatch(getPlacesThunk());
    dispatch(getCategoriesThunk());
  }, [dispatch]);

  const currentUser = useSelector((s: RootState) => s.user.user);
  const offers = useSelector(getOffers);

  // лайки грузятся при смене пользователя
  useEffect(() => {
    if (currentUser) {
      dispatch(getUserLikesThunk(currentUser.id));
    }
  }, [currentUser, offers]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
          <Route path="auth/register" element={<RegistrationFlow />} />
        <Route element={<Layout />}>
          {/*То, что есть*/}
          <Route index element={<HomePage />} />
          <Route path="skills" element={<CatalogContent />} />
          <Route path="auth/login" element={<LoginContent />} />
          <Route path="skill/new" element={<SkillFormContent />} />
          <Route path="skills/:id" element={<OfferPage />} />
          <Route path="demo/dropdowns" element={<DropdownsDemoContent />} />
          <Route path="about" element={<About />} />

          {/* Страницы регистрации */}
          <Route
            path="registration/step1"
            element={
              <RegistrationStep1
                onContinue={(email, password) => {
                  console.log("Step 1 data:", email, password);
                  window.location.href = "/registration/step2";
                }}
              />
            }
          />
          <Route
            path="registration/step2"
            element={
              <RegistrationStep2
                onBack={() => (window.location.href = "/registration/step1")}
                onContinue={(data) => {
                  console.log("Step 2 data:", data);
                  window.location.href = "/registration/step3";
                }}
              />
            }
          />
          <Route
            path="registration/step3"
            element={
              <RegistrationStep3
                onBack={() => (window.location.href = "/registration/step2")}
                onComplete={() => (window.location.href = "/")}
              />
            }
          />

          {/*заглушки*/}
          <Route path="favorites" element={<FavoritesPageStub />} />
          <Route path="requests" element={<RequestsPageStub />} />

          {/* ПРОФИЛЬ */}
          <Route path="profile">
            <Route index element={<ProfilePage />} />
            {/* Все подразделы профиля ведут на 404 */}
            <Route path="notifications" element={<NotFoundPage />} />
            <Route path="requests" element={<NotFoundPage />} />
            <Route path="exchanges" element={<NotFoundPage />} />
            <Route path="favorites" element={<NotFoundPage />} />
            <Route path="skills" element={<NotFoundPage />} />
          </Route>

          {/* Системные */}
          <Route path="500" element={<ServerErrorPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

//Общий Layout (для всех КРОМЕ главной), чтобы не дублировать везде хедер и футер
const Layout: React.FC = () => (
  <div className="layout">
    <Header />
    <main className={styles.main}>
      <Outlet />
    </main>
    <Footer />
  </div>
);

//Каталог (FilterSection + GridList)
const CatalogContent: React.FC = () => {
  const users = useSelector((s: RootState) => s.users.users);

  const [selectedGender, setSelectedGender] = React.useState<TGender>(
    GENDERS.UNSPECIFIED
  );
  const [selectedPlaces, setSelectedPlaces] = React.useState<string[]>([]);

  return (
    <section className="page page-catalog">
      <FilterSection
        onGenderChange={setSelectedGender}
        onPlacesChange={setSelectedPlaces}
        selectedGender={selectedGender}
        selectedPlaces={selectedPlaces}
      />
      <GridList
        users={users}
        // subCategories={subCategories}
        loading={false}
        hasMore={false}
        onLoadMore={() => {}}
      />
    </section>
  );
};

//Логин — AuthForm
const LoginContent: React.FC = () => (
  <section className="page page-auth">
    <AuthForm
      onContinue={(email, password) => {
        console.log("Email:", email, "Password:", password);
      }}
    />
  </section>
);

//Форма навыка
const SkillFormContent: React.FC = () => (
  <section className="page page-skillform">
    <SkillForm
      onBack={() => console.log("Back")}
      onContinue={() => console.log("Continue")}
    />
  </section>
);

//Демо: дропдауны
const DropdownsDemoContent: React.FC = () => (
  <section className="page page-dropdowns">
    <h2>Вариант Dropdown 1</h2>
    <DropdownDemo />
    <h2>Вариант Dropdown 2</h2>
    <DropdownGroupedDemo />
  </section>
);

// /favorites
const FavoritesPageStub: React.FC = () => (
  <section className="page page-favorites">
    <h1>Избранное</h1>
    <p>Страница в разработке.</p>
  </section>
);

// /requests
const RequestsPageStub: React.FC = () => (
  <section className="page page-requests">
    <h1>Заявки</h1>
    <p>Страница в разработке.</p>
  </section>
);

export default App;
