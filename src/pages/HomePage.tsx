// src\pages\HomePage.tsx

// External libs
import { useState } from 'react';
import { useSelector } from 'react-redux';

// Store
import { RootState, useDispatch } from '@store';

// Services (slices & actions)
import { getPopularUsersThunk } from '../services/popularUsers/actions';
import { getCreatedAtUsersThunk } from '../services/createdAtUsers/actions';
import { getRandomUsersThunk } from '../services/randomUsers/actions';
import { reloadFilteredUsers } from '../services/filteredUsers/actions';
import { resetFilteredUsers } from '../services/filteredUsers/filtered-users-slice';
import {
  isFiltersEmpty,
  resetFilters,
  setGender,
  setPlaces,
  setSkillType,
  setSubcategories,
} from '../services/filters/filters-slice';

// Types
import { GENDERS, TGender } from '@api/types';
import { SKILL_TYPES, TSkillType } from '../shared/types/filters';

// Features
import { FilterSection } from '@features';
import { SkillFilters } from '../features/filters/SkillFilters';
import { FiltersContainer } from '../features/filters/FiltersContainer';
import { ActiveFiltersBar } from '../features/filters/ActiveFiltersBar';

// Widgets
import { GridList } from '@widgets';
import { CardShowcase, SHOWCASE_TITLES } from '../widgets/cardShowcase/CardShowcase';

// Shared
import { Icon } from '../shared/ui/icon/Icon';

// Styles
import styles from './HomePage.module.css';

