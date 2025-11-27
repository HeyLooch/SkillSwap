// src\pages\Offer\OfferPage.tsx

import { useNavigate } from 'react-router-dom';
import { useDispatch } from '@store';
import { useSelector } from '@store';
import { UserCard } from '../../features/users/userCard/UserCard';
import { Icon } from '../../shared/ui/icon/Icon';
import { CardShowcase } from '../../widgets/cardShowcase/CardShowcase';
import { CardSlider } from '@widgets';
import { SkillCardDetails } from '../../features/skills/skillCardDetails/skillCardDetails';
import { getOfferUser, getUsers } from '../../services/users/users-slice';
import { Loader } from '../../shared/ui/loader/Loader';
import { getCurrentUser } from '../../services/user/user-slice';
import { addOfferThunk } from '../../services/offers/actions';
import { getOffersByMe } from '../../services/offers/offers-slice';

import styles from './OfferPage.module.css';

export const OfferPage: React.FC = () => {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const users = useSelector(getUsers);
  const currentUser = useSelector(getCurrentUser);
  const offerUser = useSelector(getOfferUser);
  const offersByMe = useSelector(getOffersByMe);
  const isOffered = offersByMe.includes(offerUser?.id as number);

   const handleExchange = () => {
    if (!currentUser || !offerUser) {
      navigate('/auth/register');
    }
    if (!isOffered && offerUser && currentUser?.subCategoryId) {
      dispatch(addOfferThunk({
        offerUserId: offerUser.id,
        skillOwnerId: currentUser.subCategoryId,
      }));
    }
  };

  if (!offerUser) {
    return <Loader />;
  }

  if (offerUser?.id === currentUser?.id) {
    return (
      <>
      <SkillCardDetails 
        checkEdit
        title={currentUser.skill}
        subtitle={currentUser.cat_text}
        description={currentUser.description}
        images={offerUser.images || ""}
      />
      <section>
        <CardShowcase
          title="Похожие предложения"
          titleSize='1.5em'
          icon={<Icon name="chevronRight" />}>
            <CardSlider users={users}/>
        </CardShowcase>
      </section>
      </>
    )
  }

  return (
    <>
      <section className={styles.skillSection}>
        <div className={styles.userCard}>
          {offerUser && (
            <UserCard
              needAbout
              user={offerUser}
            />
          )}
        </div>
        {offerUser && (
          <SkillCardDetails
          title={offerUser.skill || "Навык не указан"}
          subtitle={`${offerUser.cat_text || ""} / ${offerUser.sub_text || ""}`}
          description={offerUser.description || "Описание отсутствует"}
          images={offerUser.images || ""}
          buttonText={"Предложить обмен"}
          onExchange={handleExchange}
          isOffered={isOffered}
          />)
        }
      </section>

      {!users && (
        <Loader />
      )}

     <section>
        <CardShowcase
          title="Похожие предложения"
          titleSize='1.5em'
          icon={<Icon name="chevronRight" />}>
            <CardSlider users={users}/>
        </CardShowcase>
      </section>
    </>
  )
};
