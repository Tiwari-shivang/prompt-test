import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from "react-router-dom"
import { toaster } from '../../../utilits/toast'
import { addEmployeeRating, createEmpRating, createSkillsRatingByPm, createskillratinglistbypm, updateEmpRating } from './addRatingsApi'

export const useAddEmployeeRating = () => {
	const cache = useQueryClient()
	const navigate = useNavigate()
	return useMutation('addEmployeeRating', addEmployeeRating, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Added");
			cache.invalidateQueries("getEmployeeRatingByPm")
			navigate(-1)
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}


export const useCreateSkillsRatingByPm = () => {
	const cache = useQueryClient()
	return useMutation('createSkillsRatingByPm', createSkillsRatingByPm, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Added");
			cache.invalidateQueries("getEmployeeWithSkillRatingByRmId")
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useCreateEmpRating = () => {
	const cache = useQueryClient()
	return useMutation('createEmpRating', createEmpRating, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Created");
			cache.invalidateQueries("getEmployeeRatingByEmpUuid")
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useUpdateEmpRating = () => {
	const cache = useQueryClient()
	return useMutation('updateEmpRating', updateEmpRating, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Updated");
			cache.invalidateQueries("getEmployeeRatingByEmpUuid")
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}


export const useCreateskillratinglistbypm = () => {
	const navigate = useNavigate()
	const cache = useQueryClient()
	return useMutation('createskillratinglistbypm', createskillratinglistbypm, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Added");
			cache.invalidateQueries("getEmployeeWithSkillRatingByRmId")
			navigate(-1)
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}