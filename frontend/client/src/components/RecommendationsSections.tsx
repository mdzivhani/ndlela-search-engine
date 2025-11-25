/**
 * RecommendationsSections Component
 * Shows "For You", "Top Picks Near You", "Recently Viewed", and "Explore by Region"
 */
import React from 'react'
import { SearchResult } from '../types/search'

interface RecommendationsSectionsProps {
  forYou?: SearchResult[]
  topPicks?: SearchResult[]
  recentlyViewed?: SearchResult[]
  onActivityClick: (id: string) => void
  onRegionClick: (region: string, lat: number, lng: number) => void
}

interface Region {
  name: string
  province: string
  latitude: number
  longitude: number
  imageUrl: string
}

const SA_REGIONS: Region[] = [
  {
    name: 'Cape Town',
    province: 'Western Cape',
    latitude: -33.9249,
    longitude: 18.4241,
    imageUrl: 'https://via.placeholder.com/300x200/0057b7/FFFFFF?text=Cape+Town',
  },
  {
    name: 'Johannesburg',
    province: 'Gauteng',
    latitude: -26.2041,
    longitude: 28.0473,
    imageUrl: 'https://via.placeholder.com/300x200/28a745/FFFFFF?text=Johannesburg',
  },
  {
    name: 'Durban',
    province: 'KwaZulu-Natal',
    latitude: -29.8587,
    longitude: 31.0218,
    imageUrl: 'https://via.placeholder.com/300x200/ffc107/FFFFFF?text=Durban',
  },
  {
    name: 'Kruger Park',
    province: 'Mpumalanga',
    latitude: -23.9884,
    longitude: 31.5547,
    imageUrl: 'https://via.placeholder.com/300x200/dc3545/FFFFFF?text=Kruger+Park',
  },
  {
    name: 'Garden Route',
    province: 'Western Cape',
    latitude: -34.0259,
    longitude: 23.0470,
    imageUrl: 'https://via.placeholder.com/300x200/6f42c1/FFFFFF?text=Garden+Route',
  },
  {
    name: 'Stellenbosch',
    province: 'Western Cape',
    latitude: -33.9321,
    longitude: 18.8602,
    imageUrl: 'https://via.placeholder.com/300x200/fd7e14/FFFFFF?text=Stellenbosch',
  },
]

function ActivityCard({
  activity,
  onClick,
}: {
  activity: SearchResult
  onClick: (id: string) => void
}) {
  return (
    <div className="recommendation-card" onClick={() => onClick(activity.id)}>
      {activity.thumbnailUrl && (
        <img src={activity.thumbnailUrl} alt={activity.name} className="recommendation-image" />
      )}
      <div className="recommendation-content">
        <h4>{activity.name}</h4>
        <p className="recommendation-category">{activity.category}</p>
        <div className="recommendation-footer">
          {activity.rating && <span className="recommendation-rating">★ {activity.rating.toFixed(1)}</span>}
          {activity.priceFrom && (
            <span className="recommendation-price">From R{activity.priceFrom}</span>
          )}
        </div>
      </div>
    </div>
  )
}

export default function RecommendationsSections({
  forYou = [],
  topPicks = [],
  recentlyViewed = [],
  onActivityClick,
  onRegionClick,
}: RecommendationsSectionsProps) {
  return (
    <div className="recommendations-container">
      {/* For You Section */}
      {forYou.length > 0 && (
        <section className="recommendations-section">
          <h3>For You</h3>
          <p className="section-subtitle">Personalized picks based on your preferences</p>
          <div className="recommendations-scroll">
            {forYou.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} onClick={onActivityClick} />
            ))}
          </div>
        </section>
      )}

      {/* Top Picks Near You */}
      {topPicks.length > 0 && (
        <section className="recommendations-section">
          <h3>Top Picks Near You</h3>
          <p className="section-subtitle">Highly rated activities in your area</p>
          <div className="recommendations-scroll">
            {topPicks.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} onClick={onActivityClick} />
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed */}
      {recentlyViewed.length > 0 && (
        <section className="recommendations-section">
          <h3>Recently Viewed</h3>
          <p className="section-subtitle">Continue exploring where you left off</p>
          <div className="recommendations-scroll">
            {recentlyViewed.map((activity) => (
              <ActivityCard key={activity.id} activity={activity} onClick={onActivityClick} />
            ))}
          </div>
        </section>
      )}

      {/* Explore by Region */}
      <section className="recommendations-section">
        <h3>Explore by Region</h3>
        <p className="section-subtitle">Discover destinations across South Africa</p>
        <div className="regions-grid">
          {SA_REGIONS.map((region) => (
            <div
              key={region.name}
              className="region-card"
              onClick={() => onRegionClick(region.name, region.latitude, region.longitude)}
            >
              <img src={region.imageUrl} alt={region.name} className="region-image" />
              <div className="region-overlay">
                <h4>{region.name}</h4>
                <p>{region.province}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
