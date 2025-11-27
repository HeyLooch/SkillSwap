import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import {
  RegisterStep2,
  RegisterStep2Data,
} from "../../features/auth/RegisterStep2";
import { RegistrationOnBoarding } from "../../features/onboarding/registrationBoard";
import { onBoarding } from "../../features/onboarding/registrationBoard";
import { RegistrationProgress } from "../../shared/ui/RegistrationProgress/RegistrationProgress";
import { Icon } from "../../shared/ui/icon/Icon";
import styles from "./RegistrationPages.module.css";

interface RegistrationStep2Props {
  onBack: () => void;
  onContinue: (data: RegisterStep2Data) => void;
  initialData?: Partial<RegisterStep2Data>;
}

export const RegistrationStep2: React.FC<RegistrationStep2Props> = ({
  onBack,
  onContinue,
  initialData,
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
        <RegistrationProgress currentStep={2} totalSteps={3} />
      </div>

      <div className={styles.contentContainer}>
        <div className={styles.formSection}>
          <RegisterStep2
            onBack={onBack}
            onContinue={onContinue}
            initialData={initialData}
          />
        </div>

        <div className={styles.onboardingSection}>
          <RegistrationOnBoarding {...onBoarding[1]} />
        </div>
      </div>
    </div>
  );
};
