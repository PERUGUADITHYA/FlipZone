import React from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";

const StarRating = ({ rating, size = 16, total = 5 }) => {
  const stars = [];

  for (let i = 1; i <= total; i++) {
    if (rating >= i) {
      stars.push(<FaStar key={i} size={size} className="star full" />);
    } else if (rating >= i - 0.5) {
      stars.push(<FaStarHalfAlt key={i} size={size} className="star half" />);
    } else {
      stars.push(<FaRegStar key={i} size={size} className="star empty" />);
    }
  }

  return (
    <div className="starRatingContainer">
      {/* ⭐ VALUE FIRST */}
      <span className="ratingValueText">{rating.toFixed(1)}</span>

      {/* ⭐ STARS */}
      <div className="starWrap">{stars}</div>

      {/* ⭐ SCALE */}
      <span className="ratingScale">({total})</span>
    </div>
  );
};

export default StarRating;
