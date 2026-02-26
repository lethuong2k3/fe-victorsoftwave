import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { api } from '@/utils/api';
import { getLang } from '@/utils/localization';

interface GoogleReview {
  id: number;
  authorName: string;
  authorPhotoUrl?: string;
  rating: number;
  text: string;
  relativeTimeDescription?: string;
  time?: number;
}

const GoogleReviews: React.FC = () => {
  const [reviews, setReviews] = useState<GoogleReview[]>([]);
  const [loading, setLoading] = useState(true);
  const lang = getLang();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get<GoogleReview[]>('/api/google-reviews');
        setReviews(res);
      } catch (error) {
        console.error('Failed to fetch google reviews', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  if (loading || reviews.length === 0) {
    return null;
  }

  const title = lang === 'en' ? 'What Our Clients Say' : 'Khách hàng nói gì về chúng tôi';
  const subtitle = lang === 'en' ? 'Trusted by hundreds of businesses' : 'Được tin tưởng bởi hàng trăm doanh nghiệp';

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900 overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-4">
            Testimonials
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4">
            {title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex flex-col h-full"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="relative">
                  {review.authorPhotoUrl ? (
                    <img
                      src={review.authorPhotoUrl}
                      alt={review.authorName}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold text-lg">
                      {review.authorName.charAt(0)}
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1">
                    <img 
                        src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
                        alt="Google" 
                        className="w-4 h-4"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white line-clamp-1">
                    {review.authorName}
                  </h3>
                  <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                    <span>{review.relativeTimeDescription}</span>
                  </div>
                </div>
              </div>

              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>

              <div className="flex-1 relative">
                <Quote className="w-8 h-8 text-blue-100 dark:text-blue-900/30 absolute -top-2 -left-2 transform -scale-x-100" />
                <p className="text-slate-600 dark:text-slate-300 relative z-10 text-sm leading-relaxed pl-4 line-clamp-4">
                  {review.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GoogleReviews;
