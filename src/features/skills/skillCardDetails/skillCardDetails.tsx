import clsx from "clsx";
import { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "../../../services/store";
import { getCurrentUser } from "../../../services/user/user-slice";
import { getOfferUser } from "../../../services/users/users-slice";
import { Gallery } from "../../../shared/ui/gallery/Gallery";
import { useExchangeNotification } from "../../../shared/ui/notification/useExchangeNotification";
import { ExchangeNotification } from "../../../shared/ui/notification/ExchangeNotification";
import { Icon } from "../../../shared/ui/icon/Icon";
import { Button } from "../../../shared/ui/button/Button";
import photoPlaceholder from "../../../shared/assets/images/school-board.svg?.svg";
import styles from './skillCardDetails.module.css';

type SkillCardDetailsProps = {
  isOffered?: boolean; //true если уже заключали этот оффер
  checkEdit?: boolean;
  title: string;
  subtitle: string;
  description: string;
  images?: string[];
  buttonText?: string;
  onExchange?: () => void;
};

export const SkillCardDetails: FC<SkillCardDetailsProps> = ({
  isOffered,
  checkEdit,
  title,
  subtitle,
  description,
  images = [],
  buttonText = "Предложить обмен",
  onExchange,
}) => {
  const navigate = useNavigate();

  const { isNotificationOpen, openNotification, closeNotification } = useExchangeNotification();

  // Получаем пользователя из Redux
  const currentUser = useSelector(getCurrentUser);
  const offerUser = useSelector(getOfferUser);
  const isUserLoggedIn = !!currentUser;

  // Клик по кнопке обмена
  const handleExchangeClick = () => {    
    onExchange?.();
    if (isUserLoggedIn && currentUser?.id !== offerUser?.id ) {
      openNotification({
        type: "info",
        title: "Ваше предложение создано",
        message: "Теперь вы можете предложить обмен",
        buttonText: "Готово",
      });
    }
  };

  // Хендлеры кнопок
  const likeHandle = () => console.log("Liked!");
  const shareHandle = () => console.log("Shared!");
  const moreHandle = () => console.log("More...");
  const editHandle = () => console.log("Edit...");

  // ----------------- Рендер без кнопки редактирования -----------------
  if (!checkEdit) {
    return (
      <>
        <div className={styles.skillCard}>

        <div className={styles.iconsBar}>
          <button className={styles.buttonIcon} onClick={likeHandle}>
            <Icon name="like" />
          </button>
          <button className={styles.buttonIcon} onClick={shareHandle}>
            <Icon name="share" />
          </button>
          <button className={styles.buttonIcon} onClick={moreHandle}>
            <Icon name="more" />
          </button>
        </div>

        <div className={styles.mainSection}>

          <div className={styles.leftSection}>
            <div className={styles.info}>
              <h2 className={styles.title}>{title}</h2>
              <h3 className={styles.subtitle}>{subtitle}</h3>
              <p className={styles.description}>{description}</p>
            </div>
              {!isOffered && (
                <Button className={styles.buttonOffer}
                  colored
                  onClick={handleExchangeClick}
                >
                  {buttonText}
                </Button>
              )}
              {isOffered && !currentUser && (
                <Button
                  className={(styles.buttonOffer, styles.buttonOffer)}
                  onClick={handleExchangeClick}
              >
                  <Icon name='clock'/> {buttonText}
              </Button>
              )}
              {isOffered && currentUser && (
                <Button
                  className={(styles.buttonOffer, styles.buttonOfferReady)}
              >
                  <Icon name='clock'/> Обмен предложен
              </Button>
              )}
          </div>
          
          <div className={styles.rightSection}>
            {images && (
              <Gallery images={images} placeholder={photoPlaceholder} />
            )}
          </div>
          
          </div>
        </div>

        <ExchangeNotification
          isOpen={isNotificationOpen}
          onClose={closeNotification}
          type="info"
          title="Ваше предложение создано"
          message="Теперь вы можете предложить обмен"
          buttonText="Готово"
        />
      </>
    );
  }

  // ----------------- Рендер с кнопкой редактирования -----------------
  return (
    <>
      <div className={styles.skillCard} style={{ padding: '2.75em 3.75em 4.5em' }}>
        <div className={styles.headSection}>
          <h3 className={styles.headTitle}>Ваше предложение</h3>
          <p className={styles.headText}>
            Пожалуйста, проверьте и подтвердите правильность данных
          </p>
        </div>

        <div className={styles.mainSection}>
          <div className={clsx(styles.leftSection, styles.leftSectionEdit)}>
            <div className={styles.info}>
              <h2 className={styles.title}>{title}</h2>
              <h3 className={styles.subtitle}>{subtitle}</h3>
              <p className={styles.description}>{description}</p>
            </div>
            <div className={styles.buttonsContainer}>
              <Button className={styles.buttonEdit} onClick={editHandle}>
                Редактировать <Icon name="edit" />
              </Button>
              <Button colored onClick={handleExchangeClick}>
                Готово
              </Button>
            </div>
          </div>

          <div className={styles.rightSection}>
            {images && <Gallery images={images} placeholder={photoPlaceholder} />}
          </div>
        </div>

        <ExchangeNotification
          isOpen={isNotificationOpen}
          onClose={() => {
            closeNotification();
            navigate(`/skills/${currentUser?.id}`)
          }}
          type="info"
          title="Ваше предложение создано"
          message="Теперь вы можете предложить обмен"
          buttonText="Готово"
        />
      </div>
    </>
  );
};