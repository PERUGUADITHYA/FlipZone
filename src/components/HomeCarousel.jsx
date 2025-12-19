import React, { useEffect, useState } from "react";

const HomeCarousel = () => {
  const [banners, setBanners] = useState([]);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    fetch("/data/banners.json")
      .then((res) => res.json())
      .then((data) => setBanners(data.topBanners))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (paused || banners.length === 0) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % banners.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [paused, banners]);

  const prev = () => setIndex(index === 0 ? banners.length - 1 : index - 1);

  const next = () => setIndex((index + 1) % banners.length);

  return (
    <div
      className="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {banners.map((b, i) => (
        <div
          key={b.id}
          className={`carouselSlide ${i === index ? "active" : ""}`}
          style={{ backgroundImage: `url(${b.image})` }}
        >
          <div className="carouselOverlay" />

          <div className="carouselText">
            <span className="bannerTag">{b.tag}</span>
            <h2>{b.title}</h2>
            <p>{b.subtitle}</p>
            <button className="bannerBtn">{b.cta}</button>
          </div>
        </div>
      ))}

      {/* Navigation */}
      <button className="arrow left" onClick={prev}>
        ‹
      </button>
      <button className="arrow right" onClick={next}>
        ›
      </button>

      {/* Dots */}
      <div className="dots">
        {banners.map((_, i) => (
          <span
            key={i}
            className={`dot ${i === index ? "active" : ""}`}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeCarousel;
