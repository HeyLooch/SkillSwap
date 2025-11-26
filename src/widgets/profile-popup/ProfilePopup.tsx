// src\widgets\profile-popup\ProfilePopup.tsx

import { useNavigate } from 'react-router-dom'
import { useDispatch } from '@store';
import { logoutThunk } from '../../services/user/actions';
import { clearOffersByMe } from '../../services/offers/offers-slice';
import { Icon } from '../../shared/ui/icon/Icon'
import styles from './ProfilePopup.module.css'

type ProfilePopupProps = {
  onClose: () => void;
};

export const ProfilePopup = ({ onClose }: ProfilePopupProps) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleClickProfile = () => {
    onClose();
    navigate("/profile");
  };

  const logout = () => {
    dispatch(logoutThunk());
    dispatch(clearOffersByMe());
    onClose();
    navigate("/");
  };

  return(
    <div className={styles.container}>
      <ul className={styles.content}>
        <li onClick={handleClickProfile}>
          <span>Личный кабинет</span>
        </li>
        <li className={styles.logoutContainer} onClick={logout}>
          <span>Выйти из аккаунта</span>
          <Icon name='logout'/>
        </li>
      </ul>
    </div>
  )
}