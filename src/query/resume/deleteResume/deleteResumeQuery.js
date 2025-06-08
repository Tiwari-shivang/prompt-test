import { useMutation, useQueryClient } from 'react-query'
import { toaster } from '../../../utilits/toast'
import { deleteCertificate, deleteResume } from './deleteResumeApi'


export const useDeleteResume = () => {
	const cache = useQueryClient()
	return useMutation('deleteResume', deleteResume, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Delete");
			cache.invalidateQueries("getAllResumeById")
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}

export const useDeleteCertificate = () => {
	const cache = useQueryClient()
	return useMutation('deleteCertificate', deleteCertificate, {
		onSuccess: (res, variables, context) => {
			toaster("success", "Successfully Deleted");
			cache.invalidateQueries("getAllCertificatesByEmpUuid")
		},
		onError: (error) => {
			toaster("error", error.message);
		}
	})
}