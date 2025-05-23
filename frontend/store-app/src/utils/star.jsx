import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

export const renderStars = (rating) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.5;
    const empty = 5 - full - (half ? 1 : 0);

    return (
        <span className="flex items-center gap-0.5 text-yellow-500 mt-4">
            {[...Array(full)].map((_, i) => <FaStar key={'f' + i} />)}
            {half && <FaStarHalfAlt />}
            {[...Array(empty)].map((_, i) => <FaRegStar key={'e' + i} />)}
        </span>
    );
};
