'use client';

import { FaStar, FaStarHalfAlt } from 'react-icons/fa';
import Button from '@/components/common/buttons/Button';
import SimpleInput from '@/components/common/forms/SimpleInput';
import SimpleTextarea from '@/components/common/forms/SimpleTextarea';
import styles from '@/styles/travelspots/ReviewSection.module.css';

const ReviewSection = ({ reviews, averageRating, totalReviews }) => {
    return (
        <div className={styles.reviewsTab}>
            <div className={styles.reviewsHeader}>
                <h3>Visitor Reviews</h3>
                <div className={styles.averageRating}>
                    <FaStar /> {averageRating}/5 ({totalReviews.toLocaleString()} reviews)
                </div>
            </div>

            {/* Write Review Form */}
            <div className={styles.writeReview}>
                <h4 className={styles.writeReviewTitle}>Write a Review</h4>
                <div className={styles.ratingInput}>
                    <span className={styles.ratingLabel}>Your Rating:</span>
                    <div className={styles.stars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button key={star} className={styles.starButton}>
                                <FaStar />
                            </button>
                        ))}
                    </div>
                </div>
                <SimpleInput
                    name="reviewer_name"
                    placeholder="Your Name"
                    size="md"
                    className={styles.reviewNameInput}
                />
                <SimpleTextarea
                    name="review_comment"
                    placeholder="Share your experience..."
                    rows={4}
                    size="md"
                    className={styles.reviewTextarea}
                />
                <Button variant="primary" size="md">
                    Submit Review
                </Button>
            </div>

            {/* Reviews List */}
            <div className={styles.reviewsList}>
                {reviews.map(review => (
                    <div key={review.id} className={styles.reviewCard}>
                        <div className={styles.reviewHeader}>
                            <div className={styles.reviewAuthor}>
                                <div className={styles.authorAvatar}>{review.author.charAt(0)}</div>
                                <div className={styles.authorInfo}>
                                    <div className={styles.authorName}>{review.author}</div>
                                    <div className={styles.reviewDate}>{review.date}</div>
                                </div>
                            </div>
                            <div className={styles.reviewRating}>
                                {[...Array(5)].map((_, i) => {
                                    if (i < Math.floor(review.rating)) return <FaStar key={i} />;
                                    if (i === Math.floor(review.rating) && review.rating % 1 !== 0) return <FaStarHalfAlt key={i} />;
                                    return <FaStar key={i} className={styles.emptyStar} />;
                                })}
                                <span className={styles.ratingValue}>{review.rating}/5</span>
                            </div>
                        </div>
                        <p className={styles.reviewComment}>{review.comment}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReviewSection;