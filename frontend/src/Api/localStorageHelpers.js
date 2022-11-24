export const getItem =({key})=>{
     return JSON.parse(localStorage.getItem(key))
}

export const postItem = ({key,data})=>{
    return localStorage.setItem(key, JSON.stringify(data))
}

export const removeItem = ({key})=>{
    return localStorage.removeItem(key)
}

