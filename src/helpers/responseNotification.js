import { notification } from "ant-design-vue"

export const responseNotification = (response, message) => {
    if (response?.status >= 200 || response?.status <= 300) {
        notification.success({
            message: "Excellent!",
            description: message || "The action has been executed succesfully!",
            class: "custom-notification__success",
            duration: 2
        })
    }else{
        notification.error({
            message: "Error!",
            description: "Something went wrong, please try again.",
            class: "custom-notification__error",
            duration: 2

        })
    }
}