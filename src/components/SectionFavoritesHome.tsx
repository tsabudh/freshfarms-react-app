import classNames from "classnames/bind";
import React from "react";

import { useNavigate } from "react-router-dom";
import { CarouselA } from "./CarouselA";
import styles from "./SectionFavoritesHome.module.scss";
import SectionTag from "./SectionTag";
import { slides } from "../assets/data/carouselA.json";

import Button from "./UI/Button/Button";

const cx = classNames.bind(styles);

export default function SectionFavoritesHome() {
  const navigate = useNavigate();
  return (
    <section className={cx("favorites")}>
      <SectionTag text={"Favorites"} className={"amber"} />

      <div className={cx("content")}>
        <h2 className={cx("h2")}>What our customer love the most!</h2>

        <CarouselA data={slides} />

        <Button className="amber-01" onClick={() => navigate("/store")}>
          Visit Store
        </Button>
      </div>
    </section>
  );
}
