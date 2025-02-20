export const getUserRole = (getState)=>{
    const role = getState().common.auth.role;
    const roles = ['parent','student','admin'];
    if(roles.includes(role)){
        return 'admin'
    }else{
        return role
    }
}