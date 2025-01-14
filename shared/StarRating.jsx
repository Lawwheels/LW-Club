import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const StarRating = ({rating, starSize = 14,marginVertical=hp('1%')}) => {
  const totalStars = 5;

  // Calculate full, half, and empty stars
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);

  // Array of stars to render
  const stars = [
    ...Array(fullStars).fill('full'),
    ...(hasHalfStar ? ['half'] : []),
    ...Array(emptyStars).fill('empty'),
  ];

  return (
    // <View style={{marginTop: 20}}>
      <View style={[styles.starRating, { marginVertical }]}>
        <View style={styles.starsContainer}>
          {stars.map((type, index) => (
            <Image
              key={index}
              source={
                type === 'full'
                  ? require('../assets/images/star.png')
                  : type === 'half'
                  ? require('../assets/images/half-star.png')
                  : require('../assets/images/empty-star.png')
              }
              style={{
                width: starSize, // Adjust the size as needed
                height: starSize,
                marginRight: 2,
              }}
            />
          ))}
        </View>
      </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  starRating: {
    flexDirection: 'row',
    // marginVertical: marginVertical,
    marginHorizontal: 5,
    justifyContent: 'flex-end',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: 5, 
  },
});

export default StarRating;
