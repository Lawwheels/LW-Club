import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {server} from '../../constants/config';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: `${server}`,
    prepareHeaders: async (headers, {getState}) => {
      // const token = getState().auth.user?.token;
      // console.log("api",token)
      const token = await AsyncStorage.getItem('authToken'); // or your key name
      console.log('Retrieved token from AsyncStorage:', token);
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
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
      query: ({advocate, date}) => {
        const params = new URLSearchParams({advocate});
        if (date) {
          params.append('date', date);
        }
        return {
          url: `/user/slot/slotForUser/${advocate}?${params.toString()}`,
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
  useGiveAdvocateReviewMutation
} = api;
