import React from 'react';
import ProductReviewCard from '../cards/ProductReviewCard';
import AddReview from '../forms/AddReview';
import { useSelector } from 'react-redux';

const ProductReviews = () => {

  const reviews = useSelector(state => state.product.reviews);
  console.log(reviews)
  const productName = useSelector(state => state.product.productName);

  return (
    <div className="productreviews">
      { reviews.length !== 0 ? 
        <div className="review-cards">
          {
            reviews.map(review => 
              <ProductReviewCard 
                key={review.id}
                image={"https://as2.ftcdn.net/v2/jpg/03/32/59/65/1000_F_332596535_lAdLhf6KzbW6PWXBWeIFTovTii1drkbT.jpg"}
                name={review.name}
                createdAt={review.createdAt}
                rate={review.rate}
                reviewText={review.review}
              />
            )
          }
      </div>
      :
      <div className="reviews-empty">
        <div className="noreviews-text">There are no reviews yet.</div>
        <div className="befirst-text">Be the first to review <span>{productName}</span></div>
        <div className="noemail-text">Your email address will not be published. Required fields are marked *</div>
      </div>
      }
      <div className="add-review">
        <AddReview />
      </div>
    </div>
  )
}
  
export default ProductReviews;