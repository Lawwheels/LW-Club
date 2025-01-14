import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showMessage } from 'react-native-flash-message'; 
import {server} from '../../constants/config';
import {logoutUser} from '../reducers/auth/authSlice';
import {navigate} from '../../navigation/navigationRef';
import { refreshTokenApi } from '../../../shared/authUtils';

const baseQuery = fetchBaseQuery({
  baseUrl: `${server}`,
  prepareHeaders: async headers => {
    const token = await AsyncStorage.getItem('authToken'); // Retrieve token from AsyncStorage
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// const baseQueryWithReauth = async (args, api, extraOptions) => {
//   let result = await baseQuery(args, api, extraOptions);
//   console.log(result);

//   if (
//     result?.error?.status === 500 ||
//     result?.error?.data?.message === 'jwt expired' ||
//     result?.error?.data?.message === 'Unauthorized'
//   ) {
//     console.log('Unauthorized or token expired. Attempting token refresh...');
//     const refreshToken = await AsyncStorage.getItem('refreshToken');

//     if (refreshToken) {
//       // Try refreshing the token
//       const refreshResult = await baseQuery(
//         {
//           url: 'authUser/refresh',
//           method: 'POST',
//           body: {refreshToken},
//         },
//         api,
//         extraOptions,
//       );

//       // console.log('refreshToken result', refreshResult);

//       if (refreshResult?.data) {
//         const newAuthToken = refreshResult.data.AccessToken;
//         const newRefreshToken = refreshResult.data.refreshToken;

//         // Save new tokens to AsyncStorage
//         await AsyncStorage.setItem('authToken', newAuthToken);
//         await AsyncStorage.setItem('refreshToken', newRefreshToken);

//         // Retry the original request
//         result = await baseQuery(args, api, extraOptions);
//       } else if (refreshResult?.error?.data?.message === 'jwt expired') {
//         console.log('Refresh token expired. Logging out...');
//         try {
//           await api.dispatch(logoutUser());
//           navigate('authStack');
//         } catch (error) {
//           console.log('Error during logout: ', error);
//         }
//       } else {
//         console.log('Token refresh failed. Logging out...');
//         try {
//           await api.dispatch(logoutUser());
//           navigate('authStack');
//         } catch (error) {
//           console.log('Error during logout: ', error);
//         }
//       }
//     } else {
//       console.log('No refresh token available. Logging out...');
//       try {
//         await api.dispatch(logoutUser());
//         navigate('authStack');
//       } catch (error) {
//         console.log('Error during logout: ', error);
//       }
//     }
//   }

//   return result;
// };

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);
// console.log('result',result)
  if (
    result?.error?.status === 500 ||
        result?.error?.data?.message === 'jwt expired' ||
        result?.error?.data?.message === 'Unauthorized'
  ) {
    console.log('Unauthorized or token expired. Attempting token refresh...');

    const tokenRefreshed = await refreshTokenApi();
console.log("tokenRefreshed",tokenRefreshed)
    if (tokenRefreshed) {
      console.log('Token refreshed. Retrying original API call...');
      // Retry the original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      console.log('Token refresh failed. Logging out...');
      try {
        await api.dispatch(logoutUser());
        navigate('authStack');
      } catch (error) {
        console.error('Error during logout:', error);
      }
    }
  }else if (result?.error?.status === 400) {
    // Display error message for 400 status
    console.log('400 error detected:', result.error.data.message || 'Bad Request');
    showMessage({
      message: result.error.data.message || 'An error occurred. Please try again.',
      type: 'danger',
    });
  }

  return result;
};

export const api = createApi({
  reducerPath: 'api',
  // baseQuery: fetchBaseQuery({
  //   baseUrl: `${server}`,
  //   prepareHeaders: async (headers, {getState}) => {
  //     // const token = getState().auth.user?.token;
  //     // console.log("api",token)
  //     const token = await AsyncStorage.getItem('authToken'); // or your key name
  //     console.log('Retrieved token from AsyncStorage:', token);
  //     if (token) {
  //       headers.set('authorization', `Bearer ${token}`);
  //     }
  //     return headers;
  //   },
  // }),
  baseQuery: baseQueryWithReauth,
  endpoints: builder => ({
    register: builder.mutation({
      query: user => {
        return {
          url: 'authUser/register',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    verifyOtp: builder.mutation({
      query: user => {
        return {
          url: 'authUser/verifyMobileOTP',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    login: builder.mutation({
      query: user => {
        return {
          url: 'authUser/loginByMobile',
          method: 'POST',
          body: user,
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    role: builder.mutation({
      query: user => {
        return {
          url: `authUser/rolePage`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
  
    getAdvocate: builder.query({
      query: () => {
        return {
          url: 'advocate/',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    verifyAdvocate: builder.mutation({
      query: formData => {
        return {
          url: `advocate/licensePic`,
          method: 'PUT',
          body: formData,
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        };
      },
    }),
    updateAdvocateBio: builder.mutation({
      query: user => {
        return {
          url: `advocate/update`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    advocateExperience: builder.mutation({
      query: user => {
        return {
          url: `advocate/profile/experience`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    advocateEducation: builder.mutation({
      query: user => {
        return {
          url: `advocate/profile/education`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    advocateSkill: builder.mutation({
      query: user => {
        return {
          url: `advocate/profile/skill`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    advocatePracticeArea: builder.mutation({
      query: user => {
        return {
          url: `advocate/profile/practiceArea`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    advocateCertificate: builder.mutation({
      query: user => {
        return {
          url: `advocate/profile/certificate`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),

    advocateProfilePic: builder.mutation({
      query: formData => {
        return {
          url: `advocate/profilePic`,
          method: 'PUT',
          body: formData,
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        };
      },
    }),
    deleteAdvocateProfilePic: builder.mutation({
      query: () => ({
        url: `advocate/profilePic`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    advocateCoverPic: builder.mutation({
      query: formData => {
        return {
          url: `advocate/coverPic`,
          method: 'PUT',
          body: formData,
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        };
      },
    }),
    deleteAdvocateCoverPic: builder.mutation({
      query: () => ({
        url: `advocate/coverPic`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    getExperienceById: builder.query({
      query: id => {
        return {
          url: `advocate/profile/experience/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    editExperience: builder.mutation({
      query: ({id, ...user}) => {
        return {
          url: `advocate/profile/experience/${id}`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getPracticeAreaById: builder.query({
      query: id => {
        return {
          url: `advocate/profile/practiceArea/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    editPracticeArea: builder.mutation({
      query: ({id, ...user}) => {
        return {
          url: `advocate/profile/practiceArea/${id}`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    deleteExperience: builder.mutation({
      query: ({id}) => ({
        url: `advocate/profile/experience/${id}`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    getSpecialization: builder.query({
      query: () => {
        return {
          url: `advocate/master/specialization`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getPracticeArea: builder.query({
      query: () => {
        return {
          url: `advocate/master/practiceArea`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    deletePracticeArea: builder.mutation({
      query: ({id}) => ({
        url: `advocate/profile/practiceArea/${id}`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    deleteSkill: builder.mutation({
      query: ({id}) => ({
        url: `advocate/profile/skill/${id}`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    deleteEducation: builder.mutation({
      query: ({id}) => ({
        url: `advocate/profile/education/${id}`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    getEducationById: builder.query({
      query: id => {
        return {
          url: `advocate/profile/education/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    editEducation: builder.mutation({
      query: ({id, ...user}) => {
        return {
          url: `advocate/profile/education/${id}`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getCertificate: builder.query({
      query: () => {
        return {
          url: `advocate/profile/certificate`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    deleteCertificate: builder.mutation({
      query: ({id}) => ({
        url: `advocate/profile/certificate/${id}`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    getCertificateById: builder.query({
      query: id => {
        return {
          url: `advocate/profile/certificate/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    editCertificate: builder.mutation({
      query: ({id, ...user}) => {
        return {
          url: `advocate/profile/certificate/${id}`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    createTimeSlot: builder.mutation({
      query: user => {
        return {
          url: `advocate/aSlot/slot`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getAdvocateSlots: builder.query({
      query: ({date, start_date, end_date, status, serviceType}) => {
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        if (status) params.append('status', status);
        if (serviceType) params.append('serviceType', serviceType);

        return {
          url: `advocate/aSlot/slot?${params.toString()}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    deactivateSlot: builder.mutation({
      query: ({id, ...user}) => {
        return {
          url: `advocate/aSlot/slot/${id}`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    advocateProfileVisible: builder.mutation({
      query: user => {
        return {
          url: `advocate/profileVisibility`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getAdvocateSlotById: builder.query({
      query: id => {
        return {
          url: `advocate/aSlot/slot/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getAdvocateReview: builder.query({
      query: () => {
        return {
          url: 'advocate/myReviews',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getAllUserRequest: builder.query({
      query: ({status, search}) => {
        const queryParams = new URLSearchParams();
        queryParams.append('status', status);
        if (search) {
          queryParams.append('search', search);
        }
        const url = `advocate/conn/connection?${queryParams.toString()}`;
        return {
          url,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    acceptRequest: builder.mutation({
      query: user => {
        return {
          url: `advocate/conn/connection`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    advocateFollowRequest: builder.mutation({
      query: user => {
        return {
          url: `advocate/conn/follow`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getAllUsers: builder.query({
      query: ({role, search, page = 1, resultPerPage = 20}) => ({
        url: `advocate/users?role=${role}&search=${search}&page=${page}&resultPerPage=${resultPerPage}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    advocateSendRequest: builder.mutation({
      query: user => {
        return {
          url: `advocate/conn/connection`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getAdvocateChat: builder.query({
      query: () => {
        return {
          url: 'advocate/chat/chats',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getAllAdvocateById: builder.query({
      query: id => {
        return {
          url: `advocate/users/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    privateChat: builder.mutation({
      query: user => {
        return {
          url: `advocate/chat/privateChat`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getAdvocateChatById: builder.query({
      query: ({id,page}) => {
        // console.log("advocateChat",id)
        return {
          url: `advocate/chat/messages/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
          params:{page}
        };
      },
    }),
    advocateChatImage: builder.mutation({
      query: (formData) => ({
        url: `advocate/chat/attachments`,
        method: 'POST',
        body: formData, // Send the FormData directly
      }),
    }),
    getAdvocateFollower: builder.query({
      query: () => {
        return {
          url: `advocate/conn/follower`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getAdvocateFollowing: builder.query({
      query: () => {
        return {
          url: `advocate/conn/following`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),


    getAdviseSeeker: builder.query({
      query: () => {
        return {
          url: `user/`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    userProfilePic: builder.mutation({
      query: formData => {
        return {
          url: `user/profilePic`,
          method: 'PUT',
          body: formData,
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        };
      },
    }),
    deleteUserProfilePic: builder.mutation({
      query: () => ({
        url: `user/profilePic`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    updateUserBio: builder.mutation({
      query: user => {
        return {
          url: `user/update`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),

    getAllAdvocate: builder.query({
      query: ({role, search, page = 1, resultPerPage = 20}) => ({
        url: `user/users?role=${role}&search=${search}&page=${page}&resultPerPage=${resultPerPage}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    getUserAdvocateById: builder.query({
      query: id => {
        return {
          url: `user/users/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    sloteForUser: builder.query({
      query: ({ advocate, date }) => {
        if (!advocate) {
          throw new Error("Advocate ID is required to fetch slots.");
        }
    
        const params = new URLSearchParams();
        if (date) params.append('date', date);
    
        return {
          url: `user/slot/slotForUser/${advocate}?${params.toString()}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    bookingSlot: builder.mutation({
      query: user => {
        return {
          url: `user/slot/bookSlot`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getUserSlot: builder.query({
      query: ({date, start_date, end_date}) => {
        console.log('Date parameter:', date);
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return {
          url: `user/slot/myBookSlot?${params.toString()}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getUserSlotById: builder.query({
      query: id => {
        return {
          url: `user/slot/bookSlot/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    rescheduleSlot: builder.mutation({
      query: user => {
        return {
          url: `user/slot/rescheduleSlot`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    cancelSlot: builder.mutation({
      query: user => {
        return {
          url: `user/slot/cancelSlot`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    giveAdvocateReview: builder.mutation({
      query: user => {
        return {
          url: `user/giveAdvocateReviews`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getReviewById: builder.query({
      query: id => {
        return {
          url: `user/reviews/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    userPrivateChat: builder.mutation({
      query: user => {
        return {
          url: `user/chat/privateChat`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    sendRequest: builder.mutation({
      query: user => {
        return {
          url: `user/conn/connection`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    followRequest: builder.mutation({
      query: user => {
        return {
          url: `user/conn/follow`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getAllAcceptedChat: builder.query({ //remove from ui on status accepted
      //accept advocate for user
      query: ({status, search}) => {
        // Append the status as a query parameter
        const queryParams = new URLSearchParams();
        queryParams.append('status', status);
        if (search) {
          queryParams.append('search', search);
        }
        const url = `user/conn/connection?${queryParams.toString()}`;
        return {
          url,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),

    getUserFollower: builder.query({
      query: () => {
        return {
          url: `user/conn/follower`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getUserFollowing: builder.query({
      query: () => {
        return {
          url: `user/conn/following`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getUserCount: builder.query({
      query: () => {
        return {
          url: `user/conn/followCount`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getUserAdvocateFollowById: builder.query({
      query: id => {
        // console.log("id",id)
        return {
          url: `user/conn/followingOfOther?id=${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getUserAdvocateFollowerById: builder.query({
      query: id => {
        return {
          url: `user/conn/followerOfOther?id=${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    unfollowAdvocate: builder.mutation({
      query: user => {
        // console.log("user",user)
        return {
          url: `user/conn/unFollow`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getUserChat: builder.query({
      query: () => {
        return {
          url: 'user/chat/chats',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getUserChatById: builder.query({
      query: ({id,page}) => {
        // console.log("UserChat",id)
        return {
          url: `user/chat/messages/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
          params: { page },
        };
      },
    }),
    userChatImage: builder.mutation({
      query: (formData) => ({
        url: `user/chat/attachments`,
        method: 'POST',
        body: formData, // Send the FormData directly
      }),
    }),


    getStudent: builder.query({
      query: () => {
        return {
          url: `student/`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getAllStudentUser: builder.query({
      query: ({role, search, page = 1, resultPerPage = 20}) => ({
        url: `student/users?role=${role}&search=${search}&page=${page}&resultPerPage=${resultPerPage}`,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }),
    }),
    getStudentAdvocateById: builder.query({
      query: id => {
        return {
          url: `student/users/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    studentSendRequest: builder.mutation({
      query: user => {
        return {
          url: `student/conn/connection`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    updateStudentBio: builder.mutation({
      query: user => {
        return {
          url: `student/update`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    studentEducation: builder.mutation({
      query: user => {
        return {
          url: `student/profile/education`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    studentSkill: builder.mutation({
      query: user => {
        return {
          url: `student/profile/skill`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    deleteStudentSkill: builder.mutation({
      query: ({id}) => ({
        url: `student/profile/skill/${id}`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    editStudentEducation: builder.mutation({
      query: ({id, ...user}) => {
        return {
          url: `student/profile/education/${id}`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getStudentEducationById: builder.query({
      query: id => {
        return {
          url: `student/profile/education/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    studentProfilePic: builder.mutation({
      query: formData => {
        return {
          url: `student/profilePic`,
          method: 'PUT',
          body: formData,
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        };
      },
    }),
    deleteStudentProfilePic: builder.mutation({
      query: () => ({
        url: `student/profilePic`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    studentCoverPic: builder.mutation({
      query: formData => {
        return {
          url: `student/coverPic`,
          method: 'PUT',
          body: formData,
          // headers: {
          //   'Content-Type': 'application/json',
          // },
        };
      },
    }),
    deleteStudentCoverPic: builder.mutation({
      query: () => ({
        url: `student/coverPic`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    deleteStudentSkill: builder.mutation({
      query: ({id}) => ({
        url: `student/profile/skill/${id}`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    studentCertificate: builder.mutation({
      query: user => {
        return {
          url: `student/profile/certificate`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    deleteStudentEducation: builder.mutation({
      query: ({id}) => ({
        url: `student/profile/education/${id}`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    deleteStudentCertificate: builder.mutation({
      query: ({id}) => ({
        url: `student/profile/certificate/${id}`,
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
      }),
    }),
    getStudentCertificate: builder.query({
      query: () => {
        return {
          url: `student/profile/certificate`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getStudentCertificateById: builder.query({
      query: id => {
        return {
          url: `student/profile/certificate/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    editStudentCertificate: builder.mutation({
      query: ({id, ...user}) => {
        return {
          url: `student/profile/certificate/${id}`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    sloteForStudent: builder.query({
      query: ({ advocate, date }) => {
        if (!advocate) {
          throw new Error("Advocate ID is required to fetch slots.");
        }
    
        const params = new URLSearchParams();
        if (date) params.append('date', date);
    
        return {
          url: `student/slot/slotForUser/${advocate}?${params.toString()}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    bookingSlotStudent: builder.mutation({
      query: user => {
        return {
          url: `student/slot/bookSlot`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getStudentSlot: builder.query({
      query: ({date, start_date, end_date}) => {
        console.log('Date parameter:', date);
        const params = new URLSearchParams();
        if (date) params.append('date', date);
        if (start_date) params.append('start_date', start_date);
        if (end_date) params.append('end_date', end_date);
        return {
          url: `student/slot/myBookSlot?${params.toString()}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getStudentSlotById: builder.query({
      query: id => {
        return {
          url: `student/slot/bookSlot/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    rescheduleSlotStudent: builder.mutation({
      query: user => {
        return {
          url: `student/slot/rescheduleSlot`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    cancelSlotStudent: builder.mutation({
      query: user => {
        return {
          url: `student/slot/cancelSlot`,
          method: 'PUT',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getStudentChat: builder.query({
      query: () => {
        return {
          url: 'student/chat/chats',
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    studentPrivateChat: builder.mutation({
      query: user => {
        return {
          url: `student/chat/privateChat`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getStudentChatById: builder.query({
      query: ({id,page}) => {
        // console.log("advocateChat",id)
        return {
          url: `student/chat/messages/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
          params:{page}
        };
      },
    }),
    studentChatImage: builder.mutation({
      query: (formData) => ({
        url: `student/chat/attachments`,
        method: 'POST',
        body: formData, // Send the FormData directly
      }),
    }),
    studentFollowRequest: builder.mutation({
      query: user => {
        return {
          url: `student/conn/follow`,
          method: 'POST',
          body: user,
          headers: {
            'Content-Type': 'application/json',
          },
        };
      },
    }),
    getStudentFollower: builder.query({
      query: () => {
        return {
          url: `student/conn/follower`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getStudentFollowing: builder.query({
      query: () => {
        return {
          url: `student/conn/following`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getStudentAdvocateFollowerById: builder.query({
      query: id => {
        return {
          url: `student/conn/followerOfOther?id=${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    getStudentAdvocateFollowById: builder.query({
      query: id => {
        // console.log("id",id)
        return {
          url: `student/conn/followingOfOther?id=${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),
    // giveStudentAdvocateReview: builder.mutation({
    //   query: user => {
    //     return {
    //       url: `student/giveAdvocateReviews`,
    //       method: 'POST',
    //       body: user,
    //       headers: {
    //         'Content-Type': 'application/json',
    //       },
    //     };
    //   },
    // }), //not added in backend
    getStudentReviewById: builder.query({
      query: id => {
        return {
          url: `student/reviews/${id}`,
          method: 'GET',
          headers: {
            'Content-type': 'application/json',
          },
        };
      },
    }),

  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useRoleMutation,
  useGetAdvocateQuery,
  useVerifyAdvocateMutation,
  useUpdateAdvocateBioMutation,
  useAdvocateExperienceMutation,
  useAdvocateEducationMutation,
  useAdvocateSkillMutation,
  useAdvocatePracticeAreaMutation,
  useAdvocateCertificateMutation,
  useAdvocateProfilePicMutation,
  useDeleteAdvocateProfilePicMutation,
  useAdvocateCoverPicMutation,
  useDeleteAdvocateCoverPicMutation,
  useGetExperienceByIdQuery,
  useEditExperienceMutation,
  useGetPracticeAreaByIdQuery,
  useEditPracticeAreaMutation,
  useDeleteExperienceMutation,
  useGetSpecializationQuery,
  useDeletePracticeAreaMutation,
  useDeleteEducationMutation,
  useGetEducationByIdQuery,
  useEditEducationMutation,
  useGetCertificateQuery,
  useGetCertificateByIdQuery,
  useDeleteCertificateMutation,
  useEditCertificateMutation,
  useCreateTimeSlotMutation,
  useGetAdvocateSlotsQuery,
  useDeactivateSlotMutation,
  useAdvocateProfileVisibleMutation,
  useGetAdvocateSlotByIdQuery,
  useGetPracticeAreaQuery,
  useDeleteSkillMutation,
  useGetAdvocateReviewQuery,
  useGetAllUserRequestQuery,
  useAcceptRequestMutation,
  useGetAllUsersQuery,
  useAdvocateFollowRequestMutation,
  useAdvocateSendRequestMutation,
  useGetAdvocateChatQuery,
  useGetAllAdvocateByIdQuery,
  useGetAdvocateChatByIdQuery,
  useAdvocateChatImageMutation,
  useGetAdvocateFollowerQuery,
  useGetAdvocateFollowingQuery,

  useGetAdviseSeekerQuery,
  useDeleteUserProfilePicMutation,
  useUserProfilePicMutation,
  useUpdateUserBioMutation,
  useGetAllAdvocateQuery,
  useGetUserAdvocateByIdQuery,
  useSloteForUserQuery,
  useBookingSlotMutation,
  useGetUserSlotQuery,
  useGetUserSlotByIdQuery,
  useRescheduleSlotMutation,
  useCancelSlotMutation,
  useGiveAdvocateReviewMutation,
  useGetReviewByIdQuery,
  useUserPrivateChatMutation,
  useSendRequestMutation,
  useFollowRequestMutation,
  useGetAllAcceptedChatQuery,
  usePrivateChatMutation,
  useGetUserFollowerQuery,
  useGetUserFollowingQuery,
  useGetUserCountQuery,
  useGetUserAdvocateFollowByIdQuery,
  useGetUserAdvocateFollowerByIdQuery,
  useUnfollowAdvocateMutation,
  useGetUserChatQuery,
  useGetUserChatByIdQuery,
  useUserChatImageMutation,


  useGetStudentQuery,
  useGetAllStudentUserQuery,
  useGetStudentAdvocateByIdQuery,
  useStudentSendRequestMutation,
  useUpdateStudentBioMutation,
  useStudentEducationMutation,
  useStudentSkillMutation,
  useEditStudentEducationMutation,
  useGetStudentEducationByIdQuery,
  useStudentCoverPicMutation,
  useStudentProfilePicMutation,
  useDeleteStudentCoverPicMutation,
  useDeleteStudentProfilePicMutation,
  useDeleteStudentSkillMutation,
  useStudentCertificateMutation,
  useDeleteStudentEducationMutation,
  useDeleteStudentCertificateMutation,
  useGetStudentCertificateQuery,
  useEditStudentCertificateMutation,
  useGetStudentCertificateByIdQuery,
  useSloteForStudentQuery,
  useBookingSlotStudentMutation,
  useGetStudentSlotQuery,
  useGetStudentSlotByIdQuery,
  useCancelSlotStudentMutation,
  useRescheduleSlotStudentMutation,
  useGetStudentChatQuery,
  useStudentChatImageMutation,
  useStudentPrivateChatMutation,
  useGetStudentChatByIdQuery,
  useStudentFollowRequestMutation,
  useGetStudentFollowerQuery,//not added
  useGetStudentFollowingQuery,//not added
  useGetStudentAdvocateFollowerByIdQuery,
  useGetStudentAdvocateFollowByIdQuery,
  // useGiveStudentAdvocateReviewMutation,
  useGetStudentReviewByIdQuery
  
} = api;
