import { useQuery } from 'react-query'
import { toaster } from '../../utilits/toast'
import { getNotifications } from './notificationApi'

export const useGetNotifications = (userName) => {
    return useQuery(
        ['getNotifications', userName],
        () => getNotifications(userName),
        { enabled: userName ? true : false },
        {
            onError: (error) => {
                toaster('error', error.message)
            },
        }
    )
}
