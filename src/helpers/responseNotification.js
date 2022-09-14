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

export const nodesWithErrorNotification = (node) => {
    notification.error({
        message: "Invalid Nodes!",
        description: `There are some nodes that don't have data yet, please verify them before executing the code. \n(error: node #${node.id} of type ${node.name} is missing data, inputs or outputs.)`,
        class: "custom-notification__error",
        duration: 6
    })
}