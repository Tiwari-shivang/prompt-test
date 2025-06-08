import { useMutation, useQueryClient } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { updateEmpRatingByPm, updateSkillRatingByPm } from './updateRatingsApi'

export const useUpdateEmpRatingByPm = () => {
	const cache = useQueryClient()
	return useMutation('updateEmpRatingByPm', updateEmpRatingByPm, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Updated");
			cache.invalidateQueries("getEmployeeRatingByPm")
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useUpdateSkillRatingByPm = () => {
	const cache = useQueryClient()
	return useMutation('updateSkillRatingByPm', updateSkillRatingByPm, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Updated");
			cache.invalidateQueries("getEmployeeWithSkillRatingByRmId")
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}