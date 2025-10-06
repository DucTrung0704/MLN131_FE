import { message } from 'antd';

export const toast = {
    success: (content) => {
        message.success({
            content,
            className: 'custom-toast-success'
        });
    },
    error: (content) => {
        message.error({
            content,
            className: 'custom-toast-error'
        });
    },
    info: (content) => {
        message.info({
            content,
            className: 'custom-toast-info'
        });
    },
    warning: (content) => {
        message.warning({
            content,
            className: 'custom-toast-warning'
        });
    }
};

export default toast;