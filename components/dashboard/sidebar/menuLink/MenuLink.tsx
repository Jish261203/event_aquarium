import React from "react";
import styles from './menuLink.module.css'
import Link from "next/link";

const MenuLink = ({item}:any) => {
    return (
        <Link href={item.path} className={styles.container}>
            {item.icon}
            {item.title}
        </Link>
  );
};

export default MenuLink;
