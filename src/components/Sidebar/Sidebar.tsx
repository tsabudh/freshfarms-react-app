import React, { useContext, useState } from "react";
import { IoMenuSharp } from "react-icons/io5";

import { NavLink } from "react-router-dom";
import type { SidebarMenuItem } from "types/sidebar.type";
import styles from "./Sidebar.module.scss";
import SidebarItem from "./SidebarItem";
import items from "../../assets/data/sidebar.json";
import { AuthContext } from "../../context/AuthContext";

import Logo from "../UI/Icons/Logo";

export default function Sidebar({
  sidebarIsOpen,
  setSidebarIsOpen,
}: {
  sidebarIsOpen: boolean;
  setSidebarIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [expanded, setExpanded] = useState<number | string | null>(null);

  const { userRole } = useContext(AuthContext);

  const handleToggle = (_e?: React.MouseEvent) => {
    setSidebarIsOpen((prev) => !prev);
  };

  const handleExpand = (id: number) => {
    if (id === expanded) {
      setExpanded("nothing");
    } else {
      setExpanded(id);
    }
  };

  return (
    <div
      className={`${styles.sidebar}  ${
        sidebarIsOpen ? styles["sidebar--opened"] : styles["sidebar--closed"]
      }`}
    >
      <div className={styles["header"]}>
        <div
          className={styles["hamburger"]}
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          onKeyDown={(e: React.KeyboardEvent) => {
            if (e.key === "Enter" || e.key === " ") {
              handleToggle();
            }
          }}
        >
          <IoMenuSharp />
        </div>
        <figure className={styles["logo"]}>
          <NavLink to="/">
            <Logo />
          </NavLink>
        </figure>
      </div>

      {items.map((item, index) => {
        if (userRole == "customer" && item.adminOnly) return null;
        return (
          <SidebarItem
            key={index}
            item={item as SidebarMenuItem}
            id={index}
            // setExpanded={setExpanded}
            handleExpand={handleExpand}
            expanded={expanded as string}
          />
        );
      })}
    </div>
  );
}
