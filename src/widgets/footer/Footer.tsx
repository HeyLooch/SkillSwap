import { FC } from "react";
import { Link } from "react-router-dom";
import { Logo } from "../../shared/ui/logo/Logo";
import clsx from "clsx";
import styles from "./Footer.module.css";

export const Footer: FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <Logo />
          </Link>
        </div>
        <div className={styles.column}>
          <Link to="/about" className={clsx(styles.link, styles.marker)}>
            О проекте
          </Link>
          <a href="#" className={clsx(styles.link, styles.marker)}>
            Все навыки
          </a>
        </div>

        <div className={styles.column}>
          <a href="#" className={styles.link}>
            Контакты
          </a>
          <a href="#" className={styles.link}>
            Блог
          </a>
        </div>

        <div className={styles.column}>
          <a href="#" className={styles.link}>
            Политика конфиденциальности
          </a>
          <a href="#" className={styles.link}>
            Пользовательское соглашение
          </a>
        </div>
        <p className={styles.copyright}>SkillSwap — 2025</p>
      </div>
    </footer>
  );
};
