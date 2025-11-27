import React from "react";
import { RegistrationOnBoarding } from "../../features/onboarding/registrationBoard";
import { onBoarding } from "../../features/onboarding/registrationBoard";
import { AuthForm } from "../../features/auth/AuthForm";
import { RegistrationProgress } from "../../shared/ui/RegistrationProgress/RegistrationProgress";
import { Icon } from "../../shared/ui/icon/Icon";
import styles from "./RegistrationPages.module.css";
import { Link, useNavigate } from "react-router-dom";

interface RegistrationStep1Props {
  onContinue: (email: string, password: string) => void;
}

export const RegistrationStep1: React.FC<RegistrationStep1Props> = ({
  onContinue,
}) => {
  const navigate = useNavigate();
  return (
    <div className={styles.registrationPage}>
      <div className={styles.registrationHeader}>
        <Link to='/'>
          <div className={styles.logo}>
            <Icon name="logo" size={40} />
            <span>SkillSwap</span>
          </div>
        </Link>
        <button className={styles.closeButton} onClick={() => navigate(-1)}>
          Закрыть
          <Icon name="cross" size={24} />
        </button>
      </div>
      
      <div className={styles.progressSection}>
        <RegistrationProgress currentStep={1} totalSteps={3} />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.formSection}>
          <AuthForm onContinue={onContinue} />
        </div>

        <div className={styles.onboardingSection}>
          <RegistrationOnBoarding {...onBoarding[0]} />
        </div>
      </div>
    </div>
  );
};
