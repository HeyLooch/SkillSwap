import React, { useState } from "react";
import { RegistrationStep1 } from "../../pages/registration/RegistrationStep1";
import { RegistrationStep2 } from "../../pages/registration/RegistrationStep2";
import { RegistrationStep3 } from "../../pages/registration/RegistrationStep3";
import { RegisterStep2Data } from "../auth/RegisterStep2";
import { SkillFormData } from "../../widgets/skillForm/SkillForm";
import { Modal } from "../../shared/ui/modal/Modal";
import { SkillCardDetails } from "../skills/skillCardDetails/skillCardDetails";
import { useDispatch, useSelector } from "@store";
import { getCurrentUser, setCurrentUser } from "../../services/user/user-slice";
import { TGender, TUser } from "@api/types";
import { getCurrentDateTimeString } from "../../shared/lib/helpers";
import { getCategories, getSubcategories } from "../../services/categories/categories-slice";
import { clearOffersByMe } from "../../services/offers/offers-slice";
import { getOfferUser } from "../../services/users/users-slice";
import { addOfferThunk } from "../../services/offers/actions";

export const RegistrationFlow: React.FC = () => {
  const dispatch = useDispatch();

  const currentUser = useSelector(getCurrentUser);
  const offerUser = useSelector(getOfferUser);
  const categories = useSelector(getCategories);
  const subcategories = useSelector(getSubcategories);

  const [currentStep, setCurrentStep] = useState(1);
  const [step1Data, setStep1Data] = useState({ email: "", password: "" });
  const [step2Data, setStep2Data] = useState<Partial<RegisterStep2Data>>({});
  const [step3Data, setStep3Data] = useState<SkillFormData | null>(null);

  const [isSkillCardModalOpen, setSkillCardModalOpen] = useState(false);

  const setCurrentUserHandle = () => {
    const curUser: TUser = {
      id: 777,
      name: step2Data.name || '',
      gender: step2Data.gender as TGender,
      photo: step2Data.avatar ?? '',
      from: step2Data.city || '',
      skill: step3Data?.skillName || '',
      need_subcat: [],
      cat_text: step2Data?.selectedCategories?.join(", ") || "",
      sub_text: step2Data?.selectedSubcategories?.join(", ") || "",
      categoryId: Number(categories.find((i) => i.name === step2Data.selectedCategories?.join())),
      subCategoryId: Number(subcategories.find((i) => i.name === step2Data.selectedSubcategories?.join())),
      description: step3Data?.description || '',
      images:  step3Data?.imageFile ? [URL.createObjectURL(step3Data.imageFile)] : [],
      birthdate:  step2Data.birthdate ? step2Data.birthdate.toISOString() : '',
      email: step1Data.email || '',
      created_at: getCurrentDateTimeString(),
      about: '',
      likedByMe: false,
      random: Math.random()*1000
    }

    dispatch(setCurrentUser(curUser))
  }

  const handleStep1Continue = (email: string, password: string) => {
    setStep1Data({ email, password });
    setCurrentStep(2);
  };

  const handleStep2Continue = (data: RegisterStep2Data) => {
    setStep2Data(data);
    setCurrentStep(3);
  };

  const handleStep3Complete = (data: SkillFormData) => {
    setStep3Data(data);
    setCurrentUserHandle();
    dispatch(clearOffersByMe())
    setSkillCardModalOpen(true);
    console.log("Данные регистрации:", { step1Data, step2Data, step3Data: data });
  };

  const handleCloseSkillCardModal = () => {
    setSkillCardModalOpen(false);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RegistrationStep1 onContinue={handleStep1Continue} />;
      case 2:
        return (
          <RegistrationStep2
            onBack={handleBack}
            onContinue={handleStep2Continue}
            initialData={step2Data}
          />
        );
      case 3:
        return <RegistrationStep3 onBack={handleBack} onComplete={handleStep3Complete} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div>{renderStep()}</div>

      {step3Data && (
        <Modal
          isOpen={isSkillCardModalOpen}
          onClose={handleCloseSkillCardModal}
        >
          <SkillCardDetails 
            checkEdit
            title={step3Data.skillName}
            subtitle={step3Data.skillName}
            description={step3Data.description}
            onExchange={()=> {
              if (offerUser && currentUser) {
                    dispatch(addOfferThunk({
                      offerUserId: offerUser.id,
                      skillOwnerId: currentUser.subCategoryId
                    }));
                  }
            }}
           />
        </Modal>
      )}
    </>
  );
};

