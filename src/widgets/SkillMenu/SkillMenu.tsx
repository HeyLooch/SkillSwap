import { SkillMenuCategories } from './skillMenuCategory/SkillMenuCategory';
import { useSelector } from '@store';
import { getCategories, getSubcategories, getLoadingCatSubcat } from '../../services/categories/categories-slice';
import { Loader } from '../../shared/ui/loader/Loader';
import styles from './SkillMenu.module.css';

export const SkillMenu = () => {
  const categories = useSelector(getCategories);
  const subcategories = useSelector(getSubcategories);
  const isLoadingCatSubcat = useSelector(getLoadingCatSubcat);

  if (isLoadingCatSubcat) {
    return (
      <div className={styles.loaderContainer}>
        <Loader />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <SkillMenuCategories 
        categories={categories}
        subcategories={subcategories}
      />
    </div>
  );
};