export const HomePage = () => {
  const dispatch = useDispatch();

  // -------------------- State одной кнопки --------------------
  const [showAllCategory, setShowAllCategory] = useState<'popular' | 'createdAt' | 'random' | null>(null);

  // популярные пользователи
  const { users: popularUsers, isLoading: isPopularLoading, hasMore: hasMorePopular, page: popularPage } =
    useSelector((state: RootState) => state.popularUsers);

  const handleLoadMorePopularUsers = () => {
    if (!isPopularLoading && hasMorePopular) {
      dispatch(getPopularUsersThunk(popularPage + 1));
    }
  };

  // *************************************************
  // по created_at
  const { 
    users: createdAtUsers,
    isLoading: isCreatedAtLoading,
    hasMore: hasMoreCreatedAt,
    page: createdAtPage 
  } = useSelector((state: RootState) => state.createdAtUsers);

  const handleLoadMoreCreatedAtUsers = () => {
    if (!isCreatedAtLoading && hasMoreCreatedAt) {
      dispatch(getCreatedAtUsersThunk(createdAtPage + 1));
    }
  };

  // *************************************************
  // случайные пользователи
  const {
    users: randomUsers,
    isLoading: isRandomLoading,
    hasMore: hasMoreRandom,
    page: randomPage 
  } = useSelector((state: RootState) => state.randomUsers);

  const handleLoadMoreRandomUsers = () => {
    if (!isRandomLoading && hasMoreRandom) {
      dispatch(getRandomUsersThunk(randomPage + 1));
    }
  };

  // *************************************************
  // отфильтрованные пользователи
  const filters = useSelector((state: RootState) => state.filters);
  const selectedGender = useSelector((state: RootState) => state.filters.gender);
  const selectedPlaces = useSelector((state: RootState) => state.filters.places);
  const selectedSubcategories = useSelector((state: RootState) => state.filters.subcategories);
  const selectedSkillType = useSelector((state: RootState) => state.filters.skillType);

  const { 
    users: filteredUsers,
    isLoading: isFilteredLoading,
    hasMore: hasMoreFiltered,
    page: filteredPage 
  } = useSelector((state: RootState) => state.filteredUsers);

  const handleLoadMoreFilteredUsers = () => {
    if (!isFilteredLoading && hasMoreFiltered) {
      reloadFilteredUsers(filteredPage + 1);
    }
  };

  // -------------------- Категории и сабкатегории --------------------
  const categories = useSelector((s: RootState) => s.categories.categories);
  const subCategories = useSelector((s: RootState) => s.categories.subcategories);

  // -------------------- Фильтры --------------------
  const handleSubcategoryToggle = (id: number) => {
    const updated = selectedSubcategories.includes(id)
      ? selectedSubcategories.filter(x => x !== id)
      : [...selectedSubcategories, id];
    dispatch(setSubcategories(updated));
    reloadFilteredUsers();
  };

  const handleGenderChange = (gender: TGender) => {
    dispatch(setGender(gender));
    reloadFilteredUsers();
  };

  const handlePlacesChange = (places: string[]) => {
    dispatch(setPlaces(places));
    reloadFilteredUsers();
  };

  const handleSkillTypeChange = (newType: TSkillType) => {
    dispatch(setSkillType(newType));
    reloadFilteredUsers();
  };

  const handleResetAll = () => {
    dispatch(resetFilters());
    dispatch(resetFilteredUsers());
    setShowAllCategory(null);
  };

  const hasActiveFilters =
    filters.skillType !== SKILL_TYPES.ALL ||
    filters.subcategories.length > 0 ||
    filters.gender !== GENDERS.UNSPECIFIED ||
    filters.places.length > 0;

  // -------------------- Рендер --------------------
  return (
    <div className={styles.homePageWrapper}>

      <div className={styles.filterSectionWrapper}>
        <FiltersContainer
          title="Фильтры"
          onReset={hasActiveFilters ? handleResetAll : undefined}
        >
          <SkillFilters
            onSkillTypeChange={handleSkillTypeChange}
            selectedSkillType={selectedSkillType}
            categories={categories}
            subcategories={subCategories}
            selectedSubcategories={selectedSubcategories}
            onSubcategoryToggle={handleSubcategoryToggle}
          />
          <FilterSection
            onGenderChange={handleGenderChange}
            onPlacesChange={handlePlacesChange}
            selectedGender={selectedGender}
            selectedPlaces={selectedPlaces}
          />
        </FiltersContainer>

        <div className={styles.showCaseWrapper}>
          <ActiveFiltersBar
            selectedSkillType={selectedSkillType}
            selectedGender={selectedGender}
            selectedPlaces={selectedPlaces}
            selectedSubcategories={selectedSubcategories}
            onSkillTypeChange={handleSkillTypeChange}
            onChangeGender={handleGenderChange}
            onChangePlaces={handlePlacesChange}
            onSubcategoryToggle={handleSubcategoryToggle}
          />

          {isFiltersEmpty(filters) ? (
            <>
              <CardShowcase
                title={SHOWCASE_TITLES.POPULAR}
                buttonTitle={showAllCategory === 'popular' ? 'Свернуть' : 'Смотреть все'}
                icon={<Icon name="chevronRight" />}
                onButtonClick={() =>
                  setShowAllCategory(showAllCategory === 'popular' ? null : 'popular')
                }
              >
                <GridList
                  rows={showAllCategory === 'popular' ? 'auto' : 1}
                  users={popularUsers}
                  loading={isPopularLoading}
                  hasMore={hasMorePopular}
                  onLoadMore={() => handleLoadMorePopularUsers()}
                />
              </CardShowcase>

              <CardShowcase
                title={SHOWCASE_TITLES.NEW}
                buttonTitle={showAllCategory === 'createdAt' ? 'Свернуть' : 'Смотреть все'}
                icon={<Icon name="chevronRight" />}
                onButtonClick={() =>
                  setShowAllCategory(showAllCategory === 'createdAt' ? null : 'createdAt')
                }
              >
                <GridList
                  rows={showAllCategory === 'createdAt' ? 'auto' : 1}
                  users={createdAtUsers}
                  loading={isCreatedAtLoading}
                  hasMore={hasMoreCreatedAt}
                  onLoadMore={() => handleLoadMoreCreatedAtUsers()}
                />
              </CardShowcase>

              <CardShowcase
                title={SHOWCASE_TITLES.RECOMMEND}
                buttonTitle={showAllCategory === 'random' ? 'Свернуть' : 'Смотреть все'}
                icon={<Icon name="chevronRight" />}
                onButtonClick={() =>
                  setShowAllCategory(showAllCategory === 'random' ? null : 'random')
                }
              >
                <GridList
                  rows={showAllCategory === 'random' ? 'auto' : 1}
                  users={randomUsers}
                  loading={isRandomLoading}
                  hasMore={hasMoreRandom}
                  onLoadMore={() => handleLoadMoreRandomUsers()}
                />
              </CardShowcase>
            </>
          ) : (
            <CardShowcase
              title={SHOWCASE_TITLES.MATCHING}
              buttonTitle="Сначала новые"
              icon={<Icon name="sort" />}
              isIconFirst
            >
              <GridList
                users={filteredUsers}
                loading={isFilteredLoading}
                hasMore={hasMoreFiltered}
                onLoadMore={() => handleLoadMoreFilteredUsers()}
              />
            </CardShowcase>
          )}
        </div>
      </div>
    </div>
  );
};
