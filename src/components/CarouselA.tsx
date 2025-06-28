import classNames from "classnames/bind";
import React, { useRef, useState } from "react";

import styles from "./CarouselA.module.scss";
import IconGreaterThan from "./UI/Icons/IconGreaterThan";
import IconLessThan from "./UI/Icons/IconLessThan";
const cx = classNames.bind(styles);

export const CarouselA = ({
  data,
  className,
}: {
  data: Array<{ src: string; alt?: string; link?: string }>;
  className?: string;
}) => {
  if (!data) {
    return <div></div>;
  }
  const [animationName, setAnimationName] = useState<
    "slideFromRight" | "slideFromLeft" | null
  >(null);
  const [slide, setSlide] = useState(0);
  const nextSlide = () => {
    setSlide(slide === data.length - 1 ? 0 : slide + 1);
  };

  const prevSlide = () => {
    setSlide(slide === 0 ? data.length - 1 : slide - 1);
  };

  return (
    <div className={cx("carousel", cx(className))}>
      <div className={cx("main")}>
        <div onClick={prevSlide} className={cx("arrow", "arrow-left")}>
          <div className={cx("icon", "less-than")}>
            <IconLessThan onClick={prevSlide} />
          </div>
        </div>

        <div className={cx("slides-frame")}>
          <div className={cx("slides-tape")}>
            <CarouselContent data={data} slide={slide} />
          </div>
        </div>

        <div onClick={nextSlide} className={cx("arrow", "arrow-right")}>
          <div className={cx("icon", "greater-than")}>
            <IconGreaterThan onClick={nextSlide} />
          </div>
        </div>
      </div>

      <div className={cx("dot-indicators")}>
        {data.map((_, idx) => {
          return (
            <button
              key={idx}
              className={cx(
                slide === idx
                  ? ["indicator", "current"]
                  : ["indicator", "indicator-inactive"]
              )}
              onClick={() => {
                return setSlide((prevIndex) => {
                  prevIndex < idx
                    ? setAnimationName("slideFromRight")
                    : setAnimationName("slideFromLeft");
                  return idx;
                });
              }}
            ></button>
          );
        })}
      </div>
    </div>
  );
};

function CarouselContent({ data, slide }:{
    data: Array<{ src: string; alt?: string; link?: string }>;
    slide: number;
}) {
  const canvasRef = useRef(null);

  return (
    <>
      {data.map((item, idx) => {
        const classes = [];
        let addedClass = "";

        if (slide == idx) addedClass = "active";
        if (slide < idx) addedClass = "is-right";
        if (slide > idx) addedClass = "is-left";
        if (slide == 0 && idx == data.length - 1) addedClass = "is-left";
        if (idx == 0 && slide == data.length - 1) addedClass = "is-right";
        if (Math.abs(slide - idx) % data.length > 1) classes.push("hidden");

        classes.push(addedClass);

        return (
          <div
            key={idx}
            className={cx("carousel-content", classes)}
            data-index={idx}
          >
            <canvas
              id="canvas"
              style={{ display: "none" }}
              ref={canvasRef}
            ></canvas>

            <div className={cx("image-content")}>
              <div className={cx("image-wrapper")}>
                <a href={item.link} target={item.link && "_blank"}>
                  <figure>
                    <img src={item.src} alt={item.alt ?? "Logo"} />
                  </figure>
                </a>
              </div>
            </div>
            <div className={cx("text-content")}></div>
          </div>
        );
      })}
    </>
  );
}

export default CarouselA;
